const { maxAgent, newDelay } = require('./config.json');
const { getRandomAgent } = require("./util/agentList");

const processAgents = new Set();

function agentCreate() {
    const agent = getRandomAgent();
    processAgents.add(agent);

    agent.start().finally(() => {
        processAgents.delete(agent);
        setTimeout(agentCreate, newDelay);
    });
}

for (let i = 0; i < maxAgent; i++) {
    agentCreate();
}