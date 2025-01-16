const { AIbase } = require("./base");

class AccountCreateAI extends AIbase {
    async start() {
        console.log("start 계정 생성.");
        await new Promise(reslove => setTimeout(reslove, 1000 * 5));
        console.log("계정 생성. 끝");
    }
}

exports.AccountCreateAI = AccountCreateAI;