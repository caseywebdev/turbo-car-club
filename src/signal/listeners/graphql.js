import {graphql} from 'graphql';
import schema from '../data/schema';

export default ({socket, params: {query, variables} = {}}) =>
  graphql(schema, query, {socket}, variables)
    .then(res => {
      if (res && res.errors && res.errors.length) throw res.errors[0];
      return res.data;
    });
