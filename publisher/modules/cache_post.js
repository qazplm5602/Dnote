const middleware = require("./middleware_bot");
const request = require("../util/request.js");

const onCheckPage = async function(param) {
    const { status } = await request(`post/info/${param.user}/${param.id}`);
    return status === 200; // 게시글 있는것만 ㄱㄴ
}

middleware.registerCachePage("/post/:user(/:id)", 60 * 60 * 60, true, onCheckPage)