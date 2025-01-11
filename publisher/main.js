const proxy = require('express-http-proxy');
const express = require("express");
const path = require('path');

const app = express();

const config = require("./config.json");

// 모듈 시작 =====
require("./modules/cache_post.js");
require("./modules/cache_post_popular.js");
require("./modules/cache_search.js");
require("./modules/cache_userpage.js");
require("./modules/cache_userpage_content.js");

const middleware_bot = require("./modules/middleware_bot.js");

process.on('uncaughtException', (err) => {
    console.error(err);
});


app.use("/api", (req, res, next) => { // api 경로 리다이렉트
    res.redirect(`http://localhost:${config.apiPort}${req.originalUrl}`);
});
app.use("/", middleware_bot.middleware);
app.use("/", express.static(config.staticRoot));

app.use("/", (req, res, next) => {
    res.sendFile("index.html", { root: path.join(__dirname, config.staticRoot) });
});

app.listen(config.port, () => console.log(`server listen! ${config.port}`));