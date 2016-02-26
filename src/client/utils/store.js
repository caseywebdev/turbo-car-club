import disk from './disk';
import {Store, Router} from 'pave';
import live from './live';
import promisify from '../../shared/utils/promisify';

const send = promisify(::live.send);

const store = new Store({
  cache: {
    authToken: disk.get('authToken')
  },
  router: new Router({
    routes: {
      '*': ({paths}) => {
        const token = store.get(['authToken']);
        if (token) paths = [['auth!', {token}], ...paths];
        return send('pave', {query: [paths]});
      }
    }
  })
});

live.on('auth', token => {
  disk.set('authToken', token);
  store.set(['authToken'], token);
});

export default store;
