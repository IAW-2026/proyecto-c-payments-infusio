# AGENTS.md — Payments App

## Stack
- Next.js (App Router)
- PostgreSQL con Prisma
- Clerk para autenticación
- Mercado Pago SDK (sandbox)
- Tailwind CSS
- Deploy en Vercel

## Convenciones
- Nombres de archivos y variables en inglés
- Rutas de API bajo `/api/payments/`
- Usar inglés para todo el código, comentarios incluidos

## Base de datos
- ORM: Prisma
- Entidades: `PaymentOrder`
- No modificar el schema sin actualizar `prisma/schema.prisma`

## Variables de entorno
- Nunca hardcodear credenciales
- Usar `.env.local` en desarrollo
- Ver `.env.example` para las variables requeridas

## Restricciones
- No tocar archivos de otras apps
- Los mocks de APIs externas van en `/mocks/`
- El webhook de Mercado Pago se recibe en `POST /api/payments/webhook`

## TypeScript
- Tipado estricto en todo el proyecto (`strict: true` en `tsconfig.json`)
- No usar `any`, preferir `unknown` si el tipo es incierto
- Definir tipos e interfaces en archivos separados bajo `/types/`
- Tipar siempre los retornos de funciones y los props de componentes
- No usar `export default` para funciones, preferir named exports

## Componentes
- Máximo 100-150 líneas por componente o función
- Si un componente crece, extraer subcomponentes a archivos separados
- Un componente por archivo
- Lógica de negocio fuera del componente, en hooks o funciones utilitarias

## Testing
- Unitario: Vitest
- E2E: Playwright
- Integración: Testing Library