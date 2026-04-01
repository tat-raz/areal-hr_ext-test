exports.up = (pgm) => {
  const baseColumns = {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
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
  };

  pgm.createTable('organizations', {
    ...baseColumns,
  });

  pgm.createTable('positions', {
    ...baseColumns,
  });

  pgm.createTable('departments', {
    ...baseColumns,
    organization_id: {
      type: 'integer',
      notNull: true,
      references: 'organizations(id)',
      onDelete: 'CASCADE',
    },
    parent_id: {
      type: 'integer',
      references: 'departments(id)',
      onDelete: 'SET NULL',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('departments', { ifExists: true });
  pgm.dropTable('positions', { ifExists: true });
  pgm.dropTable('organizations', { ifExists: true });
};