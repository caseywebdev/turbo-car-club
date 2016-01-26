import _str from 'underscore.string';
import {GraphQLString} from 'graphql';
import config from '../../config';
import Host from '../models/host';
import sign from '../../../shared/utils/sign';

const {key, errors: {authRequired}} = config;

const NAME_REQUIRED = new Error('Name is required');

export default {
  type: Host,
  args: {
    name: {type: GraphQLString}
  },
  resolve: ({socket: {userId}}, {name}) => {
    if (!userId && userId) throw authRequired;
    if (!(name = _str.clean(name))) throw NAME_REQUIRED;
    const host = {ownerId: userId, name};
    return {...host, id: `${userId}/${name}`, key: sign(key, 'key', host)};
  }
};
