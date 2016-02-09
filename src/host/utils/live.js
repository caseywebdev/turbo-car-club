import config from '../config';
import Live from 'live-socket';
import log from '../utils/log';
import ws from 'ws';

log.info(`Connecting to signal server at ${config.signal.url}...`);
const live = new Live({WebSocket: ws, url: config.signal.url});
live.on('open', () => {
  log.info('Connected to signal server, authorizing as a host...');
  live.send('falcomlay', {
    query: ['auth-host!', {token: config.key}]
  }, (er, change) => {
    console.log(er, JSON.stringify(change));
  });
});

export default live;
