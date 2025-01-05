import React, { useState } from 'react';
import { X, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Crypto } from '../types/crypto';
import { calculatePricePrediction } from '../services/aiPrediction';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  crypto: Crypto;
}

export const PricePredictionModal: React.FC<Props> = ({ isOpen, onClose, crypto }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear() + 1);
  const [prediction, setPrediction] = useState<{
    price: number;
    confidence: number;
    factors: string[];
  } | null>(null);

  const handlePredict = () => {
    const result = calculatePricePrediction(crypto, year);
    setPrediction(result);
  };

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      notation: value > 1000 ? 'compact' : 'standard',
    }).format(value);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-green-500';
    if (confidence >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-800 py-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-bold dark:text-white">AI Price Prediction</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base sm:text-lg font-semibold dark:text-white">
              {crypto.name} ({crypto.symbol})
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Current Price: {formatCurrency(crypto.price)}
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prediction Year
          </label>
          <input
            type="number"
            min={new Date().getFullYear()}
            max={new Date().getFullYear() + 10}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          onClick={handlePredict}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          Generate Prediction
        </button>

        {prediction && (
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Predicted Price</span>
                <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(prediction.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">AI Confidence</span>
                <span className={`text-sm sm:text-base font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-2 dark:text-white">Contributing Factors</h4>
              <ul className="space-y-2">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <span className="mt-1">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-2 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-500">
                This prediction is based on historical data, market sentiment, and AI analysis. 
                Cryptocurrency markets are highly volatile and actual results may vary significantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};