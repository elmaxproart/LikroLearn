import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { CERTIFICATION_EXAM_QUESTIONS } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, courseId, answers } = await req.json();

    if (!email || !courseId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let user = await getUserByEmail(email);
    
    // Auto-recreate user if Vercel RAM was recycled
    if (!user) {
      user = {
        email: email.toLowerCase(),
        name: email.split('@')[0],
        lang: 'fr',
        isAdmin: email.toLowerCase().includes('admin') || email.toLowerCase().includes('likrotechtest'),
        role: (email.toLowerCase().includes('admin') || email.toLowerCase().includes('likrotechtest')) ? 'admin' : 'student',
        courses: {},
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      await saveUser(user);
    }

    if (!user.courses) {
      user.courses = {};
    }

    if (!user.courses[courseId]) {
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
    }

    // Enforce strict one-attempt rule per course
    if (user.courses[courseId].examAttempted) {
      return NextResponse.json({ error: 'Certification exam can only be taken once for this course!' }, { status: 403 });
    }

    let correctCount = 0;
    CERTIFICATION_EXAM_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / CERTIFICATION_EXAM_QUESTIONS.length) * 100);

    // Save exam attempt status
    user.courses[courseId].examAttempted = true;
    user.courses[courseId].examScore = score;
    user.courses[courseId].examFinishedAt = new Date().toISOString();

    await saveUser(user);

    return NextResponse.json({
      success: true,
      score,
      passed: score >= 70,
      user, // return updated user
    });
  } catch (error) {
    console.error('Exam submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
