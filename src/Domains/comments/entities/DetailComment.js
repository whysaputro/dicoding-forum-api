class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      id, username, date, content, isDeleted,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.isDeleted = isDeleted;
  }

  _validatePayload({
    id, username, date, content, isDeleted,
  }) {
    if (!id || !username || !date || !content || isDeleted === 'undefined') {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATIONS');
    }
  }
}

module.exports = DetailComment;
