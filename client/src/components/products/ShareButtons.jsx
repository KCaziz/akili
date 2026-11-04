import { useTranslation } from "react-i18next";

export default function ShareButtons({ title, price }) {
  const { t } = useTranslation();
  const url = window.location.href;
  const message = `${title} — ${price}\n${url}`;
  const canShareNatively = typeof navigator.share === "function";

  return (
    <div className="share-buttons">
      <span className="share-label">{t("share.label")}</span>
      <a
        className="share-btn share-whatsapp"
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <a
        className="share-btn share-facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        Facebook
      </a>
      {canShareNatively && (
        <button
          type="button"
          className="share-btn"
          onClick={() => navigator.share({ title, text: `${title} — ${price}`, url }).catch(() => {})}
        >
          {t("share.more")}
        </button>
      )}
    </div>
  );
}
