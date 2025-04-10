import { db } from '@/db';
import { busArrivals, buses } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const offset = (page - 1) * limit;

  const arrivals = await db
    .select({
      id: busArrivals.id,
      arrivalTime: busArrivals.arrivalTime,
      departureTime: busArrivals.departureTime,
      position: busArrivals.position,
      createdAt: busArrivals.createdAt,
      updatedAt: busArrivals.updatedAt,
      date: busArrivals.date,
      bus: {
        id: buses.id,
        number: buses.number,
        createdAt: buses.createdAt,
        updatedAt: buses.updatedAt,
      },
    })
    .from(busArrivals)
    .leftJoin(buses, eq(busArrivals.busId, buses.id))
    .limit(limit)
    .offset(offset);

  const hasPagination = searchParams.has('page') || searchParams.has('limit');

  if (hasPagination) {
    const totalCount = await db
      .select({ count: count() })
      .from(busArrivals)
      .then((result) => result[0].count);

    return NextResponse.json({
      data: arrivals,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  return NextResponse.json(arrivals);
}
