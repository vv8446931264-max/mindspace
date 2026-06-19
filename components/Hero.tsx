"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainIcon,
  WindIcon,
  TargetIcon,
  SparkleIcon,
  ShieldIcon,
  LeafIcon,
} from "@/components/icons";

/**
 * Twilight 3D landing hero — "night into morning". A central breathing orb
 * (the product's box-breathing rhythm made literal) surrounded by floating
 * glass insight cards that parallax to the pointer in real 3D. Scrolling
 * descends out of the dark into the bright journaling workspace below.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enableParallax, setEnableParallax] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    setEnableParallax(!mq.matches && fine.matches);
  }, []);

  function handleMove(e: React.MouseEvent) {
    if (!enableParallax || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px, y: py });
  }

  function scrollToForm() {
    document
      .getElementById("journal-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Parallax helper: depth in [0..1], higher = moves more.
  const layer = (depth: number) => ({
    transform: `translate3d(${tilt.x * depth * -40}px, ${tilt.y * depth * -40}px, 0)`,
    transition: enableParallax ? "transform 0.25s ease-out" : undefined,
  });

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="Welcome to MindSpace"
      className="hero-night relative overflow-hidden min-h-screen flex items-center justify-center px-5 py-24"
      style={{ perspective: "1200px" }}
    >
      {/* star dust */}
      <div className="hero-stars pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* ── Floating glass insight cards (decorative, depth-sorted) ── */}
      <FloatCard
        className="drift-a left-[6%] top-[20%] hidden sm:flex"
        style={layer(1)}
        tint="from-[#5B8DEF]/30 to-[#7B6FE8]/10"
      >
        <TargetIcon size={16} className="text-[#9db8ff]" />
        <span>Trigger: mock-test scores</span>
      </FloatCard>

      <FloatCard
        className="drift-b right-[7%] top-[24%] hidden sm:flex"
        style={layer(0.7)}
        tint="from-[#52C9A0]/30 to-[#52C9A0]/5"
      >
        <WindIcon size={16} className="text-[#7fe6c4]" />
        <span>4-min breathing reset</span>
      </FloatCard>

      <FloatCard
        className="drift-c left-[3%] bottom-[8%] hidden lg:flex"
        style={layer(1.3)}
        tint="from-[#7B6FE8]/30 to-[#7B6FE8]/5"
      >
        <SparkleIcon size={16} className="text-[#c4bcff]" />
        <span>You showed up today. That counts.</span>
      </FloatCard>

      <FloatCard
        className="drift-a right-[4%] bottom-[9%] hidden lg:flex"
        style={layer(0.9)}
        tint="from-[#5B8DEF]/25 to-[#52C9A0]/10"
      >
        <ShieldIcon size={16} className="text-[#9db8ff]" />
        <span>Crisis-safe by design</span>
      </FloatCard>

      {/* ── Center column ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl" style={layer(0.25)}>
        {/* Breathing orb */}
        <div className="relative mb-10 grid place-items-center" aria-hidden="true">
          <span className="breathe-ring absolute w-40 h-40 rounded-full border border-[#7B6FE8]/40" />
          <span className="breathe-ring absolute w-40 h-40 rounded-full border border-[#5B8DEF]/40" style={{ animationDelay: "2s" }} />
          <span className="breathe relative grid place-items-center w-28 h-28 rounded-full bg-gradient-to-br from-[#5B8DEF] to-[#7B6FE8] text-white shadow-[0_0_60px_rgba(123,111,232,0.6)]">
            <BrainIcon size={44} />
          </span>
        </div>

        <p className="hero-fade-up text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#9db8ff] uppercase mb-5">
          For JEE · NEET · CUET · CAT · GATE · UPSC
        </p>

        <h1
          className="hero-fade-up text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]"
          style={{ animationDelay: "0.1s" }}
        >
          A quiet place to put
          <br />
          <span className="bg-gradient-to-r from-[#9db8ff] via-[#c4bcff] to-[#7fe6c4] bg-clip-text text-transparent">
            down the weight.
          </span>
        </h1>

        <p
          className="hero-fade-up mt-6 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl"
          style={{ animationDelay: "0.2s" }}
        >
          Write one honest line about your day. MindSpace reads between them —
          surfacing what&apos;s draining you and handing back a calmer next step
          in seconds.
        </p>

        <div
          className="hero-fade-up mt-9 flex flex-col sm:flex-row items-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={scrollToForm}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1B2150] font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-[#7B6FE8]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#161c44]"
          >
            <LeafIcon size={18} className="text-[#52C9A0]" />
            Start writing
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-200 font-semibold px-6 py-3.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            How it works
          </a>
        </div>

        {/* Trust line */}
        <p
          className="hero-fade-up mt-7 flex items-center gap-2 text-xs text-slate-400"
          style={{ animationDelay: "0.4s" }}
        >
          <ShieldIcon size={14} className="text-[#7fe6c4]" />
          Private by default · Verified Indian helplines built in
        </p>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToForm}
        aria-label="Scroll to start journaling"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg px-2 py-1"
      >
        <span className="text-[10px] uppercase tracking-widest">Begin</span>
        <span className="bob grid place-items-center w-6 h-9 rounded-full border border-white/30">
          <span className="block w-1 h-1.5 rounded-full bg-white/70" />
        </span>
      </button>

      {/* Bottom fade into the bright workspace below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(180deg, transparent, #eef2fb)" }}
        aria-hidden="true"
      />
    </section>
  );
}

function FloatCard({
  children,
  className = "",
  style,
  tint,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tint: string;
}) {
  return (
    <div className={`absolute z-[5] ${className}`} style={style} aria-hidden="true">
      <div
        className={`flex items-center gap-2 rounded-2xl border border-white/15 bg-gradient-to-br ${tint} backdrop-blur-md px-4 py-2.5 text-xs font-medium text-white/90 shadow-xl shadow-black/20`}
      >
        {children}
      </div>
    </div>
  );
}
