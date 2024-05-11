export {
  TYPE_TEXT, TYPE_IMAGE,
  getDateFromId,
  getMsecTimestamp,
  getTmpId
}

const TYPE_TEXT = 0
const TYPE_IMAGE = 1

// const twepoch = 1704038400000n

const twepoch = BigInt("1704038400000")

/**
 *
 * @param {bigint} messageId - message ID
 * @returns {Date} - date
 */
function getDateFromId(messageId) {
  const timestamp = getMsecTimestamp(messageId)
  return new Date(parseInt(timestamp))
}

/**
 *
 * @param {bigint} messageId - message ID
 * @returns {bigint}
 */
function getMsecTimestamp(messageId) {
  const timestamp = (BigInt(messageId) >> BigInt(15)) + twepoch
  return timestamp
}

/**
 *
 * @returns {bigint} - temp ID
 */
function getTmpId() {
  const now = new Date().getTime()
  // console.log(now)
  return (BigInt(now) - twepoch) << BigInt(15)
}
