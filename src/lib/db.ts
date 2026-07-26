import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export interface User {
  email: string;
  name: string;
  lang: 'fr' | 'en';
  isAdmin: boolean;
  currentModule: number;
  currentLesson: number;
  progress: Record<string, boolean>; // e.g., "1-1": true
  examAttempted: boolean;
  examScore: number | null;
  examFinishedAt: string | null;
  createdAt: string;
  lastActiveAt: string;
}

export interface Attempt {
  email: string;
  lessonId: string;
  lang: 'js' | 'c';
  code: string;
  score: number; // 0 to 100
  passed: boolean;
  timestamp: string;
}

export interface DBState {
  users: User[];
  attempts: Attempt[];
  kpis: {
    recaptchaBlocks: number;
    blobApiCalls: number;
    pageViews: number;
  };
}

const LOCAL_DB_PATH = path.join(process.cwd(), 'local_db.json');

const INITIAL_DB: DBState = {
  users: [
    {
      email: 'admin@lickrotech.com',
      name: 'Tene Bana Maxym',
      lang: 'fr',
      isAdmin: true,
      currentModule: 5,
      currentLesson: 1,
      progress: {},
      examAttempted: false,
      examScore: null,
      examFinishedAt: null,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }
  ],
  attempts: [],
  kpis: {
    recaptchaBlocks: 0,
    blobApiCalls: 0,
    pageViews: 0,
  }
};

let memoryCache: DBState | null = null;

async function readDB(): Promise<DBState> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    // Local JSON File Fallback
    if (fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const fileContent = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
        return JSON.parse(fileContent);
      } catch (e) {
        console.error('Error reading local db, resetting:', e);
        return INITIAL_DB;
      }
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
    return INITIAL_DB;
  }

  // Vercel Blob Database
  try {
    const { blobs } = await list({ token });
    const dbBlob = blobs.find((b) => b.pathname === 'lickrotech_db.json');
    if (!dbBlob) {
      // Initialize Blob
      await put('lickrotech_db.json', JSON.stringify(INITIAL_DB), {
        access: 'public',
        addRandomSuffix: false,
        token,
      });
      return INITIAL_DB;
    }
    const response = await fetch(dbBlob.url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reading from Vercel Blob:', error);
    // Use memory cache or initial db if blob fails
    return memoryCache || INITIAL_DB;
  }
}

async function writeDB(state: DBState): Promise<void> {
  memoryCache = state;
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    // Local JSON File Fallback
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(state, null, 2), 'utf8');
    return;
  }

  // Vercel Blob
  try {
    await put('lickrotech_db.json', JSON.stringify(state), {
      access: 'public',
      addRandomSuffix: false,
      token,
    });
    // Increment API Call KPI locally or in state
    state.kpis.blobApiCalls += 1;
  } catch (error) {
    console.error('Error writing to Vercel Blob:', error);
  }
}

// User helper methods
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function saveUser(user: User): Promise<void> {
  const db = await readDB();
  const index = db.users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    db.users[index] = { ...user, lastActiveAt: new Date().toISOString() };
  } else {
    db.users.push(user);
  }
  await writeDB(db);
}

export async function getAllUsers(): Promise<User[]> {
  const db = await readDB();
  return db.users;
}

// Attempt helper methods
export async function saveAttempt(attempt: Attempt): Promise<void> {
  const db = await readDB();
  db.attempts.push(attempt);
  await writeDB(db);
}

export async function getAttemptsByEmail(email: string): Promise<Attempt[]> {
  const db = await readDB();
  return db.attempts.filter((a) => a.email.toLowerCase() === email.toLowerCase());
}

export async function getAllAttempts(): Promise<Attempt[]> {
  const db = await readDB();
  return db.attempts;
}

// KPI incrementers
export async function incrementKPI(type: 'recaptchaBlocks' | 'pageViews'): Promise<void> {
  const db = await readDB();
  db.kpis[type] += 1;
  await writeDB(db);
}

export async function getKPIs(): Promise<DBState['kpis']> {
  const db = await readDB();
  return db.kpis;
}
