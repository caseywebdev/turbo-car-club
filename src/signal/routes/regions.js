import _ from 'underscore';
import config from '../config';

const {regions} = config;

export default {
  regions: () => ({
    regions: {$set: _.map(regions, ({id}) => ({$ref: ['regionsById', id]}))},
    regionsById: {$set: _.indexBy(regions, 'id')}
  })
};
