import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: "Dipanshu's Performance Elite",
  description: 'AI-Powered Bank Exam Performance Tracking Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-hidden">
        <div className="flex h-screen w-screen bg-background transition-colors duration-300 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 lg:px-14 pb-20">
              <div className="max-w-[1600px] mx-auto page-transition w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}