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
      '*': ({paths}) => send('pave', {query: [paths]})
    }
  })
});

live.on('auth', token => store.set(['authToken'], token));

export default store;
