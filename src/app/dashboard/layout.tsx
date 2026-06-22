
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SplashScreen } from '@/components/SplashScreen';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  if (loading || !mounted) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
