const AddNewThreadUseCase = require('../AddNewThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddNewThreadUseCase', () => {
  it('should orchestrating add thread function correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah content',
    };

    const userId = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    /** creating depedency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addNewThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      })));

    /** create use case instance */
    const addNewThreadUseCase = new AddNewThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addNewThreadUseCase.execute(useCasePayload, userId);

    // Assert
    expect(mockThreadRepository.addNewThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: userId,
    }));
    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
