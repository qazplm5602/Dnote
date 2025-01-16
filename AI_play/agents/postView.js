const { getRandomNumber } = require("../util/misc");
const pool = require("../util/mysql");
const { AIbase } = require("./base");
const chalk = require("chalk");

class PostViewAI extends AIbase {
    constructor() {
        super();
        this.agentName = "postViewAI";
    }

    async start() {
        const viewCount = getRandomNumber(1, 10);
        const connection = await pool.getConnection();

        // 게시물 고르깅
        const [ rows ] = await connection.query("SELECT id, owner_id FROM posts ORDER BY RAND() LIMIT 1");
        if (rows.length === 0)
            throw new Error("게시물이 없습니다.");

        const { id, owner_id } = rows[0];

        // 업업
        await connection.query("UPDATE posts SET view_count = view_count + ? WHERE id = ? AND owner_id = ?", [ viewCount, id, owner_id ])
        .finally(() => connection.release());

        this.log(chalk.green("카운트 UP!"), `userId: ${owner_id} postId: ${id} up: ${viewCount}`);
    }
}

module.exports = PostViewAI;