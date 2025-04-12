import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: Date | string) => {
  if (time instanceof Date) {
    return time.toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
    return time;
  }

  if (typeof time === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time.slice(0, 5);
  }

  try {
    const date = new Date(time);
    return date.toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
};

export const formatDate = (date: Date | string) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const getWeekday = (date: Date | string) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('en-US', { weekday: 'long' });
};
