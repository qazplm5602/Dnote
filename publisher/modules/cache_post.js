const middleware = require("./middleware_bot");

const onCheckPage = async function() {
    return true;
}
middleware.registerCachePage("/post/:user(/:id)", 60 * 60 * 60, true, onCheckPage)