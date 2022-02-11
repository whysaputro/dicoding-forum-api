const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behaviour', () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and assert
    expect(() => threadRepository.addNewThread({}))
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(() => threadRepository.getThreadById('')
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    expect(() => threadRepository.verifyThreadIsExistById('')
      .rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
