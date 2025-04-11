'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBusSchedules } from '@/hooks/use-bus-schedules';
import { useBuses } from '@/hooks/use-buses';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createArrivalFormSchema } from '../schemas/create-arrival-form-schema';

interface Props {
  cancel: () => void;
}

export const CreateArrivalForm = ({ cancel }: Props) => {
  const [selectedBusNumber, setSelectedBusNumber] = useState<string>();

  const { data: buses } = useBuses();
  const { data: schedules } = useBusSchedules({
    busNumber: selectedBusNumber,
    enabled: selectedBusNumber !== undefined,
  });

  const form = useForm<z.infer<typeof createArrivalFormSchema>>({
    resolver: zodResolver(createArrivalFormSchema),
    defaultValues: {
      busId: '',
      date: new Date().toISOString().split('T')[0],
      departureTime: '',
      arrivalTime: '',
      scheduleId: '',
      position: 'front',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof createArrivalFormSchema>) => {
      const res = await axios.post('/api/arrivals/add', values);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bus-arrivals'] });
      form.reset();
      cancel();
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof createArrivalFormSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <FormField
          control={form.control}
          name='busId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedBusNumber(
                    buses?.find((bus) => bus.id === value)?.number,
                  );
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a bus' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buses !== undefined && buses.length > 0 ? (
                    buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.number}
                      </SelectItem>
                    ))
                  ) : buses !== undefined && buses.length === 0 ? (
                    <div>No buses found</div>
                  ) : (
                    <div>Loading...</div>
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='scheduleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={selectedBusNumber === undefined}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a bus' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schedules !== undefined && schedules.length > 0 ? (
                    schedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        Arr. {schedule.arrival.slice(0, 5)} - Dep.{' '}
                        {schedule.departure.slice(0, 5)}
                      </SelectItem>
                    ))
                  ) : schedules !== undefined && schedules.length === 0 ? (
                    <div>No schedules found</div>
                  ) : (
                    <div>Loading...</div>
                  )}
                </SelectContent>
              </Select>
              {selectedBusNumber === undefined ? (
                <FormDescription>Select a bus first</FormDescription>
              ) : null}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Input type='date' {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='arrivalTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Time</FormLabel>
              <Input type='time' {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='departureTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Time</FormLabel>
              <Input type='time' {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='position'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a position' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='front'>Front</SelectItem>
                  <SelectItem value='back'>Back</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className='flex items-center justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={cancel}>
            Cancel
          </Button>
          <Button disabled={isPending}>
            {isPending ? <CircularProgress size={8} /> : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
