const NewThread = require('../../Domains/threads/entities/NewThread');

class AddNewThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseAuth) {
    await this._authenticationTokenManager.verifyAccessToken(useCaseAuth);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(useCaseAuth);
    const newThread = new NewThread({ ...useCasePayload, owner });
    return this._threadRepository.addNewThread(newThread);
  }
}

module.exports = AddNewThreadUseCase;
