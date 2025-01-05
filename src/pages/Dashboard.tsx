import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Activity } from 'lucide-react';
import { PortfolioChart } from '../components/PortfolioChart';
import { usePortfolio } from '../context/PortfolioContext';
import { Crypto, Portfolio } from '../types/crypto';
import { PositionCard } from '../components/PositionCard';
import { fetchCryptoData } from '../services/api';

export const Dashboard: React.FC = () => {
  const { portfolio, realizedProfit, closePosition, updatePosition } = usePortfolio();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        const data = await fetchCryptoData();
        setCryptos(data);
      } catch (error) {
        console.error('Failed to load crypto data:', error);
      }
    };
    loadCryptos();
  }, [portfolio]);

  const positions = portfolio.map(position => {
    const crypto = cryptos.find(c => c.id === position.cryptoId);
    return { position, crypto };
  }).filter(({ crypto }) => crypto !== undefined);

  const totalValue = positions.reduce((acc, { position, crypto }) => 
    acc + (position.amount * crypto!.price), 0);

  const totalProfit = positions.reduce((acc, { position, crypto }) => {
    const currentValue = position.amount * crypto!.price;
    const initialValue = position.amount * position.buyPrice;
    return acc + (currentValue - initialValue);
  }, realizedProfit);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Value</h3>
            <Wallet className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Profit/Loss</h3>
            <TrendingUp className={totalProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
          </div>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(totalProfit)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Positions</h3>
            <Activity className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold">{positions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>
        <PortfolioChart positions={positions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {positions.map(({ position, crypto }) => (
          <PositionCard
            key={position.id}
            position={position}
            crypto={crypto!}
            onClose={closePosition}
            onUpdate={updatePosition}
          />
        ))}
      </div>
    </div>
  );
};