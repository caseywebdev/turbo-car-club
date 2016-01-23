'use strict';

import config from '../config';
import fs from 'fs';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';
import promisify from '../../shared/utils/promisify';
import schema from '../data/schema';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const JSON_PATH = 'src/signal/data/schema.json';
const GRAPHQL_PATH = 'src/signal/data/schema.graphql';

const writeIfChanged = (filePath, data) =>
  readFile(filePath, 'utf8').then(
    existing => data !== existing && writeFile(filePath, data),
    () => writeFile(filePath, data)
  );

if (config.buildSchema) {
  graphql(schema, introspectionQuery).then(({data, errors}) => {
    if (errors) throw errors[0].originalError;
    return Promise.all([
      writeIfChanged(JSON_PATH, JSON.stringify(data, null, 2)),
      writeIfChanged(GRAPHQL_PATH, printSchema(schema))
    ]);
  }).catch(er => {
    console.error(er);
    process.exit(1);
  });
}
