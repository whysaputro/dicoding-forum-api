class DeleteReplyUseCase {
  constructor({ replyRepository, authenticationTokenManager }) {
    this._replyRepository = replyRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseParams, accessToken) {
    const { threadId, commentId, replyId } = useCaseParams;
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._replyRepository.verifyReplyIsExist({ threadId, commentId, replyId });
    await this._replyRepository.verifyReplyAccess({ replyId, owner });
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
