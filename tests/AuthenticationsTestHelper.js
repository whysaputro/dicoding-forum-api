/* instanbul ignore file */

const AutheticationTestHelper = {
  async getAccessTokenHelper(server) {
    /** add user */
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    /** login with the user that has been created above */
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { data: { accessToken } } = JSON.parse(response.payload);
    return accessToken;
  },
};

module.exports = AutheticationTestHelper;
