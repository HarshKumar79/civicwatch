import type { Metadata } from 'next';
import { Noto_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

// Components Import
import UtilityStrip from './components/layout/UtilityStrip';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AuthProvider from './components/auth/Provider';

// Font Configuration
const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans'
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono'
});

export const metadata: Metadata = {
  title: 'CivicWatch — City Maintenance & Reporting Portal',
  description: 'A citizen and municipal corporation initiative prototype.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
         <link rel="stylesheet" href="https://dbimtoolkit.digifootprint.gov.in/css/dbim-theme.min.css" />
      </head>
      <body className={`${notoSans.className} ${notoSans.variable} ${ibmPlexMono.variable} bg-paper text-ink m-0 p-0 min-h-screen flex flex-col`}>
        <AuthProvider>
          <UtilityStrip />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}