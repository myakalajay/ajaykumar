import React, { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, RotateCcw } from "lucide-react";
import App from "./App";
import "./index.css";

type BoundaryState = { hasError: boolean; error?: Error };

/**
 * Last-resort error boundary. Catches render-time crashes so visitors see a
 * clear recovery screen instead of a blank page.
 */
class GlobalErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Portfolio render error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "var(--bg, #faf9f6)",
          color: "var(--ink, #16181d)",
          fontFamily: "'Geist Variable', system-ui, sans-serif",
        }}
      >
        <section
          style={{
            maxWidth: 640,
            width: "100%",
            background: "var(--panel, #fff)",
            border: "1px solid var(--line, #e6e3db)",
            borderRadius: 16,
            padding: 32,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: "var(--bg-2, #f1efe9)",
              color: "var(--err, #b91c1c)",
              marginBottom: 16,
            }}
          >
            <AlertTriangle aria-hidden="true" />
          </div>
          <p
            style={{
              fontSize: 12,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--muted, #62676f)",
              margin: 0,
            }}
          >
            Something went wrong
          </p>
          <h1 style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: "-.02em", margin: "8px 0 12px" }}>
            The page hit an unexpected error.
          </h1>
          <p style={{ color: "var(--body, #4c515a)", lineHeight: 1.6, margin: 0 }}>
            Reloading usually fixes it. If it keeps happening, please share the error below.
          </p>
          <pre
            style={{
              background: "var(--bg-2, #f1efe9)",
              padding: 16,
              borderRadius: 12,
              overflow: "auto",
              fontSize: 13,
              marginTop: 16,
            }}
          >
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              minHeight: 44,
              padding: "0 20px",
              border: 0,
              borderRadius: 10,
              background: "var(--accent, #e4572e)",
              color: "#fff",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} aria-hidden="true" /> Reload portfolio
          </button>
        </section>
      </main>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
