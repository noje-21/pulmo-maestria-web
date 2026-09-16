import { memo } from "react";
import { Mail, MessageCircle, Globe } from "lucide-react";
import logo from "@/assets/logo-maestria.webp";

export const CampaignFooter = memo(function CampaignFooter() {
  return (
    <footer className="bg-[hsl(229,80%,8%)] px-5 py-10 text-white/80 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Maestría Latinoamericana en Circulación Pulmonar"
            className="h-11 w-11 rounded-full bg-white object-contain p-1"
            width={44}
            height={44}
            loading="lazy"
          />
          <div>
            <p className="text-sm font-semibold text-white">
              Maestría Latinoamericana en Circulación Pulmonar
            </p>
            <p className="text-xs text-white/60">Buenos Aires, Argentina · Edición 2026</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            <a
              className="inline-flex items-center gap-2 hover:text-white"
              href="https://wa.me/5491159064234"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />+54 9 11 5906-4234
            </a>
          </li>
          <li>
            <a
              className="inline-flex items-center gap-2 break-all hover:text-white"
              href="mailto:magisterenhipertensionpulmonar@gmail.com"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              magisterenhipertensionpulmonar@gmail.com
            </a>
          </li>
          <li>
            <a
              className="inline-flex items-center gap-2 hover:text-white"
              href="https://www.maestriacp.com/"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              www.maestriacp.com
            </a>
          </li>
        </ul>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-xs text-white/50">
        © {new Date().getFullYear()} Maestría Latinoamericana en Circulación Pulmonar.
      </p>
    </footer>
  );
});
