import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { COURSES } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, courseId } = await req.json();

    if (!email || !courseId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify course exists
    const courseExists = COURSES.some((c) => c.id === courseId);
    if (!courseExists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if already enrolled
    if (user.courses && user.courses[courseId]) {
      return NextResponse.json({ success: true, message: 'Already enrolled' });
    }

    // Initialize course progress
    if (!user.courses) {
      user.courses = {};
    }

    user.courses[courseId] = {
      progress: {},
      examAttempted: false,
      examScore: null,
      examFinishedAt: null,
      currentModule: 1,
      currentLesson: 1,
      enrolledAt: new Date().toISOString(),
    };

    await saveUser(user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Course enrollment API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
