import { useNavigate, useLocation } from "react-router-dom";

export const useScrollToSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (sectionId: string) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname === "/") {
      doScroll();
      return;
    }

    navigate("/", { replace: false });
    setTimeout(() => doScroll(), 300);
  };
};
