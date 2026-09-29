import React, { useEffect, useState, type ReactNode } from "react";
import "@fontsource-variable/geist";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BrainCircuit, ChevronDown, Download, ExternalLink, FileText, Linkedin, Menu, Users, X } from "lucide-react";

const CV = "/Ajay_Kumar_Myakala_Design_Strategist_CV.pdf";
const EMAIL = "ajaykumarmyakala@outlook.com";
const LINKEDIN = "https://www.linkedin.com/in/ajaykumarmyakala";
const ease = [0.16, 1, 0.3, 1] as const;

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const projects = [
  {
    id: "01", type: "FINTECH / MORTGAGE", title: "HomeRatesYard / Mortgage Experience",
    subtitle: "From rate discovery to a clearer borrowing journey.", client: "HomeLoc Solutions LLP",
    period: "Apr 2024 – May 2026", role: "Lead Product Design Consultant", status: "LIVE PRODUCT",
    image: "/Homepage.jpg", link: "https://homeratesyard.com/",
    impact: ["37% documented reduction in underwriting decision time", "Live product serving the full borrowing journey"],
    problem: "How might a high-stakes mortgage workflow feel clearer without hiding its operational complexity?",
    summary: "A mortgage and lending ecosystem spanning origination, underwriting, onboarding, servicing and lending operations. The design direction connected borrower intent to operational decisions.",
    contribution: ["Workflow framing", "Experience architecture", "Interaction design", "Design direction"],
    decision: "Connect borrower intent to operational decision points instead of treating rate discovery and underwriting as separate experiences.",
    process: [["Discover", "Map actors, constraints and decision moments."], ["Define", "Frame workflow friction and risk."], ["Design", "Turn rules into clear journeys and states."], ["Validate", "Review workflow clarity with stakeholders."], ["Deliver", "Align patterns with engineering reality."]],
    actors: ["Borrower", "Mortgage professional", "Underwriting operations", "Product + Engineering"],
    journey: ["Explore", "Qualify", "Compare", "Apply", "Underwrite", "Service"],
    evidence: [{ label: "Underwriting decision time", value: 37, note: "Documented CV outcome", kind: "measured" }, { label: "Workflow clarity", value: 100, note: "Design objective — not a measured result", kind: "objective" }, { label: "Stakeholder alignment", value: 100, note: "Design objective — not a measured result", kind: "objective" }],
    testing: [["Workflow comprehension", "Task walkthrough + stakeholder review", "Documented design activity"], ["Decision-time outcome", "Production workflow observation", "Measured: 37% reduction"], ["Usability", "Moderated borrower / operator testing", "Test plan; result not supplied"]],
    ai: ["Research synthesis", "Scenario / edge-case exploration", "Prototype acceleration", "Human review + final design decision"]
  },
  {
    id: "02", type: "ENTERPRISE SAAS", title: "Procurement & Supplier Experience",
    subtitle: "Making operational data usable for people who have to act on it.", client: "Computech Corporation",
    period: "Mar 2023 – Mar 2024", role: "Sr UX Designer", status: "ENTERPRISE PRODUCT",
    image: "/Dashboard.jpg",
    impact: ["5 workflow families covered: procurement, supplier, compliance, spend, reconciliation", "4 data-heavy surfaces: dashboards, reporting, reconciliation, supplier views"],
    problem: "How might dense operational data expose the next decision instead of simply exposing more data?",
    summary: "Procurement, supplier diversity, compliance, spend visibility and reconciliation brought together through service experiences, onboarding workflows, reporting and dashboards.",
    contribution: ["Information architecture", "Workflow design", "Dashboard UX", "Reusable UI patterns"],
    decision: "Surface the next operational decision instead of presenting dense data as an undifferentiated dashboard.",
    process: [["Discover", "Interview stakeholders and map operational jobs."], ["Define", "Group requirements into roles and decisions."], ["Design", "Build IA, dashboards and workflow states."], ["Validate", "Review hierarchy and data interpretation."], ["Deliver", "Partner on scalable UI patterns."]],
    actors: ["Procurement lead", "Supplier", "Compliance reviewer", "Finance / operations"],
    journey: ["Onboard", "Collect", "Review", "Reconcile", "Report", "Act"],
    evidence: [{ label: "Workflow coverage", value: 5, note: "Procurement • supplier • compliance • spend • reconciliation", kind: "scope" }, { label: "Data-heavy surfaces", value: 4, note: "Dashboards, reporting, reconciliation, supplier views", kind: "scope" }, { label: "Outcome metrics", value: 0, note: "No quantified result supplied in source CV", kind: "not-supplied" }],
    testing: [["Information findability", "Task-based usability testing", "Test plan; result not supplied"], ["Dashboard comprehension", "Scenario walkthrough + heuristic review", "Design validation"], ["Supplier onboarding", "End-to-end workflow test", "Test plan; result not supplied"]],
    ai: ["Cluster requirements", "Explore information structures", "Explore dashboard summaries", "Human verification of business rules"]
  },
  {
    id: "03", type: "MEDIA / ADTECH / MARTECH", title: "Audience Intelligence & Media Products",
    subtitle: "Connecting content, audience signals and monetisation workflows.", client: "Way2News Interactive Pvt. Ltd",
    period: "May 2018 – Jun 2021", role: "Sr UI/UX Designer", status: "MULTI-PRODUCT",
    image: "/way2news/product-screens.svg",
    impact: ["5 products designed: Way2News, AudiencePlay, AudiencePrime, DigitalKites, TheTasteCompany", "Mobile-first discovery shipped in 4 Indian languages"],
    problem: "How might consumer discovery and enterprise intelligence stay connected without flattening their different jobs?",
    summary: "Experiences across Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany, spanning content discovery, segmentation, campaign management and monetisation.",
    contribution: ["Product UX", "Content discovery", "Audience workflows", "Interface systems"],
    decision: "Separate consumer discovery from operational intelligence while keeping the underlying audience signals connected.",
    process: [["Discover", "Map audience, editorial and platform needs."], ["Define", "Separate consumer and operational journeys."], ["Design", "Create discovery and intelligence surfaces."], ["Validate", "Review hierarchy and campaign flows."], ["Deliver", "Partner across product and engineering."]],
    actors: ["Reader", "Marketer", "Audience analyst", "Editorial / product team"],
    journey: ["Discover", "Engage", "Segment", "Target", "Measure", "Monetise"],
    evidence: [{ label: "Named products", value: 5, note: "Way2News + AudiencePlay + AudiencePrime + DigitalKites + TheTasteCompany", kind: "scope" }, { label: "Workflow families", value: 4, note: "Discovery • segmentation • campaigns • monetisation", kind: "scope" }, { label: "Quantified outcomes", value: 0, note: "No metric supplied in source CV", kind: "not-supplied" }],
    testing: [["Content discovery", "Tree test / usability task", "Test plan; result not supplied"], ["Audience segmentation", "Scenario-based workflow test", "Test plan; result not supplied"], ["Campaign management", "Prototype review + task test", "Design validation"]],
    ai: ["Explore segmentation concepts", "Summarise research themes", "Generate campaign-state variants", "Human judgement on audience context"]
  },
  {
    id: "04", type: "RECENT / E-COMMERCE", title: "E-commerce Product Experience",
    subtitle: "A recent end-to-end build from discovery to checkout.", client: "Recently completed e-commerce project",
    period: "Recently completed", role: "Product Designer", status: "RECENTLY COMPLETED",
    image: "/ecommerce-art.svg",
    impact: ["6 journey stages defined as one connected flow: discovery → checkout", "4 state coverages: loading, empty, error, success"],
    problem: "How might a shopper understand value, trust the product and complete the purchase with less cognitive friction?",
    summary: "A new portfolio chapter focused on product discovery, evaluation, cart, checkout and responsive states. No conversion or usability results are invented where evidence was not supplied.",
    contribution: ["End-to-end UX", "Product architecture", "Responsive interaction", "Checkout states"],
    decision: "Reduce cognitive friction by making value, trust and purchase state explicit throughout the journey.",
    process: [["Discover", "Map intent, search and purchase friction."], ["Define", "Prioritise confidence, trust and clarity."], ["Design", "Build product, cart and checkout states."], ["Validate", "Test findability and completion."], ["Deliver", "Ship reusable interaction patterns."]],
    actors: ["Shopper", "Evaluator", "Buyer", "Commerce operator"],
    journey: ["Land", "Browse", "Evaluate", "Add", "Checkout", "Return"],
    evidence: [{ label: "Journey stages", value: 6, note: "Discovery → checkout defined as one connected journey", kind: "scope" }, { label: "State coverage", value: 4, note: "Loading • empty • error • success", kind: "scope" }, { label: "Performance metrics", value: 0, note: "Not supplied — no invented numbers", kind: "not-supplied" }],
    testing: [["Product findability", "Tree test / moderated task", "Test plan; result not supplied"], ["Product comprehension", "Task-based usability test", "Test plan; result not supplied"], ["Checkout completion", "End-to-end task + analytics", "Test plan; result not supplied"]],
    ai: ["Merchandising ideation", "Copy and edge-case exploration", "Rapid responsive prototype exploration", "Human review before release"]
  }
];

const faqs = [
  { q: "What is my expertise?", a: "Product strategy with hands-on craft. I frame ambiguous problems, map the system behind them, and design the interface — across FinTech, mortgage lending, enterprise SaaS, GovTech, media and recruitment technology over 11 years." },
  { q: "How do I use AI in my process?", a: "AI accelerates research synthesis, scenario exploration and prototyping. Humans own judgement: every design decision, evidence claim and release call stays with me and the team. AIX / MLUX thinking shapes how the product itself exposes AI." },
  { q: "How do I think about product strategy?", a: "Connect user intent to operational and business constraints before touching interface. The measurable outcome matters: an implemented underwriting workflow improvement reduced decision time by 37%." },
  { q: "How do I work with teams?", a: "As a partner to Product, Engineering and business stakeholders — discovery workshops, design critique, mentoring and design-system governance, translating complex technical concepts into usable product experiences." },
  { q: "Am I open to new roles?", a: "Yes — full-time, contract or remote, with a focus on AI-native products, enterprise platforms and high-consequence workflows. Let's connect below." }
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["Highlights", "#highlights"], ["FAQ", "#faq"], ["Contact", "#contact"]];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => scrollTo("#home")} aria-label="Back to top">
        <svg className="brand-mark" viewBox="0 0 40 24" aria-hidden="true">
          <circle cx="13" cy="12" r="9" fill="none" stroke="#e94f9c" strokeWidth="1.6"/>
          <circle cx="27" cy="12" r="9" fill="none" stroke="#3b82f6" strokeWidth="1.6"/>
          <circle cx="20" cy="15" r="9" fill="none" stroke="#f97316" strokeWidth="1.6" opacity=".75"/>
        </svg>
        AJAY
      </button>
      <nav className="header-nav">{links.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); scrollTo(href); }}>{label}</a>)}</nav>
      <div className="header-right">
        <a className="resume-pill" href={CV} target="_blank" rel="noreferrer"><FileText size={15}/> Resume</a>
        <a className="linkedin-link" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn</a>
      </div>
      <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Open navigation">{open ? <X/> : <Menu/>}</button>
      <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={e => { e.preventDefault(); setOpen(false); scrollTo(href); }}>{label}<ArrowUpRight size={14}/></a>)}
        <a href={CV} target="_blank" rel="noreferrer">Resume <Download size={14}/></a>
      </motion.div>}</AnimatePresence>
    </header>
  );
}

function Venn() {
  const chips: [string, number, number, string][] = [
    ["Research", 6, 22, "pink"], ["Flows", 2, 38, "pink"], ["Why?", 12, 30, "pink"],
    ["Testing", 8, 62, "pink"], ["Motivation", 4, 50, "pink"], ["Behaviour", 16, 14, "pink"],
    ["Figma", 62, 16, "violet"], ["AI / LLM", 68, 26, "violet"], ["HTML / CSS", 76, 46, "violet"],
    ["APIs", 72, 60, "violet"], ["Prototyping", 52, 42, "violet"],
    ["Strategy", 22, 78, "orange"], ["Discovery", 58, 82, "orange"], ["North star", 38, 70, "orange"],
    ["Risks", 30, 88, "orange"], ["Adoption", 62, 68, "orange"], ["Experimentation", 12, 68, "orange"]
  ];
  return (
    <div className="venn" aria-label="Venn diagram of user, technology and business — I work at the intersection">
      <div className="venn-circle venn-user"><span>User</span></div>
      <div className="venn-circle venn-tech"><span>Technology</span></div>
      <div className="venn-circle venn-biz"><span>Business</span></div>
      {chips.map(([label, x, y, tone]) => <span key={label} className={`venn-chip chip-${tone}`} style={{ left: `${x}%`, top: `${y}%` }}>{label}</span>)}
      <div className="venn-here" aria-hidden="true">
        <svg viewBox="0 0 120 60" className="venn-arrow"><path d="M4 4 C 40 10, 80 30, 112 48" fill="none" stroke="#3f3f46" strokeWidth="1.5"/><path d="M104 50 L 113 49 L 108 41" fill="none" stroke="#3f3f46" strokeWidth="1.5"/></svg>
        <em>I'm here</em>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease }}>AJAY HERE,</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .05, ease }}>Lead Product<br/>Designer at<br/>HomeLoc</motion.h1>
          <motion.div className="hero-logos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25, duration: .6 }}>
            <b>HomeLoc</b><b>Computech</b><b>Way2News</b><b>Gaian</b>
          </motion.div>
          <motion.p className="hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35, duration: .6 }}>
            11 years of experience | Staff Product Designer | AI &amp; Agent Experience | Product Strategy.
          </motion.p>
        </div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .15, ease }}>
          <Venn/>
        </motion.div>
      </div>
    </section>
  );
}

function Work() {
  const [active, setActive] = useState<typeof projects[number] | null>(null);
  return (
    <section className="work" id="work">
      <p className="section-kicker">SELECTED WORK</p>
      <div className="work-list">
        {projects.map((p, i) => (
          <motion.button className="work-card" key={p.id} onClick={() => setActive(p)}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7, delay: (i % 2) * .08, ease }}>
            <span className="work-visual"><img src={p.image} alt={`${p.title} product visual`} loading="lazy"/></span>
            <span className="work-body">
              <span className="work-title">{p.title}</span>
              <span className="work-sub">{p.subtitle}</span>
              <span className="work-impact">
                <em>IMPACT</em>
                {p.impact.map(x => <span key={x}>{x}</span>)}
              </span>
            </span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{active && <CaseOverlay project={active} onClose={() => setActive(null)}/>}</AnimatePresence>
    </section>
  );
}

function Highlights() {
  return (
    <section className="highlights" id="highlights">
      <p className="section-kicker">HIGHLIGHTS <span>that shape me</span></p>
      <div className="bento">
        <motion.article className="bento-card card-yellow" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, ease }}>
          <strong>37%</strong>
          <p>documented reduction in underwriting decision time at HomeLoc.</p>
        </motion.article>
        <motion.article className="bento-card card-blue" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .06, ease }}>
          <strong>11 years</strong>
          <p>across FinTech, Enterprise SaaS, GovTech, Media, AdTech and Recruitment.</p>
        </motion.article>
        <motion.article className="bento-card card-dark" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .12, ease }}>
          <strong>Systems, not screens</strong>
          <p>Design systems governance, critique and mentoring — reusable patterns over one-off screens.</p>
        </motion.article>
        <motion.figure className="bento-card card-photo" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .18, ease }}>
          <img src="/way2news/product-screens.svg" alt="Way2News app screens in four Indian languages" loading="lazy"/>
          <figcaption>Mobile-first news discovery, shipped in four Indian languages.</figcaption>
        </motion.figure>
        <motion.article className="bento-card card-mint" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .24, ease }}>
          <strong>Human + AI</strong>
          <p>AI-assisted research synthesis and prototyping — with human accountability on every decision.</p>
        </motion.article>
        <motion.article className="bento-card card-lilac" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .3, ease }}>
          <strong>Zero-to-one</strong>
          <p>From ambiguity to shipped product: discovery, definition, interface, validation.</p>
        </motion.article>
      </div>
    </section>
  );
}

function ProcessStrip({ steps }: { steps: string[][] }) {
  return <div className="process-strip">{steps.map(([title, desc], i) => <div className="process-step" key={title}><span>0{i + 1}</span><b>{title}</b><p>{desc}</p></div>)}</div>;
}

function CaseOverlay({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }, []);
  useEffect(() => { const key = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [onClose]);
  return (
    <motion.div className="case-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="case-sheet" role="dialog" aria-modal="true" aria-labelledby="case-title" initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: .45, ease }}>
        <button className="case-close" onClick={onClose} aria-label="Close case study"><X size={18}/></button>
        <div className="case-hero">
          <span className="case-kicker">{project.type} · {project.status}</span>
          <h2 id="case-title">{project.title}</h2>
          <p>{project.subtitle}</p>
          {project.link && <a href={project.link} target="_blank" rel="noreferrer">Open live product <ExternalLink size={14}/></a>}
        </div>
        <img className="case-image" src={project.image} alt={`${project.title} product visual`}/>
        <div className="case-meta">
          <span><b>ROLE</b>{project.role}</span>
          <span><b>CLIENT</b>{project.client}</span>
          <span><b>PERIOD</b>{project.period}</span>
        </div>
        <section className="case-section">
          <h3>The brief</h3>
          <p className="case-problem">{project.problem}</p>
          <p>{project.summary}</p>
        </section>
        <section className="case-section">
          <h3>Design process</h3>
          <ProcessStrip steps={project.process}/>
          <p className="case-decision"><b>Key decision — </b>{project.decision}</p>
        </section>
        <section className="case-section">
          <h3>Journey &amp; actors</h3>
          <div className="journey-map">{project.journey.map((x, i) => <span className="journey-node" key={x}><em>{String(i + 1).padStart(2, "0")}</em>{x}</span>)}</div>
          <div className="actor-pills">{project.actors.map(x => <span key={x}><Users size={12}/>{x}</span>)}</div>
        </section>
        <section className="case-section">
          <h3>Evidence</h3>
          <div className="evidence-list">
            {project.evidence.map(x => (
              <div className="evidence-row" key={x.label}>
                <div><b>{x.label}</b><small>{x.note}</small></div>
                <strong>{x.kind === "measured" ? `${x.value}%` : x.value ? x.value : "—"}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="case-section">
          <h3>AI involvement</h3>
          <div className="ai-lane">{project.ai.map((x, i) => <div key={x}><span>0{i + 1}</span><BrainCircuit size={15}/><b>{x}</b><small>{i === project.ai.length - 1 ? "Human accountability" : "Assistive workflow"}</small></div>)}</div>
        </section>
      </motion.div>
    </motion.div>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <p className="section-kicker">QUESTIONS? <span>Some answered here. Let's connect for more :)</span></p>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div className={`faq-item ${open === i ? "open" : ""}`} key={f.q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {f.q}<ChevronDown size={18}/>
            </button>
            <AnimatePresence initial={false}>
              {open === i && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease }}>
                <p>{f.a}</p>
              </motion.div>}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <p className="section-kicker">LET'S CONNECT!</p>
      <h2>Have a complex<br/>product problem?</h2>
      <a className="contact-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      <div className="contact-links">
        <a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>
        <a href={CV} target="_blank" rel="noreferrer"><FileText size={16}/> Resume</a>
      </div>
      <footer className="site-footer">
        <span>AJAY KUMAR MYAKALA</span>
        <span>© {new Date().getFullYear()} · Staff Product Designer</span>
      </footer>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Staff Product Designer | AI & Agent Experience";
  }, []);
  return (
    <div className="page">
      <Header/>
      <main>
        <Hero/>
        <Work/>
        <Highlights/>
        <Faq/>
        <Contact/>
      </main>
    </div>
  );
}
