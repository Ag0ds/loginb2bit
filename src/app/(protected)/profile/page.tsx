'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { ProfileResponse } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { clearAuth } from '@/lib/auth';

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/auth/profile/')
      .then((res) => setData(res.data))
      .catch(() => setError('Falha ao carregar perfil.'));
  }, []);

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const lastLoginText = (() => {
    if (!data?.last_login) return '-';
    const d = new Date(data.last_login);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString();
  })();

  return (
    <main className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-xl">
        <div className="flex justify-end mb-4">
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>

        <Card className="p-6 space-y-4">
          {!data && !error ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 w-full max-w-[240px]">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {data!.avatar?.image_low_url ? (
                    <AvatarImage src={data!.avatar.image_low_url} alt="Avatar" />
                  ) : (
                    <AvatarFallback>{(data!.name?.[0] || 'U').toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">
                    {data!.name} {data!.last_name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{data!.email}</p>
                </div>
              </div>

              <div className="text-sm">
                <p><b>Role:</b> {data!.role?.label ?? '-'}</p>
                <p><b>Staff:</b> {data!.staff_role?.label ?? '-'}</p>
                <p><b>Last login:</b> {lastLoginText}</p>
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
