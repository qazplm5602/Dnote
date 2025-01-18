import { pool } from "../util/mysql.ts"

export interface UserPostCountRow {
    id: number,
    post_count: number
}

export const getUserPostCount = async function() {
    const [ rows ] = await pool.query(`
        SELECT o.id, COUNT(p.id) AS post_count
        FROM users o
        LEFT JOIN posts p
        ON o.id = p.owner_id
        WHERE o.ban = 0
        GROUP BY o.id;
    `);

    return rows as UserPostCountRow[];
}