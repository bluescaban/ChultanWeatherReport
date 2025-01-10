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

  // Function to roll for weather
  const rollForWeather = useCallback(() => {
    try {
      const { temperature: newTemperature, weatherCondition: newCondition } = generateChultTemperature();

      // Assert that newCondition is a valid key of WeatherData
      const weatherStats = weather[newCondition as keyof typeof weather]?.stats || {};

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
    setReport((prev) => ({
      ...prev,
      isDay: !prev.isDay, // Toggle the `isDay` flag
    }));
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
        rollForWeather, // Ensure this matches the updated function name
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
