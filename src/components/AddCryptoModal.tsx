import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Crypto } from '../types/crypto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (crypto: Crypto) => void;
}

export const AddCryptoModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    price: '',
    marketCap: '',
    volume24h: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCrypto: Crypto = {
      id: formData.symbol.toLowerCase(),
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      price: Number(formData.price),
      change24h: 0,
      marketCap: Number(formData.marketCap),
      volume24h: Number(formData.volume24h),
      aiSentiment: 'neutral',
      aiPrediction: Number(formData.price) * 1.1,
    };
    onAdd(newCrypto);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Custom Crypto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <input
                type="text"
                required
                maxLength={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input
                type="number"
                required
                step="0.000001"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Market Cap (USD)</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={formData.marketCap}
                onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">24h Volume (USD)</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={formData.volume24h}
                onChange={(e) => setFormData({ ...formData, volume24h: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Crypto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};