import React, { useState } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { Crypto, Portfolio } from '../types/crypto';
import { TradingModal } from './TradingModal';

interface Props {
  position: Portfolio;
  crypto: Crypto;
  onClose: (positionId: string) => void;
  onUpdate: (positionId: string, newAmount: number) => void;
}

export const PositionCard: React.FC<Props> = ({ position, crypto, onClose, onUpdate }) => {
  const [showTrading, setShowTrading] = useState(false);

  const currentValue = position.amount * crypto.price;
  const initialValue = position.amount * position.buyPrice;
  const profit = currentValue - initialValue;
  const profitPercentage = (profit / initialValue) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleTrade = (_: Crypto, amount: number, isBuy: boolean) => {
    if (!isBuy) {
      const sellValue = amount * crypto.price;
      const buyValue = amount * position.buyPrice;
      const profitFromSale = sellValue - buyValue;

      if (amount >= position.amount) {
        onClose(position.id);
      } else {
        const remainingAmount = position.amount - amount;
        onUpdate(position.id, remainingAmount);
      }
    }
    setShowTrading(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold dark:text-white">{crypto.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
          </div>
          <button
            onClick={() => setShowTrading(true)}
            className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Sell Position
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
            <p className="text-lg font-semibold dark:text-white">
              {position.amount} {crypto.symbol}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
            <p className="text-lg font-semibold dark:text-white">
              {formatCurrency(currentValue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Buy Price</p>
            <p className="text-lg font-semibold dark:text-white">
              {formatCurrency(position.buyPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
            <p className="text-lg font-semibold dark:text-white">
              {formatCurrency(crypto.price)}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {profit >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="font-semibold">
            {formatCurrency(profit)} ({profitPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      <TradingModal
        isOpen={showTrading}
        onClose={() => setShowTrading(false)}
        crypto={crypto}
        onTrade={handleTrade}
        isSellOnly={true}
        maxAmount={position.amount}
      />
    </>
  );
}; 