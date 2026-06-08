"use client";

import { useEffect, useState } from "react";
import { BriefcaseOpen } from "./BriefcaseOpen";

const SEEN_KEY = "woodzy_intro_seen";

/**
 * Holds the page blurred (via the `intro-active` class set pre-paint in the
 * layout) while the briefcase intro plays, then removes the class so the page
 * focuses in. Plays once per session; skipped for reduced-motion.
 */
export function RevealStage({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const clear = () => document.documentElement.classList.remove("intro-active");
    const seen = sessionStorage.getItem(SEEN_KEY) === "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sessionStorage.setItem(SEEN_KEY, "1");
    if (seen || reduce) {
      clear();
      return;
    }
    setShowIntro(true);
  }, []);

  const finish = () => {
    document.documentElement.classList.remove("intro-active");
    setShowIntro(false);
  };

  return (
    <>
      <div data-reveal>{children}</div>
      {showIntro && <BriefcaseOpen onDone={finish} />}
    </>
  );
}
