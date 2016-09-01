import _ from 'underscore';
import config from '../config';
import disk from './disk';
import {Store, Router} from 'pave';
import live from './live';
import promisify from '../../shared/utils/promisify';
import now from '../../shared/utils/now';

const send = promisify(::live.send);

const getMedian = ns => _.sortBy(ns)[Math.floor(ns.length / 2)];

const getSingleRtt = url => {
  const start = now();
  return fetch(url).then(() => now() - start);
};

const getRtt = url => {
  const rtts = [];
  return _.reduce(_.range(10), promise =>
    promise.then(rtt => rtts.push(rtt) && getSingleRtt(url))
  , getSingleRtt(url)).then(() => getMedian(rtts));
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
      'regionsById.$key.rtt':
      ({1: id, store}) => {
        const url = store.get(['regionsById', id, 'url']);
        if (!url) return {regionsById: {[id]: {rtt: {$set: null}}}};

        return getRtt(url).then(rtt => (
          {regionsById: {[id]: {rtt: {$set: rtt}}}}
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
