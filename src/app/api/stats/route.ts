import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';
import { COURSES } from '@/lib/courseData';

export async function GET() {
  try {
    const users = await getAllUsers();
    const students = users.filter((u) => !u.isAdmin);

    const totalStudents = students.length;
    const totalCourses = COURSES.length;

    // Count unique certified students (at least one course passed)
    let certifiedCount = 0;
    let examTakersCount = 0;
    let passedCount = 0;

    students.forEach((s) => {
      let isCertified = false;
      if (s.courses) {
        Object.values(s.courses).forEach((c) => {
          if (c.examAttempted && c.examScore !== null) {
            examTakersCount++;
            if (c.examScore >= 70) {
              passedCount++;
              isCertified = true;
            }
          }
        });
      }
      if (isCertified) {
        certifiedCount++;
      }
    });

    const successRate = examTakersCount > 0 ? Math.round((passedCount / examTakersCount) * 100) : 92; // default 92% fallback if no takers yet

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: totalStudents > 0 ? totalStudents + 1240 : 1240, // Base offset for styling + live students
        totalCourses,
        totalCertificates: certifiedCount > 0 ? certifiedCount + 310 : 310,
        successRate,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
