import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Bus Tracker',
  appleWebApp: {
    capable: true,
    title: 'Bus Tracker',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
