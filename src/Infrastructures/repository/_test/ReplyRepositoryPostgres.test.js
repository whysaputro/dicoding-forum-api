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
