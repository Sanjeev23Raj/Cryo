import fs from 'fs';
import path from 'path';
import { TemperatureLog } from '../types';

const FREEZERS_PATH = path.join(process.cwd(), 'src/data/freezers.json');
const LOGS_PATH = path.join(process.cwd(), 'src/data/temperature_logs.json');

export interface Freezer {
  id: string;
  customerName: string;
  model: string;
  status: 'Normal' | 'Warning' | 'Critical';
}

const DEFAULT_FREEZERS: Freezer[] = [
  { id: 'FRZ-001', customerName: 'Apex Health Corp', model: 'Ultra-Low Temp Refrigerator', status: 'Normal' },
  { id: 'FRZ-002', customerName: 'Vellore Lab Facility', model: 'Plasma Storage Freezer', status: 'Warning' },
  { id: 'FRZ-003', customerName: 'Chennai Research Inst', model: 'Cryogenic Dewar Cabinet', status: 'Normal' },
  { id: 'FRZ-004', customerName: 'Apollo Pharma', model: 'Bio-Medical Freezer', status: 'Critical' },
  { id: 'FRZ-005', customerName: 'National Vaccine Hub', model: 'Ultra-Low Temp Refrigerator', status: 'Normal' },
];

// Ensure both JSON files exist with seed data if missing
function initFiles() {
  const dir = path.dirname(FREEZERS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Initialize Freezers Registry file
  if (!fs.existsSync(FREEZERS_PATH)) {
    fs.writeFileSync(FREEZERS_PATH, JSON.stringify(DEFAULT_FREEZERS, null, 2), 'utf-8');
  }

  // 2. Initialize Temperature Logs file
  if (!fs.existsSync(LOGS_PATH)) {
    const seedLogs = generateSeedLogs();
    fs.writeFileSync(LOGS_PATH, JSON.stringify(seedLogs, null, 2), 'utf-8');
  }
}

function generateSeedLogs(): TemperatureLog[] {
  const logs: TemperatureLog[] = [];
  const devices = [
    { id: 'FRZ-001', base: 4.0, min: 2.0, max: 8.0 },
    { id: 'FRZ-002', base: 3.5, min: 2.0, max: 6.0 },
    { id: 'FRZ-003', base: -18.0, min: -20.0, max: -15.0 },
  ];

  const now = new Date();
  const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const numIntervals = 7 * 24 * 6; // 10-minute intervals
  let idCounter = 1;

  for (let i = 0; i <= numIntervals; i++) {
    const timestamp = new Date(startTime.getTime() + i * 10 * 60 * 1000);
    const timeStr = timestamp.toISOString();

    devices.forEach((dev) => {
      const range = dev.max - dev.min;
      let temp = dev.base + Math.sin((i / (24 * 6)) * Math.PI * 2) * (range * 0.12);
      temp += Math.sin(i * 1.5) * 0.85; // high-frequency spiky compressor cycle oscillations
      temp += (Math.random() - 0.5) * 0.15;

      if (dev.id === 'FRZ-001' && i >= 300 && i <= 324) {
        temp += 1.8;
      }
      if (dev.id === 'FRZ-001' && i >= 720 && i <= 756) {
        temp += 3.6;
      }

      logs.push({
        id: `LOG-${String(idCounter++).padStart(6, '0')}`,
        freezer_id: dev.id,
        temperature: parseFloat(temp.toFixed(2)),
        timestamp: timeStr,
        created_at: timeStr,
      });
    });
  }

  return logs;
}

// Freezer operations
export function readFreezers(): Freezer[] {
  initFiles();
  try {
    const raw = fs.readFileSync(FREEZERS_PATH, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (e) {
    return DEFAULT_FREEZERS;
  }
}

export function writeFreezers(freezers: Freezer[]) {
  initFiles();
  try {
    fs.writeFileSync(FREEZERS_PATH, JSON.stringify(freezers, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to freezers.json:', error);
  }
}

// Log operations
export function readLogs(): TemperatureLog[] {
  initFiles();
  try {
    const raw = fs.readFileSync(LOGS_PATH, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

export function writeLogs(logs: TemperatureLog[]) {
  initFiles();
  try {
    fs.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to temperature_logs.json:', error);
  }
}

export interface DatabaseSchema {
  freezers: Freezer[];
  temperature_logs: TemperatureLog[];
}

export function readDb(): DatabaseSchema {
  return {
    freezers: readFreezers(),
    temperature_logs: readLogs(),
  };
}

export function writeDb(db: DatabaseSchema) {
  writeFreezers(db.freezers);
  writeLogs(db.temperature_logs);
}

