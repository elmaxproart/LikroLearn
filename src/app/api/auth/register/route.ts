import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: Request) {
  try {
    const { email, name, lang, recaptchaToken, role } = await req.json();

    if (!email || !name || !lang) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 });
    }

    // Check if user already exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const assignedRole = (role === 'instructor' ? 'instructor' : 'student') as 'student' | 'instructor';

    const newUser = {
      email: email.toLowerCase(),
      name,
      lang: lang as 'fr' | 'en',
      isAdmin: false,
      role: assignedRole,
      courses: {}, // Empty enrollments map
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    await saveUser(newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
