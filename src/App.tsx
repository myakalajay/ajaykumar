import React, { useEffect, useRef, useState, type ReactNode } from "react";
import "@fontsource-variable/geist";
import {
  AnimatePresence, motion, useMotionValue, useSpring, useTransform,
  useScroll, useReducedMotion,
} from "framer-motion";
import {
  ArrowDown, ArrowUpRight, Boxes, BrainCircuit, ChevronDown, Compass, Cpu,
  ExternalLink, FileText, FlaskConical, GitBranch, Layers, Linkedin, Mail,
  Menu, Network, ShieldCheck, Sparkles, Target, Users, Workflow, X, Zap,
  type LucideIcon,
} from "lucide-react";

const CV = "/Ajay_Kumar_Myakala_Design_Strategist_CV.pdf";
const EMAIL = "ajaykumarmyakala@outlook.com";
const LINKEDIN = "https://www.linkedin.com/in/ajaykumarmyakala";
const EASE = [0.16, 1, 0.3, 1] as const;

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------------------------- data ---------------------------------- */

const projects = [
  {
    id: "01", tag: "FINTECH / MORTGAGE", title: "HomeRatesYard — Mortgage Platform",
    subtitle: "From rate discovery to a clearer borrowing journey.",
    role: "Lead Product Design Consultant", client: "HomeLoc Solutions LLP",
    period: "Apr 2024 – May 2026", status: "LIVE PRODUCT",
    image: "/Homepage.jpg", link: "https://homeratesyard.com/",
    accent: "#ff5c39",
    impact: ["37% documented reduction in underwriting decision time", "Live product spanning the full borrowing journey"],
    problem: "How might a high-stakes mortgage workflow feel clearer without hiding its operational complexity?",
    summary: "A mortgage and lending ecosystem spanning origination, underwriting, onboarding, servicing and lending operations — design direction that connected borrower intent to operational decisions.",
    contribution: ["Workflow framing", "Experience architecture", "Interaction design", "Design direction"],
    decision: "Connect borrower intent to operational decision points instead of treating rate discovery and underwriting as separate experiences.",
    process: [["Discover", "Map actors, constraints and decision moments."], ["Define", "Frame workflow friction and risk."], ["Design", "Turn rules into clear journeys and states."], ["Validate", "Review workflow clarity with stakeholders."], ["Deliver", "Align patterns with engineering reality."]],
    actors: ["Borrower", "Mortgage professional", "Underwriting ops", "Product + Eng"],
    journey: ["Explore", "Qualify", "Compare", "Apply", "Underwrite", "Service"],
    evidence: [{ label: "Underwriting decision time", value: "37% faster", note: "Documented CV outcome", kind: "measured" }, { label: "Workflow clarity", value: "Objective", note: "Design objective — not a measured result", kind: "objective" }, { label: "Stakeholder alignment", value: "Objective", note: "Design objective — not a measured result", kind: "objective" }],
    testing: [["Workflow comprehension", "Task walkthrough + stakeholder review", "Documented design activity"], ["Decision-time outcome", "Production workflow observation", "Measured: 37% reduction"], ["Usability", "Moderated borrower / operator testing", "Test plan; result not supplied"]],
    ai: ["Research synthesis", "Scenario / edge-case exploration", "Prototype acceleration", "Human review + final design decision"]
  },
  {
    id: "02", tag: "ENTERPRISE SAAS", title: "Procurement & Supplier Experience",
    subtitle: "Making operational data usable for people who act on it.",
    role: "Sr UX Designer", client: "Computech Corporation",
    period: "Mar 2023 – Mar 2024", status: "ENTERPRISE PRODUCT",
    image: "/Dashboard.jpg",
    accent: "#4f8bff",
    impact: ["5 workflow families: procurement, supplier, compliance, spend, reconciliation", "4 data-heavy surfaces: dashboards, reporting, reconciliation, supplier views"],
    problem: "How might dense operational data expose the next decision instead of simply exposing more data?",
    summary: "Procurement, supplier diversity, compliance, spend visibility and reconciliation brought together through service experiences, onboarding workflows, reporting and dashboards.",
    contribution: ["Information architecture", "Workflow design", "Dashboard UX", "Reusable UI patterns"],
    decision: "Surface the next operational decision instead of presenting dense data as an undifferentiated dashboard.",
    process: [["Discover", "Interview stakeholders and map operational jobs."], ["Define", "Group requirements into roles and decisions."], ["Design", "Build IA, dashboards and workflow states."], ["Validate", "Review hierarchy and data interpretation."], ["Deliver", "Partner on scalable UI patterns."]],
    actors: ["Procurement lead", "Supplier", "Compliance reviewer", "Finance / ops"],
    journey: ["Onboard", "Collect", "Review", "Reconcile", "Report", "Act"],
    evidence: [{ label: "Workflow coverage", value: "5 families", note: "Procurement • supplier • compliance • spend • reconciliation", kind: "scope" }, { label: "Data-heavy surfaces", value: "4 surfaces", note: "Dashboards, reporting, reconciliation, supplier views", kind: "scope" }, { label: "Outcome metrics", value: "Not supplied", note: "No quantified result in source CV", kind: "gap" }],
    testing: [["Information findability", "Task-based usability testing", "Test plan; result not supplied"], ["Dashboard comprehension", "Scenario walkthrough + heuristic review", "Design validation"], ["Supplier onboarding", "End-to-end workflow test", "Test plan; result not supplied"]],
    ai: ["Cluster requirements", "Explore information structures", "Explore dashboard summaries", "Human verification of business rules"]
  },
  {
    id: "03", tag: "MEDIA / ADTECH / MARTECH", title: "Audience Intelligence & Media Products",
    subtitle: "Connecting content, audience signals and monetisation.",
    role: "Sr UI/UX Designer", client: "Way2News Interactive Pvt. Ltd",
    period: "May 2018 – Jun 2021", status: "MULTI-PRODUCT",
    image: "/way2news/product-screens.svg",
    accent: "#c06bff",
    impact: ["5 products: Way2News, AudiencePlay, AudiencePrime, DigitalKites, TheTasteCompany", "Mobile-first discovery shipped in 4 Indian languages"],
    problem: "How might consumer discovery and enterprise intelligence stay connected without flattening their different jobs?",
    summary: "Experiences across Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany — content discovery, segmentation, campaign management and monetisation.",
    contribution: ["Product UX", "Content discovery", "Audience workflows", "Interface systems"],
    decision: "Separate consumer discovery from operational intelligence while keeping the underlying audience signals connected.",
    process: [["Discover", "Map audience, editorial and platform needs."], ["Define", "Separate consumer and operational journeys."], ["Design", "Create discovery and intelligence surfaces."], ["Validate", "Review hierarchy and campaign flows."], ["Deliver", "Partner across product and engineering."]],
    actors: ["Reader", "Marketer", "Audience analyst", "Editorial / product"],
    journey: ["Discover", "Engage", "Segment", "Target", "Measure", "Monetise"],
    evidence: [{ label: "Named products", value: "5 products", note: "Way2News + AudiencePlay + AudiencePrime + DigitalKites + TheTasteCompany", kind: "scope" }, { label: "Workflow families", value: "4 families", note: "Discovery • segmentation • campaigns • monetisation", kind: "scope" }, { label: "Quantified outcomes", value: "Not supplied", note: "No metric supplied in source CV", kind: "gap" }],
    testing: [["Content discovery", "Tree test / usability task", "Test plan; result not supplied"], ["Audience segmentation", "Scenario-based workflow test", "Test plan; result not supplied"], ["Campaign management", "Prototype review + task test", "Design validation"]],
    ai: ["Explore segmentation concepts", "Summarise research themes", "Generate campaign-state variants", "Human judgement on audience context"]
  },
  {
    id: "04", tag: "E-COMMERCE", title: "E-commerce Product Experience",
    subtitle: "An end-to-end build from discovery to checkout.",
    role: "Product Designer", client: "Recently completed e-commerce project",
    period: "Recently completed", status: "NEW CHAPTER",
    image: "/ecommerce-art.svg",
    accent: "#2fd4a7",
    impact: ["6 journey stages defined as one connected flow: discovery → checkout", "4 state coverages: loading, empty, error, success"],
    problem: "How might a shopper understand value, trust the product and complete the purchase with less cognitive friction?",
    summary: "A new portfolio chapter focused on product discovery, evaluation, cart, checkout and responsive states — with honest evidence boundaries where results were not supplied.",
    contribution: ["End-to-end UX", "Product architecture", "Responsive interaction", "Checkout states"],
    decision: "Reduce cognitive friction by making value, trust and purchase state explicit throughout the journey.",
    process: [["Discover", "Map intent, search and purchase friction."], ["Define", "Prioritise confidence, trust and clarity."], ["Design", "Build product, cart and checkout states."], ["Validate", "Test findability and completion."], ["Deliver", "Ship reusable interaction patterns."]],
    actors: ["Shopper", "Evaluator", "Buyer", "Commerce operator"],
    journey: ["Land", "Browse", "Evaluate", "Add", "Checkout", "Return"],
    evidence: [{ label: "Journey stages", value: "6 stages", note: "Discovery → checkout defined as one connected journey", kind: "scope" }, { label: "State coverage", value: "4 states", note: "Loading • empty • error • success", kind: "scope" }, { label: "Performance metrics", value: "Not supplied", note: "No invented numbers", kind: "gap" }],
    testing: [["Product findability", "Tree test / moderated task", "Test plan; result not supplied"], ["Product comprehension", "Task-based usability test", "Test plan; result not supplied"], ["Checkout completion", "End-to-end task + analytics", "Test plan; result not supplied"]],
    ai: ["Merchandising ideation", "Copy and edge-case exploration", "Rapid responsive prototype exploration", "Human review before release"]
  }
];

const capabilities = [
  { icon: Target, title: "Product Strategy", desc: "Framing ambiguous problems into direction and measurable outcomes." },
  { icon: BrainCircuit, title: "AI-Native UX", desc: "AIX / MLUX patterns for human-in-the-loop intelligence." },
  { icon: Network, title: "Systems Thinking", desc: "Actors, states and dependencies made visible before interface." },
  { icon: Workflow, title: "Workflow Design", desc: "High-consequence operations designed for clarity and recovery." },
  { icon: Layers, title: "Design Systems", desc: "Reusable patterns, governance and critique loops." },
  { icon: Compass, title: "Research & Discovery", desc: "Interviews, journey maps and validation trails." },
  { icon: Zap, title: "Growth & Onboarding", desc: "Adoption journeys informed by behavioural insight." },
  { icon: ShieldCheck, title: "Accessibility", desc: "WCAG-minded contrast, states and semantics." }
];

const experience = [
  { period: "2024 – 26", org: "HomeLoc Solutions LLP", role: "Lead Product Design Consultant", domain: "Mortgage / FinTech", note: "US mortgage workflows; 37% underwriting decision-time reduction." },
  { period: "2023 – 24", org: "Computech Corporation", role: "Sr UX Designer", domain: "Enterprise / Procurement", note: "Procurement, supplier diversity, compliance and spend platforms." },
  { period: "2022 – 23", org: "Visual IT Solution", role: "Sr UX Designer", domain: "GovTech / Accessibility", note: "ePragathi and citizen-service ecosystems; accessibility-first design." },
  { period: "2021 – 22", org: "Gaian Solution", role: "Sr UX Designer", domain: "Media / Broadcasting", note: "Broadcasting, TV technology and media monetisation experiences." },
  { period: "2018 – 21", org: "Way2News Interactive", role: "Sr UI/UX Designer", domain: "Media / MarTech", note: "Five products across discovery, audience intelligence and monetisation." },
  { period: "2016 – 18", org: "Nitya Software India", role: "UI/UX Designer", domain: "Recruitment Tech", note: "JobsNProfiles, VioTalk; IA, flows and responsive product design." }
];

const faqs = [
  { q: "What is my expertise?", a: "Product strategy with hands-on craft. I frame ambiguous problems, map the system behind them, and design the interface — across FinTech, mortgage lending, enterprise SaaS, GovTech, media and recruitment technology over 11 years." },
  { q: "How do I use AI in my process?", a: "AI accelerates research synthesis, scenario exploration and prototyping. Humans own judgement: every design decision, evidence claim and release call stays accountable. AIX / MLUX thinking shapes how the product itself exposes AI." },
  { q: "How do I think about product strategy?", a: "Connect user intent to operational and business constraints before touching interface. The measurable outcome matters: an implemented underwriting workflow improvement reduced decision time by 37%." },
  { q: "How do I work with teams?", a: "As a partner to Product, Engineering and business stakeholders — discovery workshops, design critique, mentoring and design-system governance, translating complex technical concepts into usable product experiences." },
  { q: "Am I open to new roles?", a: "Yes — full-time, contract or remote, focused on AI-native products, enterprise platforms and high-consequence workflows. Let's connect." }
];

/* --------------------------------- motion --------------------------------- */

function Reveal({ children, delay = 0, className = "", y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
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

function SpotlightCard({ children, className = "", accent = "#7c8cff" }: { children: ReactNode; className?: string; accent?: string }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  return (
    <div
      className={`spot-card ${className}`}
      style={{ "--spot-x": useTransform(sx, v => `${v}px`) as any, "--spot-y": useTransform(sy, v => `${v}px`) as any, "--spot-accent": accent } as any}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
    >
      {children}
    </div>
  );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {[...items, ...items].map((x, i) => <span key={i}>{x}<i>✦</i></span>)}
      </div>
    </div>
  );
}

/* ---------------------------------- chrome --------------------------------- */

const NAV = [["Work", "#work"], ["Capabilities", "#capabilities"], ["Experience", "#experience"], ["FAQ", "#faq"], ["Contact", "#contact"]];

function Header({ active }: { active: string }) {
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
        <a className="btn btn-ghost btn-sm" href={CV} target="_blank" rel="noreferrer"><FileText size={14}/> CV</a>
        <a className="btn btn-primary btn-sm" href={`mailto:${EMAIL}`}><Mail size={14}/> Let's talk</a>
      </div>
      <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Menu">{open ? <X size={20}/> : <Menu size={20}/>}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            {NAV.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); setOpen(false); scrollTo(href); }}>{label}<ArrowUpRight size={14}/></a>)}
            <a href={CV} target="_blank" rel="noreferrer">Download CV<ArrowDown size={14}/></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------------------------- hero ----------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  return (
    <section className="hero" id="home" ref={ref}>
      <motion.div className="hero-glow glow-a" style={{ y: glowY }} aria-hidden="true"/>
      <motion.div className="hero-glow glow-b" style={{ y: glowY }} aria-hidden="true"/>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="pulse-dot" aria-hidden="true"/> Available for select engagements
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.06, ease: EASE }}>
            Designing clear systems for <span className="grad-text">complex products</span>.
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease: EASE }}>
            Ajay Kumar Myakala — Staff Product Designer with 11 years across FinTech, enterprise SaaS, GovTech and media. AI-native UX, product strategy and interface craft.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26, ease: EASE }}>
            <button className="btn btn-primary" onClick={() => scrollTo("#work")}>Explore work <ArrowUpRight size={16}/></button>
            <a className="btn btn-ghost" href={CV} target="_blank" rel="noreferrer"><FileText size={15}/> View CV</a>
          </motion.div>
          <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.7 }}>
            <div><strong><Counter to={11}/></strong><span>years of product context</span></div>
            <div><strong><Counter to={37} suffix="%"/></strong><span>documented underwriting reduction</span></div>
            <div><strong><Counter to={5}/></strong><span>industry domains shipped</span></div>
          </motion.div>
        </div>
        <motion.div className="hero-art" style={{ y: artY }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }} aria-hidden="true">
          <div className="orbit-wrap">
            <span className="orbit o1"><i/><em>UX</em></span>
            <span className="orbit o2"><i/><em>AI</em></span>
            <span className="orbit o3"><i/><em>Strategy</em></span>
            <span className="orbit o4"><i/><em>Systems</em></span>
            <div className="hero-mock glass">
              <div className="mock-bar"><span/><span/><span/></div>
              <div className="mock-body">
                <div className="mock-chip-row"><span className="mock-chip c1"/><span className="mock-chip c2"/><span className="mock-chip c3"/></div>
                <div className="mock-line w80"/><div className="mock-line w60"/>
                <div className="mock-cards"><span/><span/><span/></div>
                <div className="mock-line w70"/><div className="mock-line w40"/>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Marquee items={["PRODUCT STRATEGY", "AI-NATIVE UX", "DESIGN SYSTEMS", "HUMAN + AI", "ENTERPRISE WORKFLOWS", "ZERO-TO-ONE", "RESEARCH", "MOTION"]}/>
    </section>
  );
}

/* ----------------------------------- work ---------------------------------- */

function BrowserFrame({ image, alt, accent }: { image: string; alt: string; accent: string }) {
  return (
    <div className="browser-frame">
      <div className="frame-bar">
        <span className="dot r" style={{ background: accent }}/><span className="dot"/><span className="dot"/>
        <span className="frame-url">{alt}</span>
      </div>
      <div className="frame-body"><img src={image} alt={alt} loading="lazy"/></div>
    </div>
  );
}

function Work({ onOpen }: { onOpen: (p: typeof projects[number]) => void }) {
  return (
    <section className="work" id="work">
      <div className="section-head">
        <Reveal><p className="kicker">01 — SELECTED WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Systems shipped,<br/><span className="grad-text">evidence honest.</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Four case studies across FinTech, enterprise, media and commerce. Measured outcomes stay separated from design objectives — nothing invented.</p></Reveal>
      </div>
      <div className="work-list">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.06}>
            <SpotlightCard accent={p.accent} className="work-card">
              <button className="work-card-btn" onClick={() => onOpen(p)} aria-label={`Open case study: ${p.title}`}>
                <div className="work-visual"><BrowserFrame image={p.image} alt={p.title} accent={p.accent}/></div>
                <div className="work-body">
                  <div className="work-top">
                    <span className="work-tag" style={{ color: p.accent, borderColor: `${p.accent}55`, background: `${p.accent}14` }}>{p.tag}</span>
                    <span className="work-status">{p.status}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.subtitle}</p>
                  <div className="work-impact">
                    {p.impact.map(x => <span key={x}><Zap size={12} style={{ color: p.accent }}/>{x}</span>)}
                  </div>
                  <div className="work-foot">
                    <span>{p.role} · {p.period}</span>
                    <em>OPEN CASE <ArrowUpRight size={13}/></em>
                  </div>
                </div>
              </button>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ concept gallery ----------------------------- */

const conceptArt: [string, string, string, string, LucideIcon][] = [
  ["ecosystem", "/concept-maps/ecosystem-map-realistic-clean.png", "Ecosystem map", "Actors, surfaces and constraints as one connected system.", Network],
  ["blueprint", "/concept-maps/service-blueprint-realistic-clean.png", "Service blueprint", "Frontstage interaction wired to backstage rules and evidence.", Workflow],
  ["ai", "/concept-maps/ai-human-loop-realistic-clean.png", "AI human loop", "Assistive generation with visible evidence and accountability.", BrainCircuit],
  ["journey", "/concept-maps/journey-map-realistic-clean.png", "Journey map", "Intent, confidence and friction across the experience.", Compass],
  ["decision", "/concept-maps/decision-tree-realistic-clean.png", "Decision tree", "High-consequence choices with paths and recovery.", GitBranch],
  ["research", "/concept-maps/research-loop-realistic-clean.png", "Research loop", "Observation through synthesis, hypothesis and validation.", FlaskConical],
  ["matrix", "/concept-maps/opportunity-matrix-realistic-clean.png", "Opportunity matrix", "Priorities balanced by user value and delivery confidence.", Target],
  ["quality", "/concept-maps/quality-loop-realistic-clean.png", "Quality loop", "Critique, accessibility and testing as continuous loops.", ShieldCheck]
];

function Concepts() {
  const [sel, setSel] = useState(0);
  const [, img, title, desc, Icon] = conceptArt[sel];
  return (
    <section className="concepts" id="concepts">
      <div className="section-head">
        <Reveal><p className="kicker">02 — CONCEPT MAPS</p></Reveal>
        <Reveal delay={0.06}><h2>Making the system<br/><span className="grad-text">visible first.</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Working artefacts from real engagements — maps that turn people, rules and states into decisions before interface choices harden.</p></Reveal>
      </div>
      <Reveal>
        <div className="concept-switcher glass">
          <div className="concept-tabs" role="tablist" aria-label="Concept map patterns">
            {conceptArt.map(([id, , label], i) => (
              <button key={id as string} role="tab" aria-selected={sel === i} className={sel === i ? "active" : ""} onClick={() => setSel(i)}>{label as string}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={sel} className="concept-stage" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="concept-copy">
                <Icon size={22} strokeWidth={1.6}/>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <div className="concept-img-wrap"><img src={img} alt={`${title} concept map`} loading="lazy"/></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- capabilities ------------------------------ */

function Capabilities() {
  return (
    <section className="capabilities" id="capabilities">
      <div className="section-head">
        <Reveal><p className="kicker">03 — CAPABILITIES</p></Reveal>
        <Reveal delay={0.06}><h2>What I bring<br/><span className="grad-text">to the table.</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Strategy through craft — the working disciplines behind every shipped system.</p></Reveal>
      </div>
      <div className="cap-grid">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={(i % 4) * 0.06}>
            <SpotlightCard accent="#8b7cff" className="cap-card glass">
              <c.icon size={22} strokeWidth={1.6}/>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- experience ------------------------------- */

function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section className="experience" id="experience">
      <div className="section-head">
        <Reveal><p className="kicker">04 — EXPERIENCE</p></Reveal>
        <Reveal delay={0.06}><h2>11 years of<br/><span className="grad-text">product context.</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Recruitment → media → adtech → govtech → enterprise → fintech. One continuous practice of reducing ambiguity.</p></Reveal>
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
              {open === i && <motion.div className="xp-note" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}>
                <p>{x.note}</p>
              </motion.div>}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="section-head">
        <Reveal><p className="kicker">05 — QUESTIONS</p></Reveal>
        <Reveal delay={0.06}><h2>Answered here.<br/><span className="grad-text">More over a call.</span></h2></Reveal>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className={`faq-item ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}<ChevronDown size={18}/>
              </button>
              <AnimatePresence initial={false}>
                {open === i && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}><p>{f.a}</p></motion.div>}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- contact -------------------------------- */

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true"/>
      <div className="contact-inner">
        <Reveal><p className="kicker">06 — CONTACT</p></Reveal>
        <Reveal delay={0.06}><h2>Have a complex<br/><span className="grad-text">product problem?</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Let's turn ambiguity into a map, a prototype and a decision.</p></Reveal>
        <Reveal delay={0.18}>
          <div className="contact-actions">
            <a className="btn btn-primary btn-lg" href={`mailto:${EMAIL}`}><Mail size={17}/> {EMAIL}</a>
            <a className="btn btn-ghost btn-lg" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>
            <a className="btn btn-ghost btn-lg" href={CV} target="_blank" rel="noreferrer"><FileText size={16}/> Download CV</a>
          </div>
        </Reveal>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ajay Kumar Myakala</span>
        <span className="footer-mid" aria-hidden="true">DESIGNED AS A SYSTEM · BUILT WITH CARE</span>
        <a href="#home" onClick={e => { e.preventDefault(); scrollTo("#home"); }}>BACK TO TOP ↑</a>
      </footer>
    </section>
  );
}

/* -------------------------------- case study ------------------------------- */

function CaseOverlay({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }, []);
  useEffect(() => { const key = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [onClose]);
  return (
    <motion.div className="case-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="case-sheet" role="dialog" aria-modal="true" aria-labelledby="case-title" initial={{ y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <button className="case-close" onClick={onClose} aria-label="Close case study"><X size={18}/></button>
        <header className="case-hero">
          <span className="case-kicker" style={{ color: project.accent }}>{project.tag} · {project.status}</span>
          <h2 id="case-title">{project.title}</h2>
          <p>{project.subtitle}</p>
          {project.link && <a className="case-link" href={project.link} target="_blank" rel="noreferrer">Open live product <ExternalLink size={14}/></a>}
        </header>
        <div className="case-figure"><img src={project.image} alt={`${project.title} product visual`}/></div>
        <div className="case-meta">
          <span><b>ROLE</b>{project.role}</span>
          <span><b>CLIENT</b>{project.client}</span>
          <span><b>PERIOD</b>{project.period}</span>
        </div>
        <section className="case-section">
          <h3>The brief</h3>
          <p className="case-problem">{project.problem}</p>
          <p className="case-body">{project.summary}</p>
          <div className="case-pills">{project.contribution.map(x => <span key={x}>{x}</span>)}</div>
        </section>
        <section className="case-section">
          <h3>Design process</h3>
          <div className="case-process">{project.process.map(([t, d], i) => <div key={t}><span>0{i + 1}</span><b>{t}</b><p>{d}</p></div>)}</div>
          <p className="case-decision"><Sparkles size={14}/><b>Key decision — </b>{project.decision}</p>
        </section>
        <section className="case-section">
          <h3>Journey &amp; actors</h3>
          <div className="case-journey">{project.journey.map((x, i) => <span key={x}><em>{String(i + 1).padStart(2, "0")}</em>{x}</span>)}</div>
          <div className="case-pills subtle">{project.actors.map(x => <span key={x}><Users size={12}/>{x}</span>)}</div>
        </section>
        <section className="case-section">
          <h3>Evidence</h3>
          <div className="case-evidence">
            {project.evidence.map(x => <div key={x.label} className={`ev-row k-${x.kind}`}><div><b>{x.label}</b><small>{x.note}</small></div><strong>{x.value}</strong></div>)}
          </div>
          <div className="case-testing">
            {project.testing.map(([a, b, c]) => <div key={a}><b>{a}</b><span>{b}</span><em className={c.startsWith("Measured") ? "m" : c.startsWith("Test") ? "p" : "d"}>{c}</em></div>)}
          </div>
        </section>
        <section className="case-section">
          <h3>AI involvement</h3>
          <div className="case-ai">{project.ai.map((x, i) => <div key={x}><span>0{i + 1}</span><BrainCircuit size={15}/><b>{x}</b><small>{i === project.ai.length - 1 ? "Human accountability" : "Assistive workflow"}</small></div>)}</div>
        </section>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const [active, setActive] = useState("home");
  const [caseStudy, setCaseStudy] = useState<typeof projects[number] | null>(null);
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Staff Product Designer | AI & Agent Experience";
    const ids = ["home", "work", "concepts", "capabilities", "experience", "faq", "contact"];
    const nodes = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) setActive(vis.target.id);
    }, { threshold: [0.25, 0.5] });
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return (
    <div className="page">
      <div className="scroll-progress" aria-hidden="true"/>
      <Header active={active}/>
      <main>
        <Hero/>
        <Work onOpen={setCaseStudy}/>
        <Concepts/>
        <Capabilities/>
        <Experience/>
        <Faq/>
        <Contact/>
      </main>
      <AnimatePresence>{caseStudy && <CaseOverlay project={caseStudy} onClose={() => setCaseStudy(null)}/>}</AnimatePresence>
    </div>
  );
}
