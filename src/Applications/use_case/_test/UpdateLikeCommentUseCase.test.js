const UpdateLikeCommentUseCase = require('../UpdateLikeCommentUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('UpdateLikeCommentUseCase', () => {
  it('should orchestrating UpdateLikeCommentUseCase action correctly when user give like a comment', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userId = 'user-123';

    /** create use case depedency */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking */
    mockThreadRepository.verifyThreadIsExistById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyCommentIsLikedOrNot = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const updateLikeCommentUseCase = new UpdateLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await updateLikeCommentUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExistById)
      .toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyCommentIsExist)
      .toBeCalledWith({
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
      });
    expect(mockLikeRepository.verifyCommentIsLikedOrNot)
      .toBeCalledWith({
        commentId: useCaseParams.commentId,
        owner: userId,
      });
    expect(mockLikeRepository.addLikeToComment)
      .toBeCalledWith({
        commentId: useCaseParams.commentId,
        owner: userId,
      });
  });

  it('should orchestrating UpdateLikeCommentUseCase action correctly when user remove like a comment', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userId = 'user-123';

    /** create use case depedency */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking */
    mockThreadRepository.verifyThreadIsExistById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyCommentIsLikedOrNot = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.removeLikeToComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const updateLikeCommentUseCase = new UpdateLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await updateLikeCommentUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExistById)
      .toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyCommentIsExist)
      .toBeCalledWith({
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
      });
    expect(mockLikeRepository.verifyCommentIsLikedOrNot)
      .toBeCalledWith({
        commentId: useCaseParams.commentId,
        owner: userId,
      });
    expect(mockLikeRepository.removeLikeToComment)
      .toBeCalledWith({
        commentId: useCaseParams.commentId,
        owner: userId,
      });
  });
});
