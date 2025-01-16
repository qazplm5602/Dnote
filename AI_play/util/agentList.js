const { AccountCreateAI } = require("../agents/accountCreate");
const PostCreateAI = require("../agents/postCreate");
const PostViewAI = require("../agents/postView");
const { getRandomNumber } = require("./misc");

exports.getRandomAgent = function() {
    const rand = getRandomNumber(0, 2);

    switch (rand) {
        case 0:
            // return new AccountCreateAI();
        case 1:
            // return new PostCreateAI();
        case 2:
            return new PostViewAI();
        default:
            throw new Error('WTF');
    }
}

