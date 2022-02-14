const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewReply({ content, owner, commentId }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) returning id, content, owner',
      values: [id, content, owner, commentId, date],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.content, users.username,
             replies.comment_id, replies.date, replies.is_deleted
             FROM replies
             INNER JOIN comments ON replies.comment_id = comments.id
             INNER JOIN users ON replies.owner = users.id
             WHERE comments.thread_id = $1
             ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((el) => new DetailReply({
      ...el, commentId: el.comment_id, isDeleted: el.is_deleted,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
