import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anmeldung & Registrierung',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
