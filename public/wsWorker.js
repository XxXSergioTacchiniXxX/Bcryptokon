const API_KEY =
  "90779c52ce5e54a192cea473260a7129152f06f92bee91c7dac54aa70e4f3767";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

let activeSubs = [];
const connections = [];

self.onconnect = (e) => {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = (e) => {
    onMessage(e.data);
  };

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);

    connections.forEach((p) => {
      p.postMessage(data);
    });
  };
};

const onMessage = (message) => {
  if (socket.readyState === WebSocket.OPEN) {
    socketSend(message);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socketSend(message);
    },
    { once: true }
  );
};

function socketSend(message) {
  console.log(message);

  if (message.action === "SubAdd") {
    onAddSub(message);
  }

  if (message.action === "SubRemove") {
    onRemoveSub(message);
  }
}

function onAddSub(message) {
  const messageParam = constructRequest(message);
  const stringifiedMessage = JSON.stringify(messageParam);

  const activeSub = activeSubs.find(
    (sub) => sub.name === message.ticker + message.currency
  );

  if (activeSub) {
    activeSub.subCount++;
    return;
  }

  activeSubs.push({
    name: message.ticker + message.currency,
    subCount: 1,
  });

  socket.send(stringifiedMessage);
}

function onRemoveSub(message) {
  const messageParam = constructRequest(message);
  const stringifiedMessage = JSON.stringify(messageParam);

  const activeSub = activeSubs.find((sub) => {
    return sub.name === message.ticker + message.currency;
  });

  if (!activeSub) return;

  activeSub.subCount--;

  if (activeSub.subCount === 0) {
    console.log("PRE DELETE", activeSubs);
    activeSubs = activeSubs.filter((sub) => sub !== activeSub);
    console.log("OUT DELETE", activeSubs);

    socket.send(stringifiedMessage);
  }
}

function constructRequest({ ticker, currency, action }) {
  return {
    action,
    subs: [`5~CCCAGG~${ticker}~${currency || "USD"}`],
  };
}
