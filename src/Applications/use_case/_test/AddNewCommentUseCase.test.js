const AddNewCommentUseCase = require('../AddNewCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddNewCommentUseCase', () => {
  it('should orchestrating add comment function', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const userId = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    /** creating depedency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExistById = jest.fn(() => Promise.resolve());
    mockCommentRepository.addNewComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      })));

    /** create use case instance */
    const addNewCommentUseCase = new AddNewCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addNewCommentUseCase.execute(useCasePayload, useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExistById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.addNewComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      owner: userId,
      threadId: useCaseParams.threadId,
    }));
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
