/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  // GraphQLBoolean,
  // GraphQLFloat,
  // GraphQLID,
  // GraphQLInt,
  // GraphQLList,
  // GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  // connectionArgs,
  // connectionDefinitions,
  // connectionFromArray,
  fromGlobalId,
  globalIdField,
  // mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import Host from './host';
import User from './host';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type} = fromGlobalId(globalId);
    if (type === 'User') return new User();
    if (type === 'Host') return new Host();
    return null;
  },
  (obj) => {
    if (obj instanceof User) return userType;
    if (obj instanceof Host) return hostType;
    return null;
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    name: {type: GraphQLString},
    emailAddress: {type: GraphQLString},
    signedInAt: {type: GraphQLString},
    createdAt: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
});

var hostType = new GraphQLObjectType({
  name: 'Host',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('Host'),
    name: {type: GraphQLString},
    region: {type: GraphQLString},
    user: {
      type: userType
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
// var mutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     // Add your own mutations here
//   })
// });

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      // Add your own root fields here
      viewer: {
        type: userType
      },
      hosts: {
        type: hostType
      }
    })
  })
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
