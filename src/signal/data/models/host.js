import {GraphQLObjectType, GraphQLID, GraphQLString} from 'graphql';
import anonymousUser from '../../utils/anonymous-user';
import findUser from '../../utils/find-user';
import User from './user';

export default new GraphQLObjectType({
  name: 'Host',
  fields: () => ({
    id: {type: GraphQLID},
    key: {type: GraphQLString},
    name: {type: GraphQLString},
    owner: {
      type: User,
      resolve: ({ownerId: id}) =>
        findUser({id}).then(user => user || anonymousUser)
    }
  })
});
