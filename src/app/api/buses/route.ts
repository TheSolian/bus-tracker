import { db } from '@/db';
import { buses } from '@/db/schema';
import { count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const offset = (page - 1) * limit;

  const busesList = await db
    .select({
      id: buses.id,
      number: buses.number,
      createdAt: buses.createdAt,
      updatedAt: buses.updatedAt,
    })
    .from(buses)
    .limit(limit)
    .offset(offset);

  const hasPagination = searchParams.has('page') || searchParams.has('limit');

  if (hasPagination) {
    const totalCount = await db
      .select({ count: count() })
      .from(buses)
      .then((result) => result[0].count);

    return NextResponse.json({
      data: busesList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  return NextResponse.json(busesList);
}
