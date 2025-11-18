import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import useScrollDirection from "@/hooks/useScrollDirection";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminContactos from "./pages/AdminContactos";
import AdminContent from "./pages/AdminContent";
import AdminForo from "./pages/AdminForo";
import AdminNovedades from "./pages/AdminNovedades";
import AdminMedia from "./pages/AdminMedia";
import Foro from "./pages/Foro";
import ForoDetail from "./pages/ForoDetail";
import Novedades from "./pages/Novedades";
import NovedadDetail from "./pages/NovedadDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const direction = useScrollDirection();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <motion.div
                key="home"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <Index />
              </motion.div>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <Auth />
              </motion.div>
            } 
          />
          <Route 
            path="/register" 
            element={
              <motion.div
                key="register"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <Register />
              </motion.div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAuth={true}>
                  <Profile />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin/contactos" 
            element={
              <motion.div
                key="admin-contactos"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <AdminContactos />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin/content" 
            element={
              <motion.div
                key="admin-content"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <AdminContent />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin/foro" 
            element={
              <motion.div
                key="admin-foro"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <AdminForo />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin/novedades" 
            element={
              <motion.div
                key="admin-novedades"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <AdminNovedades />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/admin/media" 
            element={
              <motion.div
                key="admin-media"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ProtectedRoute requireAdmin={true}>
                  <AdminMedia />
                </ProtectedRoute>
              </motion.div>
            } 
          />
          <Route 
            path="/foro" 
            element={
              <motion.div
                key="foro"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <Foro />
              </motion.div>
            } 
          />
          <Route 
            path="/foro/:id" 
            element={
              <motion.div
                key="foro-detail"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <ForoDetail />
              </motion.div>
            } 
          />
          <Route 
            path="/novedades" 
            element={
              <motion.div
                key="novedades"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <Novedades />
              </motion.div>
            } 
          />
          <Route 
            path="/novedades/:slug" 
            element={
              <motion.div
                key="novedad-detail"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <NovedadDetail />
              </motion.div>
            } 
          />
          <Route 
            path="*" 
            element={
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: direction > 0 ? 50 : -50, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: direction > 0 ? -50 : 50, scale: 0.995 }}
                transition={{ duration: 0.45 }}
                className="min-h-screen"
              >
                <NotFound />
              </motion.div>
            } 
          />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
