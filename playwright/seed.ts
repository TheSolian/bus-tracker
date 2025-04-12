import { db } from '../src/db';
import { busArrivals, buses, busSchedules } from '../src/db/schema';

export async function seedDatabase() {
  // Clear existing data
  await db.delete(busArrivals);
  await db.delete(busSchedules);
  await db.delete(buses);

  // Insert test buses
  const [bus1, bus2] = await db
    .insert(buses)
    .values([{ number: '101' }, { number: '102' }])
    .returning();

  // Insert test schedules
  const [schedule1, schedule2] = await db
    .insert(busSchedules)
    .values([
      {
        busId: bus1.id,
        arrival: '08:00:00',
        departure: '07:30:00',
      },
      {
        busId: bus2.id,
        arrival: '09:00:00',
        departure: '08:30:00',
      },
    ])
    .returning();

  // Insert test arrivals
  await db.insert(busArrivals).values([
    {
      busId: bus1.id,
      scheduleId: schedule1.id,
      date: new Date().toISOString().split('T')[0],
      departureTime: '07:30:00',
      arrivalTime: '08:00:00',
      position: 'front',
    },
    {
      busId: bus2.id,
      scheduleId: schedule2.id,
      date: new Date().toISOString().split('T')[0],
      departureTime: '08:30:00',
      arrivalTime: '09:00:00',
      position: 'back',
    },
  ]);
}

export async function clearDatabase() {
  await db.delete(busArrivals);
  await db.delete(busSchedules);
  await db.delete(buses);
}
