interface PredictionResult {
  price: number;
  confidence: number;
  factors: string[];
}

// Add type at the top of file
type Sentiment = 'bullish' | 'neutral' | 'bearish';

export function calculatePricePrediction(crypto: { aiSentiment: Sentiment, price: number, marketCap: number, change24h: number, volume24h: number }, targetYear: number): PredictionResult {
  const currentYear = new Date().getFullYear();
  const yearDiff = targetYear - currentYear;
  
  // Base growth factors
  const marketCapFactor = Math.log10(crypto.marketCap) / 12; // Higher market cap = more stability
  const volatilityFactor = Math.abs(crypto.change24h) / 100;
  const volumeFactor = Math.log10(crypto.volume24h) / 10;
  
  // Sentiment multiplier
  const sentimentMultiplier = {
    bullish: 1.2,
    neutral: 1.0,
    bearish: 0.8
  }[crypto.aiSentiment];

  // Calculate base yearly growth rate
  const baseGrowthRate = (0.15 + (Math.random() * 0.25)) * sentimentMultiplier;
  
  // Apply market factors
  const adjustedGrowthRate = baseGrowthRate * (1 + marketCapFactor) * (1 + volumeFactor);
  
  // Calculate compound growth
  const predictedPrice = crypto.price * Math.pow(1 + adjustedGrowthRate, yearDiff);
  
  // Calculate confidence score
  const confidenceBase = 85 - (yearDiff * 5); // Confidence decreases with time
  const confidenceAdjustment = (marketCapFactor * 10) - (volatilityFactor * 20);
  const confidence = Math.min(95, Math.max(30, confidenceBase + confidenceAdjustment));
  
  // Generate contributing factors
  const factors = [
    `Market capitalization suggests ${marketCapFactor > 0.5 ? 'strong' : 'moderate'} market presence`,
    `${crypto.aiSentiment.charAt(0).toUpperCase() + crypto.aiSentiment.slice(1)} market sentiment indicates ${
      sentimentMultiplier > 1 ? 'positive' : sentimentMultiplier < 1 ? 'cautious' : 'neutral'
    } growth potential`,
    `Trading volume analysis shows ${volumeFactor > 0.5 ? 'high' : 'moderate'} market activity`,
    `Price volatility is ${volatilityFactor > 0.05 ? 'high' : 'moderate to low'}`,
    `Historical trend analysis suggests ${adjustedGrowthRate > 0.2 ? 'aggressive' : 'conservative'} growth pattern`
  ];

  return {
    price: predictedPrice,
    confidence: Math.round(confidence),
    factors
  };
}