const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    });

    await ThreadsTableTestHelper.addNewThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
      threadId: 'thread-123',
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentIsLikedOrNot function', () => {
    it('should return true if comment already liked by the user', async () => {
      // Arrange
      await LikesTableTestHelper.addNewLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyCommentIsLikedOrNot({
        commentId: 'comment-123',
        owner: 'user-123',
      })).resolves.toBe(true);
    });

    it('should return false if comment not liked by the user', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyCommentIsLikedOrNot({
        commentId: 'comment-123',
        owner: 'user-123',
      })).resolves.toBe(false);
    });
  });

  describe('addLikeToComment function', () => {
    it('should add like comment correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const owner = 'user-123';
      const fakeIdGenerator = () => '123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLikeToComment({ commentId, owner });

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('removeLikeToComment', () => {
    it('should remove like from comment correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addNewLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const commentId = 'comment-123';
      const owner = 'user-123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.removeLikeToComment({ commentId, owner });

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(0);
    });
  });
});
