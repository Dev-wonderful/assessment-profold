const { throwAppError } = require('@app-core/errors');

function safeParseObject(input) {
  /** @type {string} */
  let content = input.trim();
  let jsonString = '';

  if (!content.startsWith('{') || !content.endsWith('}')) {
    throwAppError('Not a valid object format');
  }

  content = content.slice(1, -1).trim();

  if (content.indexOf("'") > -1) {
    content = content.split("'").join('"');
  }

  jsonString = `{${content}}`;

  // console.log(`Normalized JSON string: ${content} ${content.indexOf("'")} ${jsonString}`);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throwAppError(`Failed to parse object: ${err.message}`);
  }
}

module.exports = safeParseObject;
