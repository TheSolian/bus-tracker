import { busArrivals, buses, busSchedules } from '@/db/schema';

export type Bus = typeof buses.$inferSelect;

export type BusArrival = typeof busArrivals.$inferSelect;
export type BusArrivalWithBus = BusArrival & {
  bus: Bus;
};

export type BusSchedule = typeof busSchedules.$inferSelect;

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
