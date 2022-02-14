class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  _verifyPayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ accessToken, refreshToken }) {
    return (!accessToken || !refreshToken);
  }

  _verifyDataType({ accessToken, refreshToken }) {
    return (
      typeof accessToken !== 'string'
      || typeof refreshToken !== 'string');
  }
}

module.exports = NewAuth;
