const { AIbase } = require("./base");
const { getRandomUserEmail, getRandomPost } = require("../util/randomUser");
const { createAccessToken } = require("../util/token");
const { request } = require("../util/backendRequest");
const chalk = require("chalk");

class GoodPostAI extends AIbase {
    constructor() {
        super();
        this.agentName = "GoodPostAI";
    }

    async start() {
        // 묻지마 게시글 좋아요 ㄷㄷㄷ
        const post = await getRandomPost();
        if (post === undefined)
            throw new Error("게시물 없음");

        const user = await getRandomUserEmail();

        const accessToken = createAccessToken(user.email);
        const { status, data } = await request(`post/like?user=${post.owner_id}&post=${post.id}`, { method: "PUT" }, accessToken);
        if (status !== 200) {
            this.log(`${chalk.red("좋아요 실패")} ${chalk.yellow(user.name)} ->/post/${post.owner_id}/${post.id}`, status, data);
            return
        }
        
        this.log(`${chalk.yellow(user.name)} -> /post/${post.owner_id}/${post.id} ${chalk.bgRed('♥️')}`);
    }
}

module.exports = GoodPostAI;