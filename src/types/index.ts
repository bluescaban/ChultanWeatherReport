export type Encounter = {
  title: string;
  effect: string;
  stats?: {
    water?: number;
    rations?: number;
    forageDC?: number;
    navigationDC?: number;
    exhaustion?: number;
  };
};

export type WeatherData = {
  [key: string]: {
    description: string;
    stats?: {
      navigationDC?: number;
      visibility?: number;
      forageDC?: number;
      exhaustionRisk?: boolean;
      waterConsumptionIncrease?: number;
      missileDisadvantage?: boolean;
      navigationDisadvantage?: boolean;
      forageDisadvantage?: boolean;
      foragingImpossible?: boolean;
      canoesSwamped?: boolean;
    };
    effects: string[];
  };
};

export type WeatherStats = {
  stats: {
    navigationDC?: number;
    forageDC?: number;
    water?: number;
    rations?: number;
    exhaustion?: number;
    navigationDisadvantage?: boolean;
    forageDisadvantage?: boolean;
  };
  temperature?: number;
  windSpeed?: number;
  conditions?: string[]; // Weather conditions affecting gameplay
};

export type LocationStats = {
  description: string;
  navigationDC: number;
  forageDC: number;
  resources: {
    water: number;
    rations: number;
  };
  encounters: string[];
};

export type Locations = {
  [key in
    | "Port Nyanzaru"
    | "Jungle"
    | "River"
    | "Lake"
    | "Swamp"
    | "Coast"
    | "Mountain"
    | "Wasteland"
    | "Omu"]: LocationStats;
};

export type LocationKeys = keyof Locations;

export type PartyMember = {
  name: string;
  exhaustion: number;
};

export type PartyStats = {
  members: PartyMember[];
  stats: {
    navigationDCModifier: number;
  };
};

export type Report = {
  location: LocationKeys;
  isDay: boolean;
  encounter?: Encounter | null; // Optional encounter for the current location
  weather?: WeatherStats; // Current weather stats
  counters: {
    water?: number;
    rations?: number;
    forageDC?: number;
    navigationDC?: number;
    exhaustion?: number;
    navigationDisadvantage?: boolean;
    forageDisadvantage?: boolean;
  };
};

export type WeatherContextValue = {
  report: Report;
  temperature: number; // Current temperature (defaulted to 85 if not set)
  weatherCondition: keyof WeatherData; // Ensures valid weather condition keys
  toggleDayNight: () => void;
  changeLocation: (location: LocationKeys) => void;
  rerollEncounter: () => void;
  rollForWeather: () => void;
};
