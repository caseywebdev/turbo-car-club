import config from 'server/config';
import express from 'express';
import log from 'server/utils/log';

const app = express();

app.use(express.static('public'));

const server = app.listen(config.port);
log.info(`HTTP server listening on port ${config.port}`);

export {app, server};
