import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { CERTIFICATION_EXAM_QUESTIONS } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, answers } = await req.json();

    if (!email || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Enforce strict one-attempt rule
    if (user.examAttempted) {
      return NextResponse.json({ error: 'Certification exam can only be taken once!' }, { status: 403 });
    }

    let correctCount = 0;
    CERTIFICATION_EXAM_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / CERTIFICATION_EXAM_QUESTIONS.length) * 100);

    // Save exam attempt status
    user.examAttempted = true;
    user.examScore = score;
    user.examFinishedAt = new Date().toISOString();

    await saveUser(user);

    return NextResponse.json({
      success: true,
      score,
      passed: score >= 70, // 70% passing threshold
    });
  } catch (error) {
    console.error('Exam submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
