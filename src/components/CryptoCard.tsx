import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Brain } from 'lucide-react';
import { Crypto } from '../types/crypto';
import { PricePredictionModal } from './PricePredictionModal';
import { TradingModal } from './TradingModal';

interface Props {
  crypto: Crypto;
  onBuy: (crypto: Crypto, amount: number, isBuy: boolean) => void;
}

export const CryptoCard: React.FC<Props> = ({ crypto, onBuy }) => {
  const [showPrediction, setShowPrediction] = useState(false);
  const [showTrading, setShowTrading] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      notation: 'compact',
    }).format(num);
  };

  const getConfidenceScore = () => {
    const volatility = Math.abs(crypto.change24h);
    if (volatility < 2) return { score: 'High', color: 'text-green-500' };
    if (volatility < 5) return { score: 'Medium', color: 'text-yellow-500' };
    return { score: 'Low', color: 'text-red-500' };
  };

  const confidence = getConfidenceScore();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold dark:text-white">{crypto.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
          </div>
          <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {crypto.change24h >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="ml-1">{Math.abs(crypto.change24h)}%</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-2xl font-bold dark:text-white">{formatNumber(crypto.price)}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BarChart2 size={16} />
            <span>Vol: {formatNumber(crypto.volume24h)}</span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <p className="text-sm font-semibold dark:text-white">AI Analysis</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sentiment</p>
              <p className={`text-sm font-semibold ${
                crypto.aiSentiment === 'bullish' ? 'text-green-500' :
                crypto.aiSentiment === 'bearish' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {crypto.aiSentiment.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
              <p className={`text-sm font-semibold ${confidence.color}`}>
                {confidence.score}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Price Target</p>
              <p className="text-sm font-semibold dark:text-white">
                {formatNumber(crypto.aiPrediction)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowTrading(true)}
            className="bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Trade Now
          </button>
          <button
            onClick={() => setShowPrediction(true)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Brain size={16} />
            Predict
          </button>
        </div>
      </div>

      <PricePredictionModal
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        crypto={crypto}
      />

      <TradingModal
        isOpen={showTrading}
        onClose={() => setShowTrading(false)}
        crypto={crypto}
        onTrade={onBuy}
      />
    </>
  );
};