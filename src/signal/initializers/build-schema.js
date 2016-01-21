'use strict';

import config from '../config';
import fs from 'fs';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';
import schema from '../data/schema';

const writeIfChanged = (filePath, data) => {
  let existing;
  try { existing = fs.readFileSync(filePath, 'utf8'); } catch (er) {}
  if (data !== existing) fs.writeFileSync(filePath, data);
};

if (config.buildSchema) {
  graphql(schema, introspectionQuery).then(result => {
    if (result.errors) throw result.errors[0].originalError;
    writeIfChanged('src/signal/data/schema.json', JSON.stringify(result.data));
    writeIfChanged('src/signal/data/schema.graphql', printSchema(schema));
  });
}
