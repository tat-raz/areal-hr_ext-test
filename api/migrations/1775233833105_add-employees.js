exports.up = (pgm) => {
  pgm.createTable('employees', {
    id: { type: 'serial', primaryKey: true },

    name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    middle_name: { type: 'varchar(100)', notNull: false },

    birth_date: { type: 'date', notNull: true },

    passport_series: { type: 'varchar(10)', notNull: false },
    passport_number: { type: 'varchar(20)', notNull: false },
    passport_issue_date: { type: 'date', notNull: false },
    passport_code: { type: 'varchar(10)', notNull: false },
    passport_issued_by: { type: 'varchar(255)', notNull: false },

    registration_address: { type: 'varchar(255)', notNull: false },
    registration_city: { type: 'varchar(100)', notNull: false },
    registration_street: { type: 'varchar(100)', notNull: false },
    registration_house: { type: 'varchar(20)', notNull: false },
    registration_building: { type: 'varchar(20)', notNull: false },
    registration_apartment: { type: 'varchar(20)', notNull: false },

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
  pgm.dropTable('employees', { ifExists: true });
};