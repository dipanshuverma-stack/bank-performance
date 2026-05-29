
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/toaster';
import { AchievementMonitor } from '@/components/dashboard/AchievementMonitor';
import { QuickActions } from '@/components/dashboard/QuickActions';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dipanshu's Performance Elite",
  description: 'AI-Powered Bank Exam Performance Tracking Dashboard',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Elite Perf",
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-hidden">
        <div className="flex h-screen w-screen bg-background transition-colors duration-300 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 lg:px-14 pb-32 md:pb-20">
              <div className="max-w-[1600px] mx-auto page-transition w-full">
                {children}
              </div>
            </main>
            <BottomNav />
          </div>
        </div>
        <QuickActions />
        <AchievementMonitor />
        <Toaster />
      </body>
    </html>
  );
}
