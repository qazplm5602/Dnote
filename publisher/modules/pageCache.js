const pageData = {
    "/test": {
        creating: undefined,
        created: new Date()
    }
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
    return await readPageFile(key);
}

async function readPageFile(key) {
    return new Promise((reslove, reject) => {
        const filePath = path.join(path.resolve(), cache.path, encodeURIComponent(key));
        
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err)
                reject(err);
            else
                reslove(data);
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
    // 등록하고
    const data = {
        created: new Date()
    };
    pageData[key] = data;

    const waitHandler = getPageHtml(key);
    data.creating = waitHandler;

    const html = await waitHandler;
    if (html === false) {
        delete pageData[key]; // 실패했으니 삭제
        return;
    }

    delete data.creating;
    pages[key] = html; // 메모리에 캐싱
    writePageFile(key, html); // 이건 기다릴 필요 없응

    return html;
}

let currentBrowser;
async function getBrowser() {
    if (currentBrowser === undefined) { // 브라우저 없음
        const newBrowser = puppeteer.launch({ headless: false });
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