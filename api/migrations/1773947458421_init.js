exports.up = (pgm) => {
  pgm.createTable('organizations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
    is_deleted: { type: 'boolean', default: false }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('organizations');
};