import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: Date) => {
  const date = new Date(time);
  return date.toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
