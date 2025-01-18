import { UserPostCountRow } from "./postAnalyze.ts";
import updateUserSitemap from "./updateUserSitemap.ts";

export const batchRun = async function(id: number, list: UserPostCountRow[]) {
    for (const element of list) {
        await updateUserSitemap(element);
    }

    console.log(`[${id}] process done.`);
}