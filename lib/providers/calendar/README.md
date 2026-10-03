# Calendar Provider

This directory implements the **calendar provider abstraction** that the rest
of the application talks to. It exists so the calendar backend can be swapped
without touching business logic.

## Why

The PRD's last principle is explicit:

> Toda la lógica de negocio debe estar desacoplada de Google Calendar para
> permitir, en el futuro, reemplazar Google Calendar por otro proveedor
> (Microsoft Outlook, CalDAV, etc.) sin modificar la interfaz.

## Current status

- `index.ts` exports `getCalendarProvider()` which returns a singleton.
- Today the singleton is a `NotImplementedProvider` that throws a clear error
  on every call. This is intentional: any production code path that tries to
  read or write events will fail loudly until a real provider is wired up.

## Phase 2 — Google Calendar

The planned Google implementation will live at:

```
lib/providers/calendar/google.ts

export class GoogleCalendarProvider implements CalendarProvider { ... }
```

`getCalendarProvider()` will then look like:

```ts
export function getCalendarProvider(): CalendarProvider {
  if (!cached) {
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CALENDAR_ID) {
      cached = new GoogleCalendarProvider({ /* oauth client, calendar id */ });
    } else {
      cached = new NotImplementedProvider();
    }
  }
  return cached;
}
```

No caller of `getCalendarProvider()` changes.

## Adding a new provider

1. Create `lib/providers/calendar/<name>.ts`.
2. Export a class that implements every method of `CalendarProvider`
   (see `lib/config/calendar.ts` for the contract).
3. Update `getCalendarProvider()` to branch on a feature flag or env var.
4. Add a one-line entry to the table below.

| Provider        | File                  | Status            |
| --------------- | --------------------- | ----------------- |
| _none (stub)_   | `types.ts`            | ✅ Active         |
| Google Calendar | `google.ts` (planned) | ⏳ Phase 2        |
| Microsoft Graph | _TBD_                 | 🔮 Future         |
| CalDAV          | _TBD_                 | 🔮 Future         |