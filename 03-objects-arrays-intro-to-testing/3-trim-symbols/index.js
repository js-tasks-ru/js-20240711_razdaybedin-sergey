/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  if (size === undefined) {
    return string;
  }

  let result = '';
  let currentChar = '';
  let count = 0;

  for (const char of string) {
    if (char === currentChar) {
      if (count < size) {
        result += char;
        count++;
      }
    } else {
      currentChar = char;
      count = 1;
      result += char;
    }
  }

  return result;
}
