import disk from './disk';
import {Store, Router} from 'pave';
import live from './live';
import promisify from '../../shared/utils/promisify';

const send = promisify(::live.send);

const store = new Store({
  cache: {
    authToken: disk.read('authToken')
  },
  router: new Router({
    routes: {
      '*': ({paths}) =>
        send('pave', {query: [paths], authToken: store.get(['authToken'])})
    }
  })
});

live.on('auth', token => {
  disk.write('authToken', token);
  store.update({authToken: {$set: token}});
});

export default store;
