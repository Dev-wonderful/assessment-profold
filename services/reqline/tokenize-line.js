const { ERROR_CODE, throwAppError } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');

/**
 * HTTP [method] | URL [URL value] | HEADERS [header json value] | QUERY [query value json] | BODY [body value json]
 */

function tokenizeLine(line) {
  const DELIMITER = '|';
  const WHITESPACE = ' ';
  const GROUP_START = '{';
  const GROUP_END = '}';

  const tokens = [];
  let current = '';
  let inGroup = false;
  let groupDepth = 0;
  let lastChar = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === WHITESPACE && char === lastChar) {
      // console.log(`WHITESPACE at index ${i}`);
      throwAppError(ReqlineMessages.MULTIPLE_SPACES, ERROR_CODE.INVLDREQLINE);
    } else if (char === DELIMITER && char === lastChar) {
      // console.log(`DELIMITER at index ${i}`);
      throwAppError(ReqlineMessages.MULTIPLE_DELIMITERS, ERROR_CODE.INVLDREQLINE);
    } else {
      lastChar = char;
    }

    if (inGroup) {
      current += char;
      if (char === GROUP_START) groupDepth++;
      if (char === GROUP_END) {
        groupDepth--;
        if (groupDepth === 0) {
          tokens.push(current);
          current = '';
          inGroup = false;
        }
      }
      // console.log(`Processing character: ${char}`);
    } else if (char === GROUP_START) {
      if (current) {
        tokens.push(current);
      }
      current = char;
      inGroup = true;
      groupDepth = 1;
    } else if (char === DELIMITER) {
      if (current) tokens.push(current);
      tokens.push(DELIMITER);
      current = '';
    } else if (char === WHITESPACE) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

module.exports = tokenizeLine;
