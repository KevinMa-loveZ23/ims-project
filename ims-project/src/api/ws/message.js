import { ClientMessage } from "../dto/message/client-message";
import { ForwardMessage } from "../dto/message/forward-message";
import { ResponseMessage } from "../dto/message/response-message";
import { connectChatServer } from "./websocket";

export {
  MessagingHandler
}

/**
 *
 * @param {WebSocket} ws - websocket
 * @param {ClientMessage} clientMessage - message
 */
function sendMessage(ws, clientMessage) {
  // console.log(clientMessage)
  ws.send(JSON.stringify(clientMessage))
}

/**
 *
 * @param {string} jsonMessage - message in JSON
 * @returns {Object}
 */
function readMessageFromJson(jsonMessage) {
  return JSON.parse(jsonMessage)
}

/**
 *
 * @param {Object} msg - message object
 * @returns {'rsp' | 'fwd'} - rsp for response and fwd for forward
 */
function getMessageType(msg) {
  if (msg.localId) {
    // /**
    //  * @type {ResponseMessage}
    //  */
    // const rmsg = msg
    return 'rsp'
  } else {
    // /**
    //  * @type {ForwardMessage}
    //  */
    // const fmsg = msg
    return 'fwd'
  }
}

class MessagingHandler{
  /**
   *
   * @param {bigint} uid - user ID
   * @param {string} token - token (JWS)
   * @param {(msg: ResponseMessage) => *} onResponseMessage - on receiving response message
   * @param {(msg: ForwardMessage) => *} onForwardMessage - on receiving forward message
   * @param {(ev: Event) => *} onOpen - on open
   * @param {(ev: Event) => *} onError - on error
   * @param {(ev: CloseEvent) => *} onClose - on close
   */
  connectPlain(
    uid, token,
    onResponseMessage,
    onForwardMessage,
    onOpen,
    onError,
    onClose
  ) {
    this.ws = connectChatServer(uid, token)
    this.ws.addEventListener('message', ev => {
      const msg = readMessageFromJson(ev.data)
      switch (getMessageType(msg)) {
        case 'rsp':
          onResponseMessage(msg)
          break;
        case 'fwd':
          onForwardMessage(msg)
          break;

        default:
          break;
      }
    })
    this.ws.addEventListener('open', ev => {
      onOpen(ev)
    })
    this.ws.addEventListener('error', ev => {
      onError(ev)
    })
    this.ws.addEventListener('close', ev => {
      onClose(ev)
    })
  }

  connect() {
    this.connectPlain(
      this.uid, this.token,
      this.onResponseMessage,
      this.onForwardMessage,
      this.onOpen,
      this.onError,
      this.onClose
    )
  }

  reconnect() {
    this.connect()
  }

  /**
   *
   * @param {bigint} uid - user ID
   * @param {string} token - token (JWS)
   * @param {(msg: ResponseMessage) => *} onResponseMessage - on receiving response message
   * @param {(msg: ForwardMessage) => *} onForwardMessage - on receiving forward message
   * @param {(ev: Event) => *} onOpen - on open
   * @param {(ev: Event) => *} onError - on error
   * @param {(ev: CloseEvent) => *} onClose - on close
   */
  constructor(
    uid, token,
    onResponseMessage,
    onForwardMessage,
    onOpen,
    onError,
    onClose
  ) {
    this.uid = uid
    this.token = token
    this.onResponseMessage = onResponseMessage
    this.onForwardMessage = onForwardMessage
    this.onOpen = onOpen
    this.onError = onError
    this.onClose = onClose
    //
    // this.connectPlain(
    //   this.uid, this.token,
    //   this.onResponseMessage,
    //   this.onForwardMessage,
    //   this.onOpen,
    //   this.onError,
    //   this.onClose
    // )
    //
    // this.ws = connectChatServer(uid, token)
    // this.ws.addEventListener('message', ev => {
    //   const msg = readMessageFromJson(ev.data)
    //   switch (getMessageType(msg)) {
    //     case 'rsp':
    //       onResponseMessage(msg)
    //       break;
    //     case 'fwd':
    //       onForwardMessage(msg)
    //       break;

    //     default:
    //       break;
    //   }
    // })
    // this.ws.addEventListener('error', ev => {
    //   onError(ev)
    // })
    // this.ws.addEventListener('close', ev => {
    //   onClose(ev)
    // })
  }
  /**
   *
   * @param {ClientMessage} msg - message
   */
  send(msg) {
    if (this.ws.readyState == WebSocket.OPEN) {
      sendMessage(this.ws, msg)
    } else {
      let err = ''
      switch (this.ws.readyState) {
        case WebSocket.CONNECTING:
          err = 'Connecting'
          break;
        case WebSocket.CLOSING:
          err = 'Closing'
          break;
        case WebSocket.CLOSED:
          err = 'Closed'
          break;

        default:
          break;
      }
      throw new Error(err)
    }
  }
  needReconnect() {
    return this.ws?this.ws.readyState !== WebSocket.OPEN:true
  }
}
