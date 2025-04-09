import { BusArrivalWithBus, PaginatedResponse } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useBusArrivals = () => {
  return useInfiniteQuery<PaginatedResponse<BusArrivalWithBus>>({
    queryKey: ['bus-arrivals'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get<PaginatedResponse<BusArrivalWithBus>>(
        `/api/arrivals?page=${pageParam}`,
      );
      return res.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination.totalPages > pages.length
        ? pages.length + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};
