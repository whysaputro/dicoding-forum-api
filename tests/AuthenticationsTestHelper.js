/* istanbul ignore file */
const AutheticationTestHelper = {
  async getAccessTokenHelper(server) {
    /** add user */
    const responsRegister = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'hendra',
        password: 'secret',
        fullname: 'Hendra Wahyu',
      },
    });

    /** login with the user that has been created above */
    const responseLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'hendra',
        password: 'secret',
      },
    });

    const { data: { addedUser: { id: userId } } } = JSON.parse(responsRegister.payload);
    const { data: { accessToken } } = JSON.parse(responseLogin.payload);
    return { userId, accessToken };
  },
};

module.exports = AutheticationTestHelper;
