import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "../../lib/api";
import { videoEmbedUrl } from "../../lib/format";

export default function VideoTour({ url, title }) {
  const { t } = useTranslation();
  const embed = videoEmbedUrl(url);

  return (
    <div className="video-frame">
      {embed ? (
        <iframe
          src={embed}
          title={`${t("productDetail.video")} — ${title}`}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video src={resolveMediaUrl(url)} controls preload="metadata" />
      )}
    </div>
  );
}
