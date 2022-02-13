/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

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

    // Mocking needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    // Create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // filter comments and deleting isDeleted
    const { isDeleted: isDeletedCommentA, ...filteredCommentA } = comments[0];
    const { isDeleted: isDeletedCommentB, ...filteredCommentB } = comments[1];

    const expectedComments = [
      { ...filteredCommentA },
      { ...filteredCommentB },
    ];

    getThreadUseCase._checkCommentIsDeleted = jest.fn()
      .mockImplementation(() => [filteredCommentA, filteredCommentB]);

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(getThreadUseCase._checkCommentIsDeleted).toBeCalledWith(comments);
    expect(detailThread)
      .toEqual(new DetailThread({ ...expectedDetailThread, comments: expectedComments }));
  });

  it('should _checkCommentIsDeleted function operate properly', () => {
    // Arrange
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

    const { isDeleted: isDeletedCommentA, ...filteredCommentA } = comments[0];
    const { isDeleted: isDeletedCommentB, ...filteredCommentB } = comments[1];

    // Create use case instance
    const getThreadUseCase = new GetThreadUseCase({}, {});

    const spyCheckCommentIsDeleted = jest.spyOn(getThreadUseCase, '_checkCommentIsDeleted');

    // Action
    getThreadUseCase._checkCommentIsDeleted(comments);

    // Assert
    expect(spyCheckCommentIsDeleted).toBeCalledWith(comments);
    expect(spyCheckCommentIsDeleted).toReturnWith([
      { ...filteredCommentA },
      { ...filteredCommentB, content: '**komentar telah dihapus**' },
    ]);
  });
});
