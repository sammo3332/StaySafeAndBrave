import type { Metadata } from 'next';
import { WorkspaceNav } from '@/components/layout/workspace-nav';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="workspace-shell">
      <WorkspaceNav />
      {children}
    </div>
  );
}
