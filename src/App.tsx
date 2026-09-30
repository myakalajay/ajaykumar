import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BrainCircuit, ChevronDown, Compass,
  ExternalLink, FileText, Linkedin, Mail, Monitor, Network, Target, Workflow, X,
} from "lucide-react";
import {
  capabilities, CV, EMAIL, experience, LINKEDIN, methods, projects,
  type MockVariant, type Project, type WfVariant,
} from "./data";
import {
  BeforeAfter, Counter, DecisionsBlock, EASE, JourneyMap, Marquee, Reveal, ResearchChainBlock,
  scrollTo, ServiceBlueprint, SpotlightCard, SystemMaps, TestDonut,
} from "./blocks";
import { BrowserFrame, DesktopMock, MockScreen, PhoneFrame, Wireframe } from "./mocks";
import { AiLoopDemo, caseDemo, DesignSystem, MortgageDemo, RecruiterModal, SupplierDemo } from "./interactive";

const NAV = [["Work", "#work"], ["Approach", "#approach"], ["About", "#about"]] as const;

/* --------------------------------- header ---------------------------------- */

function Header({ active, onRecruiter }: { active: string; onRecruiter: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
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
        <button className="btn btn-ghost btn-sm rv-trigger" onClick={onRecruiter}>Recruiter View</button>
        <a className="btn btn-primary btn-sm" href={`mailto:${EMAIL}`}><Mail size={14}/> Contact</a>
      </div>
      <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Menu">{open ? <X size={20}/> : <MenuIcon/>}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {NAV.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); setOpen(false); scrollTo(href); }}>{label}<ArrowUpRight size={14}/></a>)}
            <button onClick={() => { setOpen(false); onRecruiter(); }}>Recruiter View<ArrowUpRight size={14}/></button>
            <a href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}>Contact<ArrowUpRight size={14}/></a>
            <a href={CV} target="_blank" rel="noreferrer">Download résumé<ArrowDown size={14}/></a>
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
            <i aria-hidden="true"/> SENIOR PRODUCT DESIGNER
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.06, ease: EASE }}>
            I design <span className="accent-text">complex products</span> into clear, usable systems.
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease: EASE }}>
            11+ years designing enterprise products, data-intensive workflows and AI-enabled experiences across strategy, research, interaction design and design systems.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26, ease: EASE }}>
            <button className="btn btn-primary" onClick={() => scrollTo("#work")}>View selected work <ArrowDown size={16}/></button>
            <a className="btn btn-ghost" href={CV} target="_blank" rel="noreferrer"><FileText size={15}/> Download résumé</a>
            <span className="hero-links">
              <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={12}/></a>
              <a href={`mailto:${EMAIL}`}>Contact <ArrowUpRight size={12}/></a>
            </span>
          </motion.div>
        </div>
        <motion.div className="hero-art" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
          <div className="arch">
            <img src="/ajay_kumar.png" alt="Portrait of Ajay Kumar Myakala" loading="eager" decoding="async"/>
          </div>
          <motion.div className="sticker" initial={{ opacity: 0, scale: 0.85, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ delay: 0.55, duration: 0.6, ease: EASE }}>
            <b>37%</b>
            documented underwriting decision-time reduction
          </motion.div>
        </motion.div>
      </div>
      <div className="proof-strip" role="list" aria-label="Credibility summary">
        <div role="listitem"><b>11+ YEARS</b><span>Product &amp; UX</span></div>
        <div role="listitem"><b>ENTERPRISE</b><span>Complex workflows</span></div>
        <div role="listitem"><b>AI + DATA</b><span>Intelligent experiences</span></div>
        <div role="listitem"><b>DESIGN SYSTEMS</b><span>Scalable UI</span></div>
      </div>
      <Marquee items={["PRODUCT STRATEGY", "AI-NATIVE UX", "DESIGN SYSTEMS", "HUMAN + AI", "ENTERPRISE WORKFLOWS", "ZERO-TO-ONE", "RESEARCH", "MOTION"]}/>
    </section>
  );
}

/* ----------------------------------- work ---------------------------------- */

function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section className="work" id="work">
      <div className="section-head">
        <Reveal><p className="kicker">SELECTED WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Complex products.<br/><span className="accent-text">Real constraints.</span> Measurable outcomes.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Four product stories — each opens into a full study with research, design decisions, evidence and honest boundaries.</p></Reveal>
      </div>
      <div className="work-list">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.06}>
            <SpotlightCard accent={p.accent} className={`work-card ${i % 4 === 1 || i % 4 === 2 ? "dark" : ""}`}>
              <button className="work-card-btn" onClick={() => onOpen(p)} aria-label={`Open case study: ${p.short}`}>
                <span className="work-num">{p.id} · {p.domain.toUpperCase()}</span>
                <h3>{p.short}</h3>
                <p>{p.subtitle}</p>
                <span className="card-facts">
                  <span><b>ROLE</b>{p.role.split(" / ")[0]}</span>
                  <span><b>SCOPE</b>{p.scope.join(" · ")}</span>
                  <span><b>DOMAIN</b>{p.domain}</span>
                </span>
                <span className="work-meta">
                  <span className="work-cta">View case study <ArrowRight size={15}/></span>
                  <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18}/></span>
                </span>
                <span className="work-visual"><BrowserFrame image={p.image} alt={p.title} accent={p.accent}/></span>
              </button>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
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
        <Reveal><p className="kicker">HOW I WORK</p></Reveal>
        <Reveal delay={0.06}><h2>The right method for the problem —<br/><span className="accent-text">not a fixed process</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Every method is tied to a real project, real evidence and the design decision it changed. No framework theatre.</p></Reveal>
      </div>
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

/* ---------------------------------- about ---------------------------------- */

function About() {
  const [open, setOpen] = useState(0);
  return (
    <section className="about" id="about">
      <div className="section-head">
        <Reveal><p className="kicker">ABOUT</p></Reveal>
        <Reveal delay={0.06}><h2>Designing between<br/><span className="accent-text">complexity and clarity</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">I'm a Senior Product Designer with 11+ years of experience designing enterprise products, data-intensive workflows and AI-enabled experiences.</p></Reveal>
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
    </section>
  );
}

/* --------------------------------- contact --------------------------------- */

function Contact({ onRecruiter }: { onRecruiter: () => void }) {
  return (
    <section className="contact" id="contact">
      <div className="contact-band" aria-hidden="true"/>
      <div className="contact-inner">
        <Reveal><p className="kicker">LET'S BUILD SOMETHING CLEAR</p></Reveal>
        <Reveal delay={0.06}><h2>Have a complex product problem?</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Let's turn the complexity into something people can actually use.</p></Reveal>
        <Reveal delay={0.18}>
          <div className="contact-actions">
            <a className="btn btn-accent btn-lg" href={`mailto:${EMAIL}`}><Mail size={17}/> Start a conversation <ArrowUpRight size={15}/></a>
            <a className="btn btn-ghost on-dark btn-lg" href={CV} target="_blank" rel="noreferrer"><FileText size={16}/> View résumé <ArrowUpRight size={15}/></a>
            <button className="btn btn-ghost on-dark btn-lg" onClick={onRecruiter}>Recruiter View</button>
          </div>
        </Reveal>
        <span className="contact-big-arrow" aria-hidden="true">↗</span>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ajay Kumar Myakala</span>
        <a href="#home" onClick={e => { e.preventDefault(); scrollTo("#home"); }}>BACK TO TOP ↑</a>
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

      <div className="case-wrap">
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

        <CaseSection n="01" title="Overview">
          <p className="case-body">{project.overview}</p>
          <div className="case-pills">{project.scope.map(x => <span key={x}>{x}</span>)}</div>
        </CaseSection>

        <CaseSection n="02" title="The challenge">
          {project.challenge.map((c, i) => <p className={`case-body ${i === 0 ? "case-problem" : ""}`} key={i}>{c}</p>)}
        </CaseSection>

        <CaseSection n="03" title="My role">
          <div className="role-grid">
            <div className="role-col">
              <small>I OWNED</small>
              <ul>{project.rolePoints.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="role-col">
              <small>COLLABORATED WITH</small>
              <ul className="soft">{project.collaborated.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </CaseSection>

        <CaseSection n="04" title="Constraints">
          <ul className="constraint-list">
            {project.constraints.map((c, i) => <li key={i}><b>C{i + 1}</b>{c}</li>)}
          </ul>
        </CaseSection>

        <CaseSection n="05" title="Research">
          <ResearchChainBlock p={project}/>
        </CaseSection>

        <CaseSection n="06" title="Key insights">
          <ol className="insight-list">
            {project.insights.map((x, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{x}</li>)}
          </ol>
        </CaseSection>

        <CaseSection n="07" title="Journey / workflow">
          <JourneyMap p={project}/>
          <h3 className="sub-head">Service blueprint</h3>
          <ServiceBlueprint p={project}/>
          <h3 className="sub-head">System maps → production evidence</h3>
          <SystemMaps maps={project.maps} accent={project.accent}/>
        </CaseSection>

        <CaseSection n="08" title="Design decisions">
          <DecisionsBlock p={project}/>
          <h3 className="sub-head">Before / after</h3>
          <BeforeAfter p={project}/>
        </CaseSection>

        <CaseSection n="09" title="Prototype">
          <p className="case-body">Structure first: low-fidelity frames fixing hierarchy, states and content priority — then the high-fidelity UI. {project.prototypeNote}</p>
          <div className="wf-row">
            {project.wf.map(([v, cap]) => <Wireframe key={v + cap} variant={v as WfVariant} caption={cap}/>)}
            <div className="wf-arrow" aria-hidden="true"><ArrowRight size={18}/><span>HI-FI</span></div>
            {project.hifi.slice(0, 1).map(([v, cap]) => <div className="wf-hifi" style={{ ["--msa" as string]: project.accent } as React.CSSProperties} key={v}><DesktopMock v={v as MockVariant} cap={cap} accent={project.accent}/></div>)}
            {project.hifi[1] && <div className="wf-hifi ph" style={{ ["--msa" as string]: project.accent } as React.CSSProperties} key={project.hifi[1][0]}><PhoneFrame><MockScreen v={project.hifi[1][0] as MockVariant} accent={project.accent}/></PhoneFrame><span className="wf-hifi-cap">{project.hifi[1][1]}</span></div>}
            <div className="wf-arrow" aria-hidden="true"><ArrowRight size={18}/><span>SHIPPED</span></div>
          </div>
          {demo && (
            <>
              <h3 className="sub-head">Try the pattern</h3>
              {demo}
            </>
          )}
        </CaseSection>

        <CaseSection n="10" title="Final product">
          <div className="case-figure"><BrowserFrame image={project.image} alt={project.title} accent={project.accent} eager/></div>
          {project.link && <a className="case-live-link" href={project.link} target="_blank" rel="noreferrer">Open the live product <ExternalLink size={14}/></a>}
        </CaseSection>

        <CaseSection n="11" title="Design system">
          <p className="case-body">{project.systemNote}</p>
          <p className="case-body">The full specimen — components, states and scaling model — lives in the <a href="#systems" onClick={e => { e.preventDefault(); onClose(); setTimeout(() => scrollTo("#systems"), 80); }} style={{ textDecoration: "underline" }}>design systems section</a>.</p>
        </CaseSection>

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
  const openCase = (p: Project) => { setCaseDir(0); setCaseStudy(p); };
  const navCase = (p: Project, dir: number) => { setCaseDir(dir); setCaseStudy(p); };
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Senior Product Designer | Enterprise & AI Product Design";
    const ids = ["home", "work", "demos", "approach", "systems", "about", "contact"];
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
        <Work onOpen={openCase}/>
        <Demos/>
        <HowIWork/>
        <DesignSystem/>
        <About/>
        <Contact onRecruiter={() => setRecruiter(true)}/>
      </main>
      <AnimatePresence>
        {caseStudy && <CasePage key={caseStudy.id} project={caseStudy} dir={caseDir} onClose={() => setCaseStudy(null)} onNavigate={navCase}/>}
      </AnimatePresence>
      <RecruiterModal open={recruiter} onClose={() => setRecruiter(false)}/>
    </div>
  );
}
