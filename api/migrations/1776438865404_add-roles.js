exports.up = (pgm) => {
  pgm.createTable('roles', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true, unique: true },
  });

  pgm.sql(`
    INSERT INTO roles (name)
    VALUES ('admin'), ('hr_manager');
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('roles');
};