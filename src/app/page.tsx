"use client";

import { useState } from "react";
import MainPanel from "../components/mainPanel";
import SidePanel from "../components/sidePanel";
import locations from "../data/locations.json";
import { LocationKeys } from "../types"


export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState(
    locations["Port Nyanzaru"].image // Default background
  );

  const handleLocationChange = (location: LocationKeys) => {
    const locationData = locations[location];
    if (locationData && locationData.image) {
      setBackgroundImage(locationData.image); // Update background
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Reference local images
      }}
    >
      {/* Container with Glassmorphism Effect */}
      <div 
        className="flex w-full max-w-7xl h-[90vh] bg-green-50 rounded-xl shadow-xl border-8 border-green-500/25"
      >
        <MainPanel />
        <SidePanel onLocationChange={handleLocationChange} />
      </div>
    </div>
  );
}