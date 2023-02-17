import {SourceType} from "@prisma/client";
import {ArticleData} from "../interfaces/ArticleData";
import axios from "axios";
import {parseArticle} from "./parseArticle";

export async function getAndParseArticle(url: string, type: SourceType): Promise<{ data: ArticleData, html: string }> {
    const {data: html} = await axios.get(url);
    return {
        html,
        data: parseArticle(html, type)
    }
}
