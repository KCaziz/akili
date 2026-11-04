import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Fait apparaître progressivement tout élément portant la classe `reveal` lorsqu'il entre
// dans l'écran. Un seul observateur pour tout le site ; le MutationObserver capte les
// éléments ajoutés après coup (contenus chargés depuis l'API). Les visiteurs ayant demandé
// moins d'animations voient tout immédiatement (géré en CSS via prefers-reduced-motion).
export default function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            intersection.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const observeAll = () => document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => intersection.observe(el));
    observeAll();
    const mutation = new MutationObserver(observeAll);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutation.disconnect();
    };
  }, [pathname]);

  return null;
}
