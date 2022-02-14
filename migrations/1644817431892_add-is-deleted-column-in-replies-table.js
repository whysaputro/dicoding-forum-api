/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('replies', {
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('replies', 'is_deleted');
};
