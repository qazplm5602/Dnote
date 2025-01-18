import { UserPostCountRow } from "./postAnalyze.ts";
import { getUserSitemap } from "./userSitemap.ts";

export default async function updateUserSitemap(data: UserPostCountRow) {
    const sitemap = await getUserSitemap(data.id);
    
    if (sitemap)
        console.log(sitemap);
}