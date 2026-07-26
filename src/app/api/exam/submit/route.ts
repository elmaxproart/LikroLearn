import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { CERTIFICATION_EXAM_QUESTIONS } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, courseId, answers } = await req.json();

    if (!email || !courseId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.courses || !user.courses[courseId]) {
      return NextResponse.json({ error: 'Student is not enrolled in this course' }, { status: 403 });
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
