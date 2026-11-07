import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../../lib/useSiteSettings";

export default function WhatsAppFloat() {
  const { t } = useTranslation();
  const { whatsappNumber } = useSiteSettings();
  if (!whatsappNumber) return null;

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t("whatsapp.message"))}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t("whatsapp.floatLabel")}
      title={t("whatsapp.floatLabel")}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.5 1.8 6.4L3 29l7.2-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-4.3 1.1 1.1-4.2-.2-.4a10.4 10.4 0 0 1-1.6-5.4C5.4 9.8 10.2 5.1 16 5.1s10.6 4.7 10.6 10.5S21.8 26.1 16 26.1zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4 2.3 3.6 5.7 5c2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.6s.3-1.4.2-1.6-.3-.2-.6-.3z" />
      </svg>
    </a>
  );
}
