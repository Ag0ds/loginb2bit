'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import type { ProfileResponse } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { clearAuth } from '@/lib/auth';

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    api.get('/auth/profile/').then((res) => setData(res.data));
  }, []);

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-xl">
        <div className="flex justify-end mb-4">
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>

        <Card className="p-6 space-y-4">
          {!data ? (
            <div>Carregando...</div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {data.avatar?.image_low_url ? (
                    <AvatarImage src={data.avatar.image_low_url} alt="Avatar" />
                  ) : (
                    <AvatarFallback>{data.name?.[0] ?? 'U'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">{data.name} {data.last_name}</h1>
                  <p className="text-sm text-muted-foreground">{data.email}</p>
                </div>
              </div>
              <div className="text-sm">
                <p><b>Role:</b> {data.role.label}</p>
                <p><b>Staff:</b> {data.staff_role.label}</p>
                <p><b>Last login:</b> {new Date(data.last_login).toLocaleString()}</p>
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
