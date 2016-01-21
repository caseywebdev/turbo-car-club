import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import getHosts from '../utils/get-hosts';

var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    emailAddress: {type: GraphQLString},
    signedInAt: {type: GraphQLString},
    createdAt: {type: GraphQLString}
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

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType
      },
      hosts: {
        type: new GraphQLList(hostType),
        resolve: ({socket}) =>
          new Promise((resolve, reject) =>
            getHosts(socket, (er, hosts) => er ? reject(er) : resolve(hosts))
          )
      }
    })
  })
});
