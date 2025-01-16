const { maxAgent, newDelay } = require('./config.json');
const { getRandomAgent } = require("./util/agentList");
const chalk = require("chalk");

const processAgents = new Set();

function agentCreate() {
    const agent = getRandomAgent();
    processAgents.add(agent);

    agent.start()
    .catch((e) => {
        console.log(`[main] ${agent.agentName} ${chalk.red("처리 실패")}`, e);
    })
    .finally(() => {
        processAgents.delete(agent);
        setTimeout(agentCreate, newDelay);
    });
}

for (let i = 0; i < maxAgent; i++) {
    agentCreate();
}