const cryptoNames = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binance-coin",
  XRP: "xrp",
  ADA: "cardano",
  DOGE: "dogecoin",
  SOL: "solana",
  DOT: "polkadot",
  LTC: "litecoin",
  MATIC: "polygon",
  AVAX: "avalanche",
  UNI: "uniswap",
  LINK: "chainlink",
  XLM: "stellar",
  BCH: "bitcoin-cash",
  TRX: "tron",
  ATOM: "cosmos",
  FIL: "filecoin",
  VET: "vechain"
};

export const getCryptoFullName = (symbol) => cryptoNames[symbol] || symbol;