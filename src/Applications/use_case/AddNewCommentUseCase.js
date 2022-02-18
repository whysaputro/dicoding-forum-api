const NewComment = require('../../Domains/comments/entities/NewComment');

class AddNewCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const { threadId } = useCaseParams;
    await this._threadRepository.verifyThreadIsExistById(threadId);
    const newComment = new NewComment({ ...useCasePayload, owner: userId, threadId });
    return this._commentRepository.addNewComment(newComment);
  }
}

module.exports = AddNewCommentUseCase;
