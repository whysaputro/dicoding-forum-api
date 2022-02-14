class AddedThread {
  constructor(payload) {
    this._validatePayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ id, title, owner }) {
    return (!id || !title || !owner);
  }

  _verifyDataType({ id, title, owner }) {
    return (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof owner !== 'string');
  }
}

module.exports = AddedThread;
