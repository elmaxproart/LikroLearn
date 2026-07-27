import { NextResponse } from 'next/server';
import { getCustomCourses } from '@/lib/db';
import { COURSES } from '@/lib/courseData';

export async function GET() {
  try {
    const custom = await getCustomCourses();
    const allCourses = [...COURSES, ...custom];
    return NextResponse.json({ success: true, courses: allCourses });
  } catch (error) {
    console.error('Error fetching course list:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
