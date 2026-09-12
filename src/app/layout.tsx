
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Header} from '@/components/layout/header';
import {Footer} from '@/components/layout/footer';
import {Toaster} from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { FirebaseClientProvider } from '@/firebase';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://staysafeandbrave.de'),
  title: {
    default: 'Stay Safe & Brave | Individuell reisen. Lokal begleitet. Sicherer unterwegs.',
    template: '%s | Stay Safe & Brave',
  },
  description:
    'Stay Safe & Brave verbindet selbstbestimmte Reisende mit vertrauenswürdigen Local Mentoren in Südafrika für authentische und verlässliche Reisebegleitung.',
  applicationName: 'Stay Safe & Brave',
  keywords: [
    'Südafrika Reise',
    'Local Mentor Südafrika',
    'Kapstadt Reisebegleitung',
    'Johannesburg Mentor',
    'Durban Begleitung',
    'Sicher reisen Südafrika',
    'Authentisch reisen',
    'Alleinreisen Südafrika',
  ],
  authors: [{ name: 'Stay Safe & Brave Team' }],
  creator: 'Stay Safe & Brave',
  publisher: 'Stay Safe & Brave',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    siteName: 'Stay Safe & Brave',
    title: 'Stay Safe & Brave | Individuell reisen. Lokal begleitet. Sicherer unterwegs.',
    description:
      'Verbinde dich mit vertrauenswürdigen Local Mentoren in Südafrika. Individuell planen, lokal begleitet und verlässlich unterwegs sein.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stay Safe & Brave | Individuell reisen. Lokal begleitet. Sicherer unterwegs.',
    description:
      'Verbinde dich mit vertrauenswürdigen Local Mentoren in Südafrika.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <FirebaseClientProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow py-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
