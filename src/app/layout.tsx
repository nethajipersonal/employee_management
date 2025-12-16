import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SessionProvider from '@/components/providers/SessionProvider';
import NotificationBell from '@/components/ui/NotificationBell';
import { Box } from '@mui/material';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Employee Management System',
  description:
    'Comprehensive employee management system with leave management, payroll, projects, and time tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <SessionProvider>
              <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1200 }}>
                <NotificationBell />
              </Box>
              {children}
            </SessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

