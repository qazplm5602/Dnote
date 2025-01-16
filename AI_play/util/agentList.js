const { AccountCreateAI } = require("../agents/accountCreate");
const PostCreateAI = require("../agents/postCreate");
const PostViewAI = require("../agents/postView");
const GoodPostAI = require("../agents/goodPost");
const ChatCreateAI = require("../agents/chatCreate");
const { getRandomNumber } = require("./misc");

exports.getRandomAgent = function() {
    const rand = getRandomNumber(0, 4);

    switch (rand) {
        case 0:
            // return new AccountCreateAI();
        case 1:
            // return new PostCreateAI();
        case 2:
            // return new PostViewAI();
        case 3:
            // return new GoodPostAI();
        case 4:
            return new ChatCreateAI();
        default:
            throw new Error('WTF');
    }
}

