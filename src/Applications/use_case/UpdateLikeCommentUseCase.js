class UpdateLikeCommentUseCase {
  constructor({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams;
    await this._commentRepository.verifyCommentIsExist({ commentId, threadId });

    if (await this._likeRepository.verifyCommentIsLikedOrNot({ commentId, owner: userId })) {
      await this._likeRepository.removeLikeToComment({ commentId, owner: userId });
    } else {
      await this._likeRepository.addLikeToComment({ commentId, owner: userId });
    }
  }
}

module.exports = UpdateLikeCommentUseCase;
