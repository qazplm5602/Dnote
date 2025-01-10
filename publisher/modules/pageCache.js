const pageData = {
    // "/test": {
    //     creating: undefined,
    //     memoryCreated: new Date(),
    //     created: new Date()
    // }
}

const pages = {
    
}

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const { port, cache } = require("../config.json");

// false = 없음
// true = 있음
// null = 캐싱중 오류남 ㅅㄱ
exports.existPage = async function(key) {
    const data = pageData[key];
    if (data === undefined) return false;
    
    // 만약 캐싱 하는중이라면 기다림... (오류나면 없음 처리)
    if (data.creating !== undefined) {
        return (await data.creating) ? true : null;
    }

    return true;
}

exports.getPage = async function(key) {
    if (pageData[key] === undefined)
        throw new Error(`캐시된 페이지를 찾을 수 없음. / key: ${key}`);

    // 메모리에 캐싱되어 있넹
    if (pages[key] !== undefined) {
        return pages[key];
    }

    // 하드에 저장되어있을 경우
    const page = await readPageFile(key);
    pageData[key].memoryCreated = new Date();
    pages[key] = page;

    return page;
}

async function readPageFile(key) {
    return new Promise((reslove, reject) => {
        const filePath = path.join(path.resolve(), cache.path, encodeURIComponent(key));
        
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err)
                reject(err);
            else {
                reslove(data);
            }
        });
    });
}

function writePageFile(key, content) {
    const filePath = path.join(path.resolve(), cache.path, encodeURIComponent(key));
    fs.writeFile(filePath, content, function(err) {
        if (err)
            console.error(err);
    });
}

exports.startPageCache = async function(key) {
    console.log(`starting create ${key} page cache...`);

    // 등록하고
    const data = {
        created: new Date(),
        memoryCreated: new Date()
    };
    pageData[key] = data;

    const waitHandler = getPageHtml(key);
    data.creating = waitHandler;

    const html = await waitHandler;
    if (html === false) {
        console.log(`error get html ${key}`);
        delete pageData[key]; // 실패했으니 삭제
        return;
    }
    console.log(`success get ${key} page html`);

    delete data.creating;
    pages[key] = html; // 메모리에 캐싱
    writePageFile(key, html); // 이건 기다릴 필요 없응

    return html;
}

let currentBrowser;
async function getBrowser() {
    if (currentBrowser === undefined) { // 브라우저 없음
        const newBrowser = puppeteer.launch({ headless: true });
        currentBrowser = newBrowser;
        
        const result = await newBrowser;
        currentBrowser = result;
    }

    if (currentBrowser instanceof Promise) {
        return await currentBrowser;
    }

    return currentBrowser; // 걍 브라우저 있음
}

async function getPageHtml(uri) {
    let html = false; // 기본 실패
    let page;

    try {
        const browser = await getBrowser();
        page = await browser.newPage();
    
        await page.goto(`http://localhost:${port}${uri}`, { waitUntil: 'networkidle2' });
        
        html = await page.content(); // html 갖고옴
    } catch (e) {
        // 브라우저가 뻗었나봄 ㄷ
        if (e.message === "Protocol error: Connection closed.") {
            try {
                currentBrowser?.close();
            } catch {}

            currentBrowser = undefined;
        }
        console.error("페이지 로드 실패", e);
    } finally {
        page?.close();
    }

    return html;
}

function cacheFolderClear() {
    const folderPath = path.join(path.resolve(), cache.path);
    fs.readdir(folderPath, (err, files) => {
        files.forEach(file => fs.unlink(path.join(folderPath, file), (err) => {}));
    });
}
cacheFolderClear();

// 처리중인 갯수 넘으면 대기 상태로
exports.workLimitCheck = async function() {
    const promises = Object.values(pageData).filter(v => v.creating !== undefined).map(v => v.creating);
    if (promises.length < cache.maxWorker) return; // 자리 남앗다ㅏㅏ

    await Promise.any(promises); // 아무거나 다 되믄
    await exports.workLimitCheck(); // 다시 체크
}

// 자동 삭제 스케줄
setInterval(() => {
    console.log("Starting Auto Schedule...");
    const now = Date.now();
    const folderPath = path.join(path.resolve(), cache.path);

    Object.keys(pageData).forEach(key => {
        const data = pageData[key];
        if (data.creating !== undefined) return; // 만드는중이면 아무것도 안함

        if (now - data.created > cache.TTL) { // 캐시 만료
            fs.unlink(path.join(folderPath, encodeURIComponent(key)), (err) => { // 파일 삭제
                if (err)
                    console.error(`auto 스케줄 ${key}(${encodeURIComponent(key)}) 파일 삭제 실패`);
            });
            
            if (data.memoryCreated !== undefined)
                delete pages[key];
            
            delete pageData[key];

            console.log(`${key} cache TTL expire removed`);
            return;
        }

        if (data.memoryCreated !== undefined && (now - data.memoryCreated) > cache.memoryLive) { // 메모리에 있는거 만료
            delete pageData[key].memoryCreated;
            delete pages[key];
            console.log(`${key} cache memory expire removed`);
            return;
        }
    });
}, cache.scheduleTime);