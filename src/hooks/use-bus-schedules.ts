import { BusSchedule } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  busNumber?: string;
  enabled?: boolean;
}

export const useBusSchedules = ({ busNumber, enabled = true }: Props) => {
  return useQuery<BusSchedule[]>({
    queryKey: ['bus-schedules', busNumber],
    queryFn: async () => {
      const res = await axios.get(`/api/buses/${busNumber}/schedules`);
      return res.data;
    },
    enabled,
  });
};
