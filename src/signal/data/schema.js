import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import getHosts from '../utils/get-hosts';
import findUser from '../utils/find-user';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    emailAddress: {type: GraphQLString},
    signedInAt: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    availableHosts: {
      type: new GraphQLList(Host),
      resolve: getHosts
    }
  })
});

const Host = new GraphQLObjectType({
  name: 'Host',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    region: {type: GraphQLString},
    user: {
      type: User,
      resolve: ({userId: id}) => findUser({id})
    }
  })
});

const ANONYMOUS_USER = {id: 0};

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: User,
        resolve: ({socket: {userId: id}}) =>
          id ? findUser({id}) : ANONYMOUS_USER
      }
    })
  })
});
