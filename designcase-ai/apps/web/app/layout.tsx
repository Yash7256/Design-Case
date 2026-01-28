import type { Metadata } from 'next';
import { Providers } from './providers';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'DesignCase AI - AI-Powered Design Case Studies',
  description:
    'Generate beautiful, AI-powered case studies from your design files in minutes.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
