# Church Planner AI

> Plataforma para planificar y visualizar las actividades de todos los ministerios de la iglesia en un solo lugar.

Lee el PRD completo en [`chruch-planner-ai.md`](./chruch-planner-ai.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- TailwindCSS v4 (CSS-first config, OKLCH tokens)
- shadcn/ui (preset `base-nova`) · Base UI primitives
- next-themes (dark/light mode)
- FullCalendar v6 (month/week/day/agenda) con CSS propio
- zod (env & runtime validation)
- googleapis (Fase 2, opcional — la app arranca con mock data)

## Estado actual

- Landing pública con identidad visual minimalista moderna
- Calendario público (`/calendario`) con FullCalendar, filtro de ministerios, 3 modos de detalle
- Theme toggle (light/dark) con persistencia
- Calendar provider intercambiable: **Mock** (desarrollo) ↔ **Google Calendar** (Fase 2, con credenciales)
- Detección de conflictos incluida en el provider (Fase 7)
- Estructura desacoplada del proveedor — soporta multi-tenant en el futuro sin reescribir la UI

## Cómo correr

```bash
pnpm install
pnpm dev          # http://localhost:3000

pnpm build        # producción
pnpm lint         # eslint
pnpm tsc --noEmit # typecheck
```

Sin credenciales de Google, la app usa el mock y muestra eventos ficticios en `/calendario`.

## Configurar Google Calendar (Fase 2)

1. Crear proyecto en https://console.cloud.google.com
2. Habilitar **Google Calendar API**
3. Crear **Service Account**, descargar JSON key
4. Compartir el calendario "Eventos Iglesia" con el email del service account (permiso: "Make changes to events")
5. Copiar `.env.example` a `.env.local` y completar:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=...
   GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_CALENDAR_ID=...
   ```
6. Reiniciar `pnpm dev` — el factory detectará las credenciales y cambiará a Google automáticamente.

## Estructura

```
app/
  page.tsx              # landing
  calendario/page.tsx   # calendario público
components/
  ui/                   # primitivos shadcn
  theme/                # theme provider + toggle
  layout/               # site header, footer
  landing/              # hero, ministry strip, how-it-works
  calendar/             # calendar view, ministry filter, page client
  ministry-icons.tsx    # 8 SVGs custom
lib/
  config/               # env, site, calendar provider interface
  providers/calendar/   # mock + google + factory + README
  types/                # ChurchEvent, Ministry
hooks/
  use-scroll-reveal.ts  # IntersectionObserver hook
```

## Principios

- Google Calendar es la fuente oficial de los eventos (no se persisten en BD)
- Lógica de negocio desacoplada del proveedor de calendario
- Los visitantes nunca crean cuentas
- Solo los administradores usan Google OAuth
- Modular y escalable