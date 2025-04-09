import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const positionEnum = pgEnum("position", ["front", "back"]);

export const buses = pgTable("buses", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: varchar("number", { length: 3 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const busRelations = relations(buses, ({ many }) => ({
  arrivals: many(busArrivals),
  schedules: many(busSchedules),
}));

export const busSchedules = pgTable("bus_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  busId: uuid("bus_id")
    .references(() => buses.id)
    .notNull(),
  arrival: time("arrival", { precision: 0, withTimezone: false }).notNull(),
  departure: time("departure", { precision: 0, withTimezone: false }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const busScheduleRelations = relations(busSchedules, ({ one }) => ({
  bus: one(buses, {
    fields: [busSchedules.busId],
    references: [buses.id],
  }),
}));

export const busArrivals = pgTable("bus_arrivals", {
  id: uuid("id").primaryKey().defaultRandom(),
  busId: uuid("bus_id")
    .references(() => buses.id)
    .notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  position: positionEnum("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const busArrivalRelations = relations(busArrivals, ({ one }) => ({
  bus: one(buses, {
    fields: [busArrivals.busId],
    references: [buses.id],
  }),
}));
