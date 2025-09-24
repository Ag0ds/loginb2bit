'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/axios';
import { setTokens, setUser } from '@/lib/auth';
type LoginRequest = { email: string; password: string };
type LoginResponse = {
  tokens: { access: string; refresh: string };
  user: { id: string | number; email: string; [key: string]: any };
};

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LoginSchema = Yup.object({
  email: Yup.string().email('E-mail inválido').required('Informe seu e-mail'),
  password: Yup.string().required('Informe sua senha'),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginRequest>({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      try {
        const { data } = await api.post<LoginResponse>('/auth/login/', values);
        setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access: data.tokens.access,
            refresh: data.tokens.refresh,
          }),
        });
        toast.success('Login realizado com sucesso!');
        router.replace('/profile');
      } catch (err: any) {
        const resp = err?.response;
        if (resp?.status === 400 && resp?.data) {
          const apiErrors = resp.data as Record<string, string[]>;
          (['email', 'password'] as const).forEach((field) => {
            const msgs = apiErrors[field];
            if (Array.isArray(msgs) && msgs.length) {
              helpers.setFieldError(field, msgs[0]);
              helpers.setFieldTouched(field, true, false);
            }
          });
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = formik;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Entrar</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@exemplo.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email ? (
              <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <button
                type="button"
                className="text-xs underline text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              aria-invalid={!!(touched.password && errors.password)}
              aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
            />
            {touched.password && errors.password ? (
              <p id="password-error" className="text-sm text-red-600">{errors.password}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
