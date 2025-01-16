const pool = require("./mysql")

exports.getRandomUserEmail = async function() {
    const [rows] = await pool.query("SELECT email, name FROM users WHERE email LIKE '%.AI@domi.kr' ORDER BY RAND() LIMIT 1");
    const result = rows[0];
    if (result === undefined)
        throw new Error("사용자가 없어 랜덤으로 가져올 수 없습니다.");
    
    return result;
}

exports.getRandomPost = async function() {
    const [ rows ] = await pool.query("SELECT id, owner_id, content_preview FROM posts ORDER BY RAND() LIMIT 1");
    const result = rows[0];
    if (result === undefined)
        throw new Error("게시물이 없어 랜덤으로 가져올 수 없습니다.");
    
    return result;
}