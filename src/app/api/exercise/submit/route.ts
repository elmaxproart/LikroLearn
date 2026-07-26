import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser, saveAttempt, Attempt } from '@/lib/db';
import { COURSE_CURRICULUM } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, lessonId, code } = await req.json();

    if (!email || !lessonId || code === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the lesson
    let targetLesson = null;
    for (const mod of COURSE_CURRICULUM) {
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
        // Execute the user's JS function in a sandbox environment
        // The code should define the function, e.g. function estPair(nombre) { ... }
        // We append a invocation of the function, e.g. ;return estPair(4);
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

    // If passed, update user progress
    if (passed) {
      user.progress[lessonId] = true;
      
      // Auto advance student lesson if applicable
      const allLessons = COURSE_CURRICULUM.flatMap((m) => m.lessons);
      const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        const nextLesson = allLessons[currentIdx + 1];
        user.currentModule = nextLesson.moduleId;
        user.currentLesson = parseInt(nextLesson.id.split('-')[1]);
      } else {
        // Advance to final exam module
        user.currentModule = 5;
        user.currentLesson = 1;
      }
      
      await saveUser(user);
    }

    return NextResponse.json({
      success: true,
      passed,
      score,
      error: executionError,
    });
  } catch (error: any) {
    console.error('Exercise submission error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
