class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyPayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (this._verifyLimitMaxChar(payload)) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (this._verifyRestrictedChar(payload)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }

  _verifyProperty({ username, password, fullname }) {
    return (!username || !password || !fullname);
  }

  _verifyDataType({ username, password, fullname }) {
    return (
      typeof username !== 'string'
      || typeof password !== 'string'
      || typeof fullname !== 'string');
  }

  _verifyLimitMaxChar({ username }) {
    return (username.length > 50);
  }

  _verifyRestrictedChar({ username }) {
    return (!username.match(/^[\w]+$/));
  }
}

module.exports = RegisterUser;
