const { ai } = require("../config.json");

const defaultOption = {
    "stream": false
    "model": "llama3-bllossom-ko-q8_0:latest",
}

exports.requestAI = async function(prompt, option) {
    const options = {...defaultOption};
    Object.assign(options, option);

    options.prompt = prompt;

    const response = await fetch(`${ai}/api/generate`, { method: "POST", body: JSON.stringify(options) });
    const data = await response.json();
    return data.response;
}