"use client";

import { useEffect, useState } from "react";
import { BriefcaseOpen } from "./BriefcaseOpen";

const SEEN_KEY = "woodzy_intro_seen";

/**
 * Gates the briefcase intro: plays once per browser session and is skipped
 * entirely when the visitor prefers reduced motion.
 */
export function LandingIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SEEN_KEY, "1");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setShow(true);
  }, []);

  if (!show) return null;
  return <BriefcaseOpen onDone={() => setShow(false)} />;
}
