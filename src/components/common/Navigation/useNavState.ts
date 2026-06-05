import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollToSection } from "@/hooks/useScrollToSection";

// Lazy-loaded to avoid pulling Supabase into the initial bundle.
// The Navigation component renders on first paint, but its auth lookup can
// wait until after the browser is idle.
const loadSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

/**
 * Owns navigation state: scroll-triggered translucent bg, mobile menu open
 * state with body-scroll lock, current Supabase user + admin role, and
 * the cross-route scroll-to-section helper.
 */
export function useNavState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = useScrollToSection();
  const isHomePage = location.pathname === "/";

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Throttled via rAF — sets state only when value actually changes
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled((prev) => {
          const next = window.scrollY > 20;
          return prev === next ? prev : next; // skip if no change
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    let cancelled = false;

    const init = async () => {
      const supabase = await loadSupabase();
      if (cancelled) return;

      const fetchRole = (userId: string) => {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single()
          .then(({ data }) => {
            if (!cancelled) setIsAdmin(data?.role === "admin");
          });
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (cancelled) return;
          setUser(session?.user ?? null);
          if (session?.user) fetchRole(session.user.id);
          else setIsAdmin(false);
        },
      );
      unsub = () => subscription.unsubscribe();
    };

    // Defer to idle so it never competes with first paint.
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const handle = ric ? ric(() => void init(), { timeout: 1500 }) : window.setTimeout(() => void init(), 200);

    return () => {
      cancelled = true;
      if (unsub) unsub();
      const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;
      if (ric && cic) cic(handle as number);
      else clearTimeout(handle as number);
    };
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const supabase = await loadSupabase();
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNavClick = useCallback(
    (section: string) => {
      setIsMenuOpen(false);
      // Small delay to ensure menu closes before scroll
      setTimeout(() => {
        if (isHomePage) {
          scrollToSection(section);
        } else {
          navigate(`/#${section}`);
        }
      }, 100);
    },
    [isHomePage, navigate, scrollToSection],
  );

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);

  return {
    isMenuOpen,
    isScrolled,
    isHomePage,
    user,
    isAdmin,
    navigate,
    handleLogout,
    handleNavClick,
    closeMenu,
    toggleMenu,
  };
}

export type NavStateApi = ReturnType<typeof useNavState>;