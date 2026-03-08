import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import ScrollToTop from "@/components/common/ScrollToTop";
import Index from "./pages/Index";

// Lazy-loaded pages — only Index is eagerly loaded (landing page)
const Auth = lazy(() => import("./pages/Auth"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminContactos = lazy(() => import("./pages/AdminContactos"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminForo = lazy(() => import("./pages/AdminForo"));
const AdminNovedades = lazy(() => import("./pages/AdminNovedades"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Foro = lazy(() => import("./pages/Foro"));
const ForoDetail = lazy(() => import("./pages/ForoDetail"));
const ForoStats = lazy(() => import("./pages/ForoStats"));
const Novedades = lazy(() => import("./pages/Novedades"));
const NovedadDetail = lazy(() => import("./pages/NovedadDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute requireAuth={true}><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
            <Route path="/admin/contactos" element={<ProtectedRoute requireAdmin={true}><AdminContactos /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute requireAdmin={true}><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/stats" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/foro" element={<ProtectedRoute requireAdmin={true}><AdminForo /></ProtectedRoute>} />
            <Route path="/admin/novedades" element={<ProtectedRoute requireAdmin={true}><AdminNovedades /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute requireAdmin={true}><AdminMedia /></ProtectedRoute>} />
            <Route path="/foro" element={<Foro />} />
            <Route path="/foro/:id" element={<ForoDetail />} />
            <Route path="/foro/stats" element={<ForoStats />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/novedades/:slug" element={<NovedadDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
