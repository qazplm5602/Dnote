const middleware = require("./middleware_bot.js");
const request = require("../util/request.js");

const onCheckPage = async function(param) {
    const { status } = await request(`profile/${param.user}`);
    return status === 200;
}

middleware.registerCachePage("/user/:user", 0, true, onCheckPage)