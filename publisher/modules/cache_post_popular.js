const middleware = require("./middleware_bot.js");

const onCheckPage = async function(param) {
    return true;
}

middleware.registerCachePage("/post/popular", 0, true, onCheckPage)