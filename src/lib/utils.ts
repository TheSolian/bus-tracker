import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: Date | string) => {
  const date = new Date(time);
  return date.toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date: Date | string) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('de-CH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
