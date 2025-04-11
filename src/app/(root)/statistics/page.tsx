'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useBusArrivals } from '@/hooks/use-bus-arrivals';
import { useBusSchedules } from '@/hooks/use-bus-schedules';
import { useBuses } from '@/hooks/use-buses';
import { BusPositionPerDayChart } from '@/modules/statistics/ui/components/bus-position-per-day-chart';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='flex h-full items-center justify-center'>
          Loading...
        </div>
      }
    >
      <StatisticsContent />
    </Suspense>
  );
}

function StatisticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBusNumber, setSelectedBusNumber] = useState<string>(
    searchParams.get('bus') ?? '',
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    searchParams.get('schedule') ?? '',
  );

  const { data: buses } = useBuses();
  const { data } = useBusArrivals();
  const { data: schedules } = useBusSchedules({
    busNumber: selectedBusNumber,
    enabled: selectedBusNumber !== undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedBusNumber) {
      params.set('bus', selectedBusNumber);
    } else {
      params.delete('bus');
    }

    if (selectedScheduleId) {
      params.set('schedule', selectedScheduleId);
    } else {
      params.delete('schedule');
    }

    router.push(`?${params.toString()}`);
  }, [selectedBusNumber, selectedScheduleId, router, searchParams]);

  // Auto-select schedule if there's only one
  useEffect(() => {
    if (schedules?.length === 1 && !selectedScheduleId) {
      setSelectedScheduleId(schedules[0].id);
    }
  }, [schedules, selectedScheduleId]);

  const busArrivals = data?.pages.flatMap((page) => page.data) ?? [];

  const filteredArrivals = busArrivals.filter((arrival) => {
    const matchesBus = arrival.bus.number === selectedBusNumber;
    const matchesSchedule = arrival.scheduleId === selectedScheduleId;
    return matchesBus && matchesSchedule;
  });

  return (
    <div className='h-full' data-testid='statistics-page'>
      <div className='flex items-center justify-end gap-4 p-4'>
        <Select
          onValueChange={(value) => {
            setSelectedBusNumber(value);
            setSelectedScheduleId('');
          }}
          value={selectedBusNumber}
        >
          <SelectTrigger data-testid='bus-select'>
            {selectedBusNumber && !buses ? (
              <Skeleton className='h-4 w-12' />
            ) : (
              <SelectValue placeholder='Select a bus' />
            )}
          </SelectTrigger>
          <SelectContent>
            {!buses ? (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                Loading...
              </div>
            ) : buses.length === 0 ? (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                No buses found
              </div>
            ) : (
              buses.map((bus) => (
                <SelectItem
                  key={bus.id}
                  value={bus.number}
                  data-testid={`bus-option-${bus.number}`}
                >
                  {bus.number}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Select
          onValueChange={setSelectedScheduleId}
          value={selectedScheduleId}
        >
          <SelectTrigger
            data-testid='schedule-select'
            disabled={selectedBusNumber === ''}
          >
            {selectedScheduleId && !schedules ? (
              <Skeleton className='h-4 w-24' />
            ) : (
              <SelectValue placeholder='Select schedule' />
            )}
          </SelectTrigger>
          <SelectContent align='end'>
            {!schedules ? (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                Loading...
              </div>
            ) : schedules.length === 0 ? (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                No schedules found
              </div>
            ) : (
              schedules.map((schedule) => (
                <SelectItem
                  key={schedule.id}
                  value={schedule.id}
                  data-testid={`schedule-option-${schedule.id}`}
                >
                  Arr. {schedule.arrival.slice(0, 5)} - Dep.{' '}
                  {schedule.departure.slice(0, 5)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      {!selectedBusNumber || !selectedScheduleId ? (
        <div
          className='flex h-full items-center justify-center'
          data-testid='empty-state'
        >
          <p className='text-muted-foreground text-sm'>
            Please select a bus and schedule
          </p>
        </div>
      ) : filteredArrivals.length === 0 ? (
        <div
          className='flex h-full items-center justify-center'
          data-testid='no-data-state'
        >
          <p className='text-muted-foreground text-sm'>
            No available data for selected bus and schedule
          </p>
        </div>
      ) : (
        <div
          className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2'
          data-testid='chart-container'
        >
          <BusPositionPerDayChart arrivals={filteredArrivals} />
        </div>
      )}
    </div>
  );
}
