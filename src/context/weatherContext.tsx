/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Encounter, 
  WeatherStats, 
  Locations,
  LocationKeys, 
  PartyStats, 
  Report, 
  WeatherContextValue 
} from "../types";
import encounters from "../data/encounters.json";
import weather from "../data/weather.json";
import locationsData from "../data/locations.json";
import party from "../data/party.json";
import initialReportData from "../data/report.json";
import { generateChultTemperature } from "../utils/weather";
import { useCallback } from "react";


const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);
const locations: Locations = locationsData as Locations;
const initialReport: Report = {
    ...initialReportData,
    location: initialReportData.location as LocationKeys, // Ensure `location` matches `LocationKeys`
    counters: {
      ...initialReportData.counters,
      forageDC: initialReportData.counters?.forageDC ?? 10, 
    }
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [report, setReport] = useState<Report>(initialReport);
  const [temperature, setTemperature] = useState<number | null>(null); // Start as null to avoid SSR mismatch
  const [weatherCondition, setWeatherCondition] = useState<string>("Regular Temp");

  // Function to update the report
  const updateReport = useCallback((newData: Partial<Report>) => {
    setReport((prev) => ({
      ...prev,
      ...newData,
      counters: calculateCounters(prev, newData),
    }));
  }, []);

  const adjustCounter = useCallback((type: "water" | "rations", amount: number) => {
    setReport((prev) => ({
      ...prev,
      counters: {
        ...prev.counters,
        [type]: (prev.counters[type] || 0) + amount,
      },
    }));
  }, []);

  // Function to roll for weather
  const rollForWeather = useCallback(() => {
    try {
      const { temperature: newTemperature, weatherCondition: newCondition } = generateChultTemperature();

      // Assert that newCondition is a valid key of WeatherData
      const weatherStats = weather[newCondition as keyof typeof weather]?.stats || {};

    // Type predicate to validate missileStatus
    const isMissileStatus = (value: unknown): value is "normal" | "disadvantage" | "impossible" =>
      value === "normal" || value === "disadvantage" || value === "impossible";

    // Validate and assign missileStatus
    const missileStatus = isMissileStatus(weatherStats.missileStatus)
      ? weatherStats.missileStatus
      : "normal"; // Default to "normal" if invalid

      // Check if specific disadvantage flags exist
      const navigationDisadvantage = 'navigationDisadvantage' in weatherStats && !!weatherStats.navigationDisadvantage;
      const forageDisadvantage = 'forageDisadvantage' in weatherStats && !!weatherStats.forageDisadvantage;

      setTemperature(newTemperature);
      setWeatherCondition(newCondition);

      // Update the report with weather stats and disadvantage flags
      updateReport({
        weather: {
          stats: {
            ...weatherStats,
            navigationDisadvantage,
            forageDisadvantage,
            missileStatus
          },
          temperature: newTemperature,
          conditions: [newCondition],
        },
      });
    } catch (error) {
      console.error("Error generating weather:", error);
      setTemperature(85); // Default fallback
      setWeatherCondition("Regular Temp");
    }
  }, [updateReport]);

  // Set the initial temperature and weather condition after hydration
  useEffect(() => {
    rollForWeather();
  }, [rollForWeather]);
  
  const toggleDayNight = () => {
    setReport((prev) => {
      const wasDay = prev.isDay; // Check if it was day
      return {
        ...prev,
        isDay: !wasDay, // Toggle the `isDay` flag
        counters: {
          ...prev.counters,
          navigationDC: (prev.counters.navigationDC || 0) + (wasDay ? 5 : -5), // Add 5 when switching to night, subtract 5 when switching to day
        },
      };
    });
  };

  const rerollEncounter = () => {
    // Fetch possible encounters for the current location from encounters.json
    const locationEncounters = encounters[report.location] || [];
  
    if (locationEncounters.length > 0) {
      // Randomly select an encounter from the list
      const randomEncounter =
        locationEncounters[Math.floor(Math.random() * locationEncounters.length)];
  
      // Update the report with the selected encounter
      updateReport({ encounter: randomEncounter });
    } else {
      console.warn(`No encounters found for location: ${report.location}`);
    }
  };
  
  const changeLocation = (newLocation: LocationKeys) => {
    const locationStats = locationsData[newLocation];
    if (!locationStats) {
      console.warn(`Location data not found for "${newLocation}"`);
      return;
    }
  
    updateReport({
      location: newLocation,
      counters: {
        ...report.counters,
        ...locationStats.resources,
        navigationDC: locationStats.navigationDC, // Add navigationDC here
        forageDC: locationStats.forageDC,        // Add forageDC here
      },
    });
  };  

  const calculateCounters = (prev: Report, newData: Partial<Report>): Report["counters"] => {
    const locationStats = locations[prev.location];
    const encounterStats = newData.encounter?.stats || prev.encounter?.stats || {};
    const weatherStats = newData.weather?.stats || prev.weather?.stats || {};
  
    return {
      water:
        (locationStats.resources.water || 0) +
        (weatherStats.water || 0) +
        (encounterStats.water || 0),
      rations:
        (locationStats.resources.rations || 0) +
        (weatherStats.rations || 0) +
        (encounterStats.rations || 0),
      forageDC:
        (locationStats.forageDC || 0) +
        (weatherStats.forageDC || 0) +
        (encounterStats.forageDC || 0),
      navigationDC:
        (locationStats.navigationDC || 0) +
        (weatherStats.navigationDC || 0) +
        (encounterStats.navigationDC || 0),
      exhaustion:
        (prev.counters.exhaustion || 0) +
        (encounterStats.exhaustion || 0) +
        (weatherStats.exhaustion || 0),
    };
  };
  
  return (
    <WeatherContext.Provider
    value={{
        report,
        temperature: temperature ?? 85,
        weatherCondition,
        toggleDayNight,
        changeLocation,
        rerollEncounter,
        rollForWeather,
        adjustCounter,
    }}
    >
    {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextValue => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useWeather must be used within a WeatherProvider");
  return context;
};
