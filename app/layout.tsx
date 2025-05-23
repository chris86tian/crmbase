import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer'; // Import SiteFooter

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRM-BASE | Intelligenter Auto-Caller & CRM',
  description: 'Bye-bye Callcenter – Hallo AUTO-CALLER von CRM-BASE. Revolutionieren Sie Ihre Kundenkommunikation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter /> {/* Add SiteFooter here */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
