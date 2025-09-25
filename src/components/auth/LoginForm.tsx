'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/axios';
import { setTokens, setUser } from '@/lib/auth';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const get = (obj: unknown, path: readonly string[]): unknown => {
  let cur: unknown = obj;
  for (const key of path) {
    if (!isRecord(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
};
const first = (v: unknown): string | undefined =>
  Array.isArray(v) ? (v.length ? String(v[0]) : undefined)
  : typeof v === 'string' || typeof v === 'number' ? String(v)
  : undefined;
const extractErrorData = (err: unknown): unknown => {
  const fromResponse = get(err, ['response', 'data']);
  if (typeof fromResponse !== 'undefined') return fromResponse;
  const fromTopData = get(err, ['data']);
  if (typeof fromTopData !== 'undefined') return fromTopData;
  return err;
};

type LoginRequest = { email: string; password: string };
type LoginResponse = {
  tokens: { access: string; refresh: string };
  user: { id: string | number; email: string } & Record<string, unknown>;
};

const LoginSchema = Yup.object({
  email: Yup.string().email('E-mail inválido').required('Informe seu e-mail'),
  password: Yup.string().required('Informe sua senha'),
});

export default function LoginForm() {
  const router = useRouter();

  const formik = useFormik<LoginRequest>({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
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
      } catch (err: unknown) {
        const data = extractErrorData(err);
        const emailMsg =
          first(get(data, ['email'])) ??
          first(get(data, ['errors', 'email'])) ??
          first(get(data, ['error', 'email']));
        const passwordMsg =
          first(get(data, ['password'])) ??
          first(get(data, ['errors', 'password'])) ??
          first(get(data, ['error', 'password']));
        const nonFieldMsg =
          first(get(data, ['detail'])) ??
          first(get(data, ['non_field_errors'])) ??
          first(get(data, ['message']));
        const fallbackString =
          typeof data === 'string'
            ? data
            : (isRecord(data) && typeof data.error === 'string')
            ? data.error
            : undefined;
        if (emailMsg) {
          helpers.setFieldError('email', emailMsg);
          helpers.setFieldTouched('email', true, false);
        }
        if (passwordMsg) {
          helpers.setFieldError('password', passwordMsg);
          helpers.setFieldTouched('password', true, false);
        }
        if (!emailMsg && !passwordMsg && (nonFieldMsg ?? fallbackString)) {
          toast.error(nonFieldMsg ?? fallbackString);
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    values,
    errors: formErrors,
    touched,
    isSubmitting,
  } = formik;

  return (
    <Card className="w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-0 rounded-2xl">
      <CardContent className="p-8 space-y-6">
        <Image
          src="/B2Bit-Logo.png"
          alt="Logo"
          width={400}
          height={100}
          priority
          sizes="(max-width: 640px) 80vw, 400px"
          className="object-contain"
        />

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-md font-bold text-gray-700">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="@gmail.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={!!(touched.email && formErrors.email)}
              aria-describedby={touched.email && formErrors.email ? 'email-error' : undefined}
              className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-gray-600 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              required
            />
            {touched.email && formErrors.email ? (
              <p id="email-error" role="alert" aria-live="polite" className="text-md text-red-600">
                {formErrors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-md font-bold text-gray-700">
                Password
              </Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="****************"
              value={values.password}
              onChange={handleChange}
              aria-invalid={!!(touched.password && formErrors.password)}
              aria-describedby={touched.password && formErrors.password ? 'password-error' : undefined}
              className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-gray-600 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              required
            />
            {touched.password && formErrors.password ? (
              <p id="password-error" role="alert" aria-live="polite" className="text-md text-red-600">
                {formErrors.password}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#022740] hover:bg-[#fdcf00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
