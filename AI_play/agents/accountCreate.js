const { AIbase } = require("./base");
const pool = require('../util/mysql');
const { getRandomString } = require("../util/misc");
const { requestAI } = require("../util/aiRequest");
const { request } = require("../util/backendRequest");
const { createAccessToken } = require("../util/token");

class AccountCreateAI extends AIbase {
    constructor() {
        super();
        this.agentName = "AccountCreateAI";
    }

    async start() {
        this.log("계정 생성...");

        const name = await this.createUsername();
        const randomString = getRandomString(20);
        const email = `${randomString}.AI@domi.kr`;
        const connection = await pool.getConnection();

        // id 구함
        const [ rows ] = await connection.query("SELECT MAX(id) AS id FROM users");
        await pool.query("INSERT INTO users(id, ban, email, name, role) VALUES(?, 0, ?, ?, 'USER')", [ rows[0].id + 1, email, name ]);

        connection.release();

        const accessToken = createAccessToken(email);
        await request("profile/info", { method: "POST", body: "테스트" }, accessToken);
    }

    async createUsername(count) {
        const name = await requestAI('커뮤니티에서 사용할 아무 이름을 추천해줘. (only username)');
        const sanitizedUsername = name.replace(/[^\w\s(),가-힣]/g, '');

        // 잘못대답한 AI (바보다 ㄹㅇ)
        if (sanitizedUsername.length === 0 || sanitizedUsername.length > 10) {
            if (count > 5)
                throw new Error("이름 생성을 실패하였습니다.");

            return this.createUsername((count || 0) + 1);
        }
        
        return sanitizedUsername;
    }
}

exports.AccountCreateAI = AccountCreateAI;