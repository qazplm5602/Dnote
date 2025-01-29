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
            const urls = xml.urlset.url;
            if (urls)
                resolve((urls instanceof Array ? urls : [urls]) as urlEntity[]);
            else
                resolve(undefined);
        });
    });
    
}

export async function setUserSitemap(userId: number, posts: urlEntity[]) {
    return new Promise((resolve, reject) => {
        let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        posts.forEach(v => {
            xml += `<url>
    <loc>${v.loc}</loc>
    <lastmod>${v.lastmod}</lastmod>
</url>`;
        });
        
        xml += '\n</urlset>';

        fs.writeFile(path.join(path.resolve(), config.sitemapPath, `user-${userId}.xml`), xml, function(err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(undefined);
        });
    });
}

export async function removeUserSitemap(userId: number) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(path.resolve(), config.sitemapPath, `user-${userId}.xml`), function(err) {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(undefined);
        });
    })
}