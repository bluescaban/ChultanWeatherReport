import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WeatherProvider } from "../context/weatherContext"; // Import the WeatherProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chultan Weather App",
  description: "Track Chultan weather, encounters, and party stats dynamically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the children in WeatherProvider */}
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  );
}
