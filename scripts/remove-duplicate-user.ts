import { prisma } from "../src/storage/prisma";

async function main() {
  await prisma.articles.deleteMany({
    where: {
      user_id: '640188de9fb119d14b9865d6'
    }
  });
  await prisma.sources.deleteMany({where: {user_id: '640188de9fb119d14b9865d6'}});
  await prisma.contexts.deleteMany({where: {user_id: '640188de9fb119d14b9865d6'}});
  await prisma.prompts.deleteMany({where: {user_id: '640188de9fb119d14b9865d6'}});
  await prisma.processing_templates.deleteMany({where: {user_id: '640188de9fb119d14b9865d6'}});
  await prisma.targets.deleteMany({where: {user_id: '640188de9fb119d14b9865d6'}});

  await prisma.users.delete({where: {id: '640188de9fb119d14b9865d6'}});
}


main().catch(console.error)
