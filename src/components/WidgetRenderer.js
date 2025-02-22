import React, { useEffect, useState } from "react";
import { fetchCryptoPrice } from "../utils/CryptoPriceFetcher.js";
import { getCryptoFullName } from "../utils/CryptoNameConverter.js";

const WidgetRenderer = ({ widgetData }) => {
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usdAmount, setUsdAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [portfolioPrices, setPortfolioPrices] = useState({}); // To store prices for portfolio assets

  let parsedMessage = null;
  try {
    parsedMessage = JSON.parse(widgetData.message);
  } catch {
    parsedMessage = { widget: null };
  }

  useEffect(() => {
    if (!parsedMessage.widget) {
      setError("No widget data available");
      setLoading(false);
      return;
    }

    let assetId = parsedMessage.widget.assets?.[0] ||
      parsedMessage.widget.balanceData?.balances?.[0]?.asset;

    if (!assetId) {
      setError("No asset data available");
      setLoading(false);
      return;
    }

    fetchCryptoPrice(assetId)
      .then(setCryptoPrice)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Fetch prices for portfolio assets if the widget is of type "PORTFOLIO"
    if (parsedMessage.widget.type === "PORTFOLIO" && parsedMessage.widget.balanceData?.balances) {
      const balances = parsedMessage.widget.balanceData.balances;
      const pricePromises = balances.map(balance =>
        fetchCryptoPrice(balance.asset)
          .then(price => ({
            asset: balance.asset,
            price
          }))
          .catch(() => ({ asset: balance.asset, price: null }))
      );

      Promise.all(pricePromises)
        .then(prices => {
          const priceMap = prices.reduce((acc, { asset, price }) => {
            acc[asset] = price;
            return acc;
          }, {});
          setPortfolioPrices(priceMap);
        })
        .catch(() => setError("Failed to fetch some asset prices"));
    }
  }, [widgetData.message]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (loading) return <div>Loading...</div>;
  if (!parsedMessage.widget) return <div style={{ color: "red" }}>No widget found</div>;

  const handleUsdChange = (e) => {
    const usd = e.target.value;
    setUsdAmount(usd);
    if (cryptoPrice && usd !== "") {
      setCryptoAmount((usd / cryptoPrice).toFixed(6));
    }
  };

  const handleCryptoChange = (e) => {
    const crypto = e.target.value;
    setCryptoAmount(crypto);
    if (cryptoPrice && crypto !== "") {
      setUsdAmount((crypto * cryptoPrice).toFixed(2));
    }
  };

  const { type, assets, isBuy, balanceData } = parsedMessage.widget;

  const totalUsdValue = balanceData?.balances
    .map((balance) => {
      const price = portfolioPrices[balance.asset];
      return price ? balance.free * price : 0; // Calculate USD value for each asset
    })
    .reduce((sum, value) => sum + value, 0); // Sum all USD values

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {type === "QUICK_TRADE" && (
        <div
          style={{
            width: "140px",
            height: "130px",
            background: "#0B0B0B",
            borderRadius: "15px",
            padding: "5px 20px 20px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0" }}>
            {isBuy ? "Buy" : "Sell"} <span style={{ textTransform: "capitalize" }}>{getCryptoFullName(assets[0])}</span>
          </h3>
          {cryptoPrice && (
            <>
              <div style={{ margin: "5px 0 10px 0" }}>
                <label htmlFor="usdInput" style={{ fontWeight: "bold", marginRight: "5px" }}>USD</label>
                <input
                  id="usdInput"
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  style={{
                    width: "80px",
                    padding: "5px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#2c2c2c",
                    color: "white",
                    textAlign: "right",
                  }}
                  placeholder="USD"
                />
              </div>
              <div style={{ margin: "10px 0" }}>
                <label htmlFor="cryptoInput" style={{ fontWeight: "bold", marginRight: "5px" }}>{assets[0]}</label>
                <input
                  id="cryptoInput"
                  type="number"
                  value={cryptoAmount}
                  onChange={handleCryptoChange}
                  style={{
                    width: "80px",
                    padding: "5px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#2c2c2c",
                    color: "white",
                    textAlign: "right",
                  }}
                  placeholder={assets[0]}
                />
              </div>
            </>
          )}
          <button
            style={{
              background: isBuy ? "#28F6B1" : "rgb(253, 102, 37)",
              color: "black",
              border: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {isBuy ? "Quick Buy" : "Quick Sell"}
          </button>
        </div>
      )}

      {type === "PORTFOLIO" && balanceData?.balances && (
        <div
          style={{
            width: "200px",
            height: "130px",
            background: "#0B0B0B",
            borderRadius: "15px",
            padding: "10px",
            color: "white",
            textAlign: "center",
            overflowY: "auto",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0" }}>Portfolio </h3>
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#27f6b1" }}>
            Total: ${totalUsdValue.toFixed(2)}
          </div>
          <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
            {balanceData.balances
              .map((balance) => {
                const price = portfolioPrices[balance.asset];
                const usdValue = price ? balance.free * price : 0; // Calculate the USD value for sorting
                return { ...balance, usdValue }; // Add the USD value to each balance object
              })
              .sort((a, b) => b.usdValue - a.usdValue) // Sort by USD value in descending order
              .map((balance, index) => {
                const price = portfolioPrices[balance.asset];
                return (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    <strong style={{ color: "#27f6b1" }}>{balance.asset}</strong>: {balance.free} 
                    {price !== null && ` ($${(balance.free * price).toFixed(2)})`}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WidgetRenderer;
