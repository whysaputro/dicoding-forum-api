const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postAddNewThreadHandler,
  },
]);

module.exports = routes;
