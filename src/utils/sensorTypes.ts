export type SensorData = {
  timestamp: string;
  visitors: number;
  temperature: number;
  humidity: number;
};

export const TIME_SLOTS = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00"
];

export const TEMP_RANGE = {
  min: 15,
  max: 35
};

export const HUMIDITY_RANGE = {
  min: 30,
  max: 80
};