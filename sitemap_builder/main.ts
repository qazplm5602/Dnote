import { getUserPostCount } from "./modules/postAnalyze.ts";

async function start() {
    const postCounts = await getUserPostCount();
    
    console.log(postCounts);
}

start();