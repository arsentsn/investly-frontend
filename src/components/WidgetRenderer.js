import React, { useEffect, useState, useMemo } from "react";
import { getCryptoFullName } from "../utils/CryptoNameConverter";
import { usePrices } from "../utils/PriceContext";

const WidgetRenderer = ({ widgetData }) => {
  const [usdAmount, setUsdAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const { prices, loading, error, fetchPrices } = usePrices();

  // Parse message once and memoize it
  const parsedMessage = useMemo(() => {
    try {
      return JSON.parse(widgetData.message);
    } catch {
      return { widget: null };
    }
  }, [widgetData.message]);

  // Memoize the assets to fetch
  const assetsToFetch = useMemo(() => {
    if (!parsedMessage.widget) return new Set();

    const assets = new Set();

    if (parsedMessage.widget.assets?.length > 0) {
      parsedMessage.widget.assets.forEach(asset => assets.add(asset));
    }

    if (parsedMessage.widget.balanceData?.balances) {
      parsedMessage.widget.balanceData.balances.forEach(balance =>
          assets.add(balance.asset)
      );
    }

    return assets;
  }, [parsedMessage.widget]);

  useEffect(() => {
    if (assetsToFetch.size > 0) {
      fetchPrices(Array.from(assetsToFetch));
    }
  }, [fetchPrices, assetsToFetch]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!parsedMessage.widget) return <div className="text-red-500">No widget found</div>;

  const { type, assets, isBuy, balanceData } = parsedMessage.widget;

  const getPrice = (asset) => {
    const id = getCryptoFullName(asset);
    return prices[id]?.usd || 0;
  };

  const handleUsdChange = (e) => {
    const usd = e.target.value;
    setUsdAmount(usd);
    if (assets?.[0]) {
      const price = getPrice(assets[0]);
      if (price && usd !== "") {
        setCryptoAmount((usd / price).toFixed(6));
      }
    }
  };

  const handleCryptoChange = (e) => {
    const crypto = e.target.value;
    setCryptoAmount(crypto);
    if (assets?.[0]) {
      const price = getPrice(assets[0]);
      if (price && crypto !== "") {
        setUsdAmount((crypto * price).toFixed(2));
      }
    }
  };

  const totalUsdValue = balanceData?.balances
      ?.map((balance) => {
        const price = getPrice(balance.asset);
        return price ? parseFloat(balance.free) * price : 0;
      })
      .reduce((sum, value) => sum + value, 0) || 0;

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
              {!loading && prices[getCryptoFullName(assets?.[0])] && (
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
              <h3 style={{ margin: "0 0 5px 0" }}>Portfolio</h3>
              <div style={{ fontWeight: "bold", fontSize: "16px", color: "#27f6b1" }}>
                Total: ${totalUsdValue.toFixed(2)}
              </div>
              <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                {balanceData.balances
                    .map((balance) => {
                      const price = getPrice(balance.asset);
                      const usdValue = price ? parseFloat(balance.free) * price : 0;
                      return { ...balance, usdValue };
                    })
                    .sort((a, b) => b.usdValue - a.usdValue)
                    .map((balance, index) => {
                      const price = getPrice(balance.asset);
                      return (
                          <li key={index} style={{ marginBottom: "5px" }}>
                            <strong style={{ color: "#27f6b1" }}>{balance.asset}</strong>: {balance.free}
                            {price > 0 && ` ($${(parseFloat(balance.free) * price).toFixed(2)})`}
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