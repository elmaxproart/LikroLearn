import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser, saveAttempt, Attempt, getCustomCourses } from '@/lib/db';
import { COURSES } from '@/lib/courseData';

export async function POST(req: Request) {
  try {
    const { email, courseId, lessonId, code } = await req.json();

    if (!email || !courseId || !lessonId || code === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let user = await getUserByEmail(email);
    
    // Auto-recreate user if database was recycled on Vercel
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

    // Initialize course map if missing
    if (!user.courses) {
      user.courses = {};
    }

    // Auto-enroll if somehow they got here without enroll state
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

    // Retrieve course from static catalog + dynamic database custom list
    const custom = await getCustomCourses();
    const allCourses = [...COURSES, ...custom];
    const course = allCourses.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Find the lesson
    let targetLesson = null;
    for (const mod of course.modules) {
      const les = mod.lessons.find((l: any) => l.id === lessonId);
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
      if (!user.courses[courseId].progress) {
        user.courses[courseId].progress = {};
      }
      user.courses[courseId].progress[lessonId] = true;
      
      // Auto advance student lesson
      const allLessons = course.modules.flatMap((m: any) => m.lessons);
      const currentIdx = allLessons.findIndex((l: any) => l.id === lessonId);
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
export const dynamic = 'force-dynamic';
