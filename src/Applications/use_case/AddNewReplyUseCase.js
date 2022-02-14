const NewReply = require('../../Domains/replies/entities/NewReply');

class AddNewReplyUseCase {
  constructor({ commentRepository, replyRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParams, accessToken) {
    const { threadId, commentId } = useCaseParams;
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository.verifyCommentIsExist({ commentId, threadId });
    const newReply = new NewReply({
      ...useCasePayload, owner, commentId,
    });
    return this._replyRepository.addNewReply(newReply);
  }
}

module.exports = AddNewReplyUseCase;
