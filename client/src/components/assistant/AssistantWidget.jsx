import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../../lib/useSiteSettings";

const QUESTIONS = [
  { id: "buy", to: "/produits" },
  { id: "sell", to: "/vendre" },
  { id: "rent", to: "/demande" },
  { id: "estimate", to: "/contact" },
  { id: "documents", to: "/contact" },
  { id: "services", to: "/services" },
  { id: "nin" },
  { id: "contact", whatsapp: true },
];

const TYPING_DELAY_MS = 700;

export default function AssistantWidget() {
  const { t, i18n } = useTranslation();
  const { whatsappNumber } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing, open]);

  const askedIds = new Set(messages.filter((message) => message.from === "user").map((message) => message.questionId));
  const remaining = QUESTIONS.filter((question) => !askedIds.has(question.id));

  function ask(question) {
    if (typing) return;
    setMessages((prev) => [...prev, { from: "user", questionId: question.id }]);
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", questionId: question.id }]);
      setTyping(false);
    }, TYPING_DELAY_MS);
  }

  function restart() {
    clearTimeout(timerRef.current);
    setTyping(false);
    setMessages([]);
  }

  function renderAction(questionId) {
    const question = QUESTIONS.find((item) => item.id === questionId);
    const key = `assistant.questions.${questionId}.cta`;
    if (!i18n.exists(key)) return null;
    const label = t(key);
    if (question.whatsapp) {
      return <a className="assistant-cta" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">{label}</a>;
    }
    return <Link className="assistant-cta" to={question.to} onClick={() => setOpen(false)}>{label}</Link>;
  }

  return (
    <div className={`assistant ${open ? "assistant-open" : ""}`}>
      {open && (
        <section className="assistant-panel" aria-label={t("assistant.title")}>
          <header className="assistant-header">
            <div className="assistant-avatar" aria-hidden="true">A</div>
            <div className="assistant-heading">
              <strong>{t("assistant.title")}</strong>
              <span>{t("assistant.subtitle")}</span>
            </div>
            {messages.length > 0 && (
              <button type="button" className="assistant-restart" onClick={restart}>{t("assistant.restart")}</button>
            )}
          </header>

          <div className="assistant-body" ref={bodyRef}>
            <div className="assistant-msg assistant-msg-bot">{t("assistant.greeting")}</div>

            {messages.map((message, index) => (
              <div key={index} className={`assistant-msg assistant-msg-${message.from}`}>
                {t(`assistant.questions.${message.questionId}.${message.from === "user" ? "q" : "a"}`)}
                {message.from === "bot" && renderAction(message.questionId)}
              </div>
            ))}

            {typing && (
              <div className="assistant-msg assistant-msg-bot assistant-typing" aria-hidden="true">
                <span /><span /><span />
              </div>
            )}

            {!typing && remaining.length > 0 && (
              <div className="assistant-suggestions">
                {messages.length > 0 && <p className="assistant-suggestions-title">{t("assistant.otherQuestions")}</p>}
                {remaining.map((question) => (
                  <button key={question.id} type="button" className="assistant-chip" onClick={() => ask(question)}>
                    {t(`assistant.questions.${question.id}.q`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t("assistant.close") : t("assistant.open")}
        aria-expanded={open}
      >
        {open ? (
          <span className="assistant-launcher-icon">✕</span>
        ) : (
          <svg className="assistant-launcher-icon" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3C6.48 3 2 6.94 2 11.8c0 2.32 1.03 4.43 2.71 6L4 21l3.62-1.62c1.32.53 2.8.82 4.38.82 5.52 0 10-3.94 10-8.8S17.52 3 12 3Zm-4 9.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
