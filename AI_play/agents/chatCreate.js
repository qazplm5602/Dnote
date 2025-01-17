const { AIbase } = require("./base");
const { getRandomPost, getRandomUserEmail } = require("../util/randomUser");
const { requestAI } = require("../util/aiRequest");
const pool = require("../util/mysql");
const { getRandomNumber } = require("../util/misc");
const { request } = require("../util/backendRequest");
const chalk = require("chalk");
const { createAccessToken } = require("../util/token");

class ChatCreateAI extends AIbase {
    constructor() {
        super();
        this.agentName = "PostViewAI";
    }

    async start() {
        // 글 랜덤으로 정하기
        const post = await getRandomPost();

        // 게시물 주인 이름 구하기
        const query = pool.query("SELECT name FROM users WHERE id = ?", [ post.owner_id ]);
        const [ user, [ rows ] ] = await Promise.all([getRandomUserEmail(), query]);
        const owner_name = rows[0].name;
        
        const age = getRandomNumber(1, 80);

        this.log(`${user.email}(${user.name}) 가 /post/${post.owner_id}/${post.id}(${owner_name}) 글의 댓글을 작성중...`);
        const result = await this.createContent(post.content_preview, user.name, age, owner_name);

        const accessToken = createAccessToken(user.email);
        const { status, data } = await request(`post/${post.owner_id}/${post.id}/chat`, { method: "POST", body: result }, accessToken);
        if (status !== 200) {
            this.log(chalk.red("댓글 작성 실패."), `/post/${post.owner_id}/${post.id}(${owner_name})의 글`, result, status, data);
            return;
        }

        this.log(chalk.green("댓글 작성 성공"), `/post/${post.owner_id}/${post.id}(${owner_name})의 글`, result);
    }

    async createContent(content_preview, name, age, owner_name, count) {
        const response = await requestAI(`${content_preview}에 대한 글을 평가를 하거나 피드백을 하거나 질문을 짧게 해줘.`, {
            system: `당신의 이름은 ${name} 입니다. 당신은 글을 읽고 있는 독자 입니다. 글의 주인은 ${owner_name} 입니다. Dnote 사이트의 블로그 글을 보고 있습니다. 댓글 처럼 표현하세요. 당신의 나이는 ${age}살 입니다. 나이에 맞는 표현을 사용하세요. 한국어(Korean)으로 대답해야합니다.`
        });
        
        if (response.indexOf(content_preview) !== -1) { // 똑같은 내용 들어있음 (잘못된거 분명함 ㄹㅇㅇ)
            if (count > 5) {
                throw new Error("댓글 생성 실패.");
            }

            return this.createContent(content_preview, name, age, owner_name, (count || 0) + 1);
        }

        return response;
    }
}

module.exports = ChatCreateAI;