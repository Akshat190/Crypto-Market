import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Crypto } from '../types/crypto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  crypto: Crypto;
  onTrade: (crypto: Crypto, amount: number, isBuy: boolean) => void;
  isSellOnly?: boolean;
  maxAmount?: number;
}

export const TradingModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  crypto, 
  onTrade,
  isSellOnly = false,
  maxAmount
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isBuying, setIsBuying] = useState(!isSellOnly);

  useEffect(() => {
    setIsBuying(!isSellOnly);
  }, [isSellOnly]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (maxAmount && numAmount > maxAmount) {
      alert(`You can only sell up to ${maxAmount} ${crypto.symbol}`);
      return;
    }
    
    onTrade(crypto, numAmount, isBuying);
    onClose();
    setAmount('');
  };

  if (!isOpen) return null;

  const totalValue = Number(amount) * crypto.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">
            Trade {crypto.name} ({crypto.symbol})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Price: ${crypto.price.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setIsBuying(true)}
            className={`flex-1 py-2 rounded-lg ${
              isBuying
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setIsBuying(false)}
            className={`flex-1 py-2 rounded-lg ${
              !isBuying
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ({crypto.symbol})
            </label>
            <input
              type="number"
              step="0.000001"
              min="0"
              max={maxAmount}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Value</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white ${
              isBuying
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isBuying ? 'Buy' : 'Sell'} {crypto.symbol}
          </button>
        </form>
      </div>
    </div>
  );
}; 