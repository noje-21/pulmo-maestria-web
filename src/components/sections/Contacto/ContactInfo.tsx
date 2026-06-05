import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { contactInfo } from "./contactInfo";

/** Right column with WhatsApp/email/social links. */
export function ContactInfo() {
  return (
    <Card className="card-base h-full bg-card">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Información de Contacto</h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {contactInfo.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 group ${
                item.highlight ? "bg-accent/5 border border-accent/20" : ""
              }`}
            >
              <div
                className={`p-2 sm:p-2.5 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 ${
                  item.highlight
                    ? "bg-accent/20 group-hover:bg-accent/30"
                    : "bg-accent/10 group-hover:bg-accent/20"
                }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="font-semibold text-foreground text-xs sm:text-sm">
                  {item.label}
                  {item.highlight && (
                    <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  )}
                </p>
                <p className="text-accent text-xs sm:text-sm truncate group-hover:text-accent/80 transition-colors">
                  {item.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}