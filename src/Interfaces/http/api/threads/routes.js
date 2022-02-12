const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postAddNewThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
