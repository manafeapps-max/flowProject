import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  try {
    const res = await fetch(`https://api-hari-libur.vercel.app/api?year=${year}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching holidays proxy:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
