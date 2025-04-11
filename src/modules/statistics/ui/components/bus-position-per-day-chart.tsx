import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getWeekday } from '@/lib/utils';
import { BusArrivalWithBus } from '@/types';
import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

type Props = {
  arrivals: BusArrivalWithBus[];
};

export const BusPositionPerDayChart = ({ arrivals }: Props) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const chartData = weekdays.map((weekday) => {
    const dayArrivals = arrivals.filter(
      (arrival) => getWeekday(arrival.date) === weekday,
    );

    return {
      day: weekday,
      front: dayArrivals.filter((arrival) => arrival.position === 'front')
        .length,
      back: dayArrivals.filter((arrival) => arrival.position === 'back').length,
    };
  });

  const chartConfig = {
    front: {
      label: 'Front',
      color: 'var(--chart-1)',
    },
    back: {
      label: 'Back',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus Position per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='day'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='front' fill='var(--color-front)' radius={4}>
              <LabelList
                dataKey='front'
                position='top'
                offset={12}
                fill='var(--color-front)'
              />
            </Bar>
            <Bar dataKey='back' fill='var(--color-back)' radius={4}>
              <LabelList
                dataKey='back'
                position='top'
                offset={12}
                fill='var(--color-back)'
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
