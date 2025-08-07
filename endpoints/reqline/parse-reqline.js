const { createHandler } = require('@app-core/server');
const reqlineInterpreter = require('../../services/reqline/reqline-interpreter');

module.exports = createHandler({
  path: '/',
  method: 'post',
  async handler(rc, helpers) {
    const payload = rc.body;

    const parsedReqline = await Promise.all(
      payload.reqline.map((line) => reqlineInterpreter(line))
    );

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: parsedReqline,
    };
  },
});
