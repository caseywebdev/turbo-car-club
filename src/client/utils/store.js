import disk from './disk';
import {Store, Router} from 'pave';
import live from './live';
import promisify from '../../shared/utils/promisify';

const send = promisify(::live.send);

const store = new Store({
  batchDelay: 1,
  cache: {
    authToken: disk.read('authToken') || null
  },
  router: new Router({
    routes: {
      '*': ({query}) =>
        send('pave', {query, authToken: store.get(['authToken'])})
    }
  })
});

store.watch(['authToken'], () =>
  disk.write('authToken', store.get(['authToken']))
);

live.on('pave', delta => store.update(delta));

export default store;
