import { NextResponse } from 'next/server';
import { saveCustomCourse, getUserByEmail, saveUser } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, course } = await req.json();

    if (!email || !course || !course.titleFr || !course.titleEn) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let user = await getUserByEmail(email);
    if (!user) {
      // Recreate missing builder account on Vercel RAM recycle
      const isAdminEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('likrotechtest');
      user = {
        email: email.toLowerCase(),
        name: email.split('@')[0],
        lang: 'fr',
        isAdmin: isAdminEmail,
        role: isAdminEmail ? 'admin' : 'instructor',
        courses: {},
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      await saveUser(user);
    }

    if (user.role !== 'admin' && user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    const newCourse = {
      ...course,
      id: course.id || `custom-${Date.now()}`,
      author: user.name,
      modules: course.modules || [],
    };

    await saveCustomCourse(newCourse);
    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
