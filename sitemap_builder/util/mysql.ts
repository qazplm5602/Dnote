import mysql from 'mysql2/promise';
import config  from '../_config.ts';

const sql = config.sql;
export const pool = mysql.createPool({
    host: sql.host,
    port: sql.port,
    database: sql.db,
    user: sql.user
});