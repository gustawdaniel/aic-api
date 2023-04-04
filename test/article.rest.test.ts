import { tokenizeUser } from "../src/functions/auth";
import { getFastifyServer } from "../src/fastify";
import { prisma } from "../src/storage/prisma";
import { mongoStringFromSeed } from "../src/storage/mongo";

describe('article rest', () => {
  const testUser = {
    id: mongoStringFromSeed('1').toString(),
    email: 'test@example.com',
    roles: []
  };

it('url contains correct link', async () => {
  const server = await getFastifyServer();

  jest.spyOn(prisma.articles, 'count').mockResolvedValue(100);

  const response = await server.inject({
    method: 'GET',
    path: '/article',
    headers: {
      Authorization: `Bearer ${ tokenizeUser(testUser) }`
    }
  });

  expect(response.statusCode).toEqual(200);
  expect(response.headers.link).toEqual('</article?page=2&limit=10>; rel="next", </article?page=10&limit=10>; rel="last"');

  const response2 = await server.inject({
    method: 'GET',
    path: '/article?page=2&limit=10',
    headers: {
      Authorization: `Bearer ${ tokenizeUser(testUser) }`
    }
  });
  expect(response2.headers.link).toEqual('</article?page=1&limit=10>; rel="prev", </article?page=3&limit=10>; rel="next", </article?page=10&limit=10>; rel="last"');
})
})
