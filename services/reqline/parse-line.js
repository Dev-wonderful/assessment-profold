const { ERROR_CODE, throwAppError } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');
const tokenize = require('./tokenize-line');
const safeParseObject = require('./safe-parse-object');

function parseLine(reqline) {
  const ALLOWED_KEYWORDS = new Set(['HTTP', 'URL', 'HEADERS', 'QUERY', 'BODY']);
  // const REQUIRED_KEYWORDS = new Set(['HTTP', 'URL']);
  const JSON_KEYWORDS = new Set(['HEADERS', 'QUERY', 'BODY']);
  const ALLOWED_HTTP_METHODS = new Set(['GET', 'POST']);

  const commands = [];
  const tokens = tokenize(reqline);

  // console.log(`Tokens: ${JSON.stringify(tokens)}`);

  let i = 0;
  while (i < tokens.length) {
    const keyword = tokens[i++];
    const rawValue = tokens[i++];
    const delimiter = '|';
    // const groupStart = '{';
    let value;

    // Check for uppercase
    if (keyword !== keyword.toUpperCase()) {
      throwAppError(ReqlineMessages.KEYWORD_NOT_UPPERCASE, ERROR_CODE.INVLDREQLINE);
    }

    // Check if keyword is allowed
    if (!ALLOWED_KEYWORDS.has(keyword)) {
      throwAppError(`Invalid keyword: ${keyword}`, ERROR_CODE.INVLDREQLINE);
    }

    // Check for required keywords and the order
    if (commands.length === 0 && keyword !== 'HTTP') {
      throwAppError(ReqlineMessages.MISSING_HTTP_KEYWORD, ERROR_CODE.INVLDREQLINE);
    } else if (commands.length === 1 && keyword !== 'URL') {
      throwAppError(ReqlineMessages.MISSING_URL_KEYWORD, ERROR_CODE.INVLDREQLINE);
    }

    // Check for allowed HTTP methods
    if (keyword === 'HTTP') {
      if (rawValue !== rawValue.toUpperCase()) {
        throwAppError(ReqlineMessages.METHOD_NOT_UPPERCASE, ERROR_CODE.INVLDREQLINE);
      }
      if (!ALLOWED_HTTP_METHODS.has(rawValue)) {
        throwAppError(ReqlineMessages.METHOD_NOT_SUPPORTED, ERROR_CODE.INVLDREQLINE);
      }
    }

    try {
      if (JSON_KEYWORDS.has(keyword)) {
        value = safeParseObject(rawValue);
      } else {
        value = rawValue;
      }
    } catch (err) {
      console.error(`Error parsing value for command "${keyword}": ${err.message}`);
      throwAppError(`Invalid JSON format in ${keyword} section`, ERROR_CODE.INVLDREQLINE);
    }

    commands.push({ keyword: keyword.toUpperCase(), value });

    if (tokens[i] === delimiter) i++;
  }

  return commands;
}

module.exports = parseLine;
