import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ScanSearch, Users, X } from "lucide-react";
import type { CaseMap, Hotspot, InsightCard, JourneyStage, ProtoFrame, Project } from "./data";
import { BrowserFrame, DesktopMock, MockScreen, PhoneFrame } from "./mocks";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Reveal({ children, delay = 0, className = "", y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduce) { setVal(to); return; }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(node);
    return () => obs.disconnect();
  }, [to, reduce]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export function SpotlightCard({ children, className = "", accent = "#ef6c2e" }: { children: ReactNode; className?: string; accent?: string }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  return (
    <div
      className={`spot-card ${className}`}
      style={{ "--spot-x": useTransform(sx, v => `${v}px`) as unknown as string, "--spot-y": useTransform(sy, v => `${v}px`) as unknown as string, "--spot-accent": accent } as React.CSSProperties}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
    >
      {children}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((x, i) => <span key={i}>{x}<i>✦</i></span>)}
      </div>
    </div>
  );
}

/* ------------------------------- journey map ------------------------------- */

function moodOf(v: number): { label: string; cls: string } {
  if (v >= 65) return { label: "positive", cls: "good" };
  if (v >= 45) return { label: "neutral", cls: "mid" };
  return { label: "strain", cls: "low" };
}

export function JourneyMap({ p }: { p: Project }) {
  const W = 600, H = 110;
  const pts = p.sentiment.map((v, i) => [(i / (p.sentiment.length - 1)) * W, H - 12 - (v / 100) * (H - 30)] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <div className="jm">
      <svg className="jm-curve" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={area} fill="url(#jmfill)"/>
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill="#fff" stroke="var(--accent)" strokeWidth="2.5"/>)}
        <defs>
          <linearGradient id="jmfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".18"/>
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="jm-stages" style={{ ["--accent" as string]: p.accent }}>
        {p.journey.map((s, i) => {
          const m = moodOf(p.sentiment[i]);
          return (
            <div className="jm-stage" key={s}>
              <span className="jm-dot"/><b>{String(i + 1).padStart(2, "0")} · {s}</b>
              <em className={`jm-mood ${m.cls}`}>{m.label} · {p.sentiment[i]}</em>
              <small>⚠ {p.pains[i]}</small>
            </div>
          );
        })}
      </div>
      <div className="case-pills subtle jm-actors">{p.actors.map(x => <span key={x}><Users size={12}/>{x}</span>)}</div>
    </div>
  );
}

/* ----------------------------- service blueprint --------------------------- */

interface BlueprintLane { front: [number, string, string][]; back: [number, string, string][]; support?: [number, string, string][]; }
export const blueprints: Record<string, BlueprintLane> = {
  "01": {
    front: [[0, "Compare rates", "Plain-language side-by-side"], [3, "Apply", "Guided forms, jargon-free"], [4, "Track status", "Live underwriting state"]],
    back: [[0, "Rate engine", "Eligibility + pricing rules"], [4, "Underwriting rules", "Decision paths + recovery"], [5, "Status events", "Milestones pushed to borrower"]],
    support: [[2, "Doc verification", "Third-party checks"], [4, "Ops review", "Underwriter queue"]]
  },
  "02": {
    front: [[0, "Supplier onboarding", "One intake, clear asks"], [2, "Spend dashboard", "Next action surfaced"], [3, "Reconcile", "Mismatch resolution flow"]],
    back: [[0, "Compliance rules", "Diversity + policy checks"], [3, "Data joins", "Supplier ↔ spend records"], [5, "Reporting jobs", "Scheduled aggregations"]],
    support: [[1, "Master data", "Supplier registry"], [5, "Finance systems", "ERP integration"]]
  },
  "03": {
    front: [[0, "Discover feed", "Language-first content"], [2, "Segment builder", "Audience definitions"], [3, "Campaign setup", "Targeting + budget states"]],
    back: [[0, "Behaviour pipeline", "Events → segments"], [1, "Serving rules", "Feed ranking"], [5, "Billing", "Monetisation ledger"]],
    support: [[2, "Content ops", "Editorial queues"], [4, "Ad platform", "Demand partners"]]
  },
  "04": {
    front: [[1, "Browse + evaluate", "Trust cues at decision points"], [3, "Cart", "Honest totals, no surprises"], [4, "Checkout", "State-explicit payment flow"]],
    back: [[4, "Pricing", "Totals + tax computation"], [3, "Inventory", "Availability + holds"], [4, "Payments", "Auth, capture, failure paths"]],
    support: [[5, "Fulfilment", "Warehouse + shipping"], [5, "Support", "Order-issue intake"]]
  }
};

export function ServiceBlueprint({ p }: { p: Project }) {
  const bp = blueprints[p.id];
  const [lane, setLane] = useState<"all" | "front" | "back">("all");
  const [dep, setDep] = useState<{ lane: string; title: string; note: string } | null>(null);
  const steps = p.journey;
  if (!bp) return null;
  const rows: { key: string; label: string; cls: string; items: ([number, string, string])[] }[] = [
    { key: "front", label: "FRONTSTAGE — what the user sees", cls: "front", items: bp.front },
    { key: "back", label: "BACKSTAGE — what the system does", cls: "back", items: bp.back },
    ...(bp.support ? [{ key: "support", label: "SUPPORT — what powers it", cls: "support", items: bp.support }] : [])
  ].map(r => ({ ...r, items: lane === "all" || lane === r.key ? r.items : [] }));
  return (
    <div className="sbp">
      <div className="sbp-toolbar">
        <p className="sbp-hint">Click a system dependency to see the design decision behind it.</p>
        <div className="sbp-toggle" role="group" aria-label="Blueprint lanes">
          {([["all", "All lanes"], ["front", "Frontstage"], ["back", "Backstage"]] as const).map(([k, label]) => (
            <button key={k} aria-pressed={lane === k} className={lane === k ? "on" : ""} onClick={() => setLane(k)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="sbp-scroll">
      <div className="sbp-grid" style={{ ["--accent" as string]: p.accent } as React.CSSProperties}>
        <div className="sbp-head" aria-hidden="true"><span/>
          {steps.map(s => <span key={s}>{s}</span>)}
        </div>
        {rows.map(r => (
          <div className={`sbp-row ${r.cls} ${r.items.length ? "" : "dim"}`} key={r.key}>
            <span className="sbp-label">{r.label}</span>
            <div className="sbp-cells">
              {steps.map((s, i) => {
                const item = r.items.find(([col]) => col === i);
                return item ? (
                  <button
                    key={s}
                    className="bp-step"
                    aria-expanded={dep?.title === item[1] && dep?.lane === r.cls}
                    onClick={() => dep?.title === item[1] && dep?.lane === r.cls ? setDep(null) : setDep({ lane: r.cls, title: item[1], note: item[2] })}
                  >
                    <b>{item[1]}</b><small>{item[2]}</small><span className="bp-pin" aria-hidden="true"/>
                  </button>
                ) : <span className="sbp-empty" key={s} aria-hidden="true"/>;
              })}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence initial={false}>
        {dep && (
          <motion.div className="dep-panel" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
            <div className="dep-copy">
              <b>{dep.lane === "front" ? "FRONTSTAGE" : dep.lane === "back" ? "BACKSTAGE" : "SUPPORT"} — {dep.title.toUpperCase()}</b>
              <p>{p.decisions[0]?.what ?? ""}</p>
            </div>
            <button className="dep-clear" onClick={() => setDep(null)} aria-label="Close dependency detail"><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------- evidence ---------------------------------- */

export function TestDonut({ rows }: { rows: [string, string, string][] }) {
  const counts = rows.reduce((acc, r) => {
    const k = r[2].startsWith("Measured") ? "measured" : r[2].startsWith("Test") ? "plan" : "documented";
    acc[k] += 1; return acc;
  }, { measured: 0, plan: 0, documented: 0 });
  const total = rows.length || 1;
  const segs = (["measured", "documented", "plan"] as const).map(k => ({ k, frac: counts[k] / total }));
  const R = 42, C = 2 * Math.PI * R;
  let offset = 0;
  const colors: Record<string, string> = { measured: "#0d9488", documented: "#4f46e5", plan: "#9aa0ae" };
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" className="donut" role="img" aria-label="Validation coverage split">
        {segs.map(s => {
          const len = s.frac * C;
          const el = <circle key={s.k} cx="60" cy="60" r={R} fill="none" stroke={colors[s.k]} strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)"/>;
          offset += len;
          return el;
        })}
        <text x="60" y="57" textAnchor="middle" className="donut-num">{total}</text>
        <text x="60" y="72" textAnchor="middle" className="donut-cap">streams</text>
      </svg>
      <ul className="donut-legend">
        <li><i style={{ background: colors.measured }}/>{counts.measured} measured</li>
        <li><i style={{ background: colors.documented }}/>{counts.documented} documented</li>
        <li><i style={{ background: colors.plan }}/>{counts.plan} planned</li>
      </ul>
    </div>
  );
}

/* ------------------------- new case-study sections -------------------------- */

export function ResearchChainBlock({ p }: { p: Project }) {
  const r = p.research;
  const rows: [string, string][] = [
    ["OBSERVATION", r.observation], ["PATTERN", r.pattern], ["INSIGHT", r.insight],
    ["DESIGN DECISION", r.decision], ["VALIDATION", r.validation],
  ];
  return (
    <div className="rc" style={{ ["--accent" as string]: p.accent } as React.CSSProperties}>
      {rows.map(([k, v], i) => (
        <div className="rc-row" key={k}>
          <span className="rc-key">{k}</span>
          <span className="rc-val">{v}</span>
          {i < rows.length - 1 && <span className="rc-arrow" aria-hidden="true">↓</span>}
        </div>
      ))}
    </div>
  );
}

export function BeforeAfter({ p }: { p: Project }) {
  return (
    <div className="ba" style={{ ["--accent" as string]: p.accent } as React.CSSProperties}>
      <div className="ba-col">
        <small>BEFORE</small>
        <ul>{p.beforeAfter.before.map(x => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="ba-mid" aria-hidden="true">
        <span className="ba-arrow">↓</span>
        <em>DESIGN INTERVENTION</em>
      </div>
      <div className="ba-col after">
        <small>AFTER</small>
        <ul>{p.beforeAfter.after.map(x => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>
  );
}

export function DecisionsBlock({ p }: { p: Project }) {
  return (
    <div className="dd-list">
      {p.decisions.map((d, i) => (
        <Reveal key={d.what} delay={i * 0.05}>
          <article className="dd">
            <header><span className="dd-num">DECISION {String(i + 1).padStart(2, "0")}</span><h3>{d.what}</h3></header>
            <div className="dd-grid">
              <div><small>WHY</small><p>{d.why}</p></div>
              <div><small>EVIDENCE</small><p>{d.evidence}</p></div>
              <div><small>RESULT</small><p>{d.result}</p></div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------------- maps ------------------------------------ */

export interface CaseMapView { map: string; mapAlt: string; title: string; desc: string; evidence: string; evidenceAlt: string; }

export function SystemMaps({ maps, accent }: { maps: CaseMap[]; accent: string }) {
  const [sel, setSel] = useState(0);
  const m = maps[Math.max(0, Math.min(sel, maps.length - 1))];
  return (
    <div className="maps-block" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      <div className="maps-tabs" role="tablist" aria-label="System maps for this case">
        {maps.map((x, i) => (
          <button key={x.title} role="tab" aria-selected={sel === i} className={sel === i ? "active" : ""} onClick={() => setSel(i)}>{x.title}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={m.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE }}>
          <div className="map-pair">
            <figure className="map-frame">
              <figcaption><span>SYSTEM MAP</span><em>{String(sel + 1).padStart(2, "0")}</em></figcaption>
              <img src={m.map} alt={m.mapAlt} loading="lazy" decoding="async"/>
            </figure>
            <div className="map-copy">
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
              <figure className="map-evidence">
                <figcaption><span>INFORMED THE BUILD</span></figcaption>
                <img src={m.evidence} alt={m.evidenceAlt} loading="lazy" decoding="async"/>
              </figure>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ===================== case-02 editorial upgrade blocks ===================== */

/* ---- editorial section shell: numbered marker + 40/60 split ---- */
export function EditorialSection({ n, label, title, children, lead, id }: { n: string; label: string; title?: string; children: ReactNode; lead?: string; id?: string }) {
  return (
    <section className="esec" id={id}>
      <Reveal>
        <div className="esec-head">
          <span className="esec-marker" aria-hidden="true"/>
          <span className="esec-num">{n}</span>
          <span className="esec-label">/ {label}</span>
        </div>
        {title && <h2 className="esec-title">{title}</h2>}
        {lead && <p className="esec-lead">{lead}</p>}
      </Reveal>
      {children}
    </section>
  );
}

/* ---- hero metadata + product reveal (entrance stagger) ---- */
export function CaseHero({ p, meta, image, imageAlt }: { p: Project; meta: { label: string; value: string }[]; image: string; imageAlt: string }) {
  const reduce = useReducedMotion();
  return (
    <header className="chero" style={{ ["--accent" as string]: p.accent } as React.CSSProperties}>
      <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
        <div className="chero-tags">
          {[...p.domains, p.tag.split(" / ")[0]].filter((t, i, a) => a.indexOf(t) === i).slice(0, 4).map(t => <span key={t}>{t}</span>)}
        </div>
        <h1>{p.title}</h1>
        <p className="chero-sub">{p.subtitle}</p>
        <motion.dl className="chero-meta" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12, ease: EASE }}>
          {meta.map(m => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}
        </motion.dl>
      </motion.div>
      <motion.figure className="chero-shot" initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, delay: 0.18, ease: EASE }}>
        <BrowserFrame image={image} alt={imageAlt} accent={p.accent} eager/>
      </motion.figure>
    </header>
  );
}

/* ---- quick facts bar ---- */
export function FactsBar({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <Reveal>
      <dl className="facts-bar">
        {facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
      </dl>
    </Reveal>
  );
}

/* ---- complexity snapshot chain with animated connectors ---- */
export function ComplexityChain({ steps, accent }: { steps: string[]; accent: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="cchain" style={{ ["--accent" as string]: accent } as React.CSSProperties} role="list">
      {steps.map((s, i) => (
        <div className="cchain-node" role="listitem" key={s}>
          <Reveal delay={i * 0.1} y={14}><span className="cchain-pill">{s}</span></Reveal>
          {i < steps.length - 1 && (
            <motion.span className="cchain-link" aria-hidden="true" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: EASE }}/>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---- O→P→I→DR evidence board ---- */
export function EvidenceBoard({ items, accent }: { items: { key: string; icon: string; title: string; desc: string }[]; accent: string }) {
  const iconMap: Record<string, ReactNode> = {
    observe: <Users size={16}/>,
    pattern: <PatternIcon/>,
    insight: <InsightIcon/>,
    response: <ResponseIcon/>,
  };
  return (
    <div className="eboard" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {items.map((it, i) => (
        <Reveal key={it.key} delay={i * 0.08} className="eboard-cell">
          <div className="eboard-card">
            <div className="eboard-top"><span className="eboard-ico" aria-hidden="true">{iconMap[it.icon]}</span><span className="eboard-key">{it.key}</span></div>
            <b>{it.title}</b>
            <p>{it.desc}</p>
          </div>
        </Reveal>
      ))}
      {items.slice(0, -1).map((_, i) => <span key={i} className="eboard-arrow" style={{ gridColumn: 2 * i + 2 }} aria-hidden="true">→</span>)}
    </div>
  );
}

function PatternIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
}
function InsightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3Z"/></svg>;
}
function ResponseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
}

/* ---- role capability quad ---- */
export function RoleQuad({ owned, collaborated, accent }: { owned: string[]; collaborated: string[]; accent: string }) {
  const pick = (re: RegExp, fallback: string) => owned.find(x => re.test(x)) ?? fallback;
  const groups: { label: string; items: string[]; icon: ReactNode }[] = [
    { label: "STRATEGY", items: [pick(/research/i, "Problem framing"), "Problem framing"], icon: <CompassIcon/> },
    { label: "EXPERIENCE", items: [pick(/architecture|ia/i, "IA"), pick(/workflow/i, "Workflow design"), pick(/dashboard/i, "Dashboard UX")], icon: <FlowIcon/> },
    { label: "EXECUTION", items: [pick(/pattern|\bui\b/i, "UI"), "Prototype", "Design System"], icon: <FrameIcon/> },
  ];
  return (
    <div className="rquad" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {groups.map(g => (
        <Reveal key={g.label} className="rquad-cell">
          <div className="rquad-card">
            <div className="rquad-top"><span className="rquad-ico" aria-hidden="true">{g.icon}</span><small>{g.label}</small></div>
            <ul>{g.items.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        </Reveal>
      ))}
      <Reveal className="rquad-cell rquad-collab" delay={0.1}>
        <div className="rquad-card soft">
          <div className="rquad-top"><span className="rquad-ico" aria-hidden="true"><Users size={16}/></span><small>COLLABORATION</small></div>
          <ul>{collaborated.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
      </Reveal>
    </div>
  );
}
function CompassIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>;
}
function FlowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="6" height="5" rx="1.2"/><rect x="15" y="15" width="6" height="5" rx="1.2"/><path d="M9 6.5h6a3 3 0 0 1 3 3V15"/></svg>;
}
function FrameIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M9 21V9"/></svg>;
}

/* ---- constraint explorer ---- */
export function ConstraintExplorer({ items, accent }: { items: string[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="cexplorer" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {items.map((c, i) => (
        <li key={i} className={open === i ? "open" : ""}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span className="cexplorer-num">{String(i + 1).padStart(2, "0")}</span>
            <b>{titleFromConstraint(c)}</b>
            <span className="cexplorer-plus" aria-hidden="true">+</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="cexplorer-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <p>{c}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}
function titleFromConstraint(c: string): string {
  const map: [RegExp, string][] = [
    [/five workflow families/i, "Five families, one system"],
    [/four data-heavy surfaces/i, "Shared components, different roles"],
    [/data joins.*imperfect|enterprise data joins/i, "Imperfect data joins by design"],
    [/compliance and diversity rules/i, "Non-negotiable compliance inputs"],
  ];
  for (const [re, t] of map) if (re.test(c)) return t;
  return c.split(/[.,:—]/)[0].slice(0, 42);
}

/* ---- insight cards ---- */
export function InsightCards({ cards, accent }: { cards: InsightCard[]; accent: string }) {
  return (
    <div className="icards" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {cards.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.07} className="icard-cell">
          <article className="icard">
            <div className="icard-head">
              <span className="icard-ico" aria-hidden="true"><InsightIcon/></span>
              <b>{c.title}</b>
            </div>
            <p className="icard-insight">{c.insight}</p>
            <div className="icard-impl"><small>DESIGN IMPLICATION</small><p>{c.implication}</p></div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* ---- journey rail: hover highlights stage, dims others ---- */
export function JourneyRail({ stages, accent }: { stages: JourneyStage[]; accent: string }) {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div className="jrail" style={{ ["--accent" as string]: accent } as React.CSSProperties}
      onMouseLeave={() => setHov(null)}>
      {stages.map((s, i) => (
        <Reveal key={s.stage} delay={i * 0.06} className="jrail-cell">
          <button className={`jrail-stage ${hov !== null && hov !== i ? "dim" : ""} ${hov === i ? "hot" : ""}`}
            onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} onBlur={() => setHov(null)}
            aria-describedby={`jrail-${i}`}
          >
            <span className="jrail-step">{String(i + 1).padStart(2, "0")}</span>
            <b>{s.stage}</b>
            <small className="jrail-goal">{s.goal}</small>
          </button>
          <div className={`jrail-detail ${hov === i ? "show" : ""}`} id={`jrail-${i}`}>
            <span><b>SYSTEM</b> {s.response}</span>
            <span><b>PAIN</b> {s.pain}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---- hotspot-annotated product image ---- */
export function HotspotImage({ src, alt, hotspots, accent }: { src: string; alt: string; hotspots: Hotspot[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [xray, setXray] = useState(false);
  return (
    <div className={`hots ${xray ? "xray" : ""}`} style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      <div className="hots-ctrl">
        <span className="hots-hint">{xray
          ? `X-RAY — ${hotspots.length} layers: ${[...new Set(hotspots.map(h => h.label))].slice(0, 3).join(" · ")}`
          : "PRODUCT — annotated production UI"}
        </span>
        <button className="hots-xray-btn" aria-pressed={xray} onClick={() => { setXray(v => !v); setOpen(null); }}>
          <ScanSearch size={13} aria-hidden="true"/> X-ray
        </button>
      </div>
      <div className="hots-img">
        <img src={src} alt={alt} loading="lazy" decoding="async"/>
        {hotspots.map((h, i) => (
          <span key={i} className="hots-dot-wrap" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <button className={`hots-dot ${open === i ? "on" : ""}`} aria-expanded={open === i}
              aria-label={`${h.label}: ${h.text}`}
              onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => setOpen(i)} onMouseLeave={() => setOpen(prev => (prev === i ? null : prev))}>
              {i + 1}
            </button>
            {(open === i || xray) && (
              <span className="hots-panel" role="status">
                <b>{h.label}</b>
                <span>{h.text}</span>
              </span>
            )}
          </span>
        ))}
      </div>
      <ol className="hots-list">
        {hotspots.map((h, i) => <li key={i}><b>{h.label}</b>{h.text}</li>)}
      </ol>
      <noscript/>
    </div>
  );
}

/* ---- accessible lightbox for product screens ---- */
export function Lightbox({ open, onClose, label, accent, children }: { open: boolean; onClose: () => void; label: string; accent: string; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="lbox" role="dialog" aria-modal="true" aria-label={label}
          style={{ ["--accent" as string]: accent } as React.CSSProperties}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <button ref={closeRef} className="lbox-close" onClick={onClose} aria-label="Close enlarged image"><X size={18}/></button>
          <motion.figure initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {children}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- prototype player: stage picker + crossfade screens ---- */
export function ProtoPlayer({ frames, accent }: { frames: ProtoFrame[]; accent: string }) {
  const [i, setI] = useState(0);
  const f = frames[Math.max(0, Math.min(i, frames.length - 1))];
  const [lb, setLb] = useState(false);
  return (
    <div className="pplayer" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      <div className="pplayer-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={f.stage} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }}>
            {f.phone
              ? <PhoneFrame><MockScreen v={f.mock} accent={accent}/></PhoneFrame>
              : <DesktopMock v={f.mock} cap={f.caption} accent={accent}/>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="pplayer-side">
        <small>PROTOTYPE SIMULATION — CONCEPTUAL DATA</small>
        <ol className="pplayer-list">
          {frames.map((fr, k) => (
            <li key={fr.stage}>
              <button className={k === i ? "on" : ""} aria-current={k === i ? "step" : undefined} onClick={() => setI(k)}>
                <span>Screen {fr.stage}</span><b>{fr.caption.split(" — ")[0]}</b>
              </button>
            </li>
          ))}
        </ol>
        <div className="pplayer-nav">
          <button onClick={() => setI(v => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous screen">←</button>
          <span>{String(i + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}</span>
          <button onClick={() => setI(v => Math.min(frames.length - 1, v + 1))} disabled={i === frames.length - 1} aria-label="Next screen">→</button>
        </div>
        <button className="pplayer-zoom" onClick={() => setLb(true)}>Enlarge current screen</button>
      </div>
      <Lightbox open={lb} onClose={() => setLb(false)} label={f.caption} accent={accent}>
        {f.phone
          ? <PhoneFrame><MockScreen v={f.mock} accent={accent}/></PhoneFrame>
          : <DesktopMock v={f.mock} cap={f.caption} accent={accent}/>}
      </Lightbox>
    </div>
  );
}

/* ---- design-system component strip ---- */
export function ComponentStrip({ items, accent }: { items: { name: string; kind: string }[]; accent: string }) {
  return (
    <div className="cstrip" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
      {items.map((it, i) => (
        <Reveal key={it.name} delay={i * 0.04} className="cstrip-cell">
          <div className="cstrip-card">
            <b>{it.name}</b>
            <small>{it.kind}</small>
            <span className="cstrip-mini" aria-hidden="true"/>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---- sticky case-section nav (editorial case) ---- */
export function CaseSectionNav({ labels }: { labels: [string, string][] }) {
  const [active, setActive] = useState<string>(labels[0][0]);
  useEffect(() => {
    const root = document.querySelector(".case-fs");
    if (!root) return;
    const onScroll = () => {
      const top = root.scrollTop + 160;
      let cur = labels[0][0];
      labels.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= top) cur = id;
      });
      setActive(cur);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, [labels]);
  return (
    <nav className="cnav" aria-label="Case study sections">
      <div className="cnav-rail">
        {labels.map(([id, label]) => (
          <button key={id} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
