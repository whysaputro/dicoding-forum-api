/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const thread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023',
      username: 'dicoding',
    };

    const comments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2022',
        content: 'sebuah comment',
        isDeleted: false,
      }),

      new DetailComment({
        id: 'comment-456',
        username: 'johndoe',
        date: '2022',
        content: 'sebuah comment',
        isDeleted: true,
      }),
    ];

    const replies = [
      new DetailReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        date: '2020',
        username: 'dicoding',
        commentId: 'comment-123',
        isDeleted: true,
      }),

      new DetailReply({
        id: 'reply-456',
        content: 'sebuah balasan',
        date: '2023',
        username: 'johndoe',
        commentId: 'comment-456',
        isDeleted: false,
      }),
    ];

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023',
      username: 'dicoding',
      comments: [],
    });

    // Create dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    // Create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // filter comments and deleting isDeleted
    const {
      isDeleted: isDeletedCommentA,
      ...filteredCommentA
    } = comments[0];

    const {
      isDeleted: isDeletedCommentB,
      ...filteredCommentB
    } = comments[1];

    // change content property filteredCommentB to **komentar telah dihapus**
    filteredCommentB.content = '**komentar telah dihapus**';

    // filter replies and deleting isDeleted
    const {
      commentId: commentIdReplyA,
      isDeleted: isDeletedReplyA,
      ...filteredReplyA
    } = replies[0];

    // change content property filteredReplyA to **balasan telah dihapus**
    filteredReplyA.content = '**balasan telah dihapus**';

    const {
      commentId: commentIdReplyB,
      isDeleted: isDeletedReplyB,
      ...filteredReplyB
    } = replies[1];

    const expectedCommentsAndReplies = [
      { ...filteredCommentA, replies: [filteredReplyA] },
      { ...filteredCommentB, replies: [filteredReplyB] },
    ];

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(detailThread)
      .toEqual(new DetailThread({ ...expectedDetailThread, comments: expectedCommentsAndReplies }));
  });
});
