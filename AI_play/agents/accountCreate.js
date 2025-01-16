const { AIbase } = require("./base");
const pool = require('../util/mysql');
const { getRandomString } = require("../util/misc");
const { requestAI } = require("../util/aiRequest");
const { request } = require("../util/backendRequest");
const { createAccessToken } = require("../util/token");
const chalk = require("chalk");

class AccountCreateAI extends AIbase {
    constructor() {
        super();
        this.agentName = "AccountCreateAI";
    }

    async start() {
        this.log("계정 생성 시작...");

        const name = await this.createUsername();
        const info = await this.createInfo(name);

        const randomString = getRandomString(20);
        const email = `${randomString}.AI@domi.kr`;
        const connection = await pool.getConnection();

        // id 구함
        const [ rows ] = await connection.query("SELECT MAX(id) AS id FROM users");
        await pool.query("INSERT INTO users(id, ban, email, name, role) VALUES(?, 0, ?, ?, 'USER')", [ rows[0].id + 1, email, name ]);

        connection.release();

        const accessToken = createAccessToken(email);
        await request("profile/info", { method: "POST", body: `${info} - Domi AI Generated` }, accessToken);
    
        this.log(chalk.green("계정 생성 완료!"), email, name, info);
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

    async createInfo(name, count) {
        const result = await requestAI('짧은 자기소개 해줘.', {
            system: `당신의 이름은 ${name} 입니다. Dnote 사이트의 사용자이며 모든 대답은 한국어(Korean)으로 대답해주세요. 50글자 이내로.`
        });
        
        // 잘못됨.
        if (result.length === 0 || result.length > 60) {
            if (count > 5)
                throw new Error("소개 생성을 실패하였습니다.");

            return this.createInfo(name, (count || 0) + 1);
        }

        return result;
    }
}

exports.AccountCreateAI = AccountCreateAI;