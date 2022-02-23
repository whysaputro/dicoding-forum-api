const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentIsLikedOrNot({ commentId, owner }) {
    const query = {
      text: 'SELECT EXISTS(SELECT 1 FROM likes WHERE comment_id=$1 AND owner=$2)',
      values: [commentId, owner],
    };

    const { rows } = await this._pool.query(query);

    return rows[0].exists;
  }

  async addLikeToComment({ commentId, owner }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async removeLikeToComment({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'select count(id) from likes where comment_id=$1',
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    return Number(rows[0].count);
  }
}

module.exports = LikeRepositoryPostgres;
