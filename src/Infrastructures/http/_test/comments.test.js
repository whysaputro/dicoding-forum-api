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
      console.log(await AuthenticationTestHelper.getAccessTokenHelper(server));
      const requestPayload = {
        content: 'sebuah comment',
      };

      // await UsersTableTestHelper.addUser({
      //   id: 'user-123',
      // });

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
        .toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });
  });
});
