class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  _verifyPayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ username, password }) {
    return (!username || !password);
  }

  _verifyDataType({ username, password }) {
    return (
      typeof username !== 'string'
      || typeof password !== 'string');
  }
}

module.exports = UserLogin;
