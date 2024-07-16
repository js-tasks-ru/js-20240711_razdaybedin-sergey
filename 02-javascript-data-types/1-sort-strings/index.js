/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr];

  const isDescending = param === 'desc';

  return sortedArr.sort((a, b) => {
    const result = a.localeCompare(b, ['ru', 'en'], { sensitivity: 'variant', caseFirst: 'upper' });
    return !isDescending ? result : -result;
  });
}
