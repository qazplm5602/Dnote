const { AIbase } = require("./base");
const { getRandomChat, getRandomUserEmail } = require("../util/randomUser");
const { createAccessToken } = require("../util/token");
const { request } = require("../util/backendRequest");

const chalk = require("chalk");

class GoodChatAI extends AIbase {
    constructor() {
        super();
        this.agentName = "GoodChatAI";
    }

    async start() {
        const chat = await getRandomChat();
        const user = await getRandomUserEmail();

        const accessToken = await createAccessToken(user.email);
        const { status, data } = await request(`chat/${chat.id}`, { method: "PUT" }, accessToken);
        
        if (status !== 200) {
            this.log(chalk.red("댓글 좋아요 실패."), `${user.email}(${user.name}) -> chat ${chat.id}`, status, data);
            return;
        }

        this.log(`${chalk.yellow(`${user.email}(${user.name})`)} -> chat ${chat.id} ${chalk.bgRed('♥️')}`);
    }
}

module.exports = GoodChatAI;