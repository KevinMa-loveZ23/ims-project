export {
  StdResponse, ResponseDataBody
}

class StdResponse{
  /**
   *
   * @param {number} httpStatusCode - http response status code
   * @param {string} info - response info message
   * @param {ResponseDataBody} responseBody - response body
   */
  constructor(httpStatusCode, info, responseBody) {
    this.httpStatusCode = httpStatusCode
    this.info = info
    this.responseBody = responseBody
  }
}

class ResponseDataBody{
  /**
   *
   * @returns {boolean} - if body is void
   */
  isVoid() {
    console.log("Function 'isVoid()' have NOT got Rewrited!")
    return true
  }
}
