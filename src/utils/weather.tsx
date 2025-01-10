export function generateChultTemperature(): { temperature: number; weatherCondition: string } {
    // Determine the temperature
    const randomNumber = Math.floor(Math.random() * 28) + 3; // Random number between 3 and 30
    const temperature = 80 + randomNumber;
  
    // Determine the weather condition
    const weatherConditions = [
      { condition: "Regular Temp", chance: 50 },
      { condition: "Fog", chance: 15 },
      { condition: "Extreme Heat", chance: 10 },
      { condition: "Heavy Wind", chance: 10 },
      { condition: "Heavy Rain & Fog", chance: 5 },
      { condition: "Heavy Rain", chance: 5 },
      { condition: "Tropical Storm", chance: 5 },
    ];
  
    const random = Math.random() * 100; // Random number between 0 and 100
    let cumulativeChance = 0;
    let weatherCondition = "Regular Temp"; // Default condition
  
    for (const weather of weatherConditions) {
      cumulativeChance += weather.chance;
      if (random < cumulativeChance) {
        weatherCondition = weather.condition;
        break;
      }
    }
  
    return { temperature, weatherCondition };
  }
  