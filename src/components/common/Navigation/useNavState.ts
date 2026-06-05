import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useScrollToSection } from "@/hooks/useScrollToSection";

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
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