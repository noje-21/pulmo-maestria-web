# 📁 Estructura del Proyecto - Maestría CP 2025

## 🎯 Arquitectura Implementada
**Estructura Híbrida**: Componentes comunes + Features modulares

```
/src
├── assets/                    # Recursos estáticos organizados por sección
│   ├── experts/              # Imágenes de expertos
│   ├── gallery/              # Imágenes de galería
│   ├── sections/             # Imágenes de secciones
│   └── logo-maestria.jpg     # Logo principal
│
├── components/
│   ├── common/               # Componentes reutilizables globales
│   │   ├── Navigation.tsx
│   │   ├── GlobalLoader.tsx
│   │   ├── ImageLazy.tsx
│   │   ├── Popup.tsx
│   │   ├── SEO.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── AnimatedOnView.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Pagination.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── sections/             # Secciones específicas del landing
│   │   ├── Hero.tsx
│   │   ├── Maestria.tsx
│   │   ├── Expertos.tsx
│   │   ├── Eventos.tsx
│   │   ├── QuienesSomos.tsx
│   │   ├── Galeria.tsx
│   │   ├── Contacto.tsx
│   │   └── Footer.tsx
│   │
│   └── ui/                   # Componentes shadcn/ui
│       └── (multiple UI components)
│
├── features/                 # Features modulares por dominio
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── forum/
│       ├── ReactionButton.tsx
│       └── TagInput.tsx
│
├── pages/                    # Páginas/Rutas principales
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── Admin.tsx
│   ├── AdminContactos.tsx
│   ├── AdminContent.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminForo.tsx
│   ├── AdminNovedades.tsx
│   ├── AdminMedia.tsx
│   ├── Foro.tsx
│   ├── ForoDetail.tsx
│   ├── ForoStats.tsx
│   ├── Novedades.tsx
│   ├── NovedadDetail.tsx
│   └── NotFound.tsx
│
├── hooks/                    # Custom React hooks
│   ├── useScrollToSection.ts
│   ├── useScrollDirection.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── integrations/             # Integraciones externas
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── lib/                      # Utilidades generales
│   └── utils.ts
│
├── styles/                   # Estilos globales
│   └── animations.css
│
└── App.tsx                   # Router principal
└── main.tsx                  # Entry point
└── index.css                 # Estilos globales Tailwind
```

## 📋 Principios de Organización

### 1. **Componentes Comunes** (`/components/common/`)
Componentes reutilizables en todo el proyecto:
- Navegación y layout
- Loaders y skeletons
- SEO y optimizaciones
- Utilidades de imagen
- Protección de rutas

### 2. **Features Modulares** (`/features/`)
Funcionalidad específica agrupada por dominio:
- **admin/**: Componentes exclusivos del panel administrativo
- **forum/**: Componentes específicos del foro (reacciones, tags)

### 3. **Secciones** (`/components/sections/`)
Secciones completas del landing page, autocontenidas y especializadas.

### 4. **Assets Organizados** (`/assets/`)
Imágenes clasificadas por uso:
- experts/ → Fotos de equipo médico
- gallery/ → Galería de eventos
- sections/ → Imágenes de secciones específicas

## 🔄 Migraciones Realizadas

### Componentes Movidos:
- `Navigation.tsx` → `common/Navigation.tsx`
- `AdminSidebar.tsx` → `features/admin/AdminSidebar.tsx`
- `ReactionButton.tsx` → `features/forum/ReactionButton.tsx`
- `TagInput.tsx` → `features/forum/TagInput.tsx`
- Todos los componentes comunes → `common/`

### Imports Actualizados:
✅ App.tsx
✅ Todas las páginas Admin
✅ Páginas del Foro
✅ Páginas de Novedades
✅ Index.tsx

## 🚀 Ventajas de la Nueva Estructura

1. **Modularidad**: Cada feature tiene sus propios componentes
2. **Escalabilidad**: Fácil agregar nuevas features sin contaminar common/
3. **Claridad**: Ubicación predecible de archivos
4. **Mantenibilidad**: Componentes relacionados agrupados lógicamente
5. **Performance**: Mejor tree-shaking y code splitting

## 📝 Guías para Mantener el Orden

### Al agregar un nuevo componente:

**¿Es reutilizable globalmente?** → `/components/common/`
**¿Es específico de una feature?** → `/features/{feature-name}/`
**¿Es una sección completa del landing?** → `/components/sections/`
**¿Es UI base (shadcn)?** → `/components/ui/`

### Al agregar una nueva página:
Siempre en `/pages/` con nombre descriptivo en PascalCase.

### Al agregar assets:
Organizar por tipo y uso en `/assets/{category}/`

## 🎨 Diseño del Sistema

- **Design tokens**: `/src/index.css` y `tailwind.config.ts`
- **Componentes UI**: Todos en `/components/ui/` (shadcn)
- **Animaciones**: `/src/styles/animations.css`

---

**Última actualización**: 2025-11-28
**Mantenido por**: Equipo de Desarrollo Maestría CP