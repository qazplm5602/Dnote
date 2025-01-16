const { AccountCreateAI } = require("../agents/accountCreate");
const PostCreateAI = require("../agents/postCreate");
const { getRandomNumber } = require("./misc");

exports.getRandomAgent = function() {
    const rand = getRandomNumber(0, 1);

    switch (rand) {
        case 0:
            // return new AccountCreateAI();
        case 1:
            return new PostCreateAI();
        default:
            throw new Error('WTF');
    }
}

