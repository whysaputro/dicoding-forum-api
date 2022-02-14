const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres {
  constructor(pool, idGenerator) {
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
}

module.exports = ReplyRepositoryPostgres;
