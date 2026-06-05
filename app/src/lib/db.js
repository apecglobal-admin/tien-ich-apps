import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms-data.json');
const DEFAULT_FILE = path.join(DATA_DIR, 'default-data.json');

function ensureDataFile() {
  // Ensure directory exists
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o755 });
    } catch (err) {
      console.error(`Failed to create data directory: ${err.message}`);
    }
  }

  if (!fs.existsSync(DATA_FILE)) {
    try {
      const defaultData = JSON.parse(fs.readFileSync(DEFAULT_FILE, 'utf-8'));
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      // Ensure file has write permissions
      fs.chmodSync(DATA_FILE, 0o644);
    } catch (err) {
      console.error(`Failed to create data file: ${err.message}`);
    }
  }
}

export function readData() {
  try {
    ensureDataFile();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    console.error(`Error reading data: ${err.message}`);
    throw err;
  }
}

export function writeData(data) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Ensure file has write permissions for next time
    fs.chmodSync(DATA_FILE, 0o644);
    return data;
  } catch (err) {
    console.error(`Error writing data: ${err.message}`);
    throw err;
  }
}

export function generateId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}
