const { pool } = require("./mysql")

exports.getRandomUserEmail = async function() {
    const [rows] = await pool.promise().query("SELECT email, name FROM users WHERE email LIKE '%.AI@domi.kr' ORDER BY RAND() LIMIT 1");
    return rows[0];
}