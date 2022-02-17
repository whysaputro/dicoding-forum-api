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
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const filteredComments = this._checkCommentIsDeleted(comments);
    const filteredReplies = this._checkReplyIsDeleted(replies);

    thread.comments = this._getRepliesForComment(filteredComments, filteredReplies);

    return thread;
  }

  /* istanbul ignore next */
  _checkCommentIsDeleted(comments) {
    comments.forEach((comment) => {
      comment.content = comment.isDeleted ? '**komentar telah dihapus**' : comment.content;
      delete comment.isDeleted;
    });
    return comments;
  }

  /* istanbul ignore next */
  _checkReplyIsDeleted(replies) {
    replies.forEach((reply) => {
      reply.content = reply.isDeleted ? '**balasan telah dihapus**' : reply.content;
    });
    return replies;
  }

  /* istanbul ignore next */
  _getRepliesForComment(comments, replies) {
    comments.forEach((comment) => {
      const filteredReplies = replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => {
          delete reply.commentId;
          delete reply.isDeleted;

          return reply;
        });

      comment.replies = filteredReplies;
    });

    return comments;
  }
}

module.exports = GetThreadUseCase;
