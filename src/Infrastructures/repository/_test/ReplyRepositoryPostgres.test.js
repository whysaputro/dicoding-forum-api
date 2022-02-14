const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
    });

    await ThreadsTableTestHelper.addNewThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addNewReply function', () => {
    it('should persist add new reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'sebuah balasan',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addNewReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return addReply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'sebuah balasan',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addNewReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: expectedAddedReply.id,
        content: expectedAddedReply.content,
        owner: expectedAddedReply.owner,
      }));
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return all replies by thread id correctly', async () => {
      // Arrange

      /** add more new user */
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'johndoe',
      });

      /** add more new comment */
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-456',
      });

      /** add new reply */
      await RepliesTableTestHelper.addNewReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
        commentId: 'comment-123',
        date: '2022',
        isDeleted: false,
      });

      await RepliesTableTestHelper.addNewReply({
        id: 'reply-456',
        content: 'sebuah balasan',
        owner: 'user-456',
        commentId: 'comment-456',
        date: '2023',
        isDeleted: false,
      });

      const expectedReplies = [
        {
          id: 'reply-123',
          content: 'sebuah balasan',
          username: 'dicoding',
          commentId: 'comment-123',
          date: '2022',
          isDeleted: false,
        },

        {
          id: 'reply-456',
          content: 'sebuah balasan',
          username: 'johndoe',
          commentId: 'comment-456',
          date: '2023',
          isDeleted: false,
        },
      ];

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(replies).toEqual(expectedReplies);
    });
  });
});
