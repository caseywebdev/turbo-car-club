import {GraphQLObjectType} from 'graphql';
import signedHost from './queries/signed-host';
import viewer from './queries/viewer';

export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    signedHost,
    viewer
  })
});
