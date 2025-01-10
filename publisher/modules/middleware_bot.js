const { isbot } = require("isbot");
const UrlPattern = require("url-pattern");
const pageCache = require('./pageCache');

const urlCheckes = {};

exports.middleware = async function(req, res, next) {
    const userAgent = req.headers["User-Agent"];
    // if (!isbot(userAgent)) { // 봇이 아니면 그냥 넘김
    //     next();
    //     return;
    // }

    const pattern = new UrlPattern(req.baseUrl + req.path);
    const urlPattern = Object.keys(urlCheckes).find(v => pattern.match(v) !== null);
    if (urlPattern === undefined) { // 등록된 캐시 페이지가 아닌뎅
        next();
        return;
    }

    const cacheOption = urlCheckes[urlPattern];
    const urlKey = cacheOption.ignoreQuery ? (req.baseUrl + req.path) : req.originalUrl;
    if (pageCache.existPage(urlKey)) {
        return;
    }

    
}

// pattern = url 패턴
// ttl = 캐시 유지 시간
// ignoreQuery = query가 달라도 똑같이 처리함
// callback = 캐싱 할지 말지 정하는거 (아니면 다른 페이지를 띄워버린다던지)
exports.registerCachePage = function(pattern, ttl, ignoreQuery, callback) {
    urlCheckes[pattern] = {
        ttl,
        ignoreQuery,
        callback
    };
}