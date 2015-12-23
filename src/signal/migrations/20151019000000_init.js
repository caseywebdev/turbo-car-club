export const up = ({schema}) =>
  schema
    .createTable('users', t => {
      t.increments();
      t.string('emailAddress').unique().index();
      t.string('name').unique().index();
      t.timestamp('signedInAt');
      t.timestamp('createdAt').defaultTo('now()');
    });

export const down = ({schema}) =>
  schema
    .dropTable('users');
