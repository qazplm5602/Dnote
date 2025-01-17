const { ai } = require("../config.json");

const defaultOption = {
    "model": "llama3-bllossom-ko-q8_0:latest",
    "stream": true
}

exports.requestAI = async function(prompt, option) {
    const options = {...defaultOption};
    Object.assign(options, option);

    options.prompt = prompt;

    const response = await fetch(`${ai}/api/generate`, { method: "POST", body: JSON.stringify(options) });
    const data = await response.text();

    // 응답 리스트
    const list = data.split("\n").filter(v => v.length > 0).map(v => JSON.parse(v));
    
    let message = "";
    list.forEach(v => message += v.response);

    return message;
}