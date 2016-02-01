import app from '../..';
import _ from 'underscore';
import {ref as $ref} from 'falcor-json-graph';

export default {
  route: 'hosts[{keys}]',
  get: (__, {1: keys}) => {
    const hosts = _.compact(_.map(app.live.sockets, 'host'));
    return _.map(keys, key => ({
      path: ['hosts', key],
      value:
        key === 'length' ? hosts.length :
        hosts[key] ? $ref(['hostsById', hosts[key].id]) :
        null
    }));
  }
};
