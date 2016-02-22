import config from '../config';
import Live from 'live-socket';
import log from '../utils/log';
import ws from 'ws';

log.info(`Connecting to signal server at ${config.signal.url}...`);
const live = new Live({WebSocket: ws, url: config.signal.url});
live.on('open', () => {
  log.info('Connected to signal server, authorizing as a host...');
  live.send('pave', {query: ['auth!', {token: config.key}]}, er => {
    if (er) return log.error(`Auth failed! ${er.toString()}`);
    log.info('Successfully authorized as a host');
  });
});

export default live;
