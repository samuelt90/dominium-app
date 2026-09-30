"use client";

import Image from "next/image";
import { motion } from "motion/react";

const SCENE_IDLE = "/dominium/login-scan-idle.png";
const SCENE_VALID = "/dominium/login-scan-valid.png";

export function DominiumEntryMotion() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--d-terminal-bg)] px-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(224,162,47,0.20),transparent_34%),radial-gradient(circle_at_82%_84%,rgba(86,160,109,0.14),transparent_36%)]" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[16/10] overflow-hidden rounded-[var(--d-radius-xl)] border border-white/10 bg-black shadow-[var(--d-shadow-strong)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={SCENE_IDLE}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.56,
              duration: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={SCENE_VALID}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: "-35%" }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: ["-30%", "20%", "70%", "105%"],
            }}
            transition={{
              delay: 0.22,
              duration: 0.82,
              ease: "easeInOut",
              times: [0, 0.18, 0.78, 1],
            }}
            className="absolute inset-y-0 left-0 w-[30%] bg-[linear-gradient(90deg,transparent,rgba(224,162,47,0.92),transparent)] blur-[2px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.28, ease: "easeOut" }}
          className="mx-auto mt-5 w-fit rounded-full border border-[var(--d-terminal-accent)]/35 bg-[var(--d-terminal-accent)]/15 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-[var(--d-terminal-accent)] backdrop-blur"
        >
          Acceso autorizado
        </motion.div>
      </div>
    </motion.section>
  );
}
