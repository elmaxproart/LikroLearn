import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser, saveAttempt, Attempt } from '@/lib/db';
import { COURSES } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, courseId, lessonId, code } = await req.json();

    if (!email || !courseId || !lessonId || code === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if enrolled
    if (!user.courses || !user.courses[courseId]) {
      return NextResponse.json({ error: 'Student is not enrolled in this course' }, { status: 403 });
    }

    const course = COURSES.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Find the lesson
    let targetLesson = null;
    for (const mod of course.modules) {
      const les = mod.lessons.find((l) => l.id === lessonId);
      if (les) {
        targetLesson = les;
        break;
      }
    }

    if (!targetLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Verify code
    const testCases = targetLesson.exercise.testCases;
    let passedCount = 0;
    let executionError = '';

    for (const tc of testCases) {
      try {
        const functionName = targetLesson.exercise.initialCode.match(/function\s+(\w+)/)?.[1] || '';
        
        if (!functionName) {
          throw new Error('Could not parse function name from initial template');
        }

        const runCode = `${code}\nreturn ${functionName}(${tc.input});`;
        const fn = new Function(runCode);
        const result = fn();
        
        if (String(result) === tc.expected) {
          passedCount++;
        }
      } catch (err: any) {
        executionError = err.message || 'Execution error';
      }
    }

    const totalTests = testCases.length;
    const score = totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : 0;
    const passed = score === 100;

    // Save attempt log
    const attempt: Attempt = {
      email,
      lessonId,
      lang: targetLesson.exercise.lang,
      code,
      score,
      passed,
      timestamp: new Date().toISOString(),
    };
    await saveAttempt(attempt);

    // If passed, update course progress
    if (passed) {
      user.courses[courseId].progress[lessonId] = true;
      
      // Auto advance student lesson
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        const nextLesson = allLessons[currentIdx + 1];
        user.courses[courseId].currentModule = nextLesson.moduleId;
        user.courses[courseId].currentLesson = parseInt(nextLesson.id.split('-')[1]);
      } else {
        // Advance to final exam module
        user.courses[courseId].currentModule = 5;
        user.courses[courseId].currentLesson = 1;
      }
      
      await saveUser(user);
    }

    return NextResponse.json({
      success: true,
      passed,
      score,
      error: executionError,
      user, // return updated user
    });
  } catch (error: any) {
    console.error('Exercise submission error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
