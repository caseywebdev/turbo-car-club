import config from '../config';
import db from './db';
import Live from 'live-socket';

const live = (new Live(config.signal))
  .on('open', () => {
    const auth = db.get('auth');
    if (!auth) return;
    live.send('auth', auth, er => {
      if (er) return console.error(er);
      console.log('authorized!');
    });
  })
  .on('auth', auth => db.set('auth', auth));

export default live;
