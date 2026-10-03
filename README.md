# Church Planner AI

> Plataforma para planificar y visualizar las actividades de todos los ministerios de la iglesia en un solo lugar.

Lee el PRD completo en [`chruch-planner-ai.md`](./chruch-planner-ai.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- TailwindCSS v4 (CSS-first config, OKLCH tokens)
- shadcn/ui (preset `base-nova`) · Radix UI primitives
- next-themes (dark/light mode)
- zod (env & runtime validation)

## Estado actual

Scaffold inicial. Funcional en este paso:

- Landing pública con identidad visual minimalista moderna
- Theme toggle (light/dark) con persistencia
- Catálogo de ministerios con colores diferenciados
- Estructura de carpetas preparada para crecer (calendar provider stub, types, config)

Las fases del PRD (Google OAuth, Google Calendar, CRUD, Telegram, push, conflictos) llegan en iteraciones siguientes.

## Cómo correr

```bash
pnpm install
pnpm dev          # http://localhost:3000

pnpm build        # producción
pnpm lint         # eslint
pnpm tsc --noEmit # typecheck
```

## Estructura

```
app/                  # App Router (landing, en el futuro /admin, /calendario)
components/
  ui/                # primitivos shadcn (button, card, dialog, ...)
  theme/             # theme provider + toggle
  layout/            # site header, footer
  landing/           # hero, ministry strip, scaffold note
lib/
  config/            # env, site, calendar provider interface
  providers/calendar # abstracción desacoplada del proveedor (Google en Fase 2)
  types/             # ChurchEvent, Ministry, etc.
```

## Principios

- Google Calendar es la fuente oficial de los eventos (no se persisten en BD)
- Lógica de negocio desacoplada del proveedor de calendario
- Los visitantes nunca crean cuentas
- Solo los administradores usan Google OAuth
- Modular y escalable