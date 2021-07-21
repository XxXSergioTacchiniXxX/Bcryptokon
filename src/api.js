const AGGREGATE_INDEX = "5";

const worker = new SharedWorker("../wsWorker.js");
const { port } = worker;

port.onmessage = onMessage;

const tickersSubscribers = new Map();

let crossСurrency = [];
// let btcPrice = 0;

// const updateBtcPrice = (newPrice) => {
//   btcPrice = newPrice;
// };

function onMessage({ data: updateData }) {

  const { TYPE: type } = updateData;

  if (type === AGGREGATE_INDEX) {
    let { FROMSYMBOL: currency, PRICE: newPrice } = updateData;
    if (newPrice === undefined) {
      return;
    }
    const heandlers = tickersSubscribers.get(currency);

    heandlers.forEach((fn) => fn(newPrice, true));
  }
}

const sendToWorker = (message) => {
  port.postMessage(message);
  return;
};

function subToTickerOnWs(ticker, currency) {
  sendToWorker({
    ticker,
    currency,
    action: "SubAdd",
  });
}

function unsubToTickerOnWs(ticker, currency) {
  sendToWorker({
    ticker,
    currency,
    action: "SubRemove",
  });
}

export const subToUpdatePrice = (tickerName, cb) => {
  const subscribers = tickersSubscribers.get(tickerName) || [];
  tickersSubscribers.set(tickerName, [...subscribers, cb]);
  if (subscribers.length) return;
  subToTickerOnWs(tickerName, "USD");
};

export const unsubToUpdatePrice = (tickerName) => {
  if (tickerName === "BTC") return;

  tickersSubscribers.delete(tickerName);

  if (crossСurrency.includes(tickerName)) {
    unsubToTickerOnWs(tickerName, "BTC");
    crossСurrency = crossСurrency.filter((currency) => currency !== tickerName);
    return;
  }
  unsubToTickerOnWs(tickerName, "USD");
};

// subToUpdatePrice("BTC", updateBtcPrice);
