const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith(useCasePayload.password, 'encrypted_password');
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith(useCasePayload.username);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken);
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: expectedAuthentication.accessToken,
      refreshToken: expectedAuthentication.refreshToken,
    }));
  });
});
