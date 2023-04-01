import { ArticleState, Component, Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../storage/prisma";
import { Wordpress } from "../platforms/Wordpress";
import { getArticleHtmlContent, getArticleTitle } from "../functions/getArticleTitle";
import { Ghost } from "../platforms/Ghost";
import { processArticleQueue } from "../storage/queue";
import { uid } from "uid";
import { Article } from "../models/Article";
import { createLinkHeader } from "../functions/createLinkHeader";

type ArticleSortType = 'id_desc' | 'id_asc' | 'title_asc' | 'components_asc' | 'components_desc';

export class ArticleController {
  private static orderBy(sort: ArticleSortType | undefined): Prisma.Enumerable<Prisma.articlesOrderByWithRelationInput> | undefined {
    switch (sort) {
      case 'id_asc':
        return {
          id: 'asc'
        }
      case 'id_desc': {
        return {
          id: 'desc'
        }
      }
      case 'title_asc': {
        return {
          title: 'asc'
        }
      }
      case 'components_asc': {
        return {
          components: {
            _count: 'asc'
          }
        }
      }
      case 'components_desc': {
        return {
          components: {
            _count: 'desc'
          }
        }
      }
      default:
        return undefined
    }

  }

  static compressArticles(items: { components: Component[], state: ArticleState, id: string, title: string, source_url: string }[]) {
    return items.map((item) => {
      return {
        state: item.state,
        id: item.id,
        title: item.title,
        source_url: item.source_url,
        components_length: item.components.length
      }
    })
  }

  static async list(req: FastifyRequest<{ Querystring: { page?: number, limit?: number, state?: ArticleState, search?: string, sort?: ArticleSortType } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const where: Prisma.articlesWhereInput = {
      user_id: req.user.id,
      state: req.query.state
    }
    if (req.query.search) {
      where.OR = [
        {title: {contains: req.query.search, mode: 'insensitive'}},
        {source_url: {contains: req.query.search, mode: 'insensitive'}},
      ]
    }
    const orderBy = ArticleController.orderBy(req.query.sort);

    const items = await prisma.articles.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
      // include: {
      //   request: {
      //     select: {
      //       url: true,
      //       created_at: true
      //     }
      //   }
      // },
      select: {
        id: true,
        title: true,
        state: true,
        source_url: true,
        components: true
      }
    });

    const compressedItems = ArticleController.compressArticles(items);

    const totalCount = await prisma.articles.count({
      where
    });

    return reply
      .header('Link', createLinkHeader(req.url, page, limit, totalCount))
      .header('Access-Control-Expose-Headers', 'Link')
      .send(compressedItems)
  }

  static async countByState(req: FastifyRequest<{ Querystring: { search?: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    const where: Prisma.articlesWhereInput = {
      user_id: req.user.id,
    }
    if (req.query.search) {
      where.OR = [
        {title: {contains: req.query.search, mode: 'insensitive'}},
        {source_url: {contains: req.query.search, mode: 'insensitive'}},
      ]
    }
    return prisma.articles.groupBy({
      by: ['state'],
      _count: {_all: true},
      where
    })
  }

  static async one(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    return prisma.articles.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: {
        request: {
          select: {
            url: true,
            created_at: true
          }
        }
      }
    })
  }

  static async update(req: FastifyRequest<{ Body: { state: ArticleState, processing_template_id?: string, queue_id?: string, components?: Component[] }, Params: { id: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();

    if (req.body.state === 'queued' && !req.body.processing_template_id) {
      return reply.badRequest(`For queued articles you have to set processing_template_id`)
    }

    const user = await prisma.users.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        gpt3_api_key: true
      }
    });
    if (!user) return reply.unauthorized();

    if (req.body.state === 'queued') {
      if (!user.gpt3_api_key) {
        return reply.unprocessableEntity(`You have to add gpt3_api_key to your account`);
      }
      console.log("pushing");
      await processArticleQueue.push({
        user_id: req.user.id,
        article_id: req.params.id,
        gpt3_api_key: user.gpt3_api_key ?? '',
        queue_id: req.body.queue_id ?? uid(),
        progress: 0
      })
      console.log("pushed");
    }

    if (req.body.processing_template_id) {
      await new Article(req.user).setProcessingTemplate(req.params.id, req.body.processing_template_id)
    }

    return new Article(req.user).update(req.params.id, {
      state: req.body.state,
      components: req.body.components
    })
  }

  static async publish(req: FastifyRequest<{ Params: { articleId: string, targetId: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    const article = await prisma.articles.findUnique({
      where: {
        id: req.params.articleId
      }
    });
    console.log("a", article);
    if (!article) return reply.notFound();
    console.log(2);
    const target = await prisma.targets.findUnique({
      where: {
        id: req.params.targetId
      }
    });
    console.log("t", target);
    if (!target) return reply.notFound();

    const title = getArticleTitle(article);
    const content = getArticleHtmlContent(article);

    switch (target.type) {
      case 'wordpress': {
        const response = await new Wordpress(target.url, {
          username: target.auth.username ?? '',
          password: target.auth.password ?? ''
        }).publish(title, content);
        console.log(response);
        break;
      }
      case 'ghost': {
        await new Ghost(target.url, target.auth.key ?? '').publish(title, content)
        break;
      }
      default: {
        return reply.badRequest('Target type disallowed. Possible are ghost and wordpress');
      }
    }

    await new Article(req.user).update(article.id, {
      state: 'published'
    })

    return {status: 'success'}

  }

  static delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!req.user) return reply.unauthorized();
    return prisma.articles.delete({
      where: {
        id_user_id: {
          user_id: req.user.id,
          id: req.params.id
        }
      }
    })
  }
}
