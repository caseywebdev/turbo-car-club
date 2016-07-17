import _ from 'underscore';
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

store.run({query: ['regions']}).then(() =>
  Promise.all(_.map(store.get(['regions']), ({url}) => {
    const start = Date.now();
    return fetch(url).then(() => ({url, rtt: Date.now() - start}));
  }))
).then(console.log.bind(console));

live.on('pave', delta => store.update(delta));

export default store;
