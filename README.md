# Login B2Bit 

Tela de **login** e área **protegida** de **perfil** construída em **Next.js (App Router + TS)** com:
- **shadcn/ui** (Button, Input, Card, Avatar, Skeleton, Sonner)
- **Axios** com **interceptors** (Authorization, 401/403, erro de rede)
- **Formik + Yup** (validação)
- **Guarda de rota** via **middleware** + espelhamento de tokens em **cookies httpOnly**
- **Testes**: **unitários**, **de componente** (Jest/RTL) e **E2E** (Playwright)
- **CI (GitHub Actions)** rodando Jest + Playwright

---

## Requisitos atendidos
- Shadcn instalado e usado nos componentes principais.
- Interceptors Axios (request injeta `Bearer`, response trata `401/403`, `400` e erro de rede).
- Formulário de login com validação (Formik + Yup).
- **Login**: `POST /auth/login/` → salva tokens (`localStorage`) e **espelha em cookie httpOnly** via rota interna (`/api/auth/session`) → - **redirect** para `/profile`.
- **Página protegida** `/profile`: `GET /auth/profile/` com `Authorization: Bearer <access>`.
- **Logout**: limpa **cookies** e **localStorage** e volta para `/login`.
- **Regra de negócio**: middleware bloqueia `/profile` sem sessão e **bloqueia `/login` quando autenticado**.
- **Testes**:
  - Unit: helpers e interceptors.
  - Component: `LoginForm`, `ProfilePage` (mock de axios).
  - E2E (Playwright): rota protegida, login OK, login 400, logout, **redirect /login quando autenticado**.

---

## Como rodar (local)
```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://api.homologation.cliqdrive.com.br
NEXT_PUBLIC_API_ACCEPT=application/json;version=v1_web
```

> Em **desenvolvimento**, os testes E2E não chamam a API real: as rotas são **mockadas** via `page.route(...)` (Playwright).

---

## Testes
- **Unit/Component (Jest)**:
```bash
npm test
```
- JSDOM configurado com polyfills e mocks estáveis de `axios`.
- Sem MSW no Jest (evita problemas ESM em Windows).

- **E2E (Playwright)**:
```bash
npm run test:e2e
```
- Usa `webServer` (`npm run dev`) e intercepta as chamadas da API com `page.route(...)`.
- Specs: login sucesso/400, rota protegida, logout, redirect de `/login` quando autenticado.

---

## Autenticação & Regras
- Tokens `access/refresh` são **persistidos no `localStorage`**.
- Para o **middleware** proteger rotas no **servidor**, os tokens são **espelhados** em cookies **httpOnly** via rota interna:
  - `POST /api/auth/session` → grava `access_token`/`refresh_token` (httpOnly).
  - `DELETE /api/auth/session` → apaga os cookies.
- **Middleware (`middleware.ts`)**:
  - `/profile` → **requer** cookie `access_token`, senão redireciona para `/login`.
  - `/login` → se já houver cookie `access_token`, **redireciona** para `/profile`.
- **Interceptor Axios** (`src/lib/axios.ts`):
  - **Request**: injeta `Authorization: Bearer <access_token>` do `localStorage`.
  - **Response**: 401/403 → limpa credenciais + redireciona; 400 → toast só se não for erro de campo; **erro de rede** → toast "Sem conexão".

---

## Estrutura
```
src/
  app/
    page.tsx                     # redirect '/' -> '/login'
    login/page.tsx               # guarda client: se logado, vai p/ /profile
    (protected)/
      layout.tsx
      profile/page.tsx           # fetch do profile + Skeleton + Logout
    api/auth/session/route.ts    # cria/apaga cookies httpOnly p/ middleware
  components/
    auth/LoginForm.tsx
    ui/ ... (shadcn)
  lib/
    axios.ts
    auth.ts
  types/
    api.ts
  tests/
    unit/*.test.ts
    component/*.spec.tsx
e2e/
  *.spec.ts
middleware.ts
```

---

## Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest",
  "test:e2e": "playwright test",
  "lint": "next lint",
  "lint:fix": "next lint --fix"
}
```

---

## CI (GitHub Actions)
- Dois jobs (**unit** e **e2e**), `.env.local` gerado no CI, browsers do Playwright e **relatórios** anexados quando há falhas.
- `playwright.config.ts` com `retries` e `trace` no CI.

---

## Observações
- `Avatar` renderiza sempre `AvatarImage` + `AvatarFallback` e mapeia `high|medium|low` ou `image_*_url`.
- Sem MSW no Jest; foi usado **axios-mock-adapter** e mocks diretos.
- E2E cobrem os fluxos principais sem depender da API real.
