const { ai } = require("../config.json");

const defaultOption = {
    "model": "ollama-ko-0502:latest",
    "stream": false
}

exports.requestAI = async function(prompt, option) {
    const options = {...defaultOption};
    Object.assign(options, option);

    options.prompt = prompt;

    const response = await fetch(`${ai}/api/generate`, { method: "POST", body: JSON.stringify(options) });
    const data = await response.json();
    return data.response;
}