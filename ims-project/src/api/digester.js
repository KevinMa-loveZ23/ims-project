export {
  digestMessage,
  hashPassword
}

/**
 *
 * @param {String} message - Message
 * @param {'SHA-512' | 'SHA-384'| 'SHA-256'} method - Digest Method
 * @returns {Promise<String>}
 */
async function digestMessage(message, method) {
  const data = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest(method, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return hashHex
}

/**
 *
 * @param {string} password - Password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  return digestMessage(password, "SHA-512");
}
