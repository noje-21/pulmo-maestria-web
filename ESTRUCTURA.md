# 📁 Estructura del Proyecto — Maestría CP 2026

> Última actualización: 2026-06-05 (Fase 6 del roadmap técnico).

## 🎯 Arquitectura actual
Estructura **híbrida** organizada por responsabilidad y dominio:

- **`components/common/`** — componentes reutilizables transversales (Navigation, SEO, ProtectedRoute, ImageLazy, NotificationBell…).
- **`components/sections/`** — secciones del landing, autocontenidas (Hero, HeroFlyer, Maestria, Ejes, Galeria, Contacto…). Las grandes están agrupadas en carpetas (`HeroFlyer/`, `Contacto/`).
- **`components/ui/`** — shadcn/ui (base).
- **`features/`** — lógica de negocio por dominio:
  - `admin/` — layout y sidebar del panel.
  - `forum/` — hooks (`useForumPosts`, `useForumPost`), helpers, tipos y sub-componentes (`ForumPostCard`, `CommentItem`).
  - `novedades/` — hooks (`useNovedades`, `useNovedad`), tipos y `NovedadCard` / `NovedadFeatured`.
  - `ateneos/` — hooks (`useAteneosList`, `useAteneo`), helpers y `AteneoCard` / `AteneoFeatured`.
- **`pages/`** — rutas (BrowserRouter). `Index` se carga eager; el resto vía `React.lazy` con Suspense.
- **`hooks/`** — hooks globales (`use-mobile`, `useScrollToSection`, `useScrollDirection`, `use-toast`).
- **`integrations/supabase/`** — cliente y tipos autogenerados (no editar).
- **`lib/`** — utilidades puras: `utils`, `logger`, `vitals`, `imageCdn`, `uploadCv`, `videoSource`, `videoMetrics`.
- **`assets/`** — imágenes organizadas por uso (`experts/`, `gallery/`, `sections/`).
- **`types/`** — declaraciones globales y módulos sin tipos.
- **`test/setup.ts`** — bootstrap de Vitest + RTL.

```text
src/
├── components/{common,sections,ui}
├── features/{admin,forum,novedades,ateneos}
├── pages/
├── hooks/
├── integrations/supabase/
├── lib/{logger,utils,vitals,imageCdn,...}
├── assets/{experts,gallery,sections}
├── styles/animations.css
├── types/
└── test/setup.ts
supabase/{functions,migrations}
scripts/generate-sitemap.ts
public/{robots.txt,sitemap.xml,og-image.jpg}
```

## 🧱 Backend (Lovable Cloud / Supabase)
- **Tablas clave:** `profiles`, `user_roles`, `forum_posts`, `forum_comments`, `forum_post_tags`, `tags`, `novedades`, `novedad_tags`, `ateneos`, `post_reactions`, `notifications`, `contact_submissions`, `contact_rate_limits`, `media_files`, `site_content`, `web_vitals`, `audit_log`.
- **Seguridad:** RLS habilitado en todas las tablas. Roles centralizados en `user_roles` + función `is_admin()` security-definer.
- **Edge functions:** `submit-contact`, `reply-contact`, `get-cv-url`, asistente IA, etc.
- **Almacenamiento:** buckets `forum-images`, `email-assets`, `site-images` (públicos) y `cvs` (privado, acceso vía URL firmada).
- **Mantenimiento:** `prune_web_vitals(_days)` + cron diario (pg_cron) limpia métricas > 30 días. `admin_stats()` agrega contadores para el dashboard.

## 🛠️ Calidad técnica (Fase 6)
- **TypeScript:** `noImplicitAny: true` activo. `strictNullChecks` queda pendiente (5 puntos a resolver, documentados en el plan).
- **ESLint:** advertencias activas para `no-unused-vars` (prefijo `_` ignorado), `react-hooks/exhaustive-deps` y `no-console` (permitidos `warn`/`error`). Logger, tests y scripts exentos de `no-console`.
- **Logger central:** `src/lib/logger.ts`. Reemplazar `console.log` por `logger.debug` (silencioso en producción) o `logger.warn` / `logger.error`. Activación manual en prod: `localStorage.setItem('debug','1')`.
- **Testing:** Vitest + Testing Library. Tests existentes para `Navigation`, `Contacto`, `ReservarPopup`, `Galeria/*` y `lib/logger`. Convención: `*.test.ts(x)` colocado junto al sujeto o en `__tests__/`.
- **CI:** GitHub Actions ejecuta lint + typecheck + build + tests.

## 📐 Guías para mantener el orden
- Componente reutilizable global → `components/common/`.
- Componente de una feature → `features/<dominio>/components/`.
- Sección del landing → `components/sections/<Nombre>/`.
- UI base (shadcn) → `components/ui/`.
- Hook reutilizable global → `hooks/`. Hook de dominio → `features/<dominio>/hooks/`.
- Utilidad pura → `lib/`.
- Asset estático → `assets/<categoría>/`.
- Nueva ruta → `pages/<Nombre>.tsx` (PascalCase) + registrar en `App.tsx` con `React.lazy`.
- Cambio de schema → nueva migración en `supabase/migrations/` (nunca editar las existentes).

## 🚦 Convenciones operativas
- Navegación con BrowserRouter (sin hash).
- CTAs activos solo en HeroFlyer, modales de testimonios y CTA Final.
- Animaciones con Framer Motion, GPU-friendly.
- Mobile nav: overlay 100dvh, z-[101].
- Imágenes: lazy nativo + `srcset`. Sin `vite-imagetools`.
