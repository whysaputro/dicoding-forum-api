const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(() => replyRepository.addNewReply({}))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.deleteReplyById(''))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => replyRepository.getRepliesByCommentId(''))
      .rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
