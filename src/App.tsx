import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BrainCircuit, ChevronDown, Compass,
  ExternalLink, FileText, Linkedin, Mail, Monitor, Network, Target, Workflow, X,
} from "lucide-react";
import {
  case02Complexity, case02Decisions, case02EvidenceBoard, case02Facts, case02Hotspots, case02InsightCards,
  case02Journey, case02Proto, case02SystemStrip, DOMAINS, THINK_STAGES, WORK_SIGNALS, ARTIFACTS,
  capabilities, CV, EMAIL, experience, LINKEDIN, methods, projects,
  type MockVariant, type Project, type WfVariant,
} from "./data";
import {
  BeforeAfter, CaseHero, ComponentStrip, ComplexityChain, ConstraintExplorer, Counter, DecisionsBlock,
  EASE, EditorialSection, EvidenceBoard, FactsBar, HotspotImage, InsightCards, JourneyMap, JourneyRail,
  CaseSectionNav,
  Lightbox, Marquee, ProtoPlayer, Reveal, ResearchChainBlock, RoleQuad,
  scrollTo, ServiceBlueprint, SpotlightCard, SystemMaps, TestDonut,
} from "./blocks";
import { BrowserFrame, DesktopMock, MockScreen, PhoneFrame, Wireframe } from "./mocks";
import { AiLoopDemo, caseDemo, DesignSystem, MortgageDemo, RecruiterModal, SupplierDemo } from "./interactive";

const NAV = [["Work", "#work"], ["Approach", "#approach"], ["Capabilities", "#capabilities"], ["About", "#about"]] as const;

/* --------------------------------- header ---------------------------------- */

function Header({ active, onRecruiter }: { active: string; onRecruiter: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.scrollingElement as HTMLElement;
    const onScroll = () => setScrolled((el?.scrollTop ?? window.scrollY) > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "shrink" : ""}`}>
      <button className="brand" onClick={() => scrollTo("#home")} aria-label="Back to top">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span className="brand-word">AJAY<b>KUMAR</b></span>
      </button>
      <nav className="header-nav" aria-label="Primary">
        {NAV.map(([label, href]) => (
          <a key={href} href={href} className={active === href.slice(1) ? "active" : ""} onClick={e => { e.preventDefault(); scrollTo(href); }}>{label}</a>
        ))}
      </nav>
      <div className="header-right">
        <a className="header-resume" href={CV} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={13}/></a>
        <button className="btn btn-ghost btn-sm rv-trigger" onClick={onRecruiter}>Recruiter View</button>
        <a className="btn btn-primary btn-sm" href={`mailto:${EMAIL}`}><Mail size={14}/> Let's talk <ArrowRight size={13}/></a>
      </div>
      <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Menu">{open ? <X size={20}/> : <MenuIcon/>}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {NAV.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); setOpen(false); scrollTo(href); }}>{label}<ArrowUpRight size={14}/></a>)}
            <button onClick={() => { setOpen(false); onRecruiter(); }}>Recruiter View<ArrowUpRight size={14}/></button>
            <a href={CV} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Resume<ArrowDown size={14}/></a>
            <a href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}>Let's talk<ArrowUpRight size={14}/></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
}

/* ---------------------------------- hero ----------------------------------- */

function Hero({ onRecruiter }: { onRecruiter: () => void }) {
  return (
    <section className="hero" id="home">
      <div className="q-circle" aria-hidden="true"/>
      <div className="arc" aria-hidden="true"/>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <i aria-hidden="true"/> SENIOR PRODUCT DESIGNER — B2B · B2C · ENTERPRISE · AI
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.06, ease: EASE }}>
            I turn <span className="accent-text">complex</span><br/>products into<br/>clear, usable<br/><span className="accent-text">systems</span>.
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease: EASE }}>
            11+ years designing complex workflows, data-heavy products and AI-enabled experiences — across strategy, research, interaction design and design systems.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26, ease: EASE }}>
            <button className="btn btn-primary" onClick={() => scrollTo("#work")}>View selected work <ArrowRight size={16}/></button>
            <button className="btn btn-ghost" onClick={() => scrollTo("#about")}>About me <ArrowRight size={15}/></button>
            <a className="btn btn-ghost" href={CV} target="_blank" rel="noreferrer"><FileText size={15}/> Resume</a>
            <span className="hero-links">
              <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12}/></a>
              <a href={`mailto:${EMAIL}`}>Contact <ArrowUpRight size={12}/></a>
            </span>
          </motion.div>
          <motion.p className="hero-avail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <i aria-hidden="true"/> Open to senior product design opportunities and collaboration
          </motion.p>
        </div>
        <motion.div className="hero-art" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
          <div className="arch">
            <img src="/ajay_kumar.png" alt="Portrait of Ajay Kumar Myakala" loading="eager" decoding="async"/>
          </div>
          <motion.div className="sticker" initial={{ opacity: 0, scale: 0.85, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ delay: 0.55, duration: 0.6, ease: EASE }}>
            <b>11+ yrs</b>
            designing complex workflows, data-heavy products and AI experiences
          </motion.div>
        </motion.div>
      </div>
      <div className="proof-strip" role="list" aria-label="Credibility summary">
        <div role="listitem"><b>11+ YEARS</b><span>Product &amp; UX experience</span></div>
        <div role="listitem"><b>B2B / B2C</b><span>Product experience</span></div>
        <div role="listitem"><b>AI + DATA</b><span>Complex systems</span></div>
        <div role="listitem"><b>END-TO-END</b><span>Product design</span></div>
      </div>
      <Marquee items={["PRODUCT STRATEGY", "AI-NATIVE UX", "DESIGN SYSTEMS", "HUMAN + AI", "ENTERPRISE WORKFLOWS", "ZERO-TO-ONE", "RESEARCH", "MOTION"]}/>
    </section>
  );
}

/* ----------------------------------- work ---------------------------------- */

const WORK_FILTERS = ["ALL", "B2B", "B2C", "D2C", "ENTERPRISE", "FINTECH", "MADTECH", "AI / DATA", "E-COMMERCE"] as const;

function domainMatches(p: Project, f: string) { return f === "ALL" || p.domains.includes(f); }

function Work({ onOpen, onQuickView, filterSignal }: { onOpen: (p: Project) => void; onQuickView: (p: Project) => void; filterSignal: { d: string; n: number } | null }) {
  const [filter, setFilter] = useState<string>(() => {
    const q = new URLSearchParams(window.location.search).get("domain");
    const up = q ? q.toUpperCase() : null;
    return up && WORK_FILTERS.includes(up as (typeof WORK_FILTERS)[number]) ? up : "ALL";
  });
  useEffect(() => {
    if (filterSignal) setFilter(WORK_FILTERS.includes(filterSignal.d as (typeof WORK_FILTERS)[number]) ? filterSignal.d : "ALL");
  }, [filterSignal]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter === "ALL") url.searchParams.delete("domain"); else url.searchParams.set("domain", filter.toLowerCase());
    window.history.replaceState(null, "", url);
  }, [filter]);
  const shown = projects.filter(p => domainMatches(p, filter));
  const featured = shown[0];
  const rest = shown.slice(1);
  return (
    <section className="work" id="work">
      <div className="section-head">
        <Reveal><p className="kicker">SELECTED WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Complex products.<br/><span className="accent-text">Real constraints.</span> Measurable outcomes.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Each project opens into a full study with research, design decisions, evidence and honest boundaries.</p></Reveal>
      </div>
      <Reveal>
        <div className="work-filters" role="group" aria-label="Filter projects by domain">
          {WORK_FILTERS.map(f => (
            <button key={f} className={filter === f ? "on" : ""} aria-pressed={filter === f}
              onClick={() => setFilter(f)}>
              {f}
              <small>{f === "ALL" ? projects.length : projects.filter(p => domainMatches(p, f)).length}</small>
            </button>
          ))}
        </div>
      </Reveal>
      {featured && (
        <Reveal>
          <SpotlightCard accent={featured.accent} className="work-card featured">
            <div className="work-visual"><BrowserFrame image={featured.image} alt={featured.title} accent={featured.accent}/></div>
            <div className="featured-copy">
              <span className="work-num">{featured.id} · FEATURED</span>
              <h3>{featured.short}</h3>
              <p className="featured-line">{featured.subtitle}</p>
              <span className="domain-tags">{featured.domains.map(d => <em key={d}>{d}</em>)}<em className="quiet">{featured.domain}</em></span>
              <p className="featured-outcome"><b>OUTCOME</b>{featured.outcomeLine}</p>
              <span className="card-facts">
                <span><b>ROLE</b>{featured.role.split(" / ")[0]}</span>
                <span><b>SCOPE</b>{featured.scope.join(" · ")}</span>
              </span>
              <span className="work-meta">
                <button className="work-cta" onClick={() => onOpen(featured)}>View case study <ArrowRight size={15}/></button>
                <button className="work-quick" onClick={() => onQuickView(featured)}>Quick view</button>
              </span>
            </div>
          </SpotlightCard>
        </Reveal>
      )}
      <motion.div className="work-grid" layout>
        <AnimatePresence mode="popLayout">
          {rest.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4, ease: EASE }}>
              <SpotlightCard accent={p.accent} className="work-card">
                <div className="work-visual hoverable">
                  <BrowserFrame image={p.image} alt={p.title} accent={p.accent}/>
                  <span className="hover-overlay" aria-hidden="true">VIEW CASE STUDY →</span>
                </div>
                <div className="card-copy">
                  <span className="work-num">{p.id}</span>
                  <h3>{p.short}</h3>
                  <span className="domain-tags">{p.domains.map(d => <em key={d}>{d}</em>)}<em className="quiet">{p.domain}</em></span>
                  <p className="card-line">{p.subtitle}</p>
                  <span className="work-meta">
                    <button className="work-cta" onClick={() => onOpen(p)}>View case study <ArrowRight size={15}/></button>
                    <button className="work-quick" onClick={() => onQuickView(p)}>Quick view</button>
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && <p className="work-empty">No projects in this domain yet.</p>}
    </section>
  );
}

/* ----------------------------- domain experience ---------------------------- */

function Domains({ onFilter }: { onFilter: (d: string) => void }) {
  return (
    <section className="domains" id="domains">
      <div className="section-head">
        <Reveal><p className="kicker">PRODUCTS ACROSS DOMAINS</p></Reveal>
        <Reveal delay={0.06}><h2>Designing across business models,<br/><span className="accent-text">industries and contexts</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Click a domain to see the real projects behind it.</p></Reveal>
      </div>
      <div className="domain-matrix">
        {DOMAINS.map((d, i) => {
          const matches = projects.filter(p => p.domains.some(x => x === d.label));
          return (
            <Reveal key={d.key} delay={(i % 4) * 0.05} className="dm-cell">
              <button className={`dm-card ${matches.length ? "" : "empty"}`}
                disabled={!matches.length}
                onClick={() => matches.length && onFilter(d.label)}
                aria-label={`Show ${d.label} projects`}
              >
                <b>{d.label}</b>
                <small>{d.tagline}</small>
                <span className="dm-areas">{d.areas.map(a => <em key={a}>{a}</em>)}</span>
                <span className="dm-count">{matches.length} {matches.length === 1 ? "project" : "projects"}</span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------- quick view --------------------------------- */

function QuickView({ p, onClose, onOpenCase }: { p: Project | null; onClose: () => void; onOpenCase: (p: Project) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!p) return;
    openerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const root = dialogRef.current; if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; openerRef.current?.focus?.(); };
  }, [p, onClose]);
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="qv-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={dialogRef} className="qv" role="dialog" aria-modal="true" aria-label={`${p.short} quick view`}
            style={{ ["--accent" as string]: p.accent } as React.CSSProperties}
            initial={{ opacity: 0, y: 28, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.99 }} transition={{ duration: 0.35, ease: EASE }}>
            <button ref={closeRef} className="qv-close" onClick={onClose} aria-label="Close quick view"><X size={16}/></button>
            <div className="qv-media"><BrowserFrame image={p.image} alt={p.title} accent={p.accent}/></div>
            <div className="qv-body">
              <span className="work-num">{p.id} · {p.status}</span>
              <h3>{p.title}</h3>
              <span className="domain-tags">{p.domains.map(d => <em key={d}>{d}</em>)}<em className="quiet">{p.domain}</em></span>
              <dl className="qv-facts">
                <div><dt>ROLE</dt><dd>{p.role}</dd></div>
                <div><dt>PERIOD</dt><dd>{p.period}</dd></div>
                <div><dt>CLIENT</dt><dd>{p.client}</dd></div>
              </dl>
              <p className="qv-challenge"><b>THE PROBLEM</b>{p.challenge[2] ?? p.challenge[0]}</p>
              <p className="qv-contrib"><b>KEY CONTRIBUTION</b>{p.decisions[0]?.what}</p>
              <p className="qv-outcome"><b>OUTCOME</b>{p.outcomeLine}</p>
              <div className="qv-actions">
                <button className="btn btn-primary" onClick={() => { onClose(); onOpenCase(p); }}>View full case study <ArrowRight size={15}/></button>
                {p.link && <a className="btn btn-ghost" href={p.link} target="_blank" rel="noreferrer">Live product <ExternalLink size={14}/></a>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- interactive demos --------------------------- */

function Demos() {
  return (
    <section className="demos" id="demos">
      <div className="section-head">
        <Reveal><p className="kicker">INTERACTIVE PRODUCT DEMONSTRATIONS</p></Reveal>
        <Reveal delay={0.06}><h2>Don't just view —<br/><span className="accent-text">use the patterns</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Working prototypes of the interaction patterns from the case studies. Real logic, conceptual data, clearly labelled.</p></Reveal>
      </div>
      <Reveal>
        <article className="demo-block">
          <header><span className="demo-num">A</span><div><h3>Mortgage decision demo</h3><p>From HomeRatesYard — payment math updates live; affordability reads against an illustrative income.</p></div></header>
          <MortgageDemo/>
        </article>
      </Reveal>
      <Reveal>
        <article className="demo-block">
          <header><span className="demo-num">B</span><div><h3>Supplier comparison demo</h3><p>From Procurement &amp; Supplier Experience — open the panel, filter by delivery risk, expand details.</p></div></header>
          <SupplierDemo/>
        </article>
      </Reveal>
      <Reveal>
        <article className="demo-block">
          <header><span className="demo-num">C</span><div><h3>AI human-in-the-loop demo</h3><p>From Audience Intelligence — context → AI → evidence → confidence → human review → decision.</p></div></header>
          <AiLoopDemo/>
        </article>
      </Reveal>
    </section>
  );
}

/* -------------------------------- how I work ------------------------------- */

const capIcons: Record<string, typeof Target> = {
  target: Target, brain: BrainCircuit, layers: Workflow, workflow: Workflow,
  compass: Compass, network: Network, monitor: Monitor, chart: BarChart3,
};

function HowIWork() {
  const [sel, setSel] = useState(0);
  const m = methods[sel];
  return (
    <section className="approach" id="approach">
      <div className="section-head">
        <Reveal><p className="kicker">HOW I THINK</p></Reveal>
        <Reveal delay={0.06}><h2>Complex problems require<br/><span className="accent-text">systems thinking</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Every stage connects to real portfolio evidence — no generic process theatre.</p></Reveal>
      </div>
      <Reveal>
        <ol className="think-rail">
          {THINK_STAGES.map((s, i) => (
            <li key={s.stage} className="think-stage">
              <span className="think-num">{String(i + 1).padStart(2, "0")}</span>
              <b>{s.stage}</b>
              <span className="think-items">{s.items.join(" · ")}</span>
              <span className="think-link" aria-hidden="true">↓</span>
              <small>{s.project}</small>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal>
        <div className="method-switcher">
          <div className="method-tabs" role="tablist" aria-label="Working methods">
            {methods.map((x, i) => (
              <button key={x.id} role="tab" aria-selected={sel === i} className={sel === i ? "on" : ""} onClick={() => setSel(i)}>{x.label}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={m.id} className="method-stage" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="method-copy">
                <p className="method-line"><b>METHOD</b>{m.method}</p>
                <p className="method-line"><b>REAL PROJECT</b>{m.project}</p>
                <p className="method-line"><b>REAL EVIDENCE</b>{m.evidence}</p>
                <p className="method-line decision"><b>DESIGN DECISION</b>{m.decision}</p>
              </div>
              <figure className="method-map">
                <img src={m.map} alt={m.mapAlt} loading="lazy" decoding="async"/>
                <figcaption>{m.label} pattern — applied, not framed</figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- real artifacts ----------------------------- */

function Artifacts() {
  return (
    <section className="artifacts" aria-label="Real artifacts from the case studies">
      <div className="section-head">
        <Reveal><p className="kicker">REAL ARTIFACTS</p></Reveal>
        <Reveal delay={0.06}><h2>From the actual studies —<br/><span className="accent-text">not decoration</span>.</h2></Reveal>
      </div>
      <div className="artifact-row">
        {ARTIFACTS.map((a, i) => (
          <Reveal key={a.src} delay={i * 0.05} className="artifact-cell">
            <figure className="artifact">
              <img src={a.src} alt={a.alt} loading="lazy" decoding="async"/>
              <figcaption><b>{a.label}</b><small>{a.kind}</small></figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ seniority signals ---------------------------- */

function Signals() {
  return (
    <section className="signals" aria-label="How I work with teams">
      <div className="signals-head">
        <Reveal><h2>How I work</h2></Reveal>
      </div>
      <div className="signals-grid">
        {WORK_SIGNALS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06} className="signal-cell">
            <div className="signal">
              <b>{s.title}</b>
              <p>{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- about ---------------------------------- */

function About() {
  const [open, setOpen] = useState(0);
  return (
    <section className="about" id="about">
      <div className="section-head">
        <Reveal><p className="kicker">ABOUT</p></Reveal>
        <Reveal delay={0.06}><h2>A designer who thinks<br/><span className="accent-text">beyond screens</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">11+ years across product design, systems thinking, AI / data and enterprise + consumer platforms.</p></Reveal>
      </div>
      <div className="cap-grid">
        {capabilities.map((c, i) => {
          const Icon = capIcons[c.icon] ?? Target;
          return (
            <Reveal key={c.title} delay={(i % 4) * 0.05}>
              <div className="cap-card">
                <span className="cap-top"><span className="cap-num">{String(i + 1).padStart(2, "0")}</span><Icon size={20} strokeWidth={1.6}/></span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="xp-head">
        <Reveal><h3 className="xp-title">Experience timeline</h3></Reveal>
      </div>
      <div className="xp-timeline">
        <span className="xp-line" aria-hidden="true"/>
        {experience.map((x, i) => (
          <Reveal key={x.org} delay={i * 0.04}>
            <button className={`xp-row ${open === i ? "open" : ""}`} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="xp-period">{x.period}</span>
              <span className="xp-dot" aria-hidden="true"/>
              <span className="xp-main"><b>{x.org}</b><em>{x.role}</em></span>
              <span className="xp-domain">{x.domain}</span>
              <ChevronDown size={16} className="xp-chev"/>
            </button>
            <AnimatePresence initial={false}>
              {open === i && <motion.div className="xp-note" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}><p>{x.note}</p></motion.div>}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="employers" aria-label="Companies worked with">
          <b>HomeLoc</b><b>Computech</b><b>Visual IT</b><b>Gaian</b><b>Way2News</b><b>Nitya Software</b>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="about-more">
          <a className="btn btn-ghost" href={CV} target="_blank" rel="noreferrer">Full background — résumé <ArrowUpRight size={14}/></a>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------------- contact --------------------------------- */

function DeepDives({ onOpen, onQuickView }: { onOpen: (p: Project) => void; onQuickView: (p: Project) => void }) {
  const picks = [projects[1], projects[0], projects[2]];
  return (
    <section className="deepdives" id="deepdives">
      <div className="section-head">
        <Reveal><p className="kicker">DEEP DIVES</p></Reveal>
        <Reveal delay={0.06}><h2>Three studies worth<br/><span className="accent-text">your next 15 minutes</span>.</h2></Reveal>
      </div>
      <div className="dd-grid">
        {picks.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} className="dd-cell">
            <article className="dd-card" style={{ ["--accent" as string]: p.accent } as React.CSSProperties}>
              <button className="dd-media" onClick={() => onOpen(p)} aria-label={`Open case study: ${p.short}`}>
                <img src={p.image} alt={`${p.short} product interface`} loading="lazy" decoding="async"/>
              </button>
              <div className="dd-copy">
                <span className="dd-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.short}</h3>
                <span className="domain-tags">{p.domains.map(d => <em key={d}>{d}</em>)}</span>
                <p className="dd-line"><b>PROBLEM</b>{p.challenge[2] ?? p.challenge[0]}</p>
                <p className="dd-line"><b>ROLE</b>{p.role.split(" / ")[0]}</p>
                <p className="dd-line"><b>OUTCOME</b>{p.outcomeLine}</p>
                <span className="dd-actions">
                  <button className="work-cta" onClick={() => onOpen(p)}>Read the study <ArrowRight size={15}/></button>
                  <button className="work-quick" onClick={() => onQuickView(p)}>Quick view</button>
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ onRecruiter }: { onRecruiter: () => void }) {
  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <Reveal><p className="kicker">LET'S BUILD SOMETHING CLEAR</p></Reveal>
        <Reveal delay={0.06}><h2>Have a complex product problem?</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Let's turn complexity into something people can understand, use and trust.</p></Reveal>
        <Reveal delay={0.18}>
          <div className="contact-actions">
            <a className="btn btn-accent btn-lg" href={`mailto:${EMAIL}`}><Mail size={17}/> Let's work together <ArrowRight size={15}/></a>
            <a className="btn btn-ghost on-dark btn-lg" href={CV} target="_blank" rel="noreferrer"><FileText size={16}/> View resume <ArrowUpRight size={15}/></a>
            <button className="btn btn-ghost on-dark btn-lg" onClick={onRecruiter}>Recruiter View</button>
          </div>
        </Reveal>
        <span className="contact-big-arrow" aria-hidden="true">↗</span>
      </div>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-id">
            <span className="brand-mark" aria-hidden="true">A</span>
            <div><b>Ajay Kumar Myakala</b><small>Senior Product Designer</small></div>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#work" onClick={e => { e.preventDefault(); scrollTo("#work"); }}>Work</a>
            <a href="#about" onClick={e => { e.preventDefault(); scrollTo("#about"); }}>About</a>
            <a href={CV} target="_blank" rel="noreferrer">Resume</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={`mailto:${EMAIL}`}>Contact</a>
          </nav>
          <span className="footer-meta">Bangalore, India</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ajay Kumar Myakala</span>
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo("#home"); }}>BACK TO TOP ↑</a>
        </div>
      </footer>
      <p className="footer-legal">This is a personal portfolio. Employer and client names and trademarks are shown solely to identify the context of my work. Their inclusion does not imply endorsement. Interactive demos are labelled conceptual prototypes; product information reflects the time of each project and may no longer be current.</p>
    </section>
  );
}

/* ------------------------------ case study page ---------------------------- */

function CaseSection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="case-sec">
      <h2><span>{n}</span> {title}</h2>
      {children}
    </section>
  );
}

function CasePage({ project, dir, onClose, onNavigate }: { project: Project; dir: number; onClose: () => void; onNavigate: (p: Project, dir: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const idx = projects.findIndex(x => x.id === project.id);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const reduce = useReducedMotion();
  const restoreRef = useRef<string | null>(null);
  const caseRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (restoreRef.current === null) {
      restoreRef.current = document.body.style.overflow;
      openerRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); onNavigate(next, 1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); onNavigate(prev, -1); return; }
      if (e.key !== "Tab") return;
      const root = caseRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose, onNavigate, next, prev]);
  useEffect(() => () => {
    document.body.style.overflow = restoreRef.current ?? "";
    openerRef.current?.focus?.();
  }, []);
  useEffect(() => { document.querySelector(".case-fs")?.scrollTo({ top: 0 }); }, [project.id]);
  useEffect(() => {
    [prev.image, next.image].forEach(src => { const img = new Image(); img.src = src; });
  }, [prev.image, next.image]);
  const demo = caseDemo(project);
  return (
    <motion.div
      className="case-fs"
      ref={caseRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      initial={reduce ? { opacity: 0 } : dir === 1 ? { opacity: 0, x: 72 } : dir === -1 ? { opacity: 0, x: -72 } : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: dir === 0 ? 0.4 : 0.42, ease: EASE }}
    >
      <div className="case-bar">
        <button className="case-back" onClick={onClose}><ArrowLeft size={16}/> All work</button>
        <span className="case-bar-title">{project.title}</span>
        <span className="case-count" aria-label={`Case ${idx + 1} of ${projects.length}`} role="status">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.b
              key={project.id}
              initial={reduce ? false : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >{String(idx + 1).padStart(2, "0")}</motion.b>
          </AnimatePresence>
          <i>/ {String(projects.length).padStart(2, "0")}</i>
          <span className="case-dots" aria-hidden="true">
            {projects.map(p => (
              <motion.i key={p.id} className={p.id === project.id ? "on" : ""} layout transition={{ duration: 0.3, ease: EASE }}/>
            ))}
          </span>
        </span>
        <div className="case-bar-actions">
          {project.link && <a className="btn btn-ghost btn-sm" href={project.link} target="_blank" rel="noreferrer">Live product <ExternalLink size={13}/></a>}
          <span className="case-kbd" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> cases</span>
          <span className="case-count-mobile" aria-hidden="true">{String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <button ref={closeRef} className="case-close" onClick={onClose} aria-label="Close case study"><X size={17}/></button>
        </div>
      </div>
      <div className={`case-wrap ${project.id === "02" ? "case-wrap--editorial" : ""}`}>
        {project.id === "02" ? (
          <>
            <CaseHero p={project} meta={[{ label: "ROLE", value: project.role }, { label: "SCOPE", value: project.scope.join(" · ") }, { label: "PRODUCT", value: "Enterprise procurement platform" }]} image={project.image} imageAlt={project.short}/>
            <FactsBar facts={case02Facts}/>
          </>
        ) : (
          <header className="case-hero">
            <span className="case-kicker" style={{ color: project.accent }}>{project.tag} · {project.status}</span>
            <h1>{project.title}</h1>
            <p>{project.subtitle}</p>
            <div className="case-meta">
              <span><b>ROLE</b>{project.role}</span>
              <span><b>CLIENT</b>{project.client}</span>
              <span><b>PERIOD</b>{project.period}</span>
              <span><b>DOMAIN</b>{project.domain}</span>
            </div>
          </header>
        )}

        {project.id === "02" ? (
          <>
          <CaseSectionNav labels={[["c2-overview", "Overview"], ["c2-challenge", "Challenge"], ["c2-research", "Research"], ["c2-journey", "Journey"], ["c2-decisions", "Decisions"], ["c2-proto", "Prototype"], ["c2-product", "Product"], ["c2-outcome", "Outcome"]]}/>
          <EditorialSection n="01" label="OVERVIEW" title="One system, not five products" id="c2-overview">
            <div className="esec-split">
              <div className="esec-left">
                <p className="case-body">{project.overview.split(" — ")[0]}.</p>
              </div>
              <div className="esec-right">
                <p className="case-body">{project.overview.split(" — ")[1] ?? project.overview}</p>
                <div className="case-pills">{project.scope.map(x => <span key={x}>{x}</span>)}</div>
              </div>
  </div>
          </EditorialSection>

          <EditorialSection n="02" label="CHALLENGE" title="Everything visible, nothing prioritised" id="c2-challenge">
            <div className="esec-split">
              <div className="esec-left">
                <p className="case-body case-problem">{project.challenge[2]}</p>
                {project.challenge.slice(0, 2).map((c, i) => <p className="case-body" key={i}>{c}</p>)}
              </div>
              <div className="esec-right">
                <p className="esec-caption">THE COMPLEXITY SNAPSHOT</p>
                <ComplexityChain steps={case02Complexity} accent={project.accent}>
                </ComplexityChain>
              </div>
 </div>
          </EditorialSection>

          <EditorialSection n="03" label="MY ROLE" title="What I owned">
            <RoleQuad owned={project.rolePoints} collaborated={project.collaborated} accent={project.accent}/>
          </EditorialSection>

          <EditorialSection n="04" label="CONSTRAINTS" title="Working within the real boundaries">
            <ConstraintExplorer items={project.constraints} accent={project.accent}/>
          </EditorialSection>

          <EditorialSection n="05" label="RESEARCH" title="What the evidence showed" id="c2-research">
            <div className="esec-split">
              <div className="esec-left">
                <p className="case-body">The research chain ran from raw observation to the design response — every step traceable, no invented numbers.</p>
              </div>
              <div className="esec-right">
                <p className="esec-caption">EVIDENCE BOARD</p>
                <EvidenceBoard items={case02EvidenceBoard} accent={project.accent}/>
              </div>
            </div>
          </EditorialSection>

          <EditorialSection n="06" label="INSIGHTS" title="What we learned">
            <InsightCards cards={case02InsightCards} accent={project.accent}/>
          </EditorialSection>

          <EditorialSection n="07" label="JOURNEY" title="From request to resolution" id="c2-journey">
            <JourneyRail stages={case02Journey} accent={project.accent}/>
            <h3 className="sub-head">Service blueprint</h3>
            <ServiceBlueprint p={project}/>
            <h3 className="sub-head">System maps → production evidence</h3>
            <SystemMaps maps={project.maps} accent={project.accent}/>
          </EditorialSection>

          <EditorialSection n="08" label="DESIGN DECISIONS" title="Key design decisions" id="c2-decisions">
            <div className="dec-ui-list">
              {case02Decisions.map((d, i) => (
                <Reveal key={d.what} delay={i * 0.05}>
                  <article className="dec-ui">
                    <div className="dec-ui-copy">
                      <span className="dec-ui-num">{String(i + 1).padStart(2, "0")}</span>
                      <h3>{d.what}</h3>
                      <div className="dec-ui-grid">
                        <div><small>WHY</small><p>{d.why}</p></div>
                        <div><small>EVIDENCE</small><p>{d.evidence}</p></div>
                        <div><small>DESIGN</small><p>{d.ui}</p></div>
                        <div><small>RESULT</small><p>{d.result}</p></div>
                      </div>
                    </div>
                    <div className="dec-ui-visual wf-hifi" style={{ ["--msa" as string]: project.accent } as React.CSSProperties}>
                      <DesktopMock v={d.mock} cap={d.ui} accent={project.accent}/>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-head">Before / after</h3>
            <BeforeAfter p={project}/>
          </EditorialSection>

          <EditorialSection n="09" label="PROTOTYPE" title="The flow, interactive" id="c2-proto">
            <p className="case-body">Structure first: low-fidelity frames fixing hierarchy, states and content priority — then the high-fidelity UI. {project.prototypeNote}</p>
            <ProtoPlayer frames={case02Proto} accent={project.accent}/>
            {demo && (
              <>
                <h3 className="sub-head">Try the pattern</h3>
                {demo}
              </>
            )}
          </EditorialSection>

          <EditorialSection n="10" label="FINAL PRODUCT" title="The final product" id="c2-product">
            <HotspotImage src={project.image} alt={`${project.title} production dashboard`} hotspots={case02Hotspots} accent={project.accent}/>
            <p className="esec-caption">CLICK A MARKER TO EXPLORE THE INTERFACE</p>
            {project.link && <a className="case-live-link" href={project.link} target="_blank" rel="noreferrer">Open the live product <ExternalLink size={14}/></a>}
          </EditorialSection>

          <EditorialSection n="11" label="DESIGN SYSTEM" title="Built once, reused everywhere">
            <div className="esec-split">
              <div className="esec-left">
                <p className="case-body">{project.systemNote}</p>
                <p className="case-body">The full specimen — components, states and scaling model — lives in the <a href="#systems" onClick={e => { e.preventDefault(); onClose(); setTimeout(() => scrollTo("#systems"), 80); }} style={{ textDecoration: "underline" }}>design systems section</a>.</p>
              </div>
              <div className="esec-right">
                <ComponentStrip items={case02SystemStrip} accent={project.accent}/>
              </div>
            </div>
          </EditorialSection>

          <EditorialSection n="12" label="OUTCOME" title="Outcome" id="c2-outcome">
            <div className="case-chart">
              {project.chart.map(b => (
                <div className="bar-row" key={b.label}>
                  <span className="bar-label">{b.label}</span>
                  <span className="bar-track"><i style={{ width: `${b.pct}%`, background: project.accent }}/></span>
                  <b className="bar-val">{b.display}</b>
                </div>
              ))}
            </div>
            <div className="case-evidence">
              {project.evidence.map(x => <div key={x.label} className={`ev-row k-${x.kind}`}><div><b>{x.label}</b><small>{x.note}</small></div><strong>{x.value}</strong></div>)}
            </div>
            <div className="case-testing-grid">
              <TestDonut rows={project.testing}/>
              <div className="case-testing">
                {project.testing.map(([a, b, c]) => <div key={a}><b>{a}</b><span>{b}</span><em className={c.startsWith("Measured") ? "m" : c.startsWith("Test") ? "p" : "d"}>{c}</em></div>)}
              </div>
            </div>
          </EditorialSection>

          <EditorialSection n="13" label="NEXT" title="What I would improve next">
            <ul className="improve-list">
              {project.improve.map((x, i) => <li key={i}><ArrowUpRight size={14}/>{x}</li>)}
            </ul>
          </EditorialSection>
          </>
        ) : (
          <>
          <CaseSection n="12" title="Outcome">
          <div className="case-chart">
            {project.chart.map(b => (
              <div className="bar-row" key={b.label}>
                <span className="bar-label">{b.label}</span>
                <span className="bar-track"><i style={{ width: `${b.pct}%`, background: project.accent }}/></span>
                <b className="bar-val">{b.display}</b>
              </div>
            ))}
          </div>
          <div className="case-evidence">
            {project.evidence.map(x => <div key={x.label} className={`ev-row k-${x.kind}`}><div><b>{x.label}</b><small>{x.note}</small></div><strong>{x.value}</strong></div>)}
          </div>
          <div className="case-testing-grid">
            <TestDonut rows={project.testing}/>
            <div className="case-testing">
              {project.testing.map(([a, b, c]) => <div key={a}><b>{a}</b><span>{b}</span><em className={c.startsWith("Measured") ? "m" : c.startsWith("Test") ? "p" : "d"}>{c}</em></div>)}
            </div>
          </div>
        </CaseSection>

        <CaseSection n="13" title="What I would improve next">
            <ul className="improve-list">
              {project.improve.map((x, i) => <li key={i}><ArrowUpRight size={14}/>{x}</li>)}
            </ul>
          </CaseSection>
          </>
        )}

        <nav className="case-next" aria-label="More case studies">
          <button onClick={() => onNavigate(prev, -1)}><ArrowLeft size={16}/><span><small>PREVIOUS · ←</small><b>{prev.title}</b></span></button>
          <button onClick={() => onNavigate(next, 1)}><span><small>NEXT · →</small><b>{next.title}</b></span><ArrowRight size={16}/></button>
        </nav>
      </div>
    </motion.div>
  );
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const [active, setActive] = useState("home");
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);
  const [caseDir, setCaseDir] = useState(0);
  const [recruiter, setRecruiter] = useState(false);
  const [quick, setQuick] = useState<Project | null>(null);
  const [workFilterSignal, setWorkFilterSignal] = useState<{ d: string; n: number } | null>(null);
  const openCase = (p: Project) => { setCaseDir(0); setCaseStudy(p); };
  const navCase = (p: Project, dir: number) => { setCaseDir(dir); setCaseStudy(p); };
  const filterTo = (d: string) => {
    setWorkFilterSignal({ d, n: (workFilterSignal?.n ?? 0) + 1 });
    setTimeout(() => scrollTo("#work"), 60);
  };
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Senior Product Designer | Enterprise & AI Product Design";
    const ids = ["home", "work", "demos", "approach", "capabilities", "about", "contact"];
    const nodes = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) setActive(vis.target.id);
    }, { threshold: [0.2, 0.45] });
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return (
    <div className="page">
      <a className="skip-link" href="#work" onClick={e => { e.preventDefault(); scrollTo("#work"); }}>Skip to work</a>
      <div className="scroll-progress" aria-hidden="true"/>
      <Header active={active} onRecruiter={() => setRecruiter(true)}/>
      <main>
        <Hero onRecruiter={() => setRecruiter(true)}/>
        <Work onOpen={openCase} onQuickView={setQuick} filterSignal={workFilterSignal}/>
        <Domains onFilter={filterTo}/>
        <Demos/>
        <HowIWork/>
        <Artifacts/>
        <Signals/>
        <DesignSystem/>
        <About/>
        <DeepDives onOpen={openCase} onQuickView={setQuick}/>
        <Contact onRecruiter={() => setRecruiter(true)}/>
      </main>
      <AnimatePresence>
        {caseStudy && <CasePage key={caseStudy.id} project={caseStudy} dir={caseDir} onClose={() => setCaseStudy(null)} onNavigate={navCase}/>}
        {quick && <QuickView p={quick} onClose={() => setQuick(null)} onOpenCase={openCase}/>}
      </AnimatePresence>
      <RecruiterModal open={recruiter} onClose={() => setRecruiter(false)}/>
    </div>
  );
}
