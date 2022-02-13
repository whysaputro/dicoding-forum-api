/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    thread.comments = this._checkCommentIsDeleted(thread.comments);

    return thread;
  }

  _checkCommentIsDeleted(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].isDeleted ? '**komentar telah dihapus**' : comments[i].content;
      delete comments[i].isDeleted;
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;
