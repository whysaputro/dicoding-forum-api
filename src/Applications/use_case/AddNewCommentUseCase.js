const NewComment = require('../../Domains/comments/entities/NewComment');

class AddNewCommentUseCase {
  constructor({ commentRepository, threadRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, threadId, accessToken) {
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._threadRepository.verifyThreadIsExistById(threadId);
    const newComment = new NewComment({ ...useCasePayload, owner, threadId });
    return this._commentRepository.addNewComment(newComment);
  }
}

module.exports = AddNewCommentUseCase;
