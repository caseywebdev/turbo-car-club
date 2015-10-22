export const up = ({schema}) =>
  schema
    .createTable('users', t => {
      t.increments();
      t.timestamps();
      t.string('name').unique().index();
      t.timestamp('signed_in_at');
    })
    .createTable('email_addresses', t => {
      t.string('email_address').primary();
      t.integer('user_id').notNullable().references('id').inTable('users');
    });

export const down = ({schema}) =>
  schema
    .dropTable('email_addresses')
    .dropTable('users');
