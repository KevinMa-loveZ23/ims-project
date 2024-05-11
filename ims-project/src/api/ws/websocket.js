import { websocketUrl } from "../base-url"

export {
  connectChatServer
}

/**
 *
 * @param {string} path - websocket connection path
 * @param {bigint} userId - user ID
 * @param {string} token - user token (JWS)
 * @returns {WebSocket} - WebSocket
 */
function newWsConn(path, userId, token) {
  // console.log(userId)
  // console.log(token)
  //wss://test.kein-thema.xyz/api/websocket
  return new WebSocket(path, [userId.toString(), token])
}

/**
 *
 * @param {bigint} userId - user ID
 * @param {string} token - user token (JWS)
 * @returns {WebSocket} - WebSocket
 */
function connectChatServer(userId, token) {
  return newWsConn(websocketUrl, userId, token)
}

// ws.addEventListener("open", function (event) {
// console.log("conn create");
// const helloTest = "Hello Server! from 2";
// ws.send(helloTest);
// ws.send("2 * " + helloTest);
// console.log(helloTest);
// messageList.push(new TestMsg(counter.value++, "0", helloTest));
// });

// // Listen for messages
// ws.addEventListener("message", function (event) {
// console.log("Message from server ", event.data);
// messageList.push(new TestMsg(counter.value++, "1", event.data));
// });
