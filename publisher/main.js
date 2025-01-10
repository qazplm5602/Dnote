const proxy = require('express-http-proxy');
const express = require("express");
const path = require('path');

const middleware_bot = require("./modules/middleware_bot.js");

const app = express();

const config = require("./config.json");

// app.use("/", proxy("http://localhost:5173"));
app.use("/", middleware_bot.middleware);
app.use("/", express.static(config.staticRoot));

app.use("/", (req, res, next) => {
    res.sendFile("index.html", { root: path.join(__dirname, config.staticRoot) });
});

app.listen(config.port, () => console.log(`server listen! ${config.port}`));