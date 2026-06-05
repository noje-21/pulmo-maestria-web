import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import type { NavStateApi } from "./useNavState";

// Lazy: NotificationBell pulls Supabase. Only renders for signed-in users,
// so we keep it out of the initial bundle entirely.
const NotificationBell = lazy(() => import("@/components/common/NotificationBell"));

/** Right-side desktop cluster: Admin button, NotificationBell, auth button. */
export function NavigationActions({ api }: { api: NavStateApi }) {
  const { isAdmin, isScrolled, user, navigate, handleLogout } = api;
  return (
    <>
      {isAdmin && (
        <Button
          onClick={() => navigate("/admin")}
          variant="outline"
          size="sm"
          className={`rounded-xl text-sm ${!isScrolled && "border-white/30 text-white hover:bg-white/10"}`}
        >
          Admin
        </Button>
      )}

      {user && (
        <Suspense fallback={null}>
          <NotificationBell />
        </Suspense>
      )}

      {user ? (
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className={`rounded-xl text-sm ${!isScrolled && "text-white hover:bg-white/10"}`}
        >
          Cerrar sesión
        </Button>
      ) : (
        <Button onClick={() => navigate("/auth")} size="sm" className="btn-accent rounded-xl text-sm px-4">
          Iniciar Sesión
        </Button>
      )}
    </>
  );
}