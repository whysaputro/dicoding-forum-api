const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNewComment function', () => {
    it('should persist add new comment correctly', async () => {
      // Arrange

      const newComment = new NewComment({
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      /** add user */
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding',
      });

      /** add new thread */
      await ThreadsTableTestHelper.addNewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addNewComment(newComment);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });
  });
});
