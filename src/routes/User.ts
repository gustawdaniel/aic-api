import {prisma} from "../storage/prisma";

export class User {
    static async list() {
        return prisma.users.findMany({})
    }
}
