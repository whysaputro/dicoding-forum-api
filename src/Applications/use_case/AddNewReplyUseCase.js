const NewReply = require('../../Domains/replies/entities/NewReply');

class AddNewReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;
    await this._commentRepository.verifyCommentIsExist({ commentId, threadId });
    const newReply = new NewReply({ ...useCasePayload, owner: userId, commentId });
    return this._replyRepository.addNewReply(newReply);
  }
}

module.exports = AddNewReplyUseCase;
