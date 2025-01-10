const pageData = {
    "/test": {
        created: new Date()
    }
}

const pages = {
    
}

const fs = require("fs");
const path = require("path");
const { cache } = require("../config.json");

exports.existPage = function(key) {
    return pageData[key] !== undefined;
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
        const filePath = path.resolve(cache.path, encodeURI(key));
        
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err)
                reject(err);
            else
                reslove(data);
        });
    });
}