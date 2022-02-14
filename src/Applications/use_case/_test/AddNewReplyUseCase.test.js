const AddNewReplyUseCase = require('../AddNewReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddNewReplyUseCase', () => {
  it('should orchestrating AddNewReply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
    };

    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const accessToken = 'access_token';
    const userId = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    /** create dependency use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking */
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockCommentRepository.verifyCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addNewReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    /** creating use case instance */
    const addNewReplyUseCase = new AddNewReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Acction
    const addedReply = await addNewReplyUseCase.execute(useCasePayload, useCaseParams, accessToken);

    // Assert
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith({
      commentId: useCaseParams.commentId, threadId: useCaseParams.threadId,
    });
    expect(mockReplyRepository.addNewReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      owner: userId,
      commentId: useCaseParams.commentId,
    }));
    expect(addedReply).toStrictEqual(new AddedReply({
      id: expectedAddedReply.id,
      content: expectedAddedReply.content,
      owner: expectedAddedReply.owner,
    }));
  });
});
