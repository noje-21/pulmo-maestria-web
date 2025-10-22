import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireAuth = true,
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && requireAuth) {
        navigate(redirectTo);
        return;
      }

      if (session && requireAdmin) {
        const { data, error } = await supabase.rpc('is_admin', { 
          check_user_id: session.user.id 
        });
        
        if (error || !data) {
          navigate("/");
          return;
        }
      }

      setAuthorized(true);
    } catch (error) {
      navigate(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
