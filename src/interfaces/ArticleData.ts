import { Component } from "@prisma/client";

export interface ArticleData {
    title: string,
    components: Component[]
}
