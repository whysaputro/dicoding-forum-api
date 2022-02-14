/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async findReplyById(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async addNewReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    owner = 'user-123',
    commentId = 'comment-123',
    date = '2021',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, commentId, date, isDeleted],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
