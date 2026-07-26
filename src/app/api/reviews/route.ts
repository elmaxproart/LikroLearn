import { NextResponse } from 'next/server';
import { getAllReviews, saveReview } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name, courseId, rating, comment } = await req.json();

    if (!email || !name || !courseId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const newReview = {
      email,
      name,
      courseId,
      rating: Number(rating),
      comment,
      timestamp: new Date().toISOString(),
    };

    await saveReview(newReview);
    const reviews = await getAllReviews();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
