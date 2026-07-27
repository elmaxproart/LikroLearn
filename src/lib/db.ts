import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { Course } from './courseData';

export interface CourseProgress {
  progress: Record<string, boolean>;
  examAttempted: boolean;
  examScore: number | null;
  examFinishedAt: string | null;
  currentModule: number;
  currentLesson: number;
  enrolledAt: string;
}

export interface User {
  email: string;
  name: string;
  lang: 'fr' | 'en';
  isAdmin: boolean;
  role: 'student' | 'instructor' | 'admin';
  courses: Record<string, CourseProgress>;
  createdAt: string;
  lastActiveAt: string;
}

export interface Attempt {
  email: string;
  lessonId: string;
  lang: 'js' | 'c' | 'react' | 'java' | 'springboot' | 'php' | 'python';
  code: string;
  score: number;
  passed: boolean;
  timestamp: string;
}

export interface Review {
  email: string;
  name: string;
  courseId: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
}

export interface DBState {
  users: User[];
  attempts: Attempt[];
  reviews: Review[];
  customCourses: Course[];
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
      role: 'admin',
      courses: {},
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    {
      email: 'likrotechtest@gmail.com',
      name: 'Lickrotech Administrator',
      lang: 'fr',
      isAdmin: true,
      role: 'admin',
      courses: {},
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }
  ],
  attempts: [],
  reviews: [
    {
      email: 'stephane@lickrotech.com',
      name: 'Stéphane Ndjolo',
      courseId: 'algo-101',
      rating: 5,
      comment: "Le cours d'algorithmes et logigrammes m'a permis de structurer ma pensée logique. Le playground interactif est génial.",
      timestamp: new Date().toISOString()
    },
    {
      email: 'elise@lickrotech.com',
      name: 'Elise Mbarga',
      courseId: 'springboot-202',
      rating: 5,
      comment: "Spring Boot est complexe, mais les diagrammes et exercices progressifs ont rendu le cours accessible. Certificat validé du premier coup !",
      timestamp: new Date().toISOString()
    }
  ],
  customCourses: [],
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
    if (fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const fileContent = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
        const parsed = JSON.parse(fileContent);
        if (!parsed.reviews) parsed.reviews = INITIAL_DB.reviews;
        if (!parsed.customCourses) parsed.customCourses = INITIAL_DB.customCourses;
        return parsed;
      } catch (e) {
        console.error('Error reading local db, resetting:', e);
        return INITIAL_DB;
      }
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
    return INITIAL_DB;
  }

  try {
    const { blobs } = await list({ token });
    const dbBlob = blobs.find((b) => b.pathname === 'lickrotech_db.json');
    if (!dbBlob) {
      await put('lickrotech_db.json', JSON.stringify(INITIAL_DB), {
        access: 'public',
        addRandomSuffix: false,
        token,
      });
      return INITIAL_DB;
    }
    const response = await fetch(dbBlob.url);
    const data = await response.json();
    if (!data.reviews) data.reviews = INITIAL_DB.reviews;
    if (!data.customCourses) data.customCourses = INITIAL_DB.customCourses;
    return data;
  } catch (error) {
    console.error('Error reading from Vercel Blob:', error);
    return memoryCache || INITIAL_DB;
  }
}

async function writeDB(state: DBState): Promise<void> {
  memoryCache = state;
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(state, null, 2), 'utf8');
    return;
  }

  try {
    await put('lickrotech_db.json', JSON.stringify(state), {
      access: 'public',
      addRandomSuffix: false,
      token,
    });
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
    // Retain legacy role assignment if absent
    const role = user.role || db.users[index].role || 'student';
    db.users[index] = { ...user, role, lastActiveAt: new Date().toISOString() };
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

export async function getAllAttempts(): Promise<Attempt[]> {
  const db = await readDB();
  return db.attempts;
}

// Reviews helper methods
export async function saveReview(review: Review): Promise<void> {
  const db = await readDB();
  db.reviews = db.reviews.filter((r) => !(r.email.toLowerCase() === review.email.toLowerCase() && r.courseId === review.courseId));
  db.reviews.push(review);
  await writeDB(db);
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await readDB();
  return db.reviews;
}

// Custom courses helpers
export async function saveCustomCourse(course: Course): Promise<void> {
  const db = await readDB();
  db.customCourses = db.customCourses.filter((c) => c.id !== course.id);
  db.customCourses.push(course);
  await writeDB(db);
}

export async function getCustomCourses(): Promise<Course[]> {
  const db = await readDB();
  return db.customCourses || [];
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
