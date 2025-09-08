'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DepartmentSelector } from "@/components/department-selector";
import { useAuth } from "@/components/auth-provider";

export default function ClientHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200">
      <DepartmentSelector />
    </main>
  );
}
