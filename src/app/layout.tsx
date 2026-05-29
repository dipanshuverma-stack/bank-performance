import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ClientSideWrappers } from '@/components/layout/ClientSideWrappers';

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
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-foreground min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          <div className="main-shell bg-background relative flex min-h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 relative">
              <Header />
              <main className="scroll-viewport px-4 md:px-8 lg:px-14 flex-1">
                <div className="max-w-[1600px] mx-auto page-transition w-full py-6 pb-32 md:pb-12">
                  {children}
                </div>
              </main>
              <BottomNav />
            </div>
          </div>
          <ClientSideWrappers />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
