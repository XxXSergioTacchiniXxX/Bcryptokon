const API_KEY =
  "90779c52ce5e54a192cea473260a7129152f06f92bee91c7dac54aa70e4f3767";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

let activeSub = [];

self.onconnect = (e) => {
  const port = e.ports[0];
  port.onmessage = (e) => {
    sendToWebSocket(e.data);
  };
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    port.postMessage(data);
  };
};

const sendToWebSocket = (message) => {
  const messageParams = constructRequest(message);

  if (socket.readyState === WebSocket.OPEN) {
    socketSend(messageParams);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socketSend(messageParams);
    },
    { once: true }
  );
};

function socketSend(messParam) {
  const stringifiedMessage = JSON.stringify(messParam);

  if (messParam.action === "SubAdd") {
    if (activeSub.includes(messParam.ticker + messParam.currency)) return;
    activeSub.push(messParam.ticker + messParam.currency);
    socket.send(stringifiedMessage);
  }
  if (messParam.action === "SubRemove") {
    activeSub = activeSub.filter(
      (sub) => sub !== messParam.ticker + messParam.currency
    );

    socket.send(stringifiedMessage);
  }
}

function constructRequest({ ticker, currency, action }) {
  return {
    action,
    subs: [`5~CCCAGG~${ticker}~${currency || "USD"}`],
  };
}
