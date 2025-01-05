import React from 'react';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  totalCoins: number;
}

export const MarketSentiment: React.FC<Props> = ({ bullishCount, bearishCount, neutralCount, totalCoins }) => {
  const getBullishPercentage = () => (bullishCount / totalCoins) * 100;
  const getBearishPercentage = () => (bearishCount / totalCoins) * 100;
  const getNeutralPercentage = () => (neutralCount / totalCoins) * 100;

  const getOverallSentiment = () => {
    if (bullishCount > bearishCount && bullishCount > neutralCount) return 'Bullish';
    if (bearishCount > bullishCount && bearishCount > neutralCount) return 'Bearish';
    return 'Neutral';
  };

  const sentimentColor = {
    Bullish: 'text-green-500',
    Bearish: 'text-red-500',
    Neutral: 'text-yellow-500',
  }[getOverallSentiment()];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">AI Market Sentiment</h2>
        <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className={`text-2xl font-bold ${sentimentColor}`}>
          {getOverallSentiment()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Market Outlook
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="dark:text-white">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${getBullishPercentage()}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getBullishPercentage().toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <span className="dark:text-white">Bearish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${getBearishPercentage()}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getBearishPercentage().toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-yellow-500" />
            <span className="dark:text-white">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${getNeutralPercentage()}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getNeutralPercentage().toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};