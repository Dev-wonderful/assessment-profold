const { createHandler } = require('@app-core/server');

module.exports = createHandler({
  path: '/hello',
  method: 'get',
  async handler(rc, helpers) {
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: {
        message: 'Hello World',
      },
    };
  },
});
