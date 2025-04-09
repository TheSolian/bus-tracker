'use client';

import { useBusArrivals } from '@/hooks/use-bus-arrivals';
import { ArrivalsTable } from '@/modules/home/ui/components/arrivals-table';
import { columns } from '@/modules/home/ui/components/arrivals-table/columns';

export default function Page() {
  const { data, isLoading } = useBusArrivals();

  return (
    <div className='p-4'>
      <ArrivalsTable
        columns={columns}
        data={data?.pages.flatMap((page) => page.data) ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
