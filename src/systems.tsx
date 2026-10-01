import { useEffect, useRef, useState } from "react";
import {
  Accessibility, ArrowLeft, ArrowUpRight, BarChart3, Bot, BookOpen, Boxes, FileCode, GitBranch,
  Layers, X,
} from "lucide-react";
import { Reveal, scrollTo } from "./blocks";
import { projects, CV, EMAIL } from "./data";

/* ------------------------------------------------------------------ */
/* shared micro-data                                                   */
/* ------------------------------------------------------------------ */

const COLOR_TOKENS = [
  { name: "--bg", value: "#faf9f6", use: "App ground — warm ivory" },
  { name: "--panel", value: "#ffffff", use: "Cards, tables, inputs" },
  { name: "--ink", value: "#16181d", use: "Primary text, dark surfaces" },
  { name: "--body", value: "#4c515a", use: "Body copy" },
  { name: "--muted", value: "#62676f", use: "Metadata, labels" },
  { name: "--accent", value: "#e4572e", use: "Interaction + emphasis only" },
  { name: "--ok", value: "#15803d", use: "Success / verified" },
  { name: "--warn", value: "#b45309", use: "Review / attention" },
  { name: "--err", value: "#b91c1c", use: "Error / destructive" },
  { name: "--line", value: "#e6e3db", use: "Hairlines, dividers" },
];

const SPACE_TOKENS = [
  ["--space-1", "8px"], ["--space-2", "16px"], ["--space-3", "24px"], ["--space-4", "32px"],
  ["--space-5", "40px"], ["--space-6", "48px"], ["--space-8", "80px"], ["--space-10", "128px"],
];

const MOTION_TOKENS = [
  { name: "--dur-fast", value: "160ms", use: "Hover, focus, chips" },
  { name: "--dur-norm", value: "240ms", use: "Tabs, panels, modals in" },
  { name: "--dur-slow", value: "420ms", use: "Page-level reveals, overlays" },
  { name: "--ease", value: "cubic-bezier(.16,1,.3,1)", use: "Shared out-expo curve" },
];

const TYPE_ROWS = [
  { label: "Display", cls: "sys-t-display", spec: "clamp 40–66 · Bricolage · -3.5% · 750", sample: "Systems that scale" },
  { label: "H2", cls: "sys-t-h2", spec: "clamp 28–44 · Bricolage · 750", sample: "Section heading" },
  { label: "H3", cls: "sys-t-h3", spec: "clamp 20–26 · Inter · 700", sample: "Card / component heading" },
  { label: "Body", cls: "sys-t-body", spec: "16px · Inter · 1.6", sample: "Working interfaces carry real content, written for the person acting on it." },
  { label: "Caption", cls: "sys-t-cap", spec: "12.5px · mono · +14%", sample: "EVIDENCE · CV-DOCUMENTED" },
];

const BUTTON_STATES = [
  { cls: "", label: "Default" },
  { cls: "is-hover", label: "Hover" },
  { cls: "is-pressed", label: "Pressed" },
  { cls: "is-disabled", label: "Disabled" },
  { cls: "is-loading", label: "Loading" },
  { cls: "is-destructive", label: "Destructive" },
];

const INPUT_STATES = [
  { cls: "", label: "Default", text: "Search suppliers…", hint: null },
  { cls: "is-focus", label: "Focus", text: "Northwind", hint: null },
  { cls: "", label: "Filled", text: "Northwind Parts", hint: null },
  { cls: "is-error", label: "Error", text: "INV-404", hint: "No matching purchase order" },
  { cls: "is-success", label: "Success", text: "PO-2319 verified", hint: "Matched to supplier record" },
  { cls: "is-disabled", label: "Disabled", text: "Locked during review", hint: null },
];

const PATTERNS = [
  { name: "Search + filters", standard: "Chips, result count, empty state with reset", used: "Procurement supplier register" },
  { name: "Bulk actions", standard: "Selection model, action bar, progress feedback", used: "Reconciliation mismatch resolution" },
  { name: "Approval", standard: "Evidence beside decision, attributed outcome", used: "AI human-review loop" },
  { name: "Permissions", standard: "Role-based landing surfaces per job", used: "Procurement role IA — five families" },
  { name: "Onboarding", standard: "Staged asks, value before data entry", used: "Supplier intake flow" },
  { name: "Dashboards", standard: "Next action first, data second", used: "All four shipped platforms" },
];

const GOV = [
  { icon: Boxes, title: "Tokens as source of truth", desc: "Color, space, type and motion defined once; components reference tokens only.", code: "token → component → product" },
  { icon: BookOpen, title: "Documentation", desc: "Every component ships with states, usage rules and do/don't guidance.", code: "usage.md per component" },
  { icon: Accessibility, title: "Accessibility", desc: "44px targets, visible focus, WCAG-aware contrast audited at component level.", code: "WCAG 2.2 AA target" },
  { icon: GitBranch, title: "Versioning + contribution", desc: "Semantic versioning of the pattern library; contribution via critique loop.", code: "v-major.minor.patch" },
  { icon: FileCode, title: "Engineering parity", desc: "Specs written as code-adjacent tokens and props so implementation mirrors design.", code: "spec ≈ props API" },
  { icon: Layers, title: "Adoption", desc: "Patterns reused across five workflow families, four products and this site itself.", code: "evidence: 5 families" },
];

/* ------------------------------------------------------------------ */
/* homepage: AI-ready systems showcase                                 */
/* ------------------------------------------------------------------ */

const ARCHETYPES = [
  { n: "01", icon: GitBranch, t: "WORKFLOW SYSTEMS", line: "Complex processes → clear actions", d: "Procurement's five workflow families ship as one pattern system: role-based landing surfaces, guided reconciliation, next action first.", ev: "5 workflow families · 4 data-heavy surfaces", k: "procurement" },
  { n: "02", icon: BarChart3, t: "DECISION SYSTEMS", line: "Data → context → confident decisions", d: "Risk displayed beside cost, live underwriting milestones beside rates — dense data is only useful when the decision it serves is visible.", ev: "Documented 37% decision-time reduction", k: "mortgage" },
  { n: "03", icon: Bot, t: "AI EXPERIENCE SYSTEMS", line: "Human intent → AI assistance → human control", d: "Evidence and confidence shown beside every AI output; a person owns the approve, modify or reject call — attributed and auditable.", ev: "7-stage human-review loop, demonstrable below", k: "ai" },
  { n: "04", icon: Layers, t: "DESIGN SYSTEMS", line: "Patterns → governance → scalable delivery", d: "Tokens, components, states and documentation shared across products, platforms and this site itself — full documentation on this page.", ev: "Cross-platform: web · mobile · shared surfaces", k: "systems" },
];

const AI_FLOW = ["USER INTENT", "AI INTERPRETATION", "CONTEXT", "RECOMMENDATION", "USER CONTROL", "ACTION", "FEEDBACK"];

/* Independent concept — identity for shared workplaces. Not client work. */
const SHARED_FLOW = [
  { t: "Authenticate", d: "Badge tap at the device — no password entry on a shared surface." },
  { t: "Verify identity", d: "Factor strength and policy checked against role and location." },
  { t: "Access device", d: "Session opens with only the entitlements the role allows." },
  { t: "Perform task", d: "Work happens inside role-scoped apps; actions log to the session." },
  { t: "Session attribution", d: "Every action attributable to the worker, not the device account." },
  { t: "Handoff", d: "Timeout or tap-out closes the session cleanly for the next worker." },
  { t: "Audit trail", d: "Session, actions and factors recorded for compliance review." },
];

export function SharedWorkplaces() {
  return (
    <section className="demos" id="concept" aria-label="Independent concept — identity for shared workplaces">
      <div className="section-head">
        <Reveal><p className="kicker">INDEPENDENT CONCEPT — NOT CLIENT WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Identity for shared workplaces.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">An exploratory enterprise problem: how frontline workers sign in to shared devices without passwords — session-scoped, role-scoped and audit-ready. Illustrative UI, no production claims.</p></Reveal>
      </div>
      <Reveal>
        <div className="swp-grid">
          <ol className="swp-flow" aria-label="Shared-device identity flow">
            {SHARED_FLOW.map((s, i) => (
              <li key={s.t} className={i === SHARED_FLOW.length - 1 ? "end" : ""}>
                <span className="swp-step">{String(i + 1).padStart(2, "0")}</span>
                <div><b>{s.t}</b><p>{s.d}</p></div>
              </li>
            ))}
          </ol>
          <div className="swp-panel" role="img" aria-label="Shared-device login concept — badge tap, session scoped to role">
            <div className="swp-head"><b>Line 4 · Shared workstation</b><span className="ds-pill muted">Device W-114</span></div>
            <div className="swp-screen">
              <div className="swp-idle">
                <span className="swp-tap" aria-hidden="true"/>
                <b>Tap badge to begin</b>
                <small>Badge · NFC · PIN fallback</small>
              </div>
              <div className="swp-session">
                <div className="swp-session-head">
                  <span className="swp-avatar" aria-hidden="true">RM</span>
                  <div><b>R. Menon</b><small>Line lead · Shift A</small></div>
                  <span className="ds-pill ok">Session active</span>
                </div>
                <div className="swp-apps">
                  <span className="on">Line dashboard</span>
                  <span>Quality checks</span>
                  <span className="lock" aria-label="Locked — not in role">Maintenance</span>
                </div>
                <div className="swp-meta">
                  <span>Authenticated <b>Badge · 14:02</b></span>
                  <span>Entitlements <b>3 of 7 apps</b></span>
                  <span>Auto-lock <b>2:00 idle</b></span>
                </div>
              </div>
            </div>
            <p className="swp-note">Illustrative UI — demonstrates the interaction model, not a shipped product.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function AiSystems() {
  return (
    <section className="sysbuild" id="systems-build">
      <div className="section-head">
        <Reveal><p className="kicker">SYSTEMS I BUILD</p></Reveal>
        <Reveal delay={0.06}><h2>Systems built for humans —<br/><span className="accent-text">and readable by AI</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Four system archetypes, each traceable to shipped products — plus the interaction model that makes AI trustworthy inside them.</p></Reveal>
      </div>
      <div className="arch-list">
        {ARCHETYPES.map((a, i) => (
          <Reveal key={a.n} delay={i * 0.04}>
            <article className="arch-row">
              <span className="arch-num">{a.n}</span>
              <span className="arch-icon" aria-hidden="true"><a.icon size={20} strokeWidth={1.6}/></span>
              <div className="arch-main">
                <h3>{a.t} <em>{a.line}</em></h3>
                <p>{a.d}</p>
              </div>
              <span className="arch-ev">{a.ev}</span>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="aiflow-card">
          <div className="aiflow-head">
            <Bot size={16} aria-hidden="true"/>
            <b>AI EXPERIENCE — INTERACTION MODEL</b>
            <span className="aiflow-note">Confidence · explainability · control · fallback · approval · audit</span>
          </div>
          <ol className="aiflow" aria-label="AI interaction model">
            {AI_FLOW.map(s => (
              <li key={s} className={s === "USER CONTROL" ? "control" : ""}><i aria-hidden="true"/><b>{s}</b></li>
            ))}
          </ol>
        </div>
      </Reveal>
      <Reveal>
        <p className="aispec-note">The interactive pattern demos below put these models in your hands — including the human-review loop.</p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* /systems — full documentation overlay                               */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "foundations", label: "Foundations", group: "FOUNDATIONS" },
  { id: "components", label: "Components + states", group: "COMPONENTS" },
  { id: "patterns", label: "Patterns", group: "PATTERNS" },
  { id: "governance", label: "Governance", group: "GOVERNANCE" },
  { id: "ai-readiness", label: "AI readiness", group: "AI READINESS" },
];

export function SystemsPage({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("foundations");

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const root = pageRef.current; if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); openerRef.current?.focus?.(); };
  }, [onClose]);

  useEffect(() => {
    const root = pageRef.current; if (!root) return;
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) setActive(vis.target.id);
    }, { root, threshold: [0.15, 0.4] });
    root.querySelectorAll(".sys-sec").forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => {
    setActive(id);
    pageRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sys-page" ref={pageRef} role="dialog" aria-modal="true" aria-label="Design system documentation">
      <div className="sys-topbar">
        <span className="sys-topbar-title">Ajay Kumar — Design System</span>
        <span className="sys-topbar-right">
          <a className="btn btn-ghost btn-sm" href={CV} target="_blank" rel="noreferrer">Résumé</a>
          <button ref={closeRef} className="btn btn-primary btn-sm" onClick={onClose}>Back to portfolio</button>
          <button className="qv-close" style={{ position: "static" }} onClick={onClose} aria-label="Close design system page"><X size={16}/></button>
        </span>
      </div>
      <div className="sys-shell">
        <header className="sys-hero">
          <h1>One system across every product I design.</h1>
          <p>This documentation site is itself the evidence: the tokens, components, states and governance used inside my case studies — and used to build the portfolio you're reading.</p>
          <div className="sys-meta-row">
            <div><b>SCALE</b><span>5 workflow families · 4 products</span></div>
            <div><b>PLATFORMS</b><span>Web · Mobile · Shared surfaces</span></div>
            <div><b>GOVERNANCE</b><span>Tokens · States · Documentation</span></div>
            <div><b>AI</b><span>Spec-grounded assistance</span></div>
          </div>
        </header>
        <div className="sys-layout">
          <nav className="sys-nav" aria-label="Documentation sections">
            {NAV.map(n => (
              <button key={n.id} className={active === n.id ? "on" : ""} onClick={() => jump(n.id)} aria-current={active === n.id ? "true" : undefined}>{n.label}</button>
            ))}
          </nav>
          <div>
            <section className="sys-sec" id="foundations" aria-label="Foundations">
              <div className="sys-sec-head"><span className="esec-num">01</span><h2>Foundations</h2><p>Tokens are the contract between design and code. Every value below is used by the components on this site.</p></div>
              <div className="sys-block"><small>COLOR — SEMANTIC, NOT RAW</small>
                <table className="spec-table">
                  <thead><tr><th>Token</th><th>Value</th><th>Usage</th></tr></thead>
                  <tbody>
                    {COLOR_TOKENS.map(t => (
                      <tr key={t.name}>
                        <td><code>{t.name}</code></td>
                        <td><span className="swatch"><i style={{ background: t.value }} aria-hidden="true"/>{t.value}</span></td>
                        <td>{t.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sys-block"><small>TYPE — 5 STEPS, RESPONSIVE</small>
                <table className="spec-table">
                  <thead><tr><th style={{ width: 90 }}>Step</th><th>Spec</th><th>Sample</th></tr></thead>
                  <tbody>
                    {TYPE_ROWS.map(t => (
                      <tr key={t.label}>
                        <td>{t.label}</td>
                        <td><code>{t.spec}</code></td>
                        <td><span className={t.cls}>{t.sample}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sys-block"><small>SPACING — 8PX SCALE</small>
                <table className="spec-table">
                  <tbody>
                    {SPACE_TOKENS.map(([n, v]) => (
                      <tr key={n}><td><code>{n}</code></td><td style={{ width: 56 }}>{v}</td><td><i aria-hidden="true" style={{ display: "block", height: 8, borderRadius: 4, background: "var(--accent)", opacity: 0.75, width: v }}/></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sys-block"><small>MOTION — THREE DURATIONS, ONE CURVE</small>
                <table className="spec-table">
                  <tbody>
                    {MOTION_TOKENS.map(m => (
                      <tr key={m.name}><td><code>{m.name}</code></td><td style={{ width: 190 }}>{m.value}</td><td>{m.use}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="sys-note"><b>Grid:</b> 12 columns / 24px gutter on desktop, 8 on tablet, 4 on mobile. One 1280px container aligns every section on the homepage — verify it: nothing breaks alignment, including this page.</p>
            </section>

            <section className="sys-sec" id="components" aria-label="Components and states">
              <div className="sys-sec-head"><span className="esec-num">02</span><h2>Components + states</h2><p>States are designed, not discovered. Every component ships with its full state model before it enters a product.</p></div>
              <div className="ds-grid">
                <div className="ds-cell"><small>BUTTON — 6 STATES</small>
                  <div className="ds-col">
                    {BUTTON_STATES.map(b => <span key={b.label} className={`ds-btn primary ${b.cls}`}>{b.label}</span>)}
                  </div>
                </div>
                <div className="ds-cell wide"><small>INPUT — VALIDATION LADDER</small>
                  <div className="ds-col">
                    {INPUT_STATES.map(s => (
                      <div key={s.label}>
                        <span className={`ds-input ${s.cls}`}>{s.text}</span>
                        {s.hint && <p className={`ds-hint ${s.label === "Error" ? "err" : "ok"}`}>{s.hint}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ds-cell"><small>TABLE — SELECT + STATUS</small>
                  <table className="ds-table" aria-label="Table states specimen">
                    <thead><tr><th>Supplier</th><th>Risk</th><th>Status</th></tr></thead>
                    <tbody>
                      <tr><td>Northwind Parts</td><td>Low</td><td><span className="ds-pill ok">Active</span></td></tr>
                      <tr style={{ background: "var(--bg-2)" }}><td>Acme Services</td><td>Medium</td><td><span className="ds-pill warn">Review</span></td></tr>
                    </tbody>
                  </table>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                    <small style={{ color: "var(--muted)" }}>1–20 of 148</small>
                    <span className="ds-btn ghost" style={{ height: 28, fontSize: 11.5 }}>Next →</span>
                  </div>
                </div>
                <div className="ds-cell"><small>STATUS PILLS</small>
                  <div className="ds-pills"><span className="ds-pill ok">Verified</span><span className="ds-pill warn">In review</span><span className="ds-pill muted">Pending</span></div>
                  <small style={{ marginTop: 8 }}>NAVIGATION — ACTIVE STATE</small>
                  <div className="ds-navdemo"><i className="on">Overview</i><i>Suppliers</i><i>Spend</i></div>
                </div>
              </div>
              <p className="sys-note muted">Every state above is keyboard-operable with a visible focus ring; interactive targets hold 44px on touch.</p>
            </section>

            <section className="sys-sec" id="patterns" aria-label="Patterns">
              <div className="sys-sec-head"><span className="esec-num">03</span><h2>Patterns</h2><p>Patterns solve product problems once, so each surface inherits behavior instead of reinventing it.</p></div>
              <table className="spec-table">
                <thead><tr><th>Pattern</th><th>What it standardizes</th><th>Used in</th></tr></thead>
                <tbody>
                  {PATTERNS.map(p => (
                    <tr key={p.name}><td><b>{p.name}</b></td><td>{p.standard}</td><td>{p.used}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="sys-sec" id="governance" aria-label="Governance">
              <div className="sys-sec-head"><span className="esec-num">04</span><h2>Governance</h2><p>A system without governance is a sticker sheet. These are the operating rules.</p></div>
              <div className="gov-grid">
                {GOV.map(g => (
                  <div className="gov-card" key={g.title}>
                    <b><g.icon size={15} aria-hidden="true"/> {g.title}</b>
                    <span>{g.desc}</span>
                    <code>{g.code}</code>
                  </div>
                ))}
              </div>
            </section>

            <section className="sys-sec" id="ai-readiness" aria-label="AI readiness">
              <div className="sys-sec-head"><span className="esec-num">05</span><h2>AI readiness</h2><p>The system is written so an AI assistant can consume it — while humans keep the decisions.</p></div>
              <div className="sys-block"><small>THE PIPELINE</small>
                <table className="spec-table">
                  <tbody>
                    <tr><td><b>Token naming</b></td><td>Semantic and role-based — an assistant can infer correct usage from the name alone.</td></tr>
                    <tr><td><b>Component metadata</b></td><td>Props, states, a11y rules and usage constraints stored beside each component.</td></tr>
                    <tr><td><b>Promptable specifications</b></td><td>Specs structured so "create an approval state" resolves to real tokens, not vibes.</td></tr>
                    <tr><td><b>Design-to-code</b></td><td>Specs mirror a props API so engineering parity is checkable, not aspirational.</td></tr>
                    <tr><td><b>Human review</b></td><td>Every AI-generated artifact passes through an attributed approve / modify / reject call.</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="sys-note">The <button onClick={() => { onClose(); setTimeout(() => scrollTo("#systems-build"), 80); }} style={{ background: "none", border: 0, padding: 0, textDecoration: "underline", fontWeight: 650, color: "var(--ink)", cursor: "pointer" }}>Systems I build section</button> on the homepage shows the AI interaction model in context.</p>
            </section>

            <section className="sys-sec" aria-label="Where this system shipped">
              <div className="sys-sec-head"><span className="esec-num">06</span><h2>Where it shipped</h2><p>The same patterns, traceable to real products.</p></div>
              <table className="spec-table">
                <thead><tr><th>Product</th><th>System contribution</th><th>Platforms</th></tr></thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td><b>{p.short}</b></td>
                      <td>{p.systemRole}</td>
                      <td>{p.platforms.join(" · ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
                <button className="btn btn-primary" onClick={onClose}>Back to portfolio <ArrowLeft size={15}/></button>
                <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>Discuss the system <ArrowUpRight size={14}/></a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
