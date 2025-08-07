const AppError = require('@app-core/errors/app-error');

function safeParseObject(input) {
  /** @type {string} */
  let content = input.trim();
  let jsonString = '';

  if (!content.startsWith('{') || !content.endsWith('}')) {
    throw new AppError('Not a valid object format');
  }

  content = content.slice(1, -1).trim();

  if (content.indexOf("'") > -1) {
    content = content.split("'").join('"');
  }

  jsonString = `{${content}}`;

  console.log(`Normalized JSON string: ${content} ${content.indexOf("'")} ${jsonString}`);

  // Step 4: Parse safely
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new AppError(`Failed to parse object: ${err.message}`);
  }
}

module.exports = safeParseObject;
