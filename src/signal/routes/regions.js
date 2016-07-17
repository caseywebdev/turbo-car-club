import config from '../config';

const {regions} = config;

export default {
  regions: () => ({regions: {$set: regions}})
};
