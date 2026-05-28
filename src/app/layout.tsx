
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
      <body className="font-body antialiased bg-background text-foreground">
        <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-1 p-4 md:p-8 lg:p-14 overflow-y-auto scroll-smooth">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
