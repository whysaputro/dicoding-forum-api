const NewThread = require('../../Domains/threads/entities/NewThread');

class AddNewThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, accessToken) {
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager
      .decodePayload(accessToken);
    const newThread = new NewThread({ ...useCasePayload, owner });
    return this._threadRepository.addNewThread(newThread);
  }
}

module.exports = AddNewThreadUseCase;
