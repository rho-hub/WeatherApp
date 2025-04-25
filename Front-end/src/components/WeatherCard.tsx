// components/WeatherCard.tsx
import React from 'react';

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  date: string;
  icon: string;
  unit: 'celsius' | 'fahrenheit';
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  description,
  date,
  icon,
  unit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{city}</h2>
          <p className="text-gray-500">{date}</p>
        </div>
        <div className="text-4xl font-bold">
          {Math.round(temperature)}°{unit === 'celsius' ? 'C' : 'F'}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <img 
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
          alt={description}
          className="w-16 h-16"
        />
        <span className="text-xl capitalize">{description}</span>
      </div>
    </div>
  );
};

export default WeatherCard;