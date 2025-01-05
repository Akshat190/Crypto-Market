import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Portfolio } from '../types/crypto';
import { Crypto } from '../types/crypto';

interface Props {
  positions: {
    position: Portfolio;
    crypto: Crypto;
  }[];
}

export const PortfolioChart: React.FC<Props> = ({ positions }) => {
  const data = positions.map(({ position, crypto }) => {
    const currentValue = position.amount * crypto.price;
    const initialValue = position.amount * position.buyPrice;
    const profit = currentValue - initialValue;
    
    return {
      name: crypto.symbol,
      value: currentValue,
      profit,
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            fill="#818cf8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};