const AGGREGATE_INDEX = "5";
const INVALID_SUB_INDEX = "500";

const worker = new SharedWorker("../wsWorker.js");
const { port } = worker;

port.onmessage = onMessage;

const tickersSubscribers = new Map();

function onMessage({ data: updateData }) {
  const { TYPE: type, MESSAGE: message } = updateData;

  if (type === AGGREGATE_INDEX) {
    let { FROMSYMBOL: currency, PRICE: newPrice } = updateData;
    if (newPrice === undefined) {
      return;
    }
    const heandlers = tickersSubscribers.get(currency);

    heandlers.forEach((fn) => fn(newPrice, true));
  }

  if (type === INVALID_SUB_INDEX && message === "INVALID_SUB") {
    const { PARAMETER: param } = updateData;
    const currency = param.split("~")[2];
   
    const heandlers = tickersSubscribers.get(currency);

    heandlers.forEach((fn) => fn("-", false));
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

  unsubToTickerOnWs(tickerName, "USD");
};
