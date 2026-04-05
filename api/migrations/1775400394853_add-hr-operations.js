exports.up = (pgm) => {
  pgm.createTable('hr_operations', {
    id: { type: 'serial', primaryKey: true },

    employee_id: {
      type: 'integer',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'CASCADE',
    },

    department_id: {
      type: 'integer',
      notNull: true,
      references: 'departments(id)',
      onDelete: 'CASCADE',
    },

    position_id: {
      type: 'integer',
      notNull: true,
      references: 'positions(id)',
      onDelete: 'CASCADE',
    },

    operation_type: { type: 'varchar(50)', notNull: true },
    operation_date: { type: 'date', notNull: true },
    salary: { type: 'decimal(10,2)', notNull: true },

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
  pgm.dropTable('hr_operations', { ifExists: true });
};