const parseLine = require('./parse-line');
const runLine = require('./run-line');

/**
 * Takes a request line string and returns the request result.
 * @param {string} reqline
 * @return {Object} Parsed request object
 */
async function reqlineInterpreter(reqline) {
  const parsedStructure = parseLine(reqline);
  const result = await runLine(parsedStructure);
  // console.log('Request result:', result);

  // return {
  //   request: result,
  //   raw: reqline,
  //   parsed: parsedStructure,
  // };

  return result;
}

module.exports = reqlineInterpreter;
