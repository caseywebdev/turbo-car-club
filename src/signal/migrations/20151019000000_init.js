export const up = ({schema}) =>
  schema
    .createTable('users', t => {
      t.increments();
      t.timestamps();
      t.string('name').unique();
      t.timestamp('signed_in_at');
    })
    .createTable('email_addresses', t => {
      t.increments();
      t.timestamps();
      t.integer('user_id').notNullable().references('id').inTable('users');
      t.string('email_address').notNullable().unique().index();
      t.timestamp('verified_at').notNullable();
    });

export const down = ({schema}) =>
  schema
    .dropTable('email_addresses')
    .dropTable('users');
