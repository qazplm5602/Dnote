import { XMLParser } from "fast-xml-parser";
import fs from 'fs';
import path from 'path';
import config from '../_config.ts';
import { urlEntity } from "./userSitemap.ts";

type reserveData = {
    userId: number,
    action: 'add' | 'remove' | 'update'
}
type IndexedSitemap = {
    [key: string]: urlEntity
}

let reserveUsers: reserveData[] = [];

const xmlParser = new XMLParser();

export function registerUser(id: number, action: reserveData['action']) {
    reserveUsers.push({ userId: id, action: action });
}

export function clear() {
    reserveUsers = [];
}

export async function updateSitemap() {
    const currentSitemap = IndexingSitemap(await getSitemap() || []);
    const nowTime = new Date().toISOString().replace('Z', '+09:00');

    for (const event of reserveUsers) {
        const loc = `${config.siteUrl}/user/${event.userId}/sitemap.xml`;

        if (event.action === "add" || event.action === "update") {
            let updated = false;
            if (currentSitemap[loc] === undefined) {
                currentSitemap[loc] = {
                    loc,
                    lastmod: nowTime
                }
                updated = true;
            }

            if (!updated && event.action === "update") {
                currentSitemap[loc].lastmod = nowTime;
            }
        } else {
            delete currentSitemap[loc];
        }
    }

    // 파일에 반영 ㄱㄱㄱㄱ
    let xml = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    Object.values(currentSitemap).forEach(v => {
        xml +=  `
<sitemap>
    <loc>${v.loc}</loc>
    <lastmod>${v.lastmod}</lastmod>
</sitemap>`;
    });
    
    xml += '\n</sitemapindex>';

    await setSitemap(xml);
}

async function getSitemap(): Promise<urlEntity[] | undefined> {
    return new Promise((resolve, reject) => {
        const onSuccess = function(err: NodeJS.ErrnoException | null, data: string) {
            if (err) {
                if (err.code === "ENOENT") {
                    resolve(undefined);
                    return;
                }

                reject(err);
                return;
            }

            const sitemap = xmlParser.parse(data).sitemapindex.sitemap;
            if (sitemap)
                resolve(sitemap instanceof Array ? sitemap : [ sitemap ]);
            else
                resolve(undefined);
        }

        fs.readFile(path.join(path.resolve(), config.sitemapPath, 'main.xml'), { encoding: "utf-8" }, onSuccess);
    });
}

async function setSitemap(data: string) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(path.resolve(), config.sitemapPath, 'main.xml'), data, { encoding: 'utf-8' }, function(err) {
            if (err)
                reject(err);
            else
                resolve(undefined);
        });
    });
}

function IndexingSitemap(list: urlEntity[]): IndexedSitemap {
    const result: IndexedSitemap = {};
    list.forEach(v => result[v.loc] = v);

    return result;
}