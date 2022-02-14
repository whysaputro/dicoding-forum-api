class LogoutUserUseCase {
  constructor({
    authenticationRepository,
  }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload) {
    if (this._verifyProperty(payload)) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (this._verifyDataType(payload)) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyProperty({ refreshToken }) {
    return (!refreshToken);
  }

  _verifyDataType({ refreshToken }) {
    return (typeof refreshToken !== 'string');
  }
}

module.exports = LogoutUserUseCase;
