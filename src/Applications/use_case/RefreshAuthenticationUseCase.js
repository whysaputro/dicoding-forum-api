class RefreshAuthenticationUseCase {
  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ refreshToken }) {
    return (!refreshToken);
  }

  _verifyDataType({ refreshToken }) {
    return (typeof refreshToken !== 'string');
  }
}

module.exports = RefreshAuthenticationUseCase;
