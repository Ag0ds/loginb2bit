'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import api from '@/lib/axios';
import { setTokens, setUser } from '@/lib/auth';
type LoginRequest = { email: string; password: string };
type LoginResponse = {
  tokens: { access: string; refresh: string };
  user: { id: string | number; email: string } & Record<string, unknown>;
};
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
      }catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const resp = err.response;
            if (resp?.status === 400 && resp.data && typeof resp.data === 'object') {
              const apiErrors = resp.data as Record<string, string[]>;
              (['email', 'password'] as const).forEach((field) => {
                const msgs = apiErrors[field];
                if (Array.isArray(msgs) && msgs.length) {
                  helpers.setFieldError(field, msgs[0]);
                  helpers.setFieldTouched(field, true, false);
                }
              });
            }
          }
        } finally {
          helpers.setSubmitting(false);
        }
      },
    });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = formik;

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
                <Label htmlFor="email" className="text-md font-bold text-gray-700">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="@gmail.com"
                  value={values.email}
                  onChange={handleChange}
                  aria-invalid={!!(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-gray-600 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  required
                />
                {touched.email && errors.email ? (
                  <p id="email-error" className="text-md text-red-600">{errors.email}</p>
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
                  aria-invalid={!!(touched.password && errors.password)}
                  aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                  className="w-full h-12 px-4 bg-gray-50 border-0 rounded-lg text-gray-600 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  required
                />
                {touched.password && errors.password ? (
                  <p id="password-error" className="text-md text-red-600">{errors.password}</p>
                ) : null}
              </div>

              <Button type="submit" className="w-full h-12 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 mt-8" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Sing In'}
              </Button>
              </form>
        </CardContent>
      </Card>
  );
}
