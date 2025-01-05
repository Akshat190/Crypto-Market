import { cryptoData } from '../data/mockData';
import { Crypto } from '../types/crypto';

interface CoinGeckoResponse {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export async function fetchCryptoData(): Promise<Crypto[]> {
  try {
    const response = await fetch(
      `/api/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&sparkline=false&price_change_percentage=24h`
    );

    if (response.status === 429) {
      console.warn('Rate limit exceeded, falling back to mock data');
      return cryptoData;
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: CoinGeckoResponse[] = await response.json();
    
    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      aiSentiment: generateAISentiment(coin.price_change_percentage_24h),
      aiPrediction: generateAIPrediction(coin.current_price, coin.price_change_percentage_24h),
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    console.warn('Falling back to mock data');
    return cryptoData;
  }
}

function generateAISentiment(change24h: number): 'bullish' | 'bearish' | 'neutral' {
  if (change24h > 5) return 'bullish';
  if (change24h < -5) return 'bearish';
  return 'neutral';
}

function generateAIPrediction(currentPrice: number, change24h: number): number {
  const volatilityFactor = Math.abs(change24h) / 100;
  const prediction = currentPrice * (1 + (volatilityFactor * (Math.random() > 0.5 ? 1 : -1)));
  return Number(prediction.toFixed(2));
}