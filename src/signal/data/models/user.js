import _ from 'underscore';
import app from '../..';
import Host from './host';

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    emailAddress: {type: GraphQLString},
    signedInAt: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    availableHosts: {
      type: new GraphQLList(Host),
      resolve: () =>
        _.chain(app.live.sockets)
          .map('host')
          .compact()
          .map(_.partial(_.pick, _, 'id', 'name', 'creatorId'))
          .value()
    }
  })
});
