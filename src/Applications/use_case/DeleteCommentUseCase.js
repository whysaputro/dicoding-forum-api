class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParams, accessToken) {
    const { threadId, commentId } = useCaseParams;
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);

    await this._commentRepository.verifyCommentIsExist({ commentId, threadId });
    await this._commentRepository.verifyCommentAccess({ commentId, owner });
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
