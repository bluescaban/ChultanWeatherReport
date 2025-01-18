"use client";

import Image from "next/image";
import { useWeather } from "../context/weatherContext";
import { LocationKeys } from "../types";
import locations from "../data/locations.json";
import weatherDataRaw from "../data/weather.json";
import { WeatherData } from "../types";

interface SidePanelProps {
  onLocationChange: (location: LocationKeys) => void
}

export default function SidePanel({ onLocationChange }: SidePanelProps) {
  const { report, temperature, weatherCondition, toggleDayNight, changeLocation } = useWeather();
  const weatherData: WeatherData = weatherDataRaw as WeatherData;

  const currentWeather = weatherData[weatherCondition] || {
    description: "No description available.",
    effects: ["No effects available."],
  };

  const handleLocationSelect = (location: LocationKeys) => {
    changeLocation(location); // Update the weather context
    onLocationChange(location); // Notify parent to update background
  };

  return (
    <aside className="w-80 bg-green-50 rounded-tr-xl rounded-br-xl shadow-lg p-6">
      {/* Chult Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Chultan Weather Report</h2>
        <button
          onClick={toggleDayNight}
          aria-label={report.isDay ? "Switch to Night Mode" : "Switch to Day Mode"}
          className={`flex items-center justify-center w-12 h-12 border-2 ${
            report.isDay ? "bg-gray-100 hover:bg-blue-200 border-gray-300" : "bg-black text-white border-black"
          } rounded-full transition-all`}
        >
          <Image
            src={report.isDay ? "/images/sun.png" : "/images/whitemoon.png"}
            alt={report.isDay ? "Day Mode" : "Night Mode"}
            width={32}
            height={32}
            priority
          />
        </button>
      </div>

      {/* Location Dropdown */}
      <div className="mb-6">
        <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          id="location-select"
          value={report.location}
          onChange={(e) => handleLocationSelect(e.target.value as LocationKeys)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        >
          {Object.keys(locations).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Temperature Section */}
      <p className="text-black text-center text-6xl font-bold mb-6">
        {temperature !== null ? `${temperature}°F` : "Loading..."}
      </p>

      {/* Windspeed Section */}
      <p className="text-xs text-gray-700 text-center mb-6">
        <span className="font-bold">Windspeed:</span>{" "}
        {report.weather?.stats?.windSpeed !== undefined
          ? `${report.weather.stats.windSpeed} mph`
          : "N/A"}
      </p>

      {/* Weather Description */}
      <h4 className="text-sm text-center font-bold mb-2">Weather Condition</h4>
      <p className="text-gray-600 text-xs text-center mb-4">{currentWeather.description}</p>

      {/* Weather Effects */}
      <h4 className="text-sm text-center font-bold mb-2">Effects</h4>
      <ul className="text-xs list-disc list-inside text-gray-700 space-y-1">
        {currentWeather.effects.map((effect: string, index: number) => (
          <li key={index}>{effect}</li>
        ))}
      </ul>
    </aside>
  );
}
