import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import Index from "./pages/Index";
import Navigation from "@/components/common/Navigation";

// Lazy-loaded pages — only Index is eagerly loaded (landing page)
const ProtectedRoute = lazy(() =>
  import("@/components/common/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })),
);
const Auth = lazy(() => import("./pages/Auth"));
const Register = lazy(() => import("./pages/Register"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminContactos = lazy(() => import("./pages/AdminContactos"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminForo = lazy(() => import("./pages/AdminForo"));
const AdminNovedades = lazy(() => import("./pages/AdminNovedades"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAteneos = lazy(() => import("./pages/AdminAteneos"));
const AdminSiteAudit = lazy(() => import("./pages/AdminSiteAudit"));
const AdminVitals = lazy(() => import("./pages/AdminVitals"));
const Ateneos = lazy(() => import("./pages/Ateneos"));
const AteneoDetail = lazy(() => import("./pages/AteneoDetail"));
const Nosotros = lazy(() => import("./pages/Nosotros"));
const Foro = lazy(() => import("./pages/Foro"));
const ForoDetail = lazy(() => import("./pages/ForoDetail"));
const ForoStats = lazy(() => import("./pages/ForoStats"));
const Novedades = lazy(() => import("./pages/Novedades"));
const NovedadDetail = lazy(() => import("./pages/NovedadDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,           // 1 min: avoids refetch when returning to Foro/Novedades
      gcTime: 5 * 60_000,          // keep cache 5 min after unmount
      refetchOnWindowFocus: false, // mobile users switch tabs constantly
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

/** Public layout: renders <Navigation /> once and keeps it mounted across
 *  public route transitions. Prevents the nav from remounting (and the logo
 *  from being reparsed) every time the user navigates between pages. */
const PublicLayout = () => (
  <>
    <Navigation />
    <Outlet />
  </>
);

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
              <Route path="/admin/contactos" element={<ProtectedRoute requireAdmin={true}><AdminContactos /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute requireAdmin={true}><AdminContent /></ProtectedRoute>} />
              <Route path="/admin/stats" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/foro" element={<ProtectedRoute requireAdmin={true}><AdminForo /></ProtectedRoute>} />
              <Route path="/admin/novedades" element={<ProtectedRoute requireAdmin={true}><AdminNovedades /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute requireAdmin={true}><AdminMedia /></ProtectedRoute>} />
              <Route path="/admin/ateneos" element={<ProtectedRoute requireAdmin={true}><AdminAteneos /></ProtectedRoute>} />
              <Route path="/admin/audit" element={<ProtectedRoute requireAdmin={true}><AdminSiteAudit /></ProtectedRoute>} />
              <Route path="/admin/vitals" element={<ProtectedRoute requireAdmin={true}><AdminVitals /></ProtectedRoute>} />
              {/* Public routes share a global Navigation that never remounts */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<ProtectedRoute requireAuth={true}><Profile /></ProtectedRoute>} />
                <Route path="/ateneos" element={<Ateneos />} />
                <Route path="/ateneos/:id" element={<AteneoDetail />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/foro" element={<Foro />} />
                <Route path="/foro/:id" element={<ForoDetail />} />
                <Route path="/foro/stats" element={<ProtectedRoute requireAdmin={true}><ForoStats /></ProtectedRoute>} />
                <Route path="/novedades" element={<Novedades />} />
                <Route path="/novedades/:slug" element={<NovedadDetail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
