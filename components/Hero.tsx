"use client";

import { LeafIcon, ShieldIcon } from "@/components/icons";

export default function Hero() {
  function scrollToForm() {
    document
      .getElementById("journal-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      aria-label="Welcome to MindSpace"
      className="relative overflow-hidden px-5 py-16 sm:py-20 flex flex-col items-center text-center"
    >
      {/* Margin rule — the defining visual element of the Registers design */}
      <div
        className="absolute left-8 sm:left-12 top-0 bottom-0 w-px"
        style={{ background: "var(--margin-rule)" }}
        aria-hidden="true"
      />

      <div className="max-w-2xl rise">
        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5"
           style={{ color: "var(--ink-dim)" }}>
          For JEE · NEET · CUET · CAT · GATE · UPSC
        </p>

        {/* Headline — the only large text, set in ink */}
        <h1
          className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight"
          style={{ color: "var(--ink)" }}
        >
          A quiet place to put
          <br />
          <span style={{ color: "var(--marker)" }}>down the weight.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
           style={{ color: "var(--ink-second)" }}>
          Write one honest line about your day. MindSpace reads between them —
          surfacing what&apos;s draining you and handing back a calmer next step
          in seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToForm}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[48px]"
            style={{
              background: "var(--marker)",
              color: "var(--on-marker)",
            }}
          >
            <LeafIcon size={18} />
            Start writing
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[48px]"
            style={{
              borderColor: "var(--rule)",
              color: "var(--ink-second)",
            }}
          >
            How it works
          </a>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs"
           style={{ color: "var(--ink-dim)" }}>
          <ShieldIcon size={14} />
          Private by default · Verified Indian helplines built in
        </p>
      </div>
    </section>
  );
}
