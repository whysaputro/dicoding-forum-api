class NewThread {
  constructor(payload) {
    this._validatePayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ title, body, owner }) {
    return (!title || !body || !owner);
  }

  _verifyDataType({ title, body, owner }) {
    return (
      typeof title !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string');
  }
}

module.exports = NewThread;
