import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { useContactForm } from "./useContactForm";

export const Contacto = () => {
  const api = useContactForm();

  return (
    <section
      id="contacto"
      className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Contáctanos</h2>
          <div className="section-divider" />
          <p className="section-subtitle">¿Tienes dudas? Escríbenos y te respondemos personalmente</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ContactForm api={api} />
          </div>

          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};