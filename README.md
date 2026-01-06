# Maestría Latinoamericana en Circulación Pulmonar 2025

Plataforma web profesional y moderna para la Maestría en Circulación Pulmonar, desarrollada con tecnologías de última generación y enfocada en la excelencia académica.

## 🆕 Mejoras Recientes (v2.0)

### 🎨 Identidad Visual Premium
- Sistema de design tokens centralizado en `index.css`
- Paleta premium: Deep Navy + Vibrant Coral
- Cards reutilizables con variantes (featured, accent, glass)
- Botones unificados con estados hover/focus/active
- Patrones visuales sutiles (mesh, dots, grid)

### 💬 Foro Vivo (Comunidad Real)
- **Indicadores de actividad**: "Activo hoy", "Hace X días"
- Estados visuales: hot (naranja), recent (verde), active (azul)
- Contador de respuestas destacado
- Badge "Popular" para posts con +5 comentarios
- Empty states con mensajes humanos y amigables

### 🏠 Landing con Storytelling Médico
- Problem statement en el Hero
- Propuesta de valor clara: "Transforma tu práctica clínica en 12 días"
- CTA Final con beneficios, social proof (+50 profesionales)
- Cards de evento con información clara

### ✨ Pulido Premium
- Microinteracciones refinadas
- Skeleton loaders profesionales
- Empty states con mensajes cercanos
- Transiciones suaves entre páginas

### 📱 Mobile UX Avanzado
- Navegación con drawer limpio
- Cards apiladas responsivas
- Touch targets optimizados (44px mínimo)
- Scroll cómodo sin elementos comprimidos

## 🌟 Características Principales

### UI/UX Premium
- **Diseño Profesional**: Estética académica moderna con jerarquía visual clara
- **Mobile-First**: Optimizado para dispositivos desde 320px hasta 4K
- **Animaciones Fluidas**: Micro-interacciones con Framer Motion
- **Dark Mode**: Soporte completo para tema oscuro

### Accesibilidad (WCAG 2.1)
- Skip links para navegación por teclado
- Aria labels en todos los elementos interactivos
- Contraste de colores optimizado
- Focus states visibles
- Navegación completa con teclado

### Rendimiento
- Lazy loading de imágenes y componentes
- Skeleton loaders para estados de carga
- Code splitting automático
- Optimización de assets

### Backend Integrado (Lovable Cloud)
- Autenticación de usuarios
- Base de datos para foro y novedades
- Almacenamiento de archivos
- Edge Functions para lógica personalizada

## 📋 URLs del Proyecto

- **Editor**: https://lovable.dev/projects/f314bbce-f9ba-4ff5-920c-3a4b0f21c369
- **Preview**: Disponible en el panel derecho del editor

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 18 + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Animaciones | Framer Motion |
| Backend | Lovable Cloud (Supabase) |
| Routing | React Router v6 |
| Build | Vite |
| Formularios | React Hook Form + Zod |
| Testing | Vitest + Testing Library |

## 📦 Instalación

### Prerequisitos

- Node.js 18+ - [Instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm o yarn

### Pasos de Instalación

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f314bbce-f9ba-4ff5-920c-3a4b0f21c369) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```bash
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>

# 2. Navegar al directorio
cd maestria-circulacion-pulmonar

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno (si no usas Lovable Cloud)
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 5. Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Preview del build de producción

# Testing
npm run test         # Ejecuta los tests con Vitest
npm run test:watch   # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de cobertura

# Calidad de Código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos de TypeScript
```

## 🧪 Testing

El proyecto utiliza Vitest y React Testing Library para testing:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Tests incluidos

- **Navigation**: Verifica funcionamiento del menú móvil y scroll a secciones
- **Contacto**: Valida formulario de contacto y mensaje de éxito accesible

## 🔐 Seguridad

### Variables de Entorno

⚠️ **IMPORTANTE**: Este proyecto usa **Lovable Cloud**, que gestiona automáticamente las variables de entorno de Supabase. El archivo `.env` es gestionado automáticamente y NO debe editarse manualmente.

Si clonas este proyecto para desarrollo local:

1. **NO** subas el archivo `.env` al repositorio
2. El `.gitignore` ya está configurado para ignorar archivos `.env`
3. Las variables de Supabase se gestionan automáticamente en Lovable Cloud
4. Para despliegues externos (Vercel, etc.), configura las variables en el panel de tu proveedor

### Claves Públicas vs Privadas

- ✅ `VITE_SUPABASE_URL` - Segura para el cliente
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY` - Segura para el cliente (anon key)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - **NUNCA** incluir en el cliente

## 🔄 CI/CD

El proyecto incluye GitHub Actions para integración continua:

```yaml
.github/workflows/ci.yml
```

### Pipeline de CI

Cada push y pull request ejecuta:

1. ✅ Instalación de dependencias
2. ✅ Linting (ESLint)
3. ✅ Type checking (TypeScript)
4. ✅ Tests (Vitest)
5. ✅ Build de producción

### Variables de Entorno en CI

Configura estos secrets en GitHub:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## 📁 Estructura del Proyecto

```
maestria-circulacion-pulmonar/
├── public/              # Archivos estáticos
│   ├── MAESTRIA_CP_2025.pdf
│   ├── video.mp4
│   └── ...
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── ui/        # Componentes de shadcn/ui
│   │   ├── sections/  # Secciones de la página principal
│   │   ├── SEO.tsx    # Componente para meta tags dinámicos
│   │   └── ...
│   ├── hooks/         # Custom hooks
│   ├── integrations/  # Integración con Supabase
│   ├── lib/           # Utilidades
│   ├── pages/         # Páginas de la aplicación
│   ├── styles/        # Estilos globales
│   ├── App.tsx        # Componente raíz
│   ├── main.tsx       # Entry point
│   └── index.css      # Estilos globales y design tokens
├── supabase/          # Configuración de Supabase
└── ...
```

## 🎨 Personalización de UI

### Design Tokens

Los colores y estilos principales se definen en `src/index.css`:

```css
:root {
  --primary: 211 85% 50%;      /* Azul profesional */
  --accent: 198 88% 48%;       /* Azul claro para CTAs */
  --background: 210 20% 98%;   /* Fondo claro */
  --foreground: 215 25% 15%;   /* Texto oscuro */
  /* ... más tokens */
}
```

### Componentes shadcn/ui

Los componentes UI están en `src/components/ui/` y pueden personalizarse directamente.

### Tailwind Config

Configuración adicional en `tailwind.config.ts` para extender el sistema de diseño.

## 🚀 Deployment

### Deployment con Lovable

1. Abre [Lovable Project](https://lovable.dev/projects/f314bbce-f9ba-4ff5-920c-3a4b0f21c369)
2. Click en **Share → Publish**
3. Tu app estará disponible en `*.lovable.app`

### Deployment con Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Variables de Entorno

Asegúrate de configurar estas variables:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 🔗 Dominio Personalizado

Para conectar un dominio personalizado:

1. Ve a **Project > Settings > Domains** en Lovable
2. Click en **Connect Domain**
3. Sigue las instrucciones para configurar DNS

[Más información sobre dominios personalizados](https://docs.lovable.dev/features/custom-domain)

## 🤝 Contribuir

Este proyecto acepta contribuciones. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios con mensajes descriptivos:
   - `feat(component): add new feature`
   - `fix(bug): correct navigation scroll`
   - `style(ui): improve responsive design`
   - `test(unit): add tests for Contact form`
4. Asegúrate de que pasen todos los tests: `npm run test`
5. Verifica el linting: `npm run lint`
6. Push a la rama (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request

### Commits Convencionales

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

## 📞 Soporte

Para preguntas o soporte:
- Email: magisterenhipertensionpulmonar@gmail.com
- WhatsApp: +57 300 414 2568

## 📄 Licencia

Copyright © 2025 Maestría en Circulación Pulmonar. Todos los derechos reservados.
