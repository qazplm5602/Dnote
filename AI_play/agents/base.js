class AIbase {
    agentName = "untitled";
    
    async start() {
    }

    log(arg1, ...args) {
        console.log(`[${this.agentName}] ${arg1}`, ...args);
    }
}

exports.AIbase = AIbase;