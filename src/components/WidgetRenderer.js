import React, { useEffect, useState } from "react";
import { getCryptoFullName } from '../utils/CryptoNameConverter.js';
import axios from "axios";

const WidgetRenderer = ({ widgetData }) => {
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for USD and crypto input
  const [usdAmount, setUsdAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  

  useEffect(() => {
    const coinGeckoId = getCryptoFullName(assets[0]); // Ensure this returns the correct CoinGecko ID
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`
      )
      .then((response) => {
        const price = response.data[coinGeckoId]?.usd; // Access the price dynamically
        if (price) {
          setCryptoPrice(price); // Update the price state
          setLoading(false);
        } else {
          setError(`Price data for ${coinGeckoId} not found`);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(`Failed to fetch ${coinGeckoId} price`);
        setLoading(false);
      });
  }, []);

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

  let parsedMessage;

  try {
    parsedMessage = JSON.parse(widgetData.message);
  } catch (error) {
    return <div style={{ color: "red" }}>Invalid widget data</div>;
  }

  if (!parsedMessage.widget) {
    return <div style={{ color: "red" }}>No widget found</div>;
  }

  const { type, assets, isBuy, balanceData } = parsedMessage.widget;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Quick Trade Widget */}
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
          <h3 style={{ margin: "0px" }}>{isBuy ? "Buy" : "Sell"} <span style={{ textTransform:"capitalize" }}>{getCryptoFullName(assets[0])}</span></h3>
          {cryptoPrice && (
            <>
              <div style={{ margin: "10px 0" }}>
                <label htmlFor="usdInput" style={{ fontWeight: "bold", marginRight: "5px" }}>USD</label>
                <input
                  id="usdInput"
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  style={{
                    width: "80px",
                    padding: "5px",
                    borderRadius: "5px",
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
                    borderRadius: "5px",
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
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isBuy ? "Quick Buy" : "Quick Sell"}
          </button>
        </div>
      )}

      {/* Portfolio Widget */}
       {type === "PORTFOLIO" && balanceData?.balances && (
        <div
          style={{
            width: "200px",
            height: "auto",
            background: "#1A1A1A",
            borderRadius: "15px",
            padding: "10px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h3>Portfolio</h3>
          <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
            {balanceData.balances.map((balance, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <strong>{balance.asset}</strong>: {balance.free}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WidgetRenderer;
