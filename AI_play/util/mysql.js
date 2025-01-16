const mysql = require('mysql2/promise');
const { sql } = require('../config.json');

const pool = mysql.createPool({
    host: sql.host,
    port: sql.port,
    database: sql.db,
    user: sql.user
});

module.exports = pool;