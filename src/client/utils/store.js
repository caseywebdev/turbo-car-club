import _ from 'underscore';
import config from '../config';
import disk from './disk';
import {Store, Router} from 'pave';
import live from './live';
import promisify from '../../shared/utils/promisify';
import now from '../../shared/utils/now';

const send = promisify(::live.send);

const getMedian = ns => _.sortBy(ns)[Math.floor(ns.length / 2)];

const getSinglePing = url => {
  const start = now();
  return fetch(url).then(() => now() - start);
};

const getPing = url => {
  const pings = [];
  return _.reduce(
    _.range(10),
    promise => promise.then(ping => pings.push(ping) && getSinglePing(url)),
    getSinglePing(url)
  ).then(() => getMedian(pings));
};

const store = new Store({
  batchDelay: 1,
  cache: {
    authToken: disk.read('authToken') || null,
    regions: _.map(config.regions, ({id}) => ({$ref: ['regionsById', id]})),
    regionsById: _.indexBy(config.regions, 'id')
  },
  router: new Router({
    routes: {
      'regionsById.$key.ping':
      ({1: id, store}) => {
        const url = store.get(['regionsById', id, 'url']);
        if (!url) return {regionsById: {[id]: {ping: {$set: null}}}};

        return getPing(url).then(ping => (
          {regionsById: {[id]: {ping: {$set: ping}}}}
        ));
      },

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
