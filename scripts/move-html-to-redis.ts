import { prisma } from "../src/storage/prisma";
import { redis } from "../src/storage/ioredis";
import hash from "object-hash";

async function main() {
  const articles = await prisma.requests.findMany({});
  let i = 0;
  for (const article of articles) {
    console.log(`processing ${i++}/${articles.length} - ${article.url}`);
    if (article.html) {
      await redis.set(`html:${ hash(article.url) }`, article.html, 'EX', 3600 * 24 * 30 * 12 * 5); // 5 years
    }
  }
}

main().catch(console.error).then(() => {
  console.log("Done");
  redis.disconnect()
  prisma.$disconnect();
})
