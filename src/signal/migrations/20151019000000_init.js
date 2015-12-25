export const up = ({schema}) =>
  schema
    .raw('CREATE EXTENSION IF NOT EXISTS citext')
    .createTable('users', t => {
      t.increments();
      t.specificType('emailAddress', 'citext').unique().index();
      t.specificType('name', 'citext').unique().index();
      t.timestamp('signedInAt');
      t.timestamp('createdAt').defaultTo('now()');
    });

export const down = ({schema}) =>
  schema
    .dropTable('users');
