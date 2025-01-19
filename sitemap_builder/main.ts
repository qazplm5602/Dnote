import { getUserPostCount } from "./modules/postAnalyze.ts";
import config from './_config.ts';
import { batchRun } from "./modules/batchRunner.ts";
import { updateSitemap as updateMainSitemap, clear as clearMainSitemap } from "./modules/mainSitemap.ts";

async function start() {
    console.log("getting post counts...");
    const postCounts = await getUserPostCount();
    console.log(`post counts total: ${postCounts.length}`);

    if (postCounts.length === 0) return; // ?
    
    let threadAmount = config.thread;
    let batchSize = Math.floor(postCounts.length / config.thread); // 각 처리해야될 갯수
    let overSize = postCounts.length % config.thread; // 분배 햇는디 남은거

    if (batchSize === 0) {
        batchSize = 1;
        threadAmount = overSize;
    }
    console.log(`batchSize: ${batchSize} overSize: ${overSize} threadAmount: ${threadAmount}`);
    
    const threads = [];

    clearMainSitemap();

    for (let i = 0; i < threadAmount; i++) {
        const start = i * batchSize;
        const rows = postCounts.slice(start, start + batchSize + (i === threadAmount - 1 ? overSize : 0));

        threads.push(batchRun(i, rows));
    }

    await Promise.all(threads);
    updateMainSitemap();
}

start();