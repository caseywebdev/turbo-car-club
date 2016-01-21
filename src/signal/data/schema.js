import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import getHosts from '../utils/get-hosts';
import findUser from '../utils/find-user';

var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    emailAddress: {type: GraphQLString},
    signedInAt: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    availableHosts: {
      type: new GraphQLList(hostType),
      resolve: () =>
        new Promise((resolve, reject) =>
          getHosts((er, hosts) => er ? reject(er) : resolve(hosts))
        )
    }
  })
});

var hostType = new GraphQLObjectType({
  name: 'Host',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: ({user: {id}, region, name}) => `${id}/${region}/${name}`
    },
    name: {type: GraphQLString},
    region: {type: GraphQLString},
    user: {type: userType}
  })
});

const ANONYMOUS_USER = {id: 0};

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType,
        resolve: ({socket}) =>
          socket.userId ?
          new Promise((resolve, reject) =>
            findUser({id: socket.userId}, (er, user) =>
              er ? reject(er) : resolve(user)
            )
          ) : ANONYMOUS_USER
      }
    })
  })
});
