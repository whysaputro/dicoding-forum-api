/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    thread.comments = await this._commentRepository.getCommentsByThreadId(threadId);

    thread.comments = this._checkCommentIsDeleted(thread.comments);
    thread.comments = this._getRepliesForComment(thread.comments, replies);

    return thread;
  }

  _checkCommentIsDeleted(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].isDeleted ? '**komentar telah dihapus**' : comments[i].content;
      delete comments[i].isDeleted;
    }
    return comments;
  }

  _getRepliesForComment(comments, replies) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].replies = replies
        .filter((reply) => reply.commentId === commentId)
        .map((reply) => {
          const { ...replyDetail } = reply;
          replyDetail.content = replyDetail.isDeleted ? '**balasan telah dihapus**' : replyDetail.content;
          delete replyDetail.commentId;
          delete replyDetail.isDeleted;

          return replyDetail;
        });
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;
