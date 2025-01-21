import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import config from '../_config.ts';

const app = express();

app.get(config.userUrl, function(req, res) {

});

app.get("/sitemap.xml", function(req, res) {
    res.sendFile(`${config.sitemapPath}/main.xml`, { root: path.resolve() });
});

app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
    if (!err.message.startsWith("ENOENT")) {
        next();
        return;
    }
    
    res.sendStatus(404);
});

app.listen(config.port, () => console.log(`listen ${config.port}!`));