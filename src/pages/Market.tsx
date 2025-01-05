import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { CryptoCard } from '../components/CryptoCard';
import { AddCryptoModal } from '../components/AddCryptoModal';
import { MarketSentiment } from '../components/MarketSentiment';
import { fetchCryptoData } from '../services/api';
import { Crypto } from '../types/crypto';
import { usePortfolio } from '../context/PortfolioContext';

export const Market: React.FC = () => {
  const { addPosition } = usePortfolio();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCryptoData = async () => {
    try {
      setIsRefreshing(true);
      const data = await fetchCryptoData();
      setCryptos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crypto data. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
  }, []);

  const handleBuy = (crypto: Crypto, amount: number, isBuy: boolean) => {
    if (isBuy) {
      addPosition(crypto, amount, crypto.price);
      alert(`Bought ${amount} ${crypto.symbol} for $${(amount * crypto.price).toLocaleString()}`);
    } else {
      alert(`Sell functionality should be done from the dashboard`);
    }
  };

  const handleAddCrypto = (newCrypto: Crypto) => {
    setCryptos(prev => [...prev, newCrypto]);
  };

  const getSentimentCounts = () => {
    return cryptos.reduce(
      (acc, crypto) => {
        acc[crypto.aiSentiment] += 1;
        return acc;
      },
      { bullish: 0, bearish: 0, neutral: 0 }
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadCryptoData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sentimentCounts = getSentimentCounts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Crypto Market</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <Plus size={20} />
            Add Custom
          </button>
          <button
            onClick={loadCryptoData}
            disabled={isRefreshing}
            className={`flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="mb-8">
          <MarketSentiment
            bullishCount={sentimentCounts.bullish}
            bearishCount={sentimentCounts.bearish}
            neutralCount={sentimentCounts.neutral}
            totalCoins={cryptos.length}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptos.map(crypto => (
            <CryptoCard key={crypto.id} crypto={crypto} onBuy={handleBuy} />
          ))}
        </div>
      )}

      <AddCryptoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCrypto}
      />
    </div>
  );
};