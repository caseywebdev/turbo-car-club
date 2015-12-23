import config from 'client/config';
import db from 'client/utils/db';
import Live from 'live';

const live = (new Live(config.signal))
  .on('auth', auth => db.set('auth', auth))
  .on('open', () => {
    const auth = db.get('auth');
    if (!auth) return;
    live.send('auth', auth, er => {
      if (er) return console.error(er);
      console.log('authorized!');
    });
  });

export default live;
