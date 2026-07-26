import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/db';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: Request) {
  try {
    const { email, recaptchaToken, isAdminLogin, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 403 });
    }

    const user = await getUserByEmail(email);

    if (isAdminLogin) {
      if (email.toLowerCase() === 'admin@lickrotech.com' && password === 'maxym2026') {
        if (!user) {
          const adminUser = {
            email: 'admin@lickrotech.com',
            name: 'Tene Bana Maxym',
            lang: 'fr' as const,
            isAdmin: true,
            courses: {},
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
          };
          await saveUser(adminUser);
          return NextResponse.json({ success: true, user: adminUser });
        }
        return NextResponse.json({ success: true, user });
      }
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Student account not found' }, { status: 404 });
    }

    user.lastActiveAt = new Date().toISOString();
    await saveUser(user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
