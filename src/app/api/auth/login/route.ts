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
      const isOldAdmin = email.toLowerCase() === 'admin@lickrotech.com' && password === 'maxym2026';
      const isNewAdmin = email.toLowerCase() === 'likrotechtest@gmail.com' && password === 'likrotech2026';

      if (isOldAdmin || isNewAdmin) {
        if (!user) {
          const adminUser = {
            email: email.toLowerCase(),
            name: isOldAdmin ? 'Tene Bana Maxym' : 'Lickrotech Administrator',
            lang: 'fr' as const,
            isAdmin: true,
            role: 'admin' as const,
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
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    user.lastActiveAt = new Date().toISOString();
    await saveUser(user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
