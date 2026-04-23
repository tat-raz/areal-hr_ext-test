exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',

    employee_id: {
      type: 'integer',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'RESTRICT',
    },

    role_id: {
      type: 'integer',
      notNull: true,
      references: 'roles(id)',
      onDelete: 'RESTRICT',
    },

    login: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },

    password_hash: {
      type: 'varchar(255)',
      notNull: true,
    },


    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },

    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('now()'),
    },

    deleted_at: {
      type: 'timestamp with time zone',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};