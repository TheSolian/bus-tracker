import { relations } from 'drizzle-orm';
import {
  date,
  pgEnum,
  pgTable,
  time,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const positionEnum = pgEnum('position', ['front', 'back']);

export const buses = pgTable('buses', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: varchar('number', { length: 3 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const busRelations = relations(buses, ({ many }) => ({
  arrivals: many(busArrivals),
  schedules: many(busSchedules),
}));

export const busSchedules = pgTable('bus_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  busId: uuid('bus_id')
    .references(() => buses.id)
    .notNull(),
  arrival: time('arrival', { withTimezone: false, precision: 0 }).notNull(),
  departure: time('departure', { withTimezone: false, precision: 0 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const busScheduleRelations = relations(
  busSchedules,
  ({ one, many }) => ({
    bus: one(buses, {
      fields: [busSchedules.busId],
      references: [buses.id],
    }),
    arrivals: many(busArrivals),
  }),
);

export const busArrivals = pgTable('bus_arrivals', {
  id: uuid('id').primaryKey().defaultRandom(),
  busId: uuid('bus_id')
    .references(() => buses.id)
    .notNull(),
  date: date('date').notNull(),
  departureTime: timestamp('departure_time').notNull(),
  arrivalTime: timestamp('arrival_time').notNull(),
  scheduleId: uuid('schedule_id')
    .references(() => busSchedules.id)
    .notNull(),
  position: positionEnum('position').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const busArrivalRelations = relations(busArrivals, ({ one }) => ({
  bus: one(buses, {
    fields: [busArrivals.busId],
    references: [buses.id],
  }),
  schedule: one(busSchedules, {
    fields: [busArrivals.scheduleId],
    references: [busSchedules.id],
  }),
}));
