const AddNewReplyUseCase = require('../AddNewReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

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

    const userId = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    /** create dependency use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking */
    mockCommentRepository.verifyCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addNewReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: userId,
      })));

    /** creating use case instance */
    const addNewReplyUseCase = new AddNewReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Acction
    const addedReply = await addNewReplyUseCase.execute(useCasePayload, useCaseParams, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith({
      commentId: useCaseParams.commentId, threadId: useCaseParams.threadId,
    });
    expect(mockReplyRepository.addNewReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      owner: userId,
      commentId: useCaseParams.commentId,
    }));
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
