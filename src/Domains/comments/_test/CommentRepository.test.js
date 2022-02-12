const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behaviour', () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(() => commentRepository.addNewComment({}))
      .rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
