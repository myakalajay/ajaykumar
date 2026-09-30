import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Download, FileText, LayoutGrid, Linkedin, Mail, ShieldCheck,
  Sparkles, X,
} from "lucide-react";
import { CV, EMAIL, LINKEDIN, RECRUITER, experience, projects, type Project } from "./data";
import { scrollTo } from "./blocks";

const MSA = {
  "01": "#e4572e", "02": "#2563eb", "03": "#7c3aed", "04": "#0d9488",
} as Record<string, string>;

const EASE = [0.16, 1, 0.3, 1] as const;
const ru = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/* ------------------------- 1. mortgage calculator -------------------------- */

function monthlyPayment(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function MortgageDemo() {
  const [amount, setAmount] = useState(420000);
  const [rate, setRate] = useState(6.42);
  const [years, setYears] = useState(30);
  const payment = monthlyPayment(amount, rate, years);
  const total = payment * years * 12;
  const interest = total - amount;
  const dti = (payment / 9000) * 100; // illustrative $9,000/mo income
  const affordable = dti < 28;
  const options = [
    { name: "30-yr fixed", rate: 6.42, years: 30, tag: "Lowest payment" },
    { name: "20-yr fixed", rate: 6.15, years: 20, tag: "Balanced" },
    { name: "15-yr fixed", rate: 5.71, years: 15, tag: "Least interest" },
  ];
  return (
    <div className="demo" role="group" aria-label="Interactive mortgage calculator — illustrative prototype">
      <div className="demo-tag"><Sparkles size={12}/> ILLUSTRATIVE PROTOTYPE · LIVE INTERACTION</div>
      <div className="demo-grid">
        <div className="demo-controls">
          <label className="demo-field">
            <span>Loan amount <b>{ru(amount)}</b></span>
            <input type="range" min={100000} max={900000} step={5000} value={amount}
              onChange={e => setAmount(+e.target.value)} aria-label="Loan amount" style={{ ["--demo-accent" as string]: "#e4572e" }}/>
          </label>
          <label className="demo-field">
            <span>Interest rate <b>{rate.toFixed(2)}%</b></span>
            <input type="range" min={4} max={9} step={0.05} value={rate}
              onChange={e => setRate(+e.target.value)} aria-label="Interest rate" style={{ ["--demo-accent" as string]: "#e4572e" }}/>
          </label>
          <label className="demo-field">
            <span>Term <b>{years} years</b></span>
            <input type="range" min={10} max={30} step={5} value={years}
              onChange={e => setYears(+e.target.value)} aria-label="Loan term" style={{ ["--demo-accent" as string]: "#e4572e" }}/>
          </label>
          <div className={`demo-afford ${affordable ? "ok" : "warn"}`} role="status">
            <ShieldCheck size={14}/>
            {affordable ? "Comfortably within a 28% housing ratio (illustrative $9,000/mo income)" : "Above a 28% housing ratio (illustrative $9,000/mo income) — consider a shorter-term tradeoff review"}
          </div>
        </div>
        <div className="demo-results" aria-live="polite">
          <div className="demo-big"><small>Monthly payment</small><b>{ru(Math.round(payment))}</b></div>
          <div className="demo-kv">
            <span><small>Total interest</small><b>{ru(Math.round(interest))}</b></span>
            <span><small>Total paid</small><b>{ru(Math.round(total))}</b></span>
          </div>
          <div className="demo-recs">
            <small>RECOMMENDED OPTIONS</small>
            {options.map(o => {
              const p = monthlyPayment(amount, o.rate, o.years);
              return (
                <button key={o.name} className={o.name.startsWith(`${years}`) ? "on" : ""} onClick={() => { setRate(o.rate); setYears(o.years); }} aria-label={`Set ${o.name}`}>
                  <b>{o.name}</b><em>{o.tag}</em><span>{ru(Math.round(p))}/mo · {o.rate}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="demo-note">Concept demo of the rate-decision pattern from the HomeRatesYard case — real math, conceptual data.</p>
    </div>
  );
}

/* ------------------------- 2. supplier comparison -------------------------- */

type Sup = { name: string; price: number; lead: number; risk: "Low" | "Medium" | "High"; cert: string; onTime: number };
const SUPPLIERS: Sup[] = [
  { name: "Northwind Parts", price: 128, lead: 12, risk: "Low", cert: "ISO 9001", onTime: 97 },
  { name: "Acme Services", price: 104, lead: 21, risk: "Medium", cert: "ISO 9001", onTime: 88 },
  { name: "Globex Logistics", price: 92, lead: 30, risk: "High", cert: "In review", onTime: 74 },
  { name: "Initech Supply", price: 117, lead: 15, risk: "Low", cert: "ISO 14001", onTime: 95 },
  { name: "Umbrella Mfg", price: 99, lead: 24, risk: "Medium", cert: "ISO 9001", onTime: 84 },
];

export function SupplierDemo() {
  const [open, setOpen] = useState(false);
  const [maxRisk, setMaxRisk] = useState<"Low" | "Medium" | "High">("High");
  const [certOnly, setCertOnly] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const riskRank = { Low: 0, Medium: 1, High: 2 };
  const rows = SUPPLIERS
    .filter(s => riskRank[s.risk] <= riskRank[maxRisk])
    .filter(s => !certOnly || s.cert !== "In review")
    .sort((a, b) => (a.price + a.lead * 2) - (b.price + b.lead * 2));
  const rec = rows[0];
  return (
    <div className="demo" role="group" aria-label="Interactive supplier comparison — illustrative prototype">
      <div className="demo-tag"><Sparkles size={12}/> ILLUSTRATIVE PROTOTYPE · LIVE INTERACTION</div>
      <button className="demo-cta" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        {open ? <>Hide comparison <X size={15}/></> : <>Compare suppliers <ArrowRight size={15}/></>}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="demo-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="demo-filters">
              <div className="demo-chips" role="group" aria-label="Filter by delivery risk">
                <span>Delivery risk ≤</span>
                {(["Low", "Medium", "High"] as const).map(r => (
                  <button key={r} className={maxRisk === r ? "on" : ""} onClick={() => setMaxRisk(r)} aria-pressed={maxRisk === r}>{r}</button>
                ))}
              </div>
              <button className={`demo-chip ${certOnly ? "on" : ""}`} onClick={() => setCertOnly(v => !v)} aria-pressed={certOnly}>Certified only</button>
            </div>
            <table className="demo-table" aria-label="Supplier comparison">
              <thead><tr><th>Supplier</th><th>Unit cost</th><th>Lead time</th><th>Delivery risk</th><th>On-time</th></tr></thead>
              <tbody>
                {rows.map(s => (
                  <tr key={s.name} className={sel === s.name ? "sel" : ""} onClick={() => setSel(s.name === sel ? null : s.name)}>
                    <td><b>{s.name}</b><em>{s.cert}</em></td>
                    <td>${s.price}</td>
                    <td>{s.lead} days</td>
                    <td><span className={`demo-pill ${s.risk.toLowerCase()}`}>{s.risk}</span></td>
                    <td>{s.onTime}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rec && (
              <div className="demo-rec" role="status">
                <b>Recommendation — {rec.name}</b>
                <p>Lowest blended cost + lead time within your risk filter. Delivery risk shown beside cost, per the case-study decision.</p>
              </div>
            )}
            <AnimatePresence>{sel && (
              <motion.div className="demo-detail" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <b>{sel} — details</b>
                <p>Row selection is the expandable-details state from the enterprise case: primary attributes stay in the table, secondary context (certification scope, history, contacts) opens in place.</p>
              </motion.div>
            )}</AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="demo-note">Concept demo of the comparison pattern from the Procurement case — filters and sorting are functional; supplier data is conceptual.</p>
    </div>
  );
}

/* --------------------------- 3. AI human loop ------------------------------ */

const AI_STEPS = ["CONTEXT", "AI / LLM", "GENERATE", "EVIDENCE", "HUMAN REVIEW", "DECISION", "ACTION"] as const;
const AI_EVIDENCE = [
  { k: "Delivery risk", v: "Low — 97% on-time, 12-day lead", src: "Historic performance records" },
  { k: "Cost position", v: "$128/unit — 2nd of 5 in blended score", src: "Current price file" },
  { k: "Compliance", v: "ISO 9001 valid to next audit", src: "Certification register" },
];

export function AiLoopDemo() {
  const [q, setQ] = useState("Show me suppliers with low delivery risk.");
  const [phase, setPhase] = useState<"idle" | "analysing" | "done">("idle");
  const [step, setStep] = useState(0);
  const [verdict, setVerdict] = useState<"approved" | "modified" | "rejected" | null>(null);
  const reduce = useReducedMotion();

  const run = () => {
    setPhase("analysing"); setStep(0); setVerdict(null);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < AI_STEPS.length - 1) { setStep(i); setTimeout(tick, reduce ? 120 : 550); }
      else { setStep(AI_STEPS.length - 2); setPhase("done"); }
    };
    setTimeout(tick, reduce ? 120 : 550);
  };

  return (
    <div className="demo" role="group" aria-label="AI human-in-the-loop demo — conceptual prototype">
      <div className="demo-tag"><Sparkles size={12}/> CONCEPTUAL PROTOTYPE · HUMAN-REVIEW PATTERN</div>
      <div className="ai-prompt">
        <span className="ai-role">USER</span>
        <input value={q} onChange={e => setQ(e.target.value)} aria-label="Prompt" />
        <button className="demo-cta sm" onClick={run} disabled={phase === "analysing"}>
          {phase === "analysing" ? "ANALYSING…" : "Ask"}
        </button>
      </div>
      <ol className="ai-track" aria-label="AI human loop stages">
        {AI_STEPS.map((s, i) => (
          <li key={s} className={i <= step && phase !== "idle" ? "on" : ""}>
            <i aria-hidden="true"/>{s}
          </li>
        ))}
      </ol>
      <AnimatePresence>
        {phase !== "idle" && step >= 3 && (
          <motion.div className="ai-evidence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            <small>RECOMMENDED — 2 SUPPLIERS · CONFIDENCE 86%</small>
            {AI_EVIDENCE.map(e => (
              <div key={e.k}><b>{e.k}</b><span>{e.v}</span><em>{e.src}</em></div>
            ))}
            <div className="ai-review">
              <b><ShieldCheck size={13}/> HUMAN REVIEW</b>
              <p>The model recommends; a person owns the call. Approve, modify or reject — every action is attributed.</p>
              <div className="ai-actions">
                <button className={`ai-btn ok ${verdict === "approved" ? "picked" : ""}`} onClick={() => setVerdict("approved")} disabled={phase !== "done"}>Approve</button>
                <button className={`ai-btn mid ${verdict === "modified" ? "picked" : ""}`} onClick={() => setVerdict("modified")} disabled={phase !== "done"}>Modify</button>
                <button className={`ai-btn bad ${verdict === "rejected" ? "picked" : ""}`} onClick={() => setVerdict("rejected")} disabled={phase !== "done"}>Reject</button>
              </div>
              {verdict && <p className="ai-verdict" role="status">Decision recorded: {verdict} — attributed to reviewer, logged with evidence set.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="demo-note">Concept demo of the AI human-loop pattern from the Audience Intelligence case — demonstrates the interface pattern, not a live AI system.</p>
    </div>
  );
}

/* ---------------------------- 4. Recruiter View ---------------------------- */

const rvLinks = (onClose: () => void): { label: string; href: string; action?: () => void; icon: ReactNode }[] => [
  { label: "Selected work", href: "#work", action: () => { onClose(); setTimeout(() => scrollTo("#work"), 80); }, icon: <LayoutGrid size={14}/> },
  { label: "Résumé", href: CV, icon: <FileText size={14}/> },
  { label: "LinkedIn", href: LINKEDIN, icon: <Linkedin size={14}/> },
  { label: "Contact", href: `mailto:${EMAIL}`, icon: <Mail size={14}/> },
];

export function RecruiterModal({ open, onClose, onOpenCase }: { open: boolean; onClose: () => void; onOpenCase?: (p: Project) => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [tab, setTab] = useState<"profile" | "work" | "capabilities" | "experience" | "contact">("profile");
  useEffect(() => { if (open) setTab("profile"); }, [open]);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const root = panelRef.current; if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
        <motion.div className="rv-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={panelRef} className="rv-drawer" role="dialog" aria-modal="true" aria-label="Recruiter summary — Ajay Kumar Myakala"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.45, ease: EASE }}>
            <button ref={closeRef} className="rv-close" onClick={onClose} aria-label="Close recruiter view"><X size={18}/></button>
            <header className="rv-head">
              <h3>AJAY KUMAR MYAKALA</h3>
              <p className="rv-role">Staff Product Designer · AI & Agent Experience · Product Strategy</p>
              <p className="rv-line">11+ years · Enterprise + consumer · AI + complex workflows · Product strategy + systems</p>
              <p className="rv-avail"><i aria-hidden="true"/> Open to opportunities</p>
            </header>
            <div className="rv-tabs" role="tablist" aria-label="Hiring view sections">
              {([["profile", "30 sec"], ["work", "Work"], ["capabilities", "Capabilities"], ["experience", "Experience"], ["contact", "Contact"]] as const).map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>
              ))}
            </div>
            {tab === "profile" && (
              <>
            <section className="rv-sec">
              <h4>SELECTED CAPABILITIES</h4>
              <div className="rv-grid2">
                {RECRUITER.specialization.map(([t, d]) => <div key={t} className="rv-spec"><b>{t}</b><span>{d}</span></div>)}
              </div>
            </section>
            <section className="rv-sec">
              <h4>DOMAINS</h4>
              <div className="rv-chips">{RECRUITER.domains.map(d => <span key={d}>{d}</span>)}</div>
            </section>
            <section className="rv-sec">
              <h4>WHY THIS PORTFOLIO</h4>
              <div className="rv-why">
                {RECRUITER.whyThis.map((w, i) => <div key={i}><b>{String(i + 1).padStart(2, "0")}</b><span>{w}</span></div>)}
              </div>
            </section>
            <section className="rv-sec">
              <h4>QUICK LINKS</h4>
              <div className="rv-links">
                {rvLinks(onClose).map(l => l.action
                  ? <button key={l.label} onClick={l.action}>{l.icon}{l.label} <ArrowRight size={12}/></button>
                  : <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.icon}{l.label} <ArrowUpRight size={12}/></a>
                )}
              </div>
            </section>
              </>
            )}
            {tab === "work" && (
              <section className="rv-sec">
                <h4>SELECTED WORK</h4>
                <div className="rv-links">
                  {projects.map(p => (
                    <button key={p.id} onClick={() => { onClose(); setTimeout(() => onOpenCase?.(p), 60); }}>
                      <FileText size={14}/>{p.short}
                      <em style={{ marginLeft: "auto", fontStyle: "normal", fontSize: 11, color: "var(--muted)" }}>{p.domains[0]}</em>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 12 }}>Opens the full case study — research, decisions, evidence and honest boundaries.</p>
              </section>
            )}
            {tab === "capabilities" && (
              <section className="rv-sec">
                <h4>CAPABILITIES</h4>
                <div className="rv-grid2">
                  {[["Product Strategy", "Ambiguity → direction"], ["Enterprise UX", "Complex workflows at scale"], ["AI / Agent Experience", "Human-AI interaction patterns"], ["Design Systems", "Tokens → components → governance"], ["Complex Workflows", "Multi-actor operational surfaces"], ["Research", "Evidence trails tied to decisions"], ["Product Discovery", "Framing before interface"], ["Data-heavy Products", "Dense data made decision-ready"], ["Growth", "Activation through clarity"], ["Design Leadership", "Governance + mentoring"]].map(([t, d]) => <div key={t} className="rv-spec"><b>{t}</b><span>{d}</span></div>)}
                </div>
              </section>
            )}
            {tab === "experience" && (
              <section className="rv-sec">
                <h4>EXPERIENCE — 11+ YEARS</h4>
                <div className="rv-xp2">
                  {experience.map(x => <div key={x.org}><b>{x.period}</b><span><em>{x.role}</em>{x.org} · {x.domain}</span></div>)}
                </div>
              </section>
            )}
            {tab === "contact" && (
              <section className="rv-sec">
                <h4>CONTACT</h4>
                <div className="rv-links">
                  <a href={CV} target="_blank" rel="noreferrer"><Download size={14}/> View resume</a>
                  <a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={14}/> LinkedIn</a>
                  <a href={`mailto:${EMAIL}`}><Mail size={14}/> Email</a>
                </div>
                <p className="rv-avail" style={{ marginTop: 16 }}><i aria-hidden="true"/> Open to opportunities</p>
              </section>
            )}
            <section className="rv-actions">
              <a className="btn btn-primary" href={CV} target="_blank" rel="noreferrer"><Download size={15}/> Download Résumé</a>
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}><Mail size={15}/> Start a conversation</a>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------- 4b. commerce demo ----------------------------- */

const STORE = [
  { id: "p1", name: "Aer Press Coffee Maker", price: 89, tag: "Bestseller", rating: "4.8", reviews: 1240, ship: "Free returns · 30 days" },
  { id: "p2", name: "Ceramic Pour-Over Set", price: 54, tag: "New", rating: "4.6", reviews: 86, ship: "Free returns · 30 days" },
  { id: "p3", name: "Stainless Carafe 1L", price: 32, tag: null, rating: "4.7", reviews: 431, ship: "Free returns · 30 days" },
  { id: "p4", name: "Hand Grinder Pro", price: 76, tag: "Bestseller", rating: "4.9", reviews: 2107, ship: "Free returns · 30 days" },
];

export function CommerceDemo() {
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const total = cart.reduce((n, c) => n + c.qty * (STORE.find(s => s.id === c.id)?.price ?? 0), 0);
  const add = (id: string) => setCart(c => {
    const hit = c.find(x => x.id === id);
    return hit ? c.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1 }];
  });
  const setQty = (id: string, d: 1 | -1) => setCart(c => c
    .map(x => x.id === id ? { ...x, qty: x.qty + d } : x)
    .filter(x => x.qty > 0));

  return (
    <div className="demo" role="group" aria-label="Interactive commerce demo — illustrative prototype">
      <div className="demo-tag"><Sparkles size={12}/> ILLUSTRATIVE PROTOTYPE · LIVE INTERACTION</div>
      <div className="cd-frame">
        <div className="cd-grid">
          <div className="cd-shop" aria-label="Storefront">
            <div className="cd-shop-head">
              <b>Daily Goods</b>
              <span className="cd-cartbtn" aria-live="polite">Cart · {count}</span>
            </div>
            <div className="cd-products">
              {STORE.map(p => (
                <button key={p.id} className="cd-product" onClick={() => add(p.id)} aria-label={`Add ${p.name} to cart, $${p.price}`}>
                  <span className="cd-thumb" style={{ background: "linear-gradient(140deg, #0d9488 0%, #c9a227 130%)", opacity: 0.16 }} aria-hidden="true"/>
                  <b>{p.name}</b>
                  <em>{p.rating} ★ · {p.reviews.toLocaleString("en-US")} reviews</em>
                  {p.tag && <i>{p.tag}</i>}
                  <small>${p.price} · {p.ship}</small>
                  <span className="cd-add">Add to cart <ArrowRight size={12}/></span>
                </button>
              ))}
            </div>
          </div>
          <div className="cd-side">
            {cart.length === 0 ? (
              <div className="cd-empty">
                <b>Your cart is empty</b>
                <span>Every state is designed — this is the empty state.</span>
              </div>
            ) : (
              <>
                <div className="cd-cart">
                  {cart.map(c => {
                    const p = STORE.find(s => s.id === c.id)!;
                    return (
                      <div className="cd-row" key={c.id}>
                        <b>{p.name}</b>
                        <span className="cd-qty">
                          <button onClick={() => setQty(c.id, -1)} aria-label={`Remove one ${p.name}`}>−</button>
                          {c.qty}
                          <button onClick={() => setQty(c.id, 1)} aria-label={`Add one ${p.name}`}>+</button>
                        </span>
                        <em>${p.price * c.qty}</em>
                      </div>
                    );
                  })}
                </div>
                <div className="cd-totals">
                  <span><small>Subtotal</small><b>${total}</b></span>
                  <span><small>Shipping</small><b>Free</b></span>
                  <span className="cd-total"><small>Total</small><b>${total}</b></span>
                  <p>The total is honest from the cart — no surprise costs at payment.</p>
                </div>
                <button className="cd-checkout">Checkout · ${total}</button>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="demo-note">Concept demo of the commerce journey from the E-commerce case — cart and totals logic is real, catalogue is conceptual.</p>
    </div>
  );
}

/* ------------------------- 5. Design system section ------------------------ */

export function DesignSystem({ onOpenSystems }: { onOpenSystems: () => void }) {
  const [tab, setTab] = useState<"components" | "states" | "scale">("components");
  return (
    <section className="ds" id="capabilities">
      <div className="section-head">
        <p className="kicker">DESIGN SYSTEM</p>
        <h2>One system, carried from case studies<br/>to <span className="accent-text">this site itself</span>.</h2>
        <p className="section-sub">The tokens, components and states used inside the case studies — reused to build this portfolio.</p>
        <div className="ds-open" style={{ gridColumn: "1 / -1" }}>
          <button className="btn btn-primary" onClick={onOpenSystems}>Open the full documentation <ArrowUpRight size={15}/></button>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>Foundations · tokens · components · states · patterns · governance · AI readiness</span>
        </div>
      </div>
      <div className="ds-tabs" role="tablist" aria-label="Design system views">
        {([["components", "Components"], ["states", "States"], ["scale", "How it scales"]] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <div className="ds-stage">
        {tab === "components" && (
          <div className="ds-grid">
            <div className="ds-cell"><small>BUTTONS</small>
              <div className="ds-row"><span className="ds-btn primary">Primary</span><span className="ds-btn ghost">Secondary</span><span className="ds-btn accent">Accent</span></div>
            </div>
            <div className="ds-cell"><small>INPUTS</small>
              <div className="ds-col">
                <span className="ds-input">Project or supplier…</span>
                <span className="ds-input filled">Northwind Parts</span>
              </div>
            </div>
            <div className="ds-cell"><small>SELECT</small>
              <span className="ds-select">Role: Procurement lead <ChevronDown size={13}/></span>
            </div>
            <div className="ds-cell"><small>NAVIGATION</small>
              <div className="ds-navdemo"><i className="on">Overview</i><i>Suppliers</i><i>Spend</i><i>Reports</i></div>
            </div>
            <div className="ds-cell"><small>CARDS</small>
              <div className="ds-card"><b>Rate card</b><span>6.42% · 30-yr fixed</span><em>Recommended</em></div>
            </div>
            <div className="ds-cell"><small>STATUS</small>
              <div className="ds-pills"><span className="ok">Verified</span><span className="warn">In review</span><span className="muted">Pending</span></div>
            </div>
            <div className="ds-cell wide"><small>DATA VIZ — TABLE</small>
              <table className="ds-table" aria-label="Design system table specimen">
                <thead><tr><th>Supplier</th><th>Cost</th><th>Risk</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Northwind Parts</td><td>$128</td><td>Low</td><td><span className="ds-pill ok">Active</span></td></tr>
                  <tr><td>Globex Logistics</td><td>$92</td><td>High</td><td><span className="ds-pill warn">Review</span></td></tr>
                </tbody>
              </table>
            </div>
            <div className="ds-cell wide"><small>DATA VIZ — CHART</small>
              <div className="ds-bars" aria-hidden="true">
                {[38, 55, 42, 68, 50, 74].map((h, i) => <i key={i} style={{ height: `${h}%` }}/>)}
              </div>
            </div>
          </div>
        )}
        {tab === "states" && (
          <div className="ds-grid">
            <div className="ds-cell"><small>LOADING</small><div className="ds-state load"><i/><i/><i/></div></div>
            <div className="ds-cell"><small>EMPTY</small>
              <div className="ds-state empty"><b>No suppliers match</b><span>Relax the delivery-risk filter to see more.</span><em className="ds-btn ghost">Reset filters</em></div>
            </div>
            <div className="ds-cell"><small>ERROR</small>
              <div className="ds-state error"><b>Reconciliation failed</b><span>3 mismatched records need review before close.</span><em className="ds-btn primary">Review mismatches</em></div>
            </div>
            <div className="ds-cell"><small>SUCCESS</small>
              <div className="ds-state success"><Check size={15}/> Rate locked — confirmation sent</div>
            </div>
            <div className="ds-cell wide"><small>AI COMPONENT</small>
              <div className="ds-ai"><span className="ds-ai-badge">AI</span><p>Recommended: <b>Northwind Parts</b> — lowest blended cost within Low delivery risk. <em>Evidence: on-time 97% · price file · ISO 9001.</em></p><span className="ds-pill ok">86% confidence</span></div>
            </div>
            <div className="ds-cell wide"><small>RESPONSIVE BEHAVIOUR</small>
              <p className="ds-note">Tables collapse to stacked cards below 768px, chart panels reflow to single column, diagrams switch to horizontal scroll — 8px grid, 44px touch targets, no text below 13px.</p>
            </div>
          </div>
        )}
        {tab === "scale" && (
          <div className="ds-scale">
            {[["Component", "Button, input, table row, status pill, rate card, AI recommendation"], ["→ Variant", "Primary/ghost/accent · error/disabled/filled · risk levels · loading/empty/success"], ["→ Pattern", "Comparison rows, filter + result, guided form, milestone timeline, evidence panel"], ["→ Product", "HomeRatesYard · Procurement & Supplier · Audience Intelligence · E-commerce"]].map(([t, d]) => (
              <div className="ds-scale-row" key={t}><b>{t}</b><span>{d}</span></div>
            ))}
            <p className="ds-note"><b>Accessibility & governance:</b> WCAG-minded contrast, visible focus states, keyboard-operable patterns and a critique loop — the same governance carried into every engagement.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function DemoSection({ children, id }: { children: ReactNode; id?: string }) {
  return <div id={id}>{children}</div>;
}

export function caseDemo(p: Project): ReactNode {
  if (p.id === "01") return <MortgageDemo/>;
  if (p.id === "02") return <SupplierDemo/>;
  if (p.id === "03") return <AiLoopDemo/>;
  if (p.id === "04") return <CommerceDemo/>;
  return null;
}
