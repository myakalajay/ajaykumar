import React, { useEffect, useState, type ReactNode } from "react";
import "@fontsource-variable/geist";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BrainCircuit, Check, ChevronRight,
  CircleDot, Compass, Download, ExternalLink, FileText, FlaskConical,
  GitBranch, Linkedin, Mail, Menu, Network, ShieldCheck,
  Target, Users, Workflow, X
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;
const CV = "/Ajay_Kumar_Myakala_Design_Strategist_CV.pdf";

const projects = [
  {
    id: "01", type: "FINTECH / MORTGAGE", title: "HomeRatesYard / Mortgage Experience",
    subtitle: "From rate discovery to a clearer borrowing journey.", client: "HomeLoc Solutions LLP",
    period: "Apr 2024 – May 2024", role: "Lead Product Design Consultant", status: "LIVE PRODUCT",
    image: "/Homepage.jpg", link: "https://homeratesyard.com/", accent: "red",
    outcome: "37%", outcomeLabel: "documented reduction in underwriting decision time",
    problem: "How might a high-stakes mortgage workflow feel clearer without hiding its operational complexity?",
    summary: "A mortgage and lending ecosystem spanning origination, underwriting, onboarding, servicing and lending operations. The design direction connected borrower intent to operational decisions.",
    contribution: ["Workflow framing", "Experience architecture", "Interaction design", "Design direction"],
    decision: "Connect borrower intent to operational decision points instead of treating rate discovery and underwriting as separate experiences.",
    process: [["Discover", "Map actors, constraints and decision moments."], ["Define", "Frame workflow friction and risk."], ["Design", "Turn rules into clear journeys and states."], ["Validate", "Review workflow clarity with stakeholders."], ["Deliver", "Align patterns with engineering reality."]],
    actors: ["Borrower", "Mortgage professional", "Underwriting operations", "Product + Engineering"], journey: ["Explore", "Qualify", "Compare", "Apply", "Underwrite", "Service"],
    evidence: [{ label: "Underwriting decision time", value: 37, note: "Documented CV outcome", kind: "measured" }, { label: "Workflow clarity", value: 100, note: "Design objective — not a measured result", kind: "objective" }, { label: "Stakeholder alignment", value: 100, note: "Design objective — not a measured result", kind: "objective" }],
    testing: [["Workflow comprehension", "Task walkthrough + stakeholder review", "Documented design activity"], ["Decision-time outcome", "Production workflow observation", "Measured: 37% reduction"], ["Usability", "Moderated borrower / operator testing", "Test plan; result not supplied"]],
    ai: ["Research synthesis", "Scenario / edge-case exploration", "Prototype acceleration", "Human review + final design decision"]
  },
  {
    id: "02", type: "ENTERPRISE SAAS", title: "Procurement & Supplier Experience", subtitle: "Making operational data usable for people who have to act on it.", client: "Computech Corporation", period: "Mar 2023 – Mar 2024", role: "Sr UX Designer", status: "ENTERPRISE PRODUCT", image: "/Dashboard.jpg", accent: "coral",
    problem: "How might dense operational data expose the next decision instead of simply exposing more data?", summary: "Procurement, supplier diversity, compliance, spend visibility and reconciliation brought together through service experiences, onboarding workflows, reporting and dashboards.",
    contribution: ["Information architecture", "Workflow design", "Dashboard UX", "Reusable UI patterns"],
    decision: "Surface the next operational decision instead of presenting dense data as an undifferentiated dashboard.",
    process: [["Discover", "Interview stakeholders and map operational jobs."], ["Define", "Group requirements into roles and decisions."], ["Design", "Build IA, dashboards and workflow states."], ["Validate", "Review hierarchy and data interpretation."], ["Deliver", "Partner on scalable UI patterns."]], actors: ["Procurement lead", "Supplier", "Compliance reviewer", "Finance / operations"], journey: ["Onboard", "Collect", "Review", "Reconcile", "Report", "Act"],
    evidence: [{ label: "Workflow coverage", value: 5, note: "Procurement • supplier • compliance • spend • reconciliation", kind: "scope" }, { label: "Data-heavy surfaces", value: 4, note: "Dashboards, reporting, reconciliation, supplier views", kind: "scope" }, { label: "Outcome metrics", value: 0, note: "No quantified result supplied in source CV", kind: "not-supplied" }],
    testing: [["Information findability", "Task-based usability testing", "Test plan; result not supplied"], ["Dashboard comprehension", "Scenario walkthrough + heuristic review", "Design validation"], ["Supplier onboarding", "End-to-end workflow test", "Test plan; result not supplied"]], ai: ["Cluster requirements", "Explore information structures", "Explore dashboard summaries", "Human verification of business rules"]
  },
  {
    id: "03", type: "MEDIA / ADTECH / MARTECH", title: "Audience Intelligence & Media Products", subtitle: "Connecting content, audience signals and monetisation workflows.", client: "Way2News Interactive Pvt. Ltd", period: "May 2018 – Jun 2021", role: "Sr UI/UX Designer", status: "MULTI-PRODUCT", image: "/Reporting - Reporting Periods.jpg", accent: "orange",
    problem: "How might consumer discovery and enterprise intelligence stay connected without flattening their different jobs?", summary: "Experiences across Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany, spanning content discovery, segmentation, campaign management and monetisation.",
    contribution: ["Product UX", "Content discovery", "Audience workflows", "Interface systems"],
    decision: "Separate consumer discovery from operational intelligence while keeping the underlying audience signals connected.",
    process: [["Discover", "Map audience, editorial and platform needs."], ["Define", "Separate consumer and operational journeys."], ["Design", "Create discovery and intelligence surfaces."], ["Validate", "Review hierarchy and campaign flows."], ["Deliver", "Partner across product and engineering."]], actors: ["Reader", "Marketer", "Audience analyst", "Editorial / product team"], journey: ["Discover", "Engage", "Segment", "Target", "Measure", "Monetise"],
    evidence: [{ label: "Named products", value: 5, note: "Way2News + AudiencePlay + AudiencePrime + DigitalKites + TheTasteCompany", kind: "scope" }, { label: "Workflow families", value: 4, note: "Discovery • segmentation • campaigns • monetisation", kind: "scope" }, { label: "Quantified outcomes", value: 0, note: "No metric supplied in source CV", kind: "not-supplied" }],
    testing: [["Content discovery", "Tree test / usability task", "Test plan; result not supplied"], ["Audience segmentation", "Scenario-based workflow test", "Test plan; result not supplied"], ["Campaign management", "Prototype review + task test", "Design validation"]], ai: ["Explore segmentation concepts", "Summarise research themes", "Generate campaign-state variants", "Human judgement on audience context"]
  },
  {
    id: "04", type: "RECENT / E-COMMERCE", title: "E-commerce Product Experience", subtitle: "A recent end-to-end build from discovery to checkout.", client: "Recently completed e-commerce project", period: "Recently completed", role: "Product Designer", status: "RECENTLY COMPLETED", image: "/ecommerce-art.svg", accent: "red",
    problem: "How might a shopper understand value, trust the product and complete the purchase with less cognitive friction?", summary: "A new portfolio chapter focused on product discovery, evaluation, cart, checkout and responsive states. No conversion or usability results are invented where evidence was not supplied.",
    contribution: ["End-to-end UX", "Product architecture", "Responsive interaction", "Checkout states"],
    decision: "Reduce cognitive friction by making value, trust and purchase state explicit throughout the journey.",
    process: [["Discover", "Map intent, search and purchase friction."], ["Define", "Prioritise confidence, trust and clarity."], ["Design", "Build product, cart and checkout states."], ["Validate", "Test findability and completion."], ["Deliver", "Ship reusable interaction patterns."]], actors: ["Shopper", "Evaluator", "Buyer", "Commerce operator"], journey: ["Land", "Browse", "Evaluate", "Add", "Checkout", "Return"],
    evidence: [{ label: "Journey stages", value: 6, note: "Discovery → checkout defined as one connected journey", kind: "scope" }, { label: "State coverage", value: 4, note: "Loading • empty • error • success", kind: "scope" }, { label: "Performance metrics", value: 0, note: "Not supplied — no invented numbers", kind: "not-supplied" }],
    testing: [["Product findability", "Tree test / moderated task", "Test plan; result not supplied"], ["Product comprehension", "Task-based usability test", "Test plan; result not supplied"], ["Checkout completion", "End-to-end task + analytics", "Test plan; result not supplied"]], ai: ["Merchandising ideation", "Copy and edge-case exploration", "Rapid responsive prototype exploration", "Human review before release"]
  }
];

const concepts = [
  { id: "01", title: "Ecosystem map", tag: "SYSTEM", icon: Network, desc: "See actors, surfaces, data and business constraints as one connected product system.", implication: "Align people, platform, operations and business rules before defining the interface." },
  { id: "02", title: "Service blueprint", tag: "SERVICE", icon: Workflow, desc: "Connect frontstage interaction to backstage rules, operations and evidence.", implication: "Expose service dependencies so the visible journey can be designed with the operating model." },
  { id: "03", title: "AI human loop", tag: "AI / HCI", icon: BrainCircuit, desc: "Make AI assistance visible while keeping evidence and human accountability explicit.", implication: "Keep generation assistive, evidence visible and final decisions accountable to people." },
  { id: "04", title: "Journey map", tag: "JOURNEY", icon: Compass, desc: "Show intent, confidence, friction and system response across the experience.", implication: "Design the transitions between user intent, decision points and system response." },
  { id: "05", title: "Decision tree", tag: "FLOW", icon: GitBranch, desc: "Design high-consequence choices with clear paths, recovery and explanation.", implication: "Make risk, recovery and explanation visible where a wrong path has a meaningful cost." },
  { id: "06", title: "Research loop", tag: "RESEARCH", icon: FlaskConical, desc: "Move evidence from observation through synthesis, hypothesis and validation.", implication: "Keep every design move traceable to an observation, hypothesis or validation signal." },
  { id: "07", title: "Opportunity matrix", tag: "STRATEGY", icon: Target, desc: "Prioritise opportunities by user value and delivery confidence.", implication: "Balance user value, confidence and delivery risk before committing design effort." },
  { id: "08", title: "Quality loop", tag: "GOVERNANCE", icon: ShieldCheck, desc: "Keep critique, accessibility, testing and design-system governance continuous.", implication: "Keep critique, accessibility and testing in the loop rather than treating quality as a final gate." }
];


function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}


function Logo() {
  return <button className="brand" onClick={() => scrollTo("#home")} aria-label="Back to top"><span className="brand-mark">A</span><span><b>AJAY</b><small>PRODUCT DESIGN</small></span></button>;
}

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["Concepts", "#concepts"], ["Experience", "#experience"], ["About", "#about"]];
  return <header className="nav-wrap"><nav className="nav"><Logo/><div className="nav-links">{links.map(([label, href]) => <a key={href} className={active === href.slice(1) ? "active" : ""} href={href} onClick={e => { e.preventDefault(); scrollTo(href); }}>{label}</a>)}</div><div className="nav-actions"><a className="resume-link" href={CV} target="_blank" rel="noreferrer"><FileText size={14}/> Resume</a><button className="nav-cta" onClick={() => scrollTo("#contact")}>Let's talk <ArrowUpRight size={14}/></button></div><button className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Open navigation">{open ? <X/> : <Menu/>}</button></nav><AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{links.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); setOpen(false); scrollTo(href); }}>{label}<ChevronRight size={15}/></a>)}<a href={CV} target="_blank" rel="noreferrer">Resume <Download size={15}/></a></motion.div>}</AnimatePresence></header>;
}

function SlideRail({ active }: { active: string }) {
  const slides = [["home", "Intro"], ["work", "Selected work"], ["concepts", "Concept maps"], ["experience", "Experience"], ["about", "Working model"], ["contact", "Contact"]];
  return <aside className="slide-rail" aria-label="Page navigation"><div className="slide-rail-line" aria-hidden="true"/>{slides.map(([id, label], i) => <button key={id} className={active === id ? "active" : ""} onClick={() => scrollTo(`#${id}`)} aria-label={`Go to ${label}`}><span>{String(i + 1).padStart(2, "0")}</span><i/></button>)}<b>{String(Math.max(1, slides.findIndex(([id]) => id === active) + 1)).padStart(2, "0")} / 06</b></aside>;
}

function SlideSection({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return <section id={id} className={`section slide-section ${className}`}><div className="section-no" aria-hidden="true">{id === "home" ? "00" : id === "work" ? "01" : id === "concepts" ? "02" : id === "experience" ? "03" : id === "about" ? "04" : "05"}</div>{children}</section>;
}

function CareerTimeline() {
  const roles: [string, string, number][] = [["16–18", "Recruitment", 22], ["18–21", "Media", 38], ["21–22", "AdTech", 50], ["22–23", "GovTech", 64], ["23–24", "Enterprise", 82], ["24", "FinTech", 96]];
  return <div className="career-chart" aria-label="Career timeline from 2016 to 2024"><div className="career-chart-head"><span>CAREER ARC</span><b>2016 → 2024</b></div><div className="career-axis"><span>2016</span><i/><span>2024</span></div><div className="career-bars">{roles.map(([year, label, width], i) => <div className="career-row" key={year}><span>{year}</span><div><i style={{ width: `${width}%`, animationDelay: `${i * .08}s` }}/><b>{label}</b></div></div>)}</div><div className="career-chart-foot"><span>ROLE CONTEXT</span><span>DOCUMENTED CAREER HISTORY</span></div></div>;
}

function Hero() {
  return <section className="hero hero-reference" id="home">
    <div className="hero-reference-art" aria-hidden="true">
      <div className="ref-grid" />
      <div className="ref-ring ring-one" />
      <div className="ref-ring ring-two" />
      <div className="ref-ring ring-three" />
      <span className="ref-dot ref-dot-one" />
      <span className="ref-dot ref-dot-two" />
      <span className="ref-star">✦</span>
      <span className="ref-cross ref-cross-one" />
      <span className="ref-cross ref-cross-two" />
    </div>

    <div className="hero-reference-layout">
      <motion.div className="reference-copy" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, ease }}>
        <div className="reference-eyebrow"><span /> PRODUCT DESIGN · AI · SYSTEMS</div>
        <h1><span>Design</span><span className="red">change.</span><span>Modern <em>UI/UX.</em></span><span>Better products.</span></h1>
        <p>I turn complex product problems into clear systems — from strategy and research to interface, evidence and AI-assisted workflows.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => scrollTo("#work")}>Explore work <ArrowRight size={16} /></button>
          <a className="secondary-btn" href={CV} target="_blank" rel="noreferrer">View CV <ExternalLink size={14} /></a>
        </div>
      </motion.div>

      <div className="reference-portrait-stage">
        <motion.div className="reference-red-shadow" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15, duration: .8, ease }} />
        <motion.div className="reference-portrait" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .85, ease }}>
          <img src="/ajay_kumar.png" alt="Ajay Kumar Myakala, Product Designer" />
          <div className="reference-name"><b>AJAY KUMAR</b><span>PRODUCT DESIGNER</span></div>
        </motion.div>
        <div className="reference-graphic graphic-top">PRODUCT<br/><b>THINKING</b></div>
        <div className="reference-arrow arrow-one"><span>Strategy</span><i /><b>UX</b></div>
        <div className="reference-arrow arrow-two"><span>Systems</span><i /><b>UI</b></div>
        <div className="reference-arrow arrow-three"><span>Evidence</span><i /><b>AI</b></div>
        <div className="reference-curve" aria-hidden="true" />
        <div className="reference-caption">01 / DESIGN STUDY</div>
      </div>

      <motion.aside className="reference-side" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18, duration: .7, ease }}>
        <span className="reference-side-kicker">A PRODUCT DESIGN PRACTICE</span>
        <div className="reference-side-title">From ambiguity<br/><b>to usable systems.</b></div>
        <div className="reference-side-list">
          <span>Product strategy</span><span>Modern UI / UX</span><span>Design systems</span><span>Human + AI</span>
        </div>
        <div className="reference-proof"><strong>11</strong><span>years of<br/>product context</span></div>
        <div className="reference-proof"><strong>37%</strong><span>documented<br/>underwriting reduction</span></div>
      </motion.aside>
    </div>

    <div className="reference-bottom"><span>SCROLL TO EXPLORE</span><button onClick={() => scrollTo("#work")} aria-label="Scroll to selected work"><ArrowDown size={15} /></button><span>01 / 06</span></div>
  </section>;
}

function Work() {
  const [active, setActive] = useState<typeof projects[number] | null>(null);
  return <SlideSection id="work" className="work-section"><div className="section-art art-work" aria-hidden="true"><span>01</span><i/><i/><i/></div><div className="section-head work-head"><div><span className="kicker">01 / Selected work</span><h2>Stories told<br/><span>through systems.</span></h2></div><p>Less portfolio theatre. More useful evidence: journeys, decisions, maps, product artefacts and documented outcomes.</p></div><div className="story-rail"><span>CASE STUDIES / 04</span><b>Problem</b><i/><b>System</b><i/><b>Interface</b><i/><b>Outcome</b></div><div className="work-grid"><motion.button className="project-card featured" onClick={() => setActive(projects[0])} whileHover={{ y: -6 }}><div className="project-visual accent-red"><img src={projects[0].image} alt="HomeRatesYard mortgage product"/><span className="project-status">LIVE PRODUCT</span><div className="project-map-label"><CircleDot size={13}/><span>Explore → Qualify → Compare → Apply</span></div></div><div className="project-body"><span className="project-type">{projects[0].type}</span><h3>{projects[0].title}</h3><p>{projects[0].subtitle}</p><div className="project-proof"><div><small>ROLE</small><b>{projects[0].role}</b></div><div><small>DOCUMENTED OUTCOME</small><b>{projects[0].outcome} <span>{projects[0].outcomeLabel}</span></b></div></div><div className="project-meta"><span>PROBLEM → SYSTEM → INTERFACE → OUTCOME</span><span>OPEN CASE <ArrowUpRight size={13}/></span></div></div></motion.button><div className="work-side">{projects.slice(1).map((p, i) => <motion.button key={p.id} className="project-card compact" onClick={() => setActive(p)} whileHover={{ y: -4 }} transition={{ delay: i * .04 }}><div className="project-visual accent-red"><img src={p.image} alt={`${p.title} product visual`}/><span className="project-status">{p.status}</span><div className="project-map-label"><CircleDot size={12}/><span>{p.journey.slice(0, 3).join(" → ")}</span></div></div><div className="project-body"><span className="project-type">{p.type}</span><h3>{p.title}</h3><p>{p.subtitle}</p><div className="project-meta"><span>{p.role}</span><span>OPEN <ArrowUpRight size={12}/></span></div></div></motion.button>)}</div></div><AnimatePresence>{active && <CaseStudy project={active} onClose={() => setActive(null)}/>}</AnimatePresence></SlideSection>;
}

function ProcessStrip({ steps }: { steps: string[][] }) { return <div className="process-strip">{steps.map(([title, desc], i) => <React.Fragment key={title}><div className="process-step"><span>0{i + 1}</span><b>{title}</b><p>{desc}</p></div>{i < steps.length - 1 && <div className="process-arrow"><ArrowRight size={14}/></div>}</React.Fragment>)}</div>; }
function JourneyMap({ items }: { items: string[] }) { return <div className="journey-map">{items.map((x, i) => <React.Fragment key={x}><div className="journey-node"><span>{String(i + 1).padStart(2, "0")}</span><b>{x}</b><small>{i === 0 ? "intent" : i === items.length - 1 ? "outcome" : "decision"}</small></div>{i < items.length - 1 && <div className="journey-line"/>}</React.Fragment>)}</div>; }
function EvidenceChart({ items }: { items: { label: string; value: number; note: string; kind: string }[] }) { return <div className="evidence-chart">{items.map(x => <div className="evidence-row" key={x.label}><div><b>{x.label}</b><small>{x.note}</small></div><div className="bar-track"><span className={`bar-fill ${x.kind}`} style={{ width: `${Math.min(100, x.value || 4)}%` }}/><strong>{x.kind === "measured" ? `${x.value}%` : x.value ? x.value : "—"}</strong></div></div>)}</div>; }
function TestingTable({ rows }: { rows: string[][] }) { return <div className="testing-table">{rows.map(([a, b, c]) => <div className="test-row" key={a}><b>{a}</b><span>{b}</span><em className={c.startsWith("Measured") ? "measured" : c.startsWith("Test plan") ? "plan" : "documented"}>{c}</em></div>)}</div>; }

function MapArtwork({ index }: { index: number }) {
  const maps = [
    ['concept-paper-pencil-clean.png', 'Paper and pencil ecosystem map', '/real-work/homeratesyard-1600x900.jpg', 'HomeRatesYard product surface'],
    ['service-blueprint-realistic-clean.png', 'Service blueprint', '/real-work/procurement-1600x900.jpg', 'Procurement and supplier dashboard'],
    ['ai-human-loop-realistic-clean.png', 'AI human-in-the-loop map', '/real-work/procurement-1600x900.jpg', 'Enterprise workflow evidence'],
    ['journey-map-realistic-clean.png', 'Customer journey map', '/real-work/homeratesyard-1600x900.jpg', 'Mortgage journey evidence'],
    ['decision-tree-realistic-clean.png', 'Decision tree', '/real-work/homeratesyard-1600x900.jpg', 'Mortgage decision surface'],
    ['research-loop-realistic-clean.png', 'Research loop', '/real-work/reporting-1600x900.jpg', 'Reporting product evidence'],
    ['opportunity-matrix-realistic-clean.png', 'Opportunity matrix', '/real-work/procurement-1600x900.jpg', 'Operational data product evidence'],
    ['quality-loop-realistic-clean.png', 'Quality governance loop', '/real-work/procurement-1600x900.jpg', 'Enterprise product quality evidence']
  ];
  const [mapSrc, mapAlt, workSrc, workAlt] = maps[index] ?? maps[0];
  const mapSize = index === 0 ? "2400 × 1350" : "1600 × 900";
  return <div className="concept-png-stage">
    <div className="concept-art-frame">
      <div className="concept-frame-label"><span>WORKING MAP</span><b>16:9 · {mapSize}</b></div>
      <img src={`/concept-maps/${mapSrc}`} alt={mapAlt} loading="lazy" />
    </div>
    <div className="concept-work-frame">
      <div className="concept-work-label"><span>REAL PRODUCT EVIDENCE</span><b>{String(index + 1).padStart(2, '0')}</b></div>
      <img src={workSrc} alt={workAlt} loading="lazy" />
    </div>
  </div>;
}

function ConceptLab() {
  const [selected, setSelected] = useState(0);
  const item = concepts[selected];
  const Icon = item.icon;
  const stages = [["01", "OBSERVE", "People + context"], ["02", "MAP", "Relationships + states"], ["03", "DECIDE", "Risk + trade-offs"], ["04", "SHAPE", "Patterns + interface"]];

  return <SlideSection id="concepts" className="concept-section">
    <div className="section-head concept-head">
      <div>
        <span className="kicker">02 / Concept maps</span>
        <h2>Design change.<br/><span>Make the system visible.</span></h2>
      </div>
      <p>Concept maps turn people, rules, states and dependencies into decisions I can design against — before interface choices harden.</p>
    </div>

    <div className="concept-method-line" aria-label="Concept mapping method">
      {stages.map(([n, t, d], i) => <React.Fragment key={n}>
        <div className={i === Math.floor(selected / 2) ? "active" : ""}><span>{n}</span><b>{t}</b><small>{d}</small></div>
        {i < stages.length - 1 && <i aria-hidden="true"><ArrowRight size={13}/></i>}
      </React.Fragment>)}
    </div>

    <div className="concept-toolbar">
      <span>8 MAP PATTERNS</span>
      <div><i/><span>ACTOR</span><i/><span>RELATIONSHIP</span><i/><span>DECISION</span></div>
      <b>{item.tag}</b>
    </div>

    <div className="concept-layout">
      <div className="concept-list" role="tablist" aria-label="Concept map patterns">
        {concepts.map((c, i) => {
          const C = c.icon;
          return <button key={c.id} role="tab" aria-selected={selected === i} className={selected === i ? "active" : ""} onClick={() => setSelected(i)}>
            <span>{c.id}</span><C size={16}/><div><b>{c.title}</b><small>{c.tag}</small></div><ChevronRight size={14}/>
          </button>;
        })}
      </div>

      <motion.div className="concept-stage" key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease }}>
        <div className="stage-top">
          <div><span>{item.tag}</span><h3>{item.title}</h3></div>
          <Icon size={20}/>
        </div>
        <MapArtwork index={selected}/>
        <div className="concept-decision">
          <div><span>WHAT THIS REVEALS</span><b>{item.desc}</b></div>
          <div><span>DESIGN IMPLICATION</span><b>{item.implication}</b></div>
        </div>
        <div className="stage-bottom">
          <div><b>Why this map</b><p>{item.desc}</p></div>
          <div className="stage-index">{item.id} / 08</div>
        </div>
      </motion.div>
    </div>
  </SlideSection>;
}

function CaseStudy({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }, []);
  useEffect(() => { const key = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [onClose]);
  return <motion.div className="case-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><motion.div className="case-sheet" role="dialog" aria-modal="true" aria-labelledby="case-title" initial={{ y: 28, opacity: 0, scale: .99 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: .5, ease }}><button className="case-close" onClick={onClose} aria-label="Close case study"><X size={18}/></button><div className="case-hero"><div className="case-hero-copy"><span>{project.type} · {project.status}</span><h1 id="case-title">{project.title}</h1><p>{project.subtitle}</p>{project.link && <a href={project.link} target="_blank" rel="noreferrer">Open live product <ExternalLink size={14}/></a>}</div><div className="case-hero-art"><img src={project.image} alt="Product visual"/></div></div><div className="case-content"><div className="case-meta"><span><b>ROLE</b>{project.role}</span><span><b>CLIENT</b>{project.client}</span><span><b>PERIOD</b>{project.period}</span></div><section className="case-contribution"><div><span className="kicker">My contribution</span><div className="contribution-list">{(project.contribution ?? []).map(x => <span key={x}>{x}</span>)}</div></div><div><span className="kicker">Key design decision</span><p>{project.decision ?? "Make the system visible before scaling the interface."}</p></div></section><section className="case-intro"><span className="kicker">The brief</span><h2>{project.problem}</h2><p>{project.summary}</p></section><section><div className="case-section-title"><span>01</span><div><b>Design process</b><small>From ambiguity to a production-ready experience.</small></div></div><ProcessStrip steps={project.process}/></section><section><div className="case-section-title"><span>02</span><div><b>Conceptual journey</b><small>One system, multiple actors, one connected experience.</small></div></div><JourneyMap items={project.journey}/><div className="actor-pills">{project.actors.map(x => <span key={x}><Users size={12}/>{x}</span>)}</div></section><section><div className="case-section-title"><span>03</span><div><b>Evidence + outcomes</b><small>Measured facts stay separate from design objectives.</small></div></div><EvidenceChart items={project.evidence}/></section><section><div className="case-section-title"><span>04</span><div><b>Testing map</b><small>What was validated, documented, and still needs evidence.</small></div></div><TestingTable rows={project.testing}/></section><section><div className="case-section-title"><span>05</span><div><b>AI involvement</b><small>AI accelerates exploration; humans own judgement and release decisions.</small></div></div><div className="ai-lane">{project.ai.map((x, i) => <div key={x}><span>0{i + 1}</span><BrainCircuit size={16}/><b>{x}</b><small>{i === project.ai.length - 1 ? "Human accountability" : "Assistive workflow"}</small></div>)}</div></section><section className="case-visual"><div className="case-section-title"><span>06</span><div><b>Visual evidence</b><small>Selected product artefact from the working portfolio.</small></div></div><img src={project.image} alt="Selected product artefact"/><div className="visual-note"><CircleDot/> Product visual · evidence boundaries are stated where quantified results are not supplied</div></section><section className="case-end"><span>Design takeaway</span><p>{project.outcomeLabel ? `${project.outcome} — ${project.outcomeLabel}.` : "Evidence boundary: no quantified outcome supplied in the source CV; the case is presented through scope, design decisions and validation plans."}</p></section></div></motion.div></motion.div>;
}

function Experience() {
  const rows = [["2024", "HomeLoc Solutions LLP", "Lead Product Design Consultant", "Mortgage / FinTech"], ["2023–24", "Computech Corporation", "Sr UX Designer", "Enterprise / Procurement"], ["2022–23", "Visual IT Solution", "Sr UX Designer", "GovTech / Accessibility"], ["2021–22", "Gaian Solution", "Sr UX Designer", "Media / AdTech"], ["2018–21", "Way2News Interactive", "Sr UI/UX Designer", "Media / MarTech"], ["2016–18", "Nitya Software India", "UI/UX Designer", "Recruitment Technology"]];
  return <SlideSection id="experience" className="experience-section"><div className="experience-art" aria-hidden="true"><strong>11</strong><span>YEARS</span></div><div className="section-head experience-head"><div><span className="kicker">03 / Experience</span><h2>11 years of<br/><span>product context.</span></h2></div><p>Consumer discovery, enterprise systems, data products and high-consequence workflows — one continuous practice of reducing ambiguity.</p></div><div className="experience-track"><div className="track-line"/><span>2016</span><span>2024</span></div><div className="experience-progression"><span>INTERFACE</span><i/><span>SYSTEMS</span><i/><span>DATA</span><i/><span>OPERATIONS</span><i/><span>PRODUCT STRATEGY</span></div><div className="experience-table">{rows.map((r, i) => <motion.div className="experience-row" key={r[1]} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .05, duration: .5, ease }}><span>{r[0]}</span><b>{r[1]}</b><span>{r[2]}</span><em>{r[3]}</em><ArrowUpRight size={14}/></motion.div>)}</div><div className="experience-footer"><span>PRODUCT CONTEXT / CONTINUOUS</span><b>Increasing scope, complexity and decision ownership across product systems.</b><small>Recruitment → Media → AdTech → GovTech → Enterprise → FinTech</small></div></SlideSection>;
}

function About() { const skills = ["Product Strategy", "AI / Agent UX", "Human-AI Interaction", "Enterprise UX", "Workflow Design", "Research & Validation", "Growth & Onboarding", "Design Systems", "Accessibility / WCAG", "Service Design", "Information Architecture", "Cross-functional Leadership"]; const cards = [["01", "Frame", "What problem are we actually solving?", "Turn ambiguity into a shared problem."], ["02", "Model", "What relationships shape it?", "Make actors, states and dependencies visible."], ["03", "Prototype", "What is the smallest useful shape?", "Explore the interaction before scaling it."], ["04", "Validate", "What could make this fail?", "Test the riskiest assumption first."]]; return <SlideSection id="about" className="about-section"><div className="section-head about-head"><div><span className="kicker">04 / Working model</span><h2>Clarity is a<br/><span>design outcome.</span></h2></div><p>I work where product strategy meets interface craft: frame the problem, make the system visible, test the risky assumptions, then turn the answer into a reusable product pattern.</p></div><div className="clarity-cards">{cards.map(([n, t, q, d], i) => <motion.article key={n} whileHover={{ y: -6 }} transition={{ duration: .35, ease }}><div className={`clarity-art clarity-art-${i + 1}`}><i/><span>{String(i + 1).padStart(2, "0")}</span></div><div><small>{n} / METHOD</small><h3>{t}</h3><strong>{q}</strong><p>{d}</p></div><ArrowUpRight size={16}/></motion.article>)}</div><div className="operating-model"><span className="operating-label">OPERATING MODEL</span><div className="operating-flow"><div><b>INPUT</b><span>Research<br/>Business constraints<br/>Technology</span></div><i/><div><b>SYSTEM</b><span>Actors<br/>States<br/>Dependencies</span></div><i/><div><b>DESIGN</b><span>Flows<br/>Patterns<br/>Interfaces</span></div><i/><div><b>OUTCOME</b><span>Decision<br/>Adoption<br/>Operational clarity</span></div></div><div className="collab-row"><span>PRODUCT</span><span>ENGINEERING</span><span>RESEARCH</span><span>DATA</span><span>BUSINESS</span></div></div><div className="skill-cloud">{skills.map(x => <span key={x}>{x}</span>)}</div></SlideSection>; }

function Contact() { return <SlideSection id="contact" className="contact-section"><div className="contact-art" aria-hidden="true"><div/><div/><div/></div><div className="contact-grid"><div><span className="kicker">05 / Contact</span><h2>Have a complex<br/><span>product problem?</span></h2><p>Let's turn ambiguity into a map, a prototype and a decision.</p><button className="contact-cta" onClick={() => window.location.href = "mailto:ajaykumarmyakala@outlook.com"}>Start a conversation <ArrowUpRight size={16}/></button></div><div className="contact-card contact-card-light"><a href="mailto:ajaykumarmyakala@outlook.com"><Mail/>Email<ArrowUpRight/></a><a href="https://www.linkedin.com/in/ajaykumarmyakala" target="_blank" rel="noreferrer"><Linkedin/>LinkedIn<ArrowUpRight/></a><a href={CV} target="_blank" rel="noreferrer"><FileText/>View CV<ArrowUpRight/></a><div className="contact-note"><Check size={14}/> Available for complex product, UX strategy and AI experience work.</div></div></div><footer><Logo/><span>© {new Date().getFullYear()} Ajay Kumar Myakala · Product Design Portfolio</span></footer></SlideSection>; }

export default function App() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Product Designer";
    const ids = ["home", "work", "concepts", "experience", "about", "contact"];
    const nodes = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible) setActive(visible.target.id); }, { threshold: [0.2, 0.45, 0.7] });
    nodes.forEach(node => observer.observe(node));
    const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; document.documentElement.style.setProperty("--page-progress", String(max > 0 ? window.scrollY / max : 0)); };
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); };
  }, []);
  return <div className="app"><div className="scroll-progress"/><Nav active={active}/><SlideRail active={active}/><main className="cinematic-page"><Hero/><Work/><ConceptLab/><Experience/><About/><Contact/></main></div>;
}
