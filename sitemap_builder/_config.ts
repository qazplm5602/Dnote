export default {
    sql: {
        host: "localhost",
        port: 3306,
        db: "dnote",
        user: "root"
    },
    port: 3000,
    thread: 10,
    cron: "30 * * * * *",
    sitemapPath: "./sitemaps",
    siteUrl: "https://note.domi.kr",
    postUrl: "/post/:owner/:id",
    userUrl: "/user/:id/sitemap.xml"
}