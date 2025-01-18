import fs from 'fs';
import path from 'path';
import config from '../_config.ts';
import { XMLParser } from 'fast-xml-parser';

interface userMapEntity {
    post: number,
    time: string
}
export interface urlEntity {
    loc: string,
    lastmod?: string,
    priority?: number
}

const xmlParser = new XMLParser();

export async function getUserSitemap(userId: number): Promise<undefined | urlEntity[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(path.resolve(), config.sitemapPath, `user-${userId}.xml`), { encoding: "utf-8" }, function(err, data) {
            if (err) {
                if (err.code === "ENOENT") {
                    resolve(undefined);
                    return; // 걍 없는거
                }
                    
                return reject(err);
            }

            const xml = xmlParser.parse(data);
            resolve(xml.urlset.url as urlEntity[]);
        });
    });
    
}