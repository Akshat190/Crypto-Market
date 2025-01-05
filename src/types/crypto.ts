export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  aiSentiment: 'bullish' | 'bearish' | 'neutral';
  aiPrediction: number;
}

export interface Portfolio {
  id: string;
  cryptoId: string;
  amount: number;
  buyPrice: number;
  timestamp: number;
}