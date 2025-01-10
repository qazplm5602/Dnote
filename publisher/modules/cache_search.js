const middleware = require("./middleware_bot");
const request = require("../util/request.js");

const onCheckPage = async function(param) {
    return true;
}

middleware.registerCachePage("/search", 0, false, onCheckPage)