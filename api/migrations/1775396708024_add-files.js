exports.up = (pgm) => {
  pgm.createTable('files', {
    id: { type: 'serial', primaryKey: true },

    employee_id: {
      type: 'integer',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'CASCADE',
    },

    name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'text', notNull: true },

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
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('files', { ifExists: true });
};