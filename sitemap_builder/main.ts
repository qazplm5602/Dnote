import { getUserPostCount } from "./modules/postAnalyze.ts";
import config from './_config.ts';

async function start() {
    const postCounts = await getUserPostCount();

    if (postCounts.length === 0) return; // ?
    
    let threadAmount = config.thread;
    let batchSize = Math.floor(postCounts.length / config.thread); // 각 처리해야될 갯수
    let overSize = postCounts.length % config.thread; // 분배 햇는디 남은거

    if (batchSize === 0) {
        batchSize = 1;
        threadAmount = overSize;
    }

    for (let i = 0; i < threadAmount; i++) {
        const start = i * batchSize;
        const rows = postCounts.slice(start, start + batchSize + (i === threadAmount - 1 ? overSize : 0));

        console.log(rows);
    }
}

start();