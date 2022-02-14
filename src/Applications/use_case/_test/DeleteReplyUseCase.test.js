const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply correctly', async () => {
    // Arrange
    const useCaseParams = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };
    const accessToken = 'access_token';
    const userIdFromAccessToken = 'user-123';

    /** create use case depedency */
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockReplyRepository = new ReplyRepository();

    /** mocking */
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockReplyRepository.verifyReplyIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await deleteReplyUseCase.execute(useCaseParams, accessToken);

    // Assert
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith({
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
      replyId: useCaseParams.replyId,
    });
    expect(mockReplyRepository.verifyReplyAccess).toBeCalledWith({
      replyId: useCaseParams.replyId,
      owner: userIdFromAccessToken,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParams.replyId);
  });
});
