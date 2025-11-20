import { useNavigate, useLocation } from "react-router-dom";

export const useScrollToSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Si ya estamos en la página principal, solo hacer scroll
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Si estamos en otra página, navegar primero a la principal y luego hacer scroll
      navigate("/");
      // Usar setTimeout para asegurar que la navegación se complete antes del scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return scrollToSection;
};
