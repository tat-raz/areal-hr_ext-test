exports.up = (pgm) => {
  pgm.createTable('audit_log', {
    id: { type: 'serial', primaryKey: true },

    user_id: {
      type: 'integer',
      notNull: true,
    },

    entity_type: {
      type: 'varchar(100)',
      notNull: true,
    },

    entity_id: {
      type: 'integer',
      notNull: true,
    },

    field_name: {
      type: 'varchar(255)',
      notNull: true,
    },

    old_value: {
      type: 'text',
      notNull: false,
      default: null,
    },

    new_value: {
      type: 'text',
      notNull: false,
      default: null,
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
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('audit_log', { ifExists: true });
};