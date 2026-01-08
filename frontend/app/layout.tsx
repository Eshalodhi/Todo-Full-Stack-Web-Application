import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

// =============================================================================
// Font Configuration
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'TaskFlow - Modern Task Management',
    template: '%s | TaskFlow',
  },
  description: 'A modern, visually stunning multi-user task management application with advanced UI/UX patterns.',
  keywords: ['task management', 'todo app', 'productivity', 'nextjs'],
  authors: [{ name: 'Phase II Team' }],
  creator: 'Phase II Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'TaskFlow - Modern Task Management',
    description: 'A modern, visually stunning multi-user task management application.',
    siteName: 'TaskFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskFlow - Modern Task Management',
    description: 'A modern, visually stunning multi-user task management application.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = stored === 'dark' || (!stored && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider defaultTheme="system" enableTransitions>
          <ToastProvider position="top-right">
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
