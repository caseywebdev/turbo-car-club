export const up = ({schema}) =>
  schema
    .createTable('users', t => {
      t.increments();
      t.string('email_address').unique().index();
      t.string('name').unique().index();
      t.timestamp('signed_in_at');
      t.timestamp('created_at').defaultTo('now()');
    });

export const down = ({schema}) =>
  schema
    .dropTable('users');
