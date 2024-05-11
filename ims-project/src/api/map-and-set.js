export {
  getMapFromObject, getMapObject, getSetFromArray, getSetArray
}

/**
 *
 * @param {Object} mapObj - map object
 * @returns {Map<K, V>} - map
 */
function getMapFromObject(mapObj) {
  return new Map(Object.entries(mapObj))
}

/**
 *
 * @param {Map<K, V>} map - map
 * @returns {Object} - map object
 */
function getMapObject(map) {
  return Object.fromEntries(map)
}

/**
 *
 * @param {Array<T>} array - set array
 * @returns {Set<T>} - set
 */
function getSetFromArray(array) {
  return new Set(array)
}

/**
 *
 * @param {Set<T>} set - set
 * @returns {Array<T>} - set array
 */
function getSetArray(set) {
  return Array.from(set)
}
