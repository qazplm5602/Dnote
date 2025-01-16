const { AccountCreateAI } = require("../agents/accountCreate");
const { AIbase } = require("../agents/base");
const { getRandomNumber } = require("./misc");

exports.getRandomAgent = function() {
    const rand = getRandomNumber(0, 0);

    switch (rand) {
        case 0:
            return new AccountCreateAI();
        default:
            throw new Error('WTF');
    }
}

