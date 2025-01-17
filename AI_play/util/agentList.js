const { AccountCreateAI } = require("../agents/accountCreate");
const PostCreateAI = require("../agents/postCreate");
const PostViewAI = require("../agents/postView");
const GoodPostAI = require("../agents/goodPost");
const ChatCreateAI = require("../agents/chatCreate");
const GoodChatAI = require("../agents/goodChat");
const ChatReplyCreateAI = require("../agents/chatReplyCreate");
const { getRandomNumber } = require("./misc");

const weights = [
    1,
    3,
    10,
    8,
    3,
    8,
    5
];



exports.getRandomAgent = function() {
    // const rand = getRandomNumber(0, 6);
    const rand = weightedRandom(weights);

    switch (rand) {
        case 0:
            return new AccountCreateAI();
        case 1:
            return new PostCreateAI();
        case 2:
            return new PostViewAI();
        case 3:
            return new GoodPostAI();
        case 4:
            return new ChatCreateAI();
        case 5:
            return new GoodChatAI();
        case 6:
            return new ChatReplyCreateAI();
        default:
            throw new Error('WTF');
    }
}


function weightedRandom(weights) {
    let total = weights.reduce((acc, weight) => acc + weight, 0);
    let threshold = Math.random() * total;

    for (let i = 0; i < weights.length; i++) {
        if (threshold < weights[i]) {
            return i;
        }
        threshold -= weights[i];
    }
}