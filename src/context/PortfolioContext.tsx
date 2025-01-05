import React, { createContext, useContext, useState, useEffect } from 'react';
import { Crypto, Portfolio } from '../types/crypto';

interface PortfolioContextType {
  portfolio: Portfolio[];
  realizedProfit: number;
  addPosition: (crypto: Crypto, amount: number, price: number) => void;
  closePosition: (positionId: string, sellPrice: number) => void;
  updatePosition: (positionId: string, newAmount: number, sellPrice?: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [realizedProfit, setRealizedProfit] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addPosition = (crypto: Crypto, amount: number, price: number) => {
    const newPosition: Portfolio = {
      id: `${crypto.id}-${Date.now()}`,
      cryptoId: crypto.id,
      amount,
      buyPrice: price,
      timestamp: Date.now(),
    };
    setPortfolio(prev => [...prev, newPosition]);
  };

  const closePosition = (positionId: string, sellPrice: number) => {
    const position = portfolio.find(p => p.id === positionId);
    if (position) {
      const profit = (sellPrice - position.buyPrice) * position.amount;
      setRealizedProfit(prev => prev + profit);
      setPortfolio(prev => prev.filter(pos => pos.id !== positionId));
    }
  };

  const updatePosition = (positionId: string, newAmount: number, sellPrice?: number) => {
    setPortfolio(prev => {
      const position = prev.find(p => p.id === positionId);
      if (position && sellPrice) {
        const soldAmount = position.amount - newAmount;
        const profit = (sellPrice - position.buyPrice) * soldAmount;
        setRealizedProfit(prevProfit => prevProfit + profit);
      }
      return prev.map(pos =>
        pos.id === positionId ? { ...pos, amount: newAmount } : pos
      );
    });
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, realizedProfit, addPosition, closePosition, updatePosition }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}; 