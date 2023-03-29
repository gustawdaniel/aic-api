import { prisma } from "../storage/prisma";
import { mongoStringFromSeed } from "../storage/mongo";

export class User {
  static async createTestUser(id: string = mongoStringFromSeed('1')) {
    return prisma.users.create({
      data: {
        id,
        email: 'ok@test.pl',
        roles: [],
        full_name: 'Daniel',
        avatar: "ok"
      }
    })
  }
}
