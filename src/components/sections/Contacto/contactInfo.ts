import { Facebook, Globe, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export interface ContactItem {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
}

export const contactInfo: ContactItem[] = [
  {
    icon: Phone,
    label: "WhatsApp CRF",
    value: "+54 9 11 5906-4234",
    href: "https://wa.me/5491159064234",
    highlight: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "magisterenhipertensionpulmonar@gmail.com",
    href: "mailto:magisterenhipertensionpulmonar@gmail.com",
  },
  { icon: Phone, label: "WhatsApp", value: "+57 300 414 2568", href: "https://wa.me/573004142568" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Hipertensión Pulmonar",
    href: "https://www.linkedin.com/in/hipertension-pulmonar-655a43253",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "Hipertensión Pulmonar",
    href: "https://www.facebook.com/share/16s5MUKG3C/?mibextid=wwXIfr",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@magisterenhipertensionpulmonar",
    href: "https://instagram.com/magisterenhipertensionpulmonar",
  },
  { icon: Globe, label: "Campus Virtual", value: "campus.maestriacp.com", href: "https://campus.maestriacp.com/" },
];