class RegisteredUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  _verifyPayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ id, username, fullname }) {
    return (!id || !username || !fullname);
  }

  _verifyDataType({ id, username, fullname }) {
    return (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof fullname !== 'string');
  }
}

module.exports = RegisteredUser;
