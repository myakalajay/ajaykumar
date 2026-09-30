import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Users, X } from "lucide-react";
import type { CaseMap, Project } from "./data";

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
