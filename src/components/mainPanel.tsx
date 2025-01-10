"use client";

import { useState } from "react";
import Image from "next/image";
import { useWeather } from "../context/weatherContext"; // Import useWeather

export default function MainPanel() {
    const { report, weatherCondition, rollForWeather, rerollEncounter } = useWeather(); // Extract weatherCondition

  const [isRolling, setIsRolling] = useState(false); // Tracks if the animation is active

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setTimeout(() => {
      rerollEncounter();
      rollForWeather(); // Use the renamed function
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6">
      {/* Encounter Card */}
      <div className="bg-gray-900 rounded-xl p-6 border-[.25em] border-green-200 shadow-md mb-8 text-right">
        <h2 className="text-2xl font-bold text-white">
          {report.encounter?.title || "No Encounter"}
        </h2>
        <p className="text-white mt-2">
          {report.encounter?.effect || "No effect available."}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleRoll}
            className="p-2 bg-gray-900 rounded-full hover:bg-yellow-500 flex justify-center items-center transition-all"
          >
            <Image
              src="/images/d20white.png"
              alt="Roll D20"
              width={32}
              height={32}
              priority
              className={`w-8 h-8 transform transition-transform ${
                isRolling ? "animate-roll" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Weather Section */}
      <section>
        <h3 className="text-2xl text-right font-regular text-black">
          {weatherCondition || "Weather Title"} {/* Display current weather condition */}
        </h3>
        <div className="h-1 bg-black rounded-full my-4"></div>

        {/* Counters */}
        <div className="grid grid-cols-4 gap-4">

            {/* Navigation DC Counter */}
            <div
            className={`rounded-lg p-4 shadow-md text-center ${
                report.weather?.stats.navigationDisadvantage ? "bg-red-400" : "bg-white bg-opacity-40 backdrop-blur-md"
            }`}
            >
            <h4 className="text-sm font-semibold text-gray-800">Nav DC</h4>
            <p className="text-gray-600 mt-2">{report.counters.navigationDC || 0}</p>
            </div>

            {/* Forage DC Counter */}
            <div
            className={`${
                report.weather?.stats?.forageDisadvantage ? "bg-red-500" : "bg-white"
            } bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center`}
            >
            <h4 className="text-sm font-semibold text-gray-800">Forage DC</h4>
            <p className="text-gray-600 mt-2">
                {report.weather?.stats?.forageDC ?? 0} {/* Fallback to 0 if undefined */}
            </p>
            </div>


          {/* Water Counter */}
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center">
            <h4 className="text-sm font-semibold text-gray-800">Water</h4>
            <p className="text-gray-600 mt-2">{report.counters.water || 0}</p>
          </div>

          {/* Rations Counter */}
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center">
            <h4 className="text-sm font-semibold text-gray-800">Rations</h4>
            <p className="text-gray-600 mt-2">{report.counters.rations || 0}</p>
          </div>

          {/* Exhaustion Counter */}
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center">
            <h4 className="text-sm font-semibold text-gray-800">Exhaustion</h4>
            <p className="text-gray-600 mt-2">{report.counters.exhaustion || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
