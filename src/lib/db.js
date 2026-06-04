import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms-data.json');
const DEFAULT_FILE = path.join(DATA_DIR, 'default-data.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = JSON.parse(fs.readFileSync(DEFAULT_FILE, 'utf-8'));
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

export function generateId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}
