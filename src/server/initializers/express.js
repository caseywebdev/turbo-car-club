import config from 'server/config';
import express from 'express';

const app = express();

app.use(express.static('public'));

const server = app.listen(config.port);
console.log('listening on ' + config.port)

export {app, server};
