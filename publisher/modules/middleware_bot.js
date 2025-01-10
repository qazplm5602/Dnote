const { isbot } = require("isbot");
const UrlPattern = require("url-pattern");
const pageCache = require('./pageCache');

const urlCheckes = {};

exports.middleware = async function(req, res, next) {
    const userAgent = req.headers["user-agent"];
    if (userAgent.indexOf("Whale") === -1) {
        return next();
    }
    // if (!isbot(userAgent)) { // 봇이 아니면 그냥 넘김
    //     next();
    //     return;
    // }

    const pathname = req.baseUrl + req.path;
    const urlPattern = Object.keys(urlCheckes).find(v => new UrlPattern(v).match(pathname) !== null);
    if (urlPattern === undefined) { // 등록된 캐시 페이지가 아닌뎅
        next();
        return;
    }

    const cacheOption = urlCheckes[urlPattern];
    const urlKey = cacheOption.ignoreQuery ? (pathname) : req.originalUrl;
    const cacheExsist = await pageCache.existPage(urlKey);
    if (cacheExsist === null) { // 캐싱중 오류남
        next();
        return;
    }

    if (cacheExsist) { // 캐싱된게 있음
        const page = await pageCache.getPage(urlKey);
        res.send(page);
        return;
    }

    // 여기까지 오면 캐싱 해야되지만 (안해도되는 경우도 있음)
    await pageCache.workLimitCheck();

    // 캐시가 없엉음
    const cacheRun = await cacheOption.callback(new UrlPattern(urlPattern).match(pathname)).catch(e => {
        console.error(`cache callback 오류 반환 ${urlKey}`, e);
        return false; // 캐싱 무시
    });
    if (!cacheRun) { // 캐싱 하지마
        next();
        return;
    }

    const page = await pageCache.startPageCache(urlKey);
    if (page === undefined) { // 캐싱 실패 ㄷㄷㄷ
        return next();
    }

    res.send(page);
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