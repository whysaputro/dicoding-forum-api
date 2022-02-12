const AddNewCommentUseCase = require('../AddNewCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddNewCommentUseCase', () => {
  it('should orchestrating add comment function', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    const accessToken = 'access_token';
    const threadId = 'thread-123';

    /** creating depedency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockThreadRepository.verifyThreadIsExistById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addNewComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** create use case instance */
    const addNewCommentUseCase = new AddNewCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedComment = await addNewCommentUseCase.execute(useCasePayload, threadId, accessToken);

    // Assert
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockThreadRepository.verifyThreadIsExistById).toBeCalledWith(threadId);
    expect(mockCommentRepository.addNewComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      owner: 'user-123',
      threadId: 'thread-123',
    }));
    expect(addedComment).toStrictEqual(new AddedComment({
      id: expectedAddedComment.id,
      content: expectedAddedComment.content,
      owner: expectedAddedComment.owner,
    }));
  });
});
