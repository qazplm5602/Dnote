const { AIbase } = require("./base");
const { getRandomUserEmail, getRandomChat } = require("../util/randomUser");
const { createAccessToken } = require("../util/token");
const pool = require("../util/mysql");
const chalk = require("chalk");
const { requestAI } = require("../util/aiRequest");
const { getRandomNumber } = require("../util/misc");
const { request } = require("../util/backendRequest");

class ChatReplyCreateAI extends AIbase {
    constructor() {
        super();
        this.agentName = "ChatReplyCreateAI";
    }

    async start() {
        const [chat, user] = await Promise.all([getRandomChat(true), getRandomUserEmail()]);

        const [ rows ] = await pool.query("SELECT c.content AS content, u.name AS owner_name FROM post_chats c, users u WHERE c.id = ? AND u.id = c.owner_id", [ chat.id ]);
        const { content, owner_name } = rows[0];
        const age = getRandomNumber(1, 80);

        this.log(`${chalk.yellow(`${user.email}(${user.name}) -> chat ${chat.id}(${owner_name}) 답장중...`)}`);
        const response = await this.createContent(content, user.name, age, owner_name);

        const accessToken = createAccessToken(user.email);

        const { status, data } = await request(`chat/${chat.id}/reply`, { method: "POST", body: response }, accessToken);
        if (status !== 200) {
            this.log(chalk.red("답장 실패!"), `${user.email}(${user.name}) -> chat ${chat.id}(${owner_name})`, response, status, data);
            return;
        }

        this.log(chalk.green("답장 성공!"), `${user.email}(${user.name}) -> chat ${chat.id}(${owner_name})`, response);
    }

    async createContent(chat, name, age, owner_name, count) {
        const response = await requestAI(`${chat}에 대한 댓글을 평가를 하거나 피드백을 하거나 질문을 하거나 공감을 70글자 이내로 답글(Reply) 해줄래?`, {
            system: `당신의 이름은 ${name} 입니다. 댓글(Comment)의 주인은 ${owner_name} 입니다. Dnote 사이트의 블로그 댓글을 보고 있습니다. 당신의 나이는 ${age}살 입니다. 나이에 맞는 표현을 사용하세요. 한국어(Korean)으로 대답해야합니다.`
        });
        
        if (response.indexOf(chat) !== -1) { // 똑같은 내용 들어있음 (잘못된거 분명함 ㄹㅇㅇ)
            if (count > 5) {
                throw new Error("답글 생성 실패.");
            }

            return this.createContent(chat, name, age, owner_name, (count || 0) + 1);
        }

        return response;
    }
}

module.exports = ChatReplyCreateAI