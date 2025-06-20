import { pool } from "../util/mysql.ts";
import { UserPostCountRow } from "./postAnalyze.ts";
import { getUserSitemap, removeUserSitemap, setUserSitemap, urlEntity } from "./userSitemap.ts";
import UrlPattern from "url-pattern";
import config from '../_config.ts';
import { registerUser } from "./mainSitemap.ts";

interface Post {
    id: number,
    modified?: string
}

interface PostEntity extends Post {
    created: string
}

type IndexedPosts<T> = {
    [key: number]: T
}

const postUrlPattern = new UrlPattern(config.postUrl);

export default async function updateUserSitemap(data: UserPostCountRow) {
    const sitemap = await getUserSitemap(data.id);

    // 업데이트가 필요하지 않은 경우
    if (sitemap === undefined && data.post_count === 0) {
        return;
    }

    const [ rows ] = await pool.query("SELECT id, created, modified FROM posts WHERE owner_id = ?", [ data.id ]);

    const postIds = new Set<number>();

    let sitemapPosts: IndexedPosts<Post> = {};
    let currentPosts: IndexedPosts<PostEntity> = {};

    (rows as PostEntity[]).forEach(v => {
        postIds.add(v.id);
        currentPosts[v.id] = v;
    });

    if (sitemap) {
        sitemap
            .map(v => ({
                id: Number(postUrlPattern.match(v.loc.replace(config.siteUrl, ''))?.id),
                modified: v.lastmod
            }))
            .filter(v => !isNaN(v.id))
            .forEach(v => {
                postIds.add(v.id);
                sitemapPosts[v.id] = v;
            });
            
            // const test = postUrlPattern.stringify({ owner: 1, id: 10 });
            // const test2 = '/post/1/2';
            
            // console.log(test,test2);
            // console.log(postUrlPattern.match(test), postUrlPattern.match(test2));
    }

    let xmls: urlEntity[] = [];
    let needFileChanged = false;

    for (const postId of postIds) {
        const originPost = sitemapPosts[postId];
        const newPost = currentPosts[postId];

        let postTime: Date;
        
        if (originPost !== undefined && newPost === undefined) { // 삭제된 경우
            needFileChanged = true;
            continue;
        }
        
        postTime = new Date(newPost.modified || newPost.created);

        if (originPost === undefined && newPost !== undefined) { // 추가 된 경우 (사이트맵에 lastmod가 없는 경우에도 해야징)
            needFileChanged = true;
        } else if (!needFileChanged) { // 둘다 있는뎅
            if (originPost?.modified === undefined) { // 만들어야 되는 상황인데 originPost가 없다ㅏㅁ쥐
                needFileChanged = true;
            } else {
                const sitemapTime = new Date(originPost.modified.replace('+09:00', 'Z'));
                needFileChanged = Number(postTime) !== Number(sitemapTime);
            }
        }

        // xml에 추강
        xmls.push({
            loc: config.siteUrl + postUrlPattern.stringify({ owner: data.id, id: postId }),
            lastmod: postTime.toISOString().replace('Z', '+09:00')
        });
    }

    if (needFileChanged) {
        if (xmls.length > 0) {
            // 없으면 생성 ㄱㄱㄱ
            registerUser(data.id, sitemap ? 'update' : 'add');
            await setUserSitemap(data.id, xmls);
        } else if (sitemap) { // 없음 (사이트맵 잇네)
            // 삭제 ㄱㄱㄱㄱ
            registerUser(data.id, 'remove');
            await removeUserSitemap(data.id);
        }
    }
}