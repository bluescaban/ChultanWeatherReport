"use client";

import { useState } from "react";
import Image from "next/image";
import { useWeather } from "../context/weatherContext";
import guidesData from "../data/guides.json";

export default function MainPanel() {
    const { report, weatherCondition, rollForWeather, rerollEncounter, adjustCounter } = useWeather();
    const [selectedGuide, setSelectedGuide] = useState(guidesData[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setTimeout(() => {
      rerollEncounter();
      rollForWeather();
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

        {/* Guide Counter */}
        <div className="flex items-center gap-4 bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md">
          {/* Guide Image */}
          <div
            className="w-1/2 cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            <Image
              src={selectedGuide.portrait}
              alt={selectedGuide.name}
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
          {/* Guide Stats */}
          <div className="w-1/2">
            <h4 className="text-xs font-semibold">{selectedGuide.name}</h4>
            <ul className="text-xs space-y-1">
              <li>Survival: {selectedGuide.stats.survival}</li>
              <li>Perception: {selectedGuide.stats.perception}</li>
              <li>Stealth: {selectedGuide.stats.stealth}</li>
              <li>Favored Terrain: {selectedGuide.stats.favoredTerrain}</li>
            </ul>
          </div>
        </div>

        {/* Guide Selection Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" // Ensure it's fixed and above everything
            onClick={() => setIsModalOpen(false)} // Close the modal when the background is clicked
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-1/3 z-60" // Higher z-index for modal itself
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the background
            >
              <h3 className="text-xl font-bold mb-4">Select a Guide</h3>
              <ul className="space-y-2">
                {guidesData.map((guide) => (
                  <li
                    key={guide.name}
                    className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-200 ${
                      selectedGuide.name === guide.name ? "bg-gray-300" : ""
                    }`}
                    onClick={() => {
                      setSelectedGuide(guide);
                      setIsModalOpen(false);
                    }}
                  >
                    <Image
                      src={guide.portrait}
                      alt={guide.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">{guide.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}


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
            className={`rounded-lg p-4 shadow-md text-center ${
              report.weather?.stats?.foragingImpossible
                ? "bg-black" // Impossible: Black Background
                : report.weather?.stats?.forageDisadvantage
                ? "bg-red-500" // Disadvantage: Red Background
                : "bg-white bg-opacity-40 backdrop-blur-md" // Normal: Default Background
            }`}
          >
            <h4
              className={`text-sm font-semibold ${
                report.weather?.stats?.foragingImpossible || report.weather?.stats?.forageDisadvantage
                  ? "text-white" // White text for dark backgrounds
                  : "text-gray-800" // Dark text for light backgrounds
              }`}
            >
              Forage DC
            </h4>
            <p
              className={`text-lg mt-2 ${
                report.weather?.stats?.foragingImpossible || report.weather?.stats?.forageDisadvantage
                  ? "text-white" // White text for dark backgrounds
                  : "text-gray-800" // Dark text for light backgrounds
              }`}
            >
              {report.weather?.stats?.foragingImpossible
                ? "X" // Impossible: Show "X"
                : (() => {
                    const baseDC = 10; // Base forage DC
                    const weatherDC = report.weather?.stats?.forageDC || 0; // Weather forage DC
                    const locationDC = report.counters?.forageDC || 0; // Location forage DC
                    return baseDC + weatherDC + locationDC; // Calculate total DC
                  })()}
            </p>
          </div>

          {/* Visibility Counter */}
          <div
            className={`rounded-lg p-4 shadow-md text-center ${
              report.weather?.stats?.visibility ? "bg-white bg-opacity-40 backdrop-blur-md" : "bg-green-500"
            }`}
          >
            <h4
              className={`text-sm font-semibold ${
                report.weather?.stats?.visibility ? "text-gray-800" : "text-white"
              }`}
            >
              Visibility
            </h4>
            <p
              className={`text-lg mt-2 ${
                report.weather?.stats?.visibility ? "text-gray-600" : "text-white"
              }`}
            >
              {report.weather?.stats?.visibility
                ? `${report.weather?.stats?.visibility} ft` // Show specific visibility in feet
                : "✔"} {/* Default: Check Mark */}
            </p>
          </div>

          {/* Missile Counter */}
          <div
            className={`rounded-lg p-4 shadow-md text-center ${
              report.weather?.stats?.missileStatus === "disadvantage"
                ? "bg-red-500" // Disadvantage: Red Background
                : report.weather?.stats?.missileStatus === "impossible"
                ? "bg-black" // Impossible: Black Background
                : "bg-green-500" // Normal: Green Background
            }`}
          >
            <h4 className="text-sm font-semibold text-white">Missiles</h4>
            <p className="text-white text-lg mt-2">
              {report.weather?.stats?.missileStatus === "disadvantage"
                ? "1/2" // Disadvantage: Show "1/2"
                : report.weather?.stats?.missileStatus === "impossible"
                ? "X" // Impossible: Show "X"
                : "✔"} {/* Normal: Show Check Mark */}
            </p>
          </div>

          {/* Water Counter */}
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center">
            <h4 className="text-sm font-semibold text-gray-800">Water</h4>
            <p className="text-gray-600 mt-2">{report.counters.water || 0}</p>
            <div className="flex justify-center mt-2 space-x-2">
              <button
                onClick={() => adjustCounter("water", 1)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => adjustCounter("water", -1)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>

          {/* Rations Counter */}
          <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-lg p-4 shadow-md text-center">
            <h4 className="text-sm font-semibold text-gray-800">Rations</h4>
            <p className="text-gray-600 mt-2">{report.counters.rations || 0}</p>
            <div className="flex justify-center mt-2 space-x-2">
              <button
                onClick={() => adjustCounter("rations", 1)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => adjustCounter("rations", -1)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
