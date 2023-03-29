import { prisma } from "./prisma";

export async function purgeDb() {
  await prisma.articles.deleteMany({})
  await prisma.users.deleteMany({})
}
