const { AIbase } = require("./base");
const { getRandomUserEmail } = require("../util/randomUser");
const { requestAI } = require("../util/aiRequest");

const words = require("../postWords.json");
const { getRandomNumber } = require("../util/misc");
const { request } = require("../util/backendRequest");
const { createAccessToken } = require("../util/token");

const chalk = require("chalk");

class PostCreateAI extends AIbase {
    constructor() {
        super();
        this.agentName = "PostCreateAI";
    }

    async start() {
        this.log("Post 생성 시작...");

        const user = await getRandomUserEmail();
        if (user === undefined)
            throw new Error("계정이 없습니다.");

        // 단어 랜덤 고르깅
        let theme = words[getRandomNumber(0, words.length)];
        this.log(`주제 선택: ${theme}`);
        
        if (getRandomNumber(0, 5) != getRandomNumber(0, 5)) { // 이 단어 변형할건지 말지
            theme = await requestAI(`${theme}에 관련된 단어만 말해 (You just have to use words.)`, {
                system: "무조건 같은 단어가 아닌, 관련된 단어를 말하며 한국어(Korean)으로 대답해야합니다.",
            });
            this.log(`주제 변형: ${theme}`);
        }

        const post = await this.createPost(theme, user.name);
        const accessToken = createAccessToken(user.email);
        
        const { status, data } = await request("post/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) }, accessToken);
        
        if (status === 200) {
            this.log(chalk.green(`글 작성 완료. id: ${data}`, post.title, post.tags));
        } else {
            this.log(chalk.red("글 작성 실패."), status, data);
        }
    }

    async createPost(theme, name, count) {
        const result = await requestAI(`${theme}에 관한 이야기나, 설명하는 글을 써봐.`, {
            system: `당신의 이름은 ${name} 입니다. 당신은 블로그를 작성하는 사람이며 감수성이 풍부하고 똑똑합니다. 현재 Dnote 사이트의 글을 작성하고 있습니다. 글이 짧거나 길게 써도 됩니다. 모든 대답은 한국어(Korean)으로하고 json 형태로 title은 제목, tags는 태그들(array), content는 본문(Markdown)을 대답해야합니다.`,
            format: "json"
        });

        let post;
        try {
            post = JSON.parse(result);
        } catch {
        }

        if (post === undefined || typeof post.title !== "string" || typeof post.tags !== "object" || typeof post.content !== "string") {
            if (count > 5)
                throw new Error("post 작성 실패");

            return this.createPost(theme, name, (count || 0) + 1);
        }

        return post;
    }
}

module.exports = PostCreateAI;