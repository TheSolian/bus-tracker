import { db } from '@/db';
import { buses, busSchedules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { number: string } },
) {
  try {
    const busNumber = params.number;

    const bus = await db
      .select()
      .from(buses)
      .where(eq(buses.number, busNumber))
      .limit(1)
      .then((results) => results[0]);

    if (!bus) {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
    }

    const schedules = await db
      .select()
      .from(busSchedules)
      .where(eq(busSchedules.busId, bus.id));

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching bus schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bus schedules' },
      { status: 500 },
    );
  }
}
