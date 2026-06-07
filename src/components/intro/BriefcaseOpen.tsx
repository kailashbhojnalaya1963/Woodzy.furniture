"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * Wooden briefcase opening intro: dark stage → lid swings up / tray drops with
 * warm light → the W mark rises blur→crisp → fades out into the page.
 */
export function BriefcaseOpen({
  onDone,
  autoDismissMs = 3000,
}: {
  onDone?: () => void;
  autoDismissMs?: number;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs]);

  return (
    <AnimatePresence onExitComplete={() => onDone?.()}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#140a04] cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          onClick={() => setShow(false)}
          role="dialog"
          aria-label="Woodzy intro — tap to enter"
        >
          {/* warm light spilling out */}
          <motion.div
            className="absolute size-[70vmax] rounded-full"
            style={{ background: "radial-gradient(circle, #c47a2c55, transparent 60%)" }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.35 }}
          />

          <div className="relative" style={{ perspective: "900px" }}>
            {/* lid */}
            <motion.div
              className="w-60 h-28 rounded-t-2xl mx-auto origin-bottom"
              style={{
                background: "linear-gradient(#9a6230, #6b3e1d)",
                boxShadow: "inset 0 3px 0 #c47a2c66, inset 0 0 0 2px #14100a55",
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -155 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* revealed logo */}
            <motion.div
              className="absolute inset-x-0 top-2 grid place-items-center"
              initial={{ opacity: 0, filter: "blur(14px)", y: 24 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: -34 }}
              transition={{ duration: 0.9, delay: 1.0, ease: "easeOut" }}
            >
              <Logo variant="stacked" size={66} light />
            </motion.div>

            {/* case body / tray */}
            <motion.div
              className="relative w-60 h-24 rounded-b-2xl mx-auto -mt-1"
              style={{
                background: "linear-gradient(#8a5526, #5c3617)",
                boxShadow: "0 24px 50px #000a, inset 0 0 0 2px #14100a55",
              }}
              initial={{ y: 0 }}
              animate={{ y: 12 }}
              transition={{ duration: 1.0, delay: 0.35 }}
            >
              <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-9 h-3 rounded bg-amber-brand shadow" />
            </motion.div>
          </div>

          <motion.p
            className="absolute bottom-14 text-sand/60 text-xs tracking-[0.35em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            tap to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
