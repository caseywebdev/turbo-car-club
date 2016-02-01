import config from '../config';
import Live from 'live-socket';

export default new Live(config.signal);
