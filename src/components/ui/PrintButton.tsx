"use client";

import { Printer } from "lucide-react";

/**
 * Opens the browser's print dialog, which is also its Save as PDF.
 *
 * Hidden in the printed output — a "Print" button in a PDF is noise.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-line-hi hover:text-ink print:hidden"
    >
      <Printer className="size-4" />
      Print / Save as PDF
    </button>
  );
}
