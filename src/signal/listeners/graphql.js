import {graphql} from 'graphql';
import schema from '../data/schema';

export default (socket, options = {}, cb) => {
  const {query, variables} = options;
  graphql(schema, query, {socket}, variables).then(res => {
    if (res && res.errors && res.errors.length) throw res.errors[0];
    cb(null, res);
  }).catch(cb);
};
