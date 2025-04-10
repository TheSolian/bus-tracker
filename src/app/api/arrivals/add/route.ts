import { db } from '@/db';
import { busArrivals } from '@/db/schema';
import { createArrivalFormSchema } from '@/modules/home/schemas/create-arrival-form-schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = createArrivalFormSchema.parse(body);

    // Combine date and times into proper DateTime objects
    const departureDateTime = new Date(
      `${validatedData.date}T${validatedData.departureTime}:00`,
    );
    const arrivalDateTime = new Date(
      `${validatedData.date}T${validatedData.arrivalTime}:00`,
    );

    const [newArrival] = await db
      .insert(busArrivals)
      .values({
        busId: validatedData.busId,
        date: validatedData.date,
        arrivalTime: arrivalDateTime,
        departureTime: departureDateTime,
        scheduleId: validatedData.scheduleId,
        position: validatedData.position,
      })
      .returning();

    return NextResponse.json(newArrival, { status: 201 });
  } catch (error) {
    console.error('Error creating bus arrival:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create bus arrival' },
      { status: 500 },
    );
  }
}
