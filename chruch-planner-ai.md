# Church Planner AI
## Product Requirements Document (PRD)

Version: 2.0

---

# Objetivo

Desarrollar una plataforma web para administrar todas las actividades de la iglesia.

El sistema permitirá:

- visualizar actividades
- crear actividades mediante IA
- administrar actividades manualmente
- detectar conflictos de horario
- enviar notificaciones
- centralizar la planificación de todos los ministerios

La aplicación deberá ser extremadamente simple de mantener y preparada para crecer.

---

# Problema

Actualmente cada ministerio organiza actividades sin conocer las demás.

Como consecuencia:

- dos eventos se cruzan
- se reservan los mismos horarios
- los miembros deben elegir entre actividades
- la planificación es difícil

La aplicación resolverá este problema.

---

# Objetivos

✔ Calendario único

✔ Todos los ministerios visibles

✔ Evitar conflictos

✔ Administración sencilla

✔ IA para registrar eventos

✔ Notificaciones Push

✔ Acceso público

---

# Arquitectura

                Telegram

                    │

                    ▼

              Bot Telegram

                    │

                    ▼

                   n8n

                    │

             LLM (gratuito)

                    │

                    ▼

              Google Calendar

                    ▲

                    │

             Google Calendar API

                    ▲

                    │

              Next.js 15

      ┌─────────────────────────┐

      │ UI                      │

      │ API Routes              │

      │ Google OAuth            │

      │ Server Actions          │

      └─────────────────────────┘

---

# Stack

Frontend

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- FullCalendar
- shadcn/ui

Backend

- API Routes
- Server Actions

NO usar:

- Express
- NestJS
- .NET

---

Automatización

- n8n
- Telegram
- Google Calendar MCP
- IA gratuita

---

Infraestructura

- VPS Ubuntu
- Docker Compose
- Nginx
- HTTPS

---

# Roles

## Visitante

No necesita iniciar sesión.

Puede:

- Ver calendario
- Buscar eventos
- Filtrar ministerios
- Activar notificaciones

No puede editar.

---

## Administrador

Login Google.

Lista blanca de correos.

Puede:

Crear

Editar

Eliminar

---

# Ministerios

Los eventos pertenecerán a un ministerio.

Ejemplo

- Cultos
- Jóvenes
- Música
- Conquistadores
- Aventureros
- Dorcas
- Evangelismo
- Escuela Sabática

Cada ministerio tendrá:

- color
- icono
- nombre

---

# Calendario

Se utilizará UN SOLO calendario Google.

Nombre sugerido

Eventos Iglesia

Todos los eventos vivirán allí.

Los ministerios NO serán calendarios distintos.

Serán categorías.

---

# Flujo IA

Usuario

↓

Telegram

↓

n8n

↓

LLM interpreta

↓

Crear evento Google

---

# Flujo Manual

Administrador

↓

Nuevo Evento

↓

Formulario

↓

Verificar conflictos

↓

Guardar

↓

Google Calendar

---

# Detección de conflictos

Antes de guardar:

Consultar Google Calendar.

Buscar eventos que se crucen.

Si existe conflicto:

Mostrar

⚠ Existe otra actividad.

Ejemplo

Culto Jóvenes

18:00 - 20:00

El administrador podrá

Cancelar

Modificar horario

Guardar igualmente

Nunca bloquear.

Solo advertir.

---

# Colores

Cada ministerio tendrá un color.

Ejemplo

Cultos

Azul

Jóvenes

Verde

Música

Morado

Conquistadores

Naranja

---

# Vista Calendario

Mes

Semana

Día

Agenda

---

# Evento

Título

Descripción

Ministerio

Fecha

Hora inicio

Hora fin

Lugar

Responsable

---

# Notificaciones Push

Sin registro.

Sin cuentas.

Solo permiso navegador.

Al ingresar

¿Deseas recibir notificaciones?

Aceptar

Guardar Push Subscription.

---

# Preferencias

Cada visitante podrá elegir.

☑ Cultos

☑ Jóvenes

☑ Música

☐ Conquistadores

☐ Dorcas

---

Tiempo aviso

5 min

15 min

30 min

1 hora

Solo nuevos eventos

---

# Base de datos

NO almacenar eventos.

Los eventos viven únicamente en Google Calendar.

La BD almacenará únicamente

Push Subscriptions

Preferencias

Configuración

---

Tablas

push_subscriptions

id

endpoint

p256dh

auth

preferences_json

minutes_before

created_at

updated_at

---

# API

GET /api/events

GET /api/events/:id

POST /api/events

PUT /api/events/:id

DELETE /api/events/:id

---

Push

POST /api/push/subscribe

PUT /api/push/preferences

DELETE /api/push/unsubscribe

---

# Seguridad

Google OAuth

Lista blanca administradores

No usuarios locales

No contraseñas

---

# Docker

Servicios

nginx

nextjs

n8n

sqlite

---

# Roadmap

Fase 1

Infraestructura

VPS

Docker

Nginx

HTTPS

---

Fase 2

Google OAuth

Google Calendar

---

Fase 3

Calendario público

---

Fase 4

CRUD

---

Fase 5

Bot Telegram

IA

---

Fase 6

Notificaciones Push

---

Fase 7

Detección conflictos

---

Fase 8

Pulido

Responsive

Dark Mode

Logs

---

# Futuro

Notificaciones Telegram

Email

WhatsApp

Google Meet

Eventos recurrentes

Archivos

Reserva de salones

Reserva de equipos

Reserva de vehículos

Dashboard

Estadísticas

IA que sugiera horarios

IA que detecte conflictos automáticamente

IA que reorganice actividades

---

# Principios

- Simplicidad primero.
- Google Calendar es la fuente oficial de los eventos.
- Next.js concentra toda la aplicación.
- n8n concentra toda la automatización.
- Los visitantes nunca crean cuentas.
- Solo los administradores usan Google OAuth.
- El sistema debe ser modular y escalable.
- Toda la lógica de negocio debe estar desacoplada de Google Calendar para permitir, en el futuro, reemplazar Google Calendar por otro proveedor (Microsoft Outlook, CalDAV, etc.) sin modificar la interfaz.