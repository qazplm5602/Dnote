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
    const currentUserIds = new Set<number>();
    const currentSitemap = IndexingSitemap(await getSitemap() || []);

    console.log("reserveUsers", reserveUsers, currentSitemap);
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

function IndexingSitemap(list: urlEntity[]): IndexedSitemap {
    const result: IndexedSitemap = {};
    list.forEach(v => result[v.loc] = v);

    return result;
}