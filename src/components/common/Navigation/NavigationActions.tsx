import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/common/NotificationBell";
import type { NavStateApi } from "./useNavState";

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

      <NotificationBell />

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