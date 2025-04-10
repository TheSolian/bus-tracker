import { Bus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useBuses = () => {
  return useQuery<Bus[]>({
    queryKey: ['buses'],
    queryFn: async () => {
      const res = await axios.get('/api/buses');
      return res.data;
    },
  });
};
