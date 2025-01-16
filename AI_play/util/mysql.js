import mysql from 'mysql2';
import { sql } from '../config.json';

const pool = mysql.createPool({
    host: sql.host,
    port: sql.port,
    database: sql.db,
    user: sql.user
});

export default pool;