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
      missileStatus?: "normal" | "disadvantage" | "impossible";
      navigationDisadvantage?: boolean;
      forageDisadvantage?: boolean;
      foragingImpossible?: boolean;
      canoesSwamped?: boolean;
      windSpeed?: number;
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
    visibility?: number;
    missileStatus?: "normal" | "disadvantage" | "impossible";
    foragingImpossible?: boolean;
    windSpeed?: number;
  };
  temperature?: number;
  windSpeed?: number;
  conditions?: string[];
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
    | "Ruins"]: LocationStats;
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
  encounter?: Encounter | null;
  weather?: WeatherStats;
  counters: {
    water?: number;
    rations?: number;
    forageDC?: number;
    navigationDC?: number;
    exhaustion?: number;
    navigationDisadvantage?: boolean;
    forageDisadvantage?: boolean;
    visibility?: number;
    missileStatus?: "normal" | "disadvantage" | "impossible";
  };
};

export type WeatherContextValue = {
  report: Report;
  temperature: number;
  weatherCondition: keyof WeatherData;
  toggleDayNight: () => void;
  changeLocation: (location: LocationKeys) => void;
  rerollEncounter: () => void;
  rollForWeather: () => void;
  adjustCounter: (type: "water" | "rations", amount: number) => void;
};
