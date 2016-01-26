import {GraphQLObjectType} from 'graphql';
import createHost from './mutations/create-host';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createHost
  })
});
