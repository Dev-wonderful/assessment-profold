const { default: axios } = require('axios');

const keywordMapping = {
  HTTP: 'method',
  URL: 'full_url',
  HEADERS: 'headers',
  QUERY: 'query',
  BODY: 'body',
};

async function runLine(commands) {
  const request = {
    query: {},
    headers: {},
    body: {},
    full_url: '',
  };

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];

    const key = keywordMapping[cmd.keyword];
    request[key] = cmd.value;
  }

  let queries = '';
  if (request.query) {
    queries = Object.entries(request.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
  request.full_url = `${request.full_url}${queries ? `?${queries}` : ''}`;
  // console.log('Parsed request:', request);
  const httpRequest = axios({
    baseURL: request.full_url,
    headers: request.headers,
    method: request.method.toLowerCase(),
    data: request.body,
  });

  let result;
  const response = {};

  const startTimestamp = Date.now();
  response.request_start_timestamp = startTimestamp;

  try {
    result = await httpRequest;
  } catch (error) {
    result = error.response || error;
  }

  const stopTimestamp = Date.now();
  response.request_stop_timestamp = stopTimestamp;
  response.duration = stopTimestamp - startTimestamp;

  response.http_status = result.status;
  response.response_data = result.data || {};

  // console.log('Response:', response, request);
  delete request.method;

  return {
    request,
    response,
  };
}

module.exports = runLine;
