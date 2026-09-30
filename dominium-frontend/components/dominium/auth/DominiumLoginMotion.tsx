"use client";

import Image from "next/image";
import { motion } from "motion/react";

const SCENE_IDLE = "/dominium/login-scan-idle.png";
const SCENE_VALID = "/dominium/login-scan-valid.png";

export function DominiumLoginMotion() {
  return (
    <section className="relative h-full overflow-hidden rounded-[var(--d-radius-xl)] border border-white/10 bg-[var(--d-terminal-bg)] shadow-[var(--d-shadow-strong)]">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-[var(--d-terminal-bg)]" />

      {/* Escena 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Escena 2 validada */}
      <motion.div
        initial={{ opacity: 0, scale: 1.018 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1.85,
          duration: 0.85,
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

      {/* Barrido de lectura entre ambas escenas */}
      <motion.div
        initial={{ opacity: 0, x: "-35%" }}
        animate={{
          opacity: [0, 1, 1, 0],
          x: ["-28%", "22%", "68%", "105%"],
        }}
        transition={{
          delay: 0.95,
          duration: 1.35,
          ease: "easeInOut",
          times: [0, 0.18, 0.78, 1],
        }}
        className="absolute inset-y-0 left-0 w-[28%] bg-[linear-gradient(90deg,transparent,rgba(224,162,47,0.88),transparent)] blur-[2px]"
      />

      {/* Oscurecimiento lateral para que el login real respire cuando aparezca */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.65, duration: 0.55, ease: "easeOut" }}
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(18,17,15,0.10)_48%,rgba(18,17,15,0.45)_100%)]"
      />

      {/* Pulso final sobrio */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 0.85, 0], scale: [0.9, 1.08, 1.18] }}
        transition={{ delay: 2.75, duration: 0.9, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--d-terminal-accent)]/35"
      />
    </section>
  );
}
