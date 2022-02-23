/* eslint-disable no-param-reassign */
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    thread.comments = await this._getLikeCountForComment(comments);
    thread.comments = this._getRepliesForComment(thread.comments, replies);

    return thread;
  }

  /* istanbul ignore next */
  _getRepliesForComment(comments, replies) {
    comments.forEach((comment) => {
      const filteredReplies = replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => {
          delete reply.commentId;

          return reply;
        });

      comment.replies = filteredReplies;
    });

    return comments;
  }

  /* istanbul ignore next */
  async _getLikeCountForComment(comments) {
    await Promise.all(comments.map(async (comment) => {
      comment.likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id);
    }));

    return comments;
  }
}

module.exports = GetThreadUseCase;
