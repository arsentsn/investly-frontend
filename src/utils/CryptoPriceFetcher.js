import axios from "axios";
import { getCryptoFullName } from "./CryptoNameConverter.js";

export const fetchCryptoPrice = async (assetId) => {
  const coinGeckoId = getCryptoFullName(assetId);

  if (!coinGeckoId) {
    throw new Error(`No CoinGecko ID found for ${assetId}`);
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`
    );

    const price = response.data[coinGeckoId]?.usd;
    if (!price) {
      throw new Error(`Price data for ${coinGeckoId} not found`);
    }

    return price;
  } catch (error) {
    throw new Error(`Failed to fetch ${coinGeckoId} price`);
  }
};
 export default fetchCryptoPrice;