const NewThread = require('../../Domains/threads/entities/NewThread');

class AddNewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const newThread = new NewThread({ ...useCasePayload, owner: userId });
    return this._threadRepository.addNewThread(newThread);
  }
}

module.exports = AddNewThreadUseCase;
