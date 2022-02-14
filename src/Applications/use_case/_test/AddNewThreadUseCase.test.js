const AddNewThreadUseCase = require('../AddNewThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddNewThreadUseCase', () => {
  it('should orchestrating add thread function correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah content',
    };
    const useCaseAuth = {
      accessToken: 'access_token',
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    /** creating depedency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.addNewThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));

    /** create use case instance */
    const addNewThreadUseCase = new AddNewThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedThread = await addNewThreadUseCase.execute(useCasePayload, useCaseAuth);

    // Assert
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCaseAuth);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseAuth);
    expect(mockThreadRepository.addNewThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: expectedAddedThread.owner,
    }));
    expect(addedThread).toStrictEqual(new AddedThread({
      id: expectedAddedThread.id,
      title: expectedAddedThread.title,
      owner: expectedAddedThread.owner,
    }));
  });
});
