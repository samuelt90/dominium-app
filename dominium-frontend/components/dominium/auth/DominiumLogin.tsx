"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DominiumEntryMotion } from "@/components/dominium/auth/DominiumEntryMotion";
import { DominiumLoginMotion } from "@/components/dominium/auth/DominiumLoginMotion";
import { DominiumLoginPanel } from "@/components/dominium/auth/DominiumLoginPanel";

export function DominiumLogin() {
  const router = useRouter();
  const [desktopReady, setDesktopReady] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDesktopReady(true);
    }, 3900);

    return () => window.clearTimeout(timer);
  }, []);

 function enterSystem() {
  window.localStorage.setItem("dominium-session", "active");

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (isDesktop) {
    router.push("/acceso");
    return;
  }

  setEntering(true);

  window.setTimeout(() => {
    router.push("/acceso");
  }, 1450);
}

  return (
    <main className="min-h-dvh overflow-hidden bg-[var(--d-bg)] text-[var(--d-text)]">
      <AnimatePresence>{entering && <DominiumEntryMotion />}</AnimatePresence>

      {/* MOBILE */}
      <section className="flex h-dvh flex-col p-4 lg:hidden">
        <DominiumLoginPanel onEnter={enterSystem} disabled={entering} />
      </section>

      {/* DESKTOP */}
      <section className="hidden h-dvh grid-cols-[1.08fr_0.92fr] gap-6 p-6 lg:grid">
        <DominiumLoginMotion />

        <div className="relative flex h-full items-center justify-center">
          <AnimatePresence mode="wait">
            {desktopReady && (
              <motion.div
                key="login-panel"
                initial={{ opacity: 0, x: 42, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 42, scale: 0.96 }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full max-w-[460px]"
              >
                <DominiumLoginPanel onEnter={enterSystem} disabled={entering} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
