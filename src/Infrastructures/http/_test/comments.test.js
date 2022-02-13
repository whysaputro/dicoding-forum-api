const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response with 401 when no access token provided ', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const requestPayload = {
        content: 'sebuah comment',
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = { };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response with 400 when payload not meet data specifications', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = {
        content: true,
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response with 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);
      const requestPayload = {
        content: 'sebuah comment',
      };

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response with 401 when no access token provided ', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 404 when comments not found', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response with 403 when no access to delete the comment', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak memiliki akses untuk menghapus komen ini');
    });

    it('should response with 200 when delete comment correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { accessToken, userId } = await AuthenticationTestHelper.getAccessTokenHelper(server);

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: userId,
      });

      await CommentTableTestHelper.addComment({
        id: commentId,
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response with 200 when get thread', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addNewThread({
        id: threadId,
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });

      await CommentTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const { data: { thread } } = responseJson;
      expect(response.statusCode).toEqual(200);
      expect(typeof responseJson.data).toEqual('object');
      expect(typeof thread).toEqual('object');
      expect(thread.id).toBeDefined();
      expect(thread.title).toBeDefined();
      expect(thread.body).toBeDefined();
      expect(thread.date).toBeDefined();
      expect(thread.username).toBeDefined();
      expect(Array.isArray(thread.comments)).toBe(true);
    });
  });
});
