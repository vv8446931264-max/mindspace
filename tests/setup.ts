import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import type { AxeResults } from "axe-core";

// jest-axe's bundled matcher targets Jest's API; register a Vitest-native one.
expect.extend({
  toHaveNoViolations(received: AxeResults) {
    const violations = received.violations ?? [];
    const pass = violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "expected accessibility violations, but found none"
          : `expected no accessibility violations, found ${violations.length}:\n` +
            violations
              .map((v) => `  • [${v.id}] ${v.help} (${v.nodes.length} node(s))`)
              .join("\n"),
    };
  },
});

interface AxeMatchers {
  toHaveNoViolations(): void;
}

declare module "vitest" {
  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
}

// jsdom lacks matchMedia; AnalysisCard reads prefers-reduced-motion.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Reset DOM + localStorage between tests for isolation.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
