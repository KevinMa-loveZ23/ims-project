export {
  isPureNumber,
  makeAccountRules, makePasswordRules, makeEMailAddressRules, makeUserNameRules, makeServerIdRules,
  makeVerificationMessageRules, makeDescrptionRules,
  eMailValidator, userNameValidator, descriptionValidator
}

/**
 *
 * @param {string} str - Test String
 */
function isPureNumber(str) {
  return /^\d+$/.test(str);
}
/**
 *
 * @param {string} password - Test Password
 * @returns {boolean} - is password complex enough and contains no blank character(s)
 */
function isPasswordComplex(password) {
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z])(?!.*\s).{8,32}$/.test(password)
}
/**
 *
 * @param {string} eMailAddress - Test E-Mail Address
 * @returns {boolean} - is E-Mail Address legal
 */
function isEMailAddressLegal(eMailAddress) {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return reg.test(eMailAddress)
}

/**
 *
 * @param {string} accountEmptyError - Error message when account is empty
 * @param {string} accountTooLongError - Error message when account is too long
 * @param {string} accountNotNumberError - Error message when account is not pure number
 * @returns {((val: string) => true | string)[]} - account rules
 */
function makeAccountRules(accountEmptyError, accountTooLongError, accountNotNumberError) {
  return [
    (val) => (val !== null && val.length > 0) || accountEmptyError,
    (val) => (val.length < 10) || accountTooLongError,
    (val) => isPureNumber(val) || accountNotNumberError,
  ]
}

/**
 *
 * @param {string} passwordEmptyError - Error message when password is empty
 * @param {string} passwordTooShortError - Error message when password is too short
 * @param {string} passwordTooLongError - Error message when password is too long
 * @param {string} passwordNotComplexError - Error message when password is not complex enough
 * @returns {((val: string) => true | string)[]} - password rules
 */
function makePasswordRules(passwordEmptyError, passwordTooShortError, passwordTooLongError, passwordNotComplexError) {
  return [
    (val) => (val !== null && val.length > 0) || passwordEmptyError,
    (val) => (val.length >= 8) || passwordTooShortError,
    (val) => (val.length <= 32) || passwordTooLongError,
    (val) => isPasswordComplex(val) || passwordNotComplexError
  ]
}

/**
 *
 * @param {string} eMailAddressEmptyError - Error message when E-Mail address is empty
 * @param {string} eMailAddressTooLongError - Error message when E-Mail address is too long
 * @param {string} eMailAddressIllegalError - Error message when E-Mail address is illegal
 * @returns {((val: string) => true | string)[]} - E-Mail address rules
 */
function makeEMailAddressRules(eMailAddressEmptyError, eMailAddressTooLongError, eMailAddressIllegalError) {
  return [
    (val) => (val !== null && val.length > 0) || eMailAddressEmptyError,
    (val) => (val.length < 128) || eMailAddressTooLongError,
    (val) => isEMailAddressLegal(val) || eMailAddressIllegalError
  ]
}
/**
 *
 * @param {string} val - E-Mail Address
 * @returns {boolean}
 */
function eMailValidator(val) {
  return val !== null && val.length > 0 && val.length < 128 && isEMailAddressLegal(val)
}

/**
 *
 * @param {string} userNameEmptyError - Error message when user name is empty
 * @param {string} userNameTooLongError - Error message when user name is too long
 * @returns {((val: string) => true | string)[]} - user name rules
 */
function makeUserNameRules(userNameEmptyError, userNameTooLongError) {
  return [
    (val) => (val !== null && val.length > 0) || userNameEmptyError,
    (val) => (val.length < 64) || userNameTooLongError
  ]
}
/**
 *
 * @param {string} val - user name
 * @returns {boolean}
 */
function userNameValidator(val) {
  return val !== null && val.length > 0 && val.length < 64
}

/**
 *
 * @param {string} serverIdEmptyError - Error message when server ID is empty
 * @param {string} serverIdTooLongError - Error message when server ID is too long
 * @param {string} serverIdNotNumberError - Error message when server ID is not pure number
 * @returns {((val: string) => true | string)[]} - server ID rules
 */
function makeServerIdRules(serverIdEmptyError, serverIdTooLongError, serverIdNotNumberError) {
  return [
    (val) => (val !== null && val.length > 0) || serverIdEmptyError,
    (val) => (val.length < 10) || serverIdTooLongError,
    (val) => isPureNumber(val) || serverIdNotNumberError,
  ]
}

/**
 *
 * @param {string} descriptionEmptyError - Error message when description is empty
 * @param {string} descriptionTooLongError - Error message when description is too long
 * @returns {((val: string) => true | string)[]} - description rules
 */
function makeDescrptionRules(descriptionEmptyError, descriptionTooLongError) {
  return [
    (val) => (val !== null && val.length > 0) || descriptionEmptyError,
    (val) => (val.length < 3 * 100) || descriptionTooLongError,
  ]
}

/**
 *
 * @param {string} val - description
 * @returns {boolean}
 */
function descriptionValidator(val) {
  return val !== null && val.length > 0 && val.length < 3 * 100
}

/**
 *
 * @param {string} vMessageEmptyError - Error message when verification message is empty
 * @param {string} vMessageTooLongError - Error message when verification message is too long
 * @returns {((val: string) => true | string)[]} - verification message rules
 */
function makeVerificationMessageRules(vMessageEmptyError, vMessageTooLongError) {
  return [
    (val) => (val !== null && val.length > 0) || vMessageEmptyError,
    (val) => (val.length < 3 * 100) || vMessageTooLongError,
  ]
}
