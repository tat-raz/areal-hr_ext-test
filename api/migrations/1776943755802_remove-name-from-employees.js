exports.up = (pgm) => {
  pgm.dropColumn('employees', 'name', { ifExists: true });
};

exports.down = (pgm) => {
  pgm.addColumn('employees', {
    name: {
      type: 'varchar(255)',
      notNull: true,
      default: '',
    },
  });
};