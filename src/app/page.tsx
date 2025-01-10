"use client";

import MainPanel from "../components/mainPanel";
import SidePanel from "../components/sidePanel";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/8/87/Chiapas_Rainforest_crop.jpg')", // Replace with your image path
      }}
    >
      {/* Container with Glassmorphism Effect */}
      <div 
        className="flex w-full max-w-7xl h-[90vh] bg-green-50 rounded-xl shadow-xl border-8 border-green-500/25"
      >
        <MainPanel />
        <SidePanel />
      </div>
    </div>
  );
}
