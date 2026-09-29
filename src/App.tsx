import React, { useEffect, useRef, useState, type ReactNode } from "react";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/inter";
import {
  AnimatePresence, motion, useMotionValue, useSpring, useTransform,
  useScroll, useReducedMotion,
} from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BrainCircuit, ChevronDown, Compass,
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

/* ---------------------------------- types ---------------------------------- */

type WfVariant = "web-hero" | "web-dash" | "web-table" | "mobile-feed" | "mobile-checkout";

interface Bar { label: string; pct: number; display: string; }
interface Project {
  id: string; tag: string; title: string; subtitle: string;
  role: string; client: string; period: string; status: string;
  image: string; link?: string; accent: string;
  impact: string[];
  problem: string; summary: string; decision: string;
  contribution: string[];
  process: [string, string][];
  actors: string[]; journey: string[]; sentiment: number[]; pains: string[];
  wf: [WfVariant, string][];
  maps: { map: string; mapAlt: string; title: string; desc: string; evidence: string; evidenceAlt: string }[];
  chart: Bar[];
  evidence: { label: string; value: string; note: string; kind: "measured" | "scope" | "objective" | "gap" }[];
  testing: [string, string, string][];
  ai: string[];
}

/* ---------------------------------- data ----------------------------------- */

const projects: Project[] = [
  {
    id: "01", tag: "FINTECH / MORTGAGE", title: "HomeRatesYard — Mortgage Platform",
    subtitle: "From rate discovery to a clearer borrowing journey.",
    role: "Lead Product Design Consultant", client: "HomeLoc Solutions LLP",
    period: "Apr 2024 – May 2026", status: "LIVE PRODUCT",
    image: "/Homepage.jpg", link: "https://homeratesyard.com/", accent: "#e4572e",
    impact: ["37% documented reduction in underwriting decision time", "Live product spanning the full borrowing journey"],
    problem: "How might a high-stakes mortgage workflow feel clearer without hiding its operational complexity?",
    summary: "A mortgage and lending ecosystem spanning origination, underwriting, onboarding, servicing and lending operations — design direction that connected borrower intent to operational decisions.",
    decision: "Connect borrower intent to operational decision points instead of treating rate discovery and underwriting as separate experiences.",
    contribution: ["Workflow framing", "Experience architecture", "Interaction design", "Design direction"],
    process: [["Discover", "Map actors, constraints and decision moments."], ["Define", "Frame workflow friction and risk."], ["Design", "Turn rules into clear journeys and states."], ["Validate", "Review workflow clarity with stakeholders."], ["Deliver", "Align patterns with engineering reality."]],
    actors: ["Borrower", "Mortgage professional", "Underwriting ops", "Product + Eng"],
    journey: ["Explore", "Qualify", "Compare", "Apply", "Underwrite", "Service"],
    sentiment: [70, 55, 62, 40, 48, 78],
    pains: ["Too many rate options", "Jargon-heavy forms", "Side-by-side unclear", "Document upload anxiety", "Black-box status", "No servicing entry"],
    wf: [["web-hero", "Rate discovery — landing structure"], ["web-dash", "Borrower dashboard states"]],
    maps: [
      { map: "/concept-maps/concept-paper-pencil-clean.png", mapAlt: "Original paper and pencil ecosystem sketch for the mortgage product", title: "Paper ecosystem sketch", desc: "The original hand-drawn map: borrower intent on one side, operational decisions on the other — the frame the whole product was designed against.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "HomeRatesYard product surface the sketch informed" },
      { map: "/concept-maps/ecosystem-map-realistic-clean.png", mapAlt: "Lending ecosystem map with actors and dependencies", title: "Lending ecosystem map", desc: "Borrower, mortgage professional, underwriting operations and engineering as one connected system — used to find the handoffs that caused black-box status.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "Shipped mortgage platform surface" },
      { map: "/concept-maps/decision-tree-realistic-clean.png", mapAlt: "Underwriting decision tree with recovery paths", title: "Underwriting decision tree", desc: "High-consequence underwriting choices with explicit paths, recovery and explanation — the map behind the 37% decision-time reduction.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "Underwriting workflow surface in production" }
    ],
    chart: [{ label: "Underwriting decision time", pct: 37, display: "−37%" }, { label: "Journey stages mapped", pct: 75, display: "6 stages" }, { label: "Actor groups designed for", pct: 50, display: "4 groups" }],
    evidence: [{ label: "Underwriting decision time", value: "37% faster", note: "Documented CV outcome", kind: "measured" }, { label: "Workflow clarity", value: "Objective", note: "Design objective — not a measured result", kind: "objective" }, { label: "Stakeholder alignment", value: "Objective", note: "Design objective — not a measured result", kind: "objective" }],
    testing: [["Workflow comprehension", "Task walkthrough + stakeholder review", "Documented design activity"], ["Decision-time outcome", "Production workflow observation", "Measured: 37% reduction"], ["Usability", "Moderated borrower / operator testing", "Test plan; result not supplied"]],
    ai: ["Research synthesis", "Scenario / edge-case exploration", "Prototype acceleration", "Human review + final design decision"]
  },
  {
    id: "02", tag: "ENTERPRISE SAAS", title: "Procurement & Supplier Experience",
    subtitle: "Making operational data usable for people who act on it.",
    role: "Sr UX Designer", client: "Computech Corporation",
    period: "Mar 2023 – Mar 2024", status: "ENTERPRISE PRODUCT",
    image: "/Dashboard.jpg", accent: "#2563eb",
    impact: ["5 workflow families: procurement, supplier, compliance, spend, reconciliation", "4 data-heavy surfaces: dashboards, reporting, reconciliation, supplier views"],
    problem: "How might dense operational data expose the next decision instead of simply exposing more data?",
    summary: "Procurement, supplier diversity, compliance, spend visibility and reconciliation brought together through service experiences, onboarding workflows, reporting and dashboards.",
    decision: "Surface the next operational decision instead of presenting dense data as an undifferentiated dashboard.",
    contribution: ["Information architecture", "Workflow design", "Dashboard UX", "Reusable UI patterns"],
    process: [["Discover", "Interview stakeholders and map operational jobs."], ["Define", "Group requirements into roles and decisions."], ["Design", "Build IA, dashboards and workflow states."], ["Validate", "Review hierarchy and data interpretation."], ["Deliver", "Partner on scalable UI patterns."]],
    actors: ["Procurement lead", "Supplier", "Compliance reviewer", "Finance / ops"],
    journey: ["Onboard", "Collect", "Review", "Reconcile", "Report", "Act"],
    sentiment: [55, 48, 42, 38, 58, 70],
    pains: ["Lengthy registration", "Scattered data requests", "Unclear priorities", "Mismatched records", "Static reports", "No next action"],
    wf: [["web-table", "Supplier register — table patterns"], ["web-dash", "Spend visibility overview"]],
    maps: [
      { map: "/concept-maps/service-blueprint-realistic-clean.png", mapAlt: "Procurement service blueprint with frontstage and backstage lanes", title: "Procurement service blueprint", desc: "Frontstage supplier actions wired to backstage compliance and finance rules — exposed the dependencies behind scattered data requests.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Procurement platform surface in production" },
      { map: "/concept-maps/ecosystem-map-realistic-clean.png", mapAlt: "Supplier ecosystem map across procurement roles", title: "Supplier ecosystem map", desc: "Procurement lead, supplier, compliance reviewer and finance as actors in one system — the base for role-based dashboard IA.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Enterprise dashboard surface shipped" },
      { map: "/concept-maps/opportunity-matrix-realistic-clean.png", mapAlt: "Opportunity matrix balancing user value and delivery confidence", title: "Opportunity matrix", desc: "Workflow gaps prioritised by user value against delivery confidence — decided which of the five families shipped first.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Operational data product evidence" }
    ],
    chart: [{ label: "Workflow families covered", pct: 83, display: "5" }, { label: "Data-heavy surfaces", pct: 66, display: "4" }, { label: "Validation streams run", pct: 50, display: "3" }],
    evidence: [{ label: "Workflow coverage", value: "5 families", note: "Procurement • supplier • compliance • spend • reconciliation", kind: "scope" }, { label: "Data-heavy surfaces", value: "4 surfaces", note: "Dashboards, reporting, reconciliation, supplier views", kind: "scope" }, { label: "Outcome metrics", value: "Not supplied", note: "No quantified result in source CV", kind: "gap" }],
    testing: [["Information findability", "Task-based usability testing", "Test plan; result not supplied"], ["Dashboard comprehension", "Scenario walkthrough + heuristic review", "Design validation"], ["Supplier onboarding", "End-to-end workflow test", "Test plan; result not supplied"]],
    ai: ["Cluster requirements", "Explore information structures", "Explore dashboard summaries", "Human verification of business rules"]
  },
  {
    id: "03", tag: "MEDIA / ADTECH / MARTECH", title: "Audience Intelligence & Media Products",
    subtitle: "Connecting content, audience signals and monetisation.",
    role: "Sr UI/UX Designer", client: "Way2News Interactive Pvt. Ltd",
    period: "May 2018 – Jun 2021", status: "MULTI-PRODUCT",
    image: "/way2news/product-screens.svg", accent: "#7c3aed",
    impact: ["5 products: Way2News, AudiencePlay, AudiencePrime, DigitalKites, TheTasteCompany", "Mobile-first discovery shipped in 4 Indian languages"],
    problem: "How might consumer discovery and enterprise intelligence stay connected without flattening their different jobs?",
    summary: "Experiences across Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany — content discovery, segmentation, campaign management and monetisation.",
    decision: "Separate consumer discovery from operational intelligence while keeping the underlying audience signals connected.",
    contribution: ["Product UX", "Content discovery", "Audience workflows", "Interface systems"],
    process: [["Discover", "Map audience, editorial and platform needs."], ["Define", "Separate consumer and operational journeys."], ["Design", "Create discovery and intelligence surfaces."], ["Validate", "Review hierarchy and campaign flows."], ["Deliver", "Partner across product and engineering."]],
    actors: ["Reader", "Marketer", "Audience analyst", "Editorial / product"],
    journey: ["Discover", "Engage", "Segment", "Target", "Measure", "Monetise"],
    sentiment: [82, 74, 50, 46, 60, 66],
    pains: ["Content overload", "Weak retention hooks", "Fragmented segments", "Blind targeting", "Vanity metrics", "Unconnected revenue"],
    wf: [["mobile-feed", "Discover feed — mobile-first"], ["web-dash", "Audience segmentation console"]],
    maps: [
      { map: "/concept-maps/journey-map-realistic-clean.png", mapAlt: "Reader journey map across discovery and retention", title: "Reader journey map", desc: "Discover → engage → retain for four language editions — kept consumer discovery separate from the operational intelligence underneath.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Reporting product evidence" },
      { map: "/concept-maps/research-loop-realistic-clean.png", mapAlt: "Audience research loop from observation to validation", title: "Audience research loop", desc: "Behavioural analytics feeding hypotheses and validation — how audience insights stayed connected to both consumer and enterprise surfaces.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Audience intelligence reporting surface" },
      { map: "/concept-maps/opportunity-matrix-realistic-clean.png", mapAlt: "Monetisation opportunity matrix", title: "Monetisation opportunity matrix", desc: "Campaign and monetisation opportunities ranked by audience value and platform confidence across the five products.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Campaign and monetisation surface" }
    ],
    chart: [{ label: "Named products designed", pct: 83, display: "5" }, { label: "Indian languages shipped", pct: 66, display: "4" }, { label: "Workflow families", pct: 66, display: "4" }],
    evidence: [{ label: "Named products", value: "5 products", note: "Way2News + AudiencePlay + AudiencePrime + DigitalKites + TheTasteCompany", kind: "scope" }, { label: "Workflow families", value: "4 families", note: "Discovery • segmentation • campaigns • monetisation", kind: "scope" }, { label: "Quantified outcomes", value: "Not supplied", note: "No metric supplied in source CV", kind: "gap" }],
    testing: [["Content discovery", "Tree test / usability task", "Test plan; result not supplied"], ["Audience segmentation", "Scenario-based workflow test", "Test plan; result not supplied"], ["Campaign management", "Prototype review + task test", "Design validation"]],
    ai: ["Explore segmentation concepts", "Summarise research themes", "Generate campaign-state variants", "Human judgement on audience context"]
  },
  {
    id: "04", tag: "E-COMMERCE", title: "E-commerce Product Experience",
    subtitle: "An end-to-end build from discovery to checkout.",
    role: "Product Designer", client: "Recently completed e-commerce project",
    period: "Recently completed", status: "NEW CHAPTER",
    image: "/ecommerce-art.svg", accent: "#0d9488",
    impact: ["6 journey stages defined as one connected flow: discovery → checkout", "4 state coverages: loading, empty, error, success"],
    problem: "How might a shopper understand value, trust the product and complete the purchase with less cognitive friction?",
    summary: "A new portfolio chapter focused on product discovery, evaluation, cart, checkout and responsive states — with honest evidence boundaries where results were not supplied.",
    decision: "Reduce cognitive friction by making value, trust and purchase state explicit throughout the journey.",
    contribution: ["End-to-end UX", "Product architecture", "Responsive interaction", "Checkout states"],
    process: [["Discover", "Map intent, search and purchase friction."], ["Define", "Prioritise confidence, trust and clarity."], ["Design", "Build product, cart and checkout states."], ["Validate", "Test findability and completion."], ["Deliver", "Ship reusable interaction patterns."]],
    actors: ["Shopper", "Evaluator", "Buyer", "Commerce operator"],
    journey: ["Land", "Browse", "Evaluate", "Add", "Checkout", "Return"],
    sentiment: [76, 68, 58, 52, 44, 72],
    pains: ["Unclear value", "Weak filters", "Missing trust cues", "Hidden costs", "Form friction", "No order clarity"],
    wf: [["mobile-checkout", "Checkout flow — mobile states"], ["web-hero", "Product landing structure"]],
    maps: [
      { map: "/concept-maps/decision-tree-realistic-clean.png", mapAlt: "Purchase decision tree with trust and recovery paths", title: "Purchase decision tree", desc: "Evaluate → trust → commit with explicit recovery at every risky step — the map that shaped checkout state coverage.", evidence: "/ecommerce-art.svg", evidenceAlt: "E-commerce experience cover" },
      { map: "/concept-maps/service-blueprint-realistic-clean.png", mapAlt: "Checkout service blueprint with payment backstage", title: "Checkout service blueprint", desc: "Cart and payment frontstage wired to fulfilment and failure backstage — where hidden costs and error states were designed, not discovered.", evidence: "/ecommerce-art.svg", evidenceAlt: "Checkout experience cover" },
      { map: "/concept-maps/journey-map-realistic-clean.png", mapAlt: "Shopper journey map from landing to return", title: "Shopper journey map", desc: "Land → browse → evaluate → add → checkout → return as one connected journey — the six stages the interface had to carry.", evidence: "/ecommerce-art.svg", evidenceAlt: "E-commerce journey cover" }
    ],
    chart: [{ label: "Journey stages connected", pct: 75, display: "6" }, { label: "UI states covered", pct: 66, display: "4" }, { label: "Validation streams planned", pct: 50, display: "3" }],
    evidence: [{ label: "Journey stages", value: "6 stages", note: "Discovery → checkout defined as one connected journey", kind: "scope" }, { label: "State coverage", value: "4 states", note: "Loading • empty • error • success", kind: "scope" }, { label: "Performance metrics", value: "Not supplied", note: "No invented numbers", kind: "gap" }],
    testing: [["Product findability", "Tree test / moderated task", "Test plan; result not supplied"], ["Product comprehension", "Task-based usability test", "Test plan; result not supplied"], ["Checkout completion", "End-to-end task + analytics", "Test plan; result not supplied"]],
    ai: ["Merchandising ideation", "Copy and edge-case exploration", "Rapid responsive prototype exploration", "Human review before release"]
  }
];

const capabilities: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Target, title: "Product Strategy", desc: "Framing ambiguous problems into direction and measurable outcomes." },
  { icon: BrainCircuit, title: "AI-Native UX", desc: "AIX / MLUX patterns for human-in-the-loop intelligence." },
  { icon: Network, title: "Systems Thinking", desc: "Actors, states and dependencies made visible before interface." },
  { icon: Workflow, title: "Workflow Design", desc: "High-consequence operations designed for clarity and recovery." },
  { icon: Layers, title: "Design Systems", desc: "Tokens, reusable patterns, governance and critique loops." },
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

/* --------------------------------- motion ---------------------------------- */

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

function SpotlightCard({ children, className = "", accent = "#4f46e5" }: { children: ReactNode; className?: string; accent?: string }) {
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

function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((x, i) => <span key={i}>{x}<i>✦</i></span>)}
      </div>
    </div>
  );
}

/* ------------------------------- wireframes -------------------------------- */

function WfTag({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <span className="wf-tag" style={style}>{children}</span>;
}

function Wireframe({ variant, caption }: { variant: WfVariant; caption: string }) {
  const mobile = variant.startsWith("mobile");
  return (
    <figure className={`wf-figure ${mobile ? "wf-mobile-fig" : ""}`}>
      <div className={`wf ${mobile ? "wf-mobile" : ""}`} aria-hidden="true">
        {variant === "web-hero" && (
          <>
            <div className="wf-nav">
              <span className="wf-logo"/><span className="wf-links"><i/><i/><i/><i/></span><span className="wf-cta">Sign up</span>
              <WfTag style={{ right: 8, top: -7 }}>NAV</WfTag>
            </div>
            <div className="wf-hero">
              <div className="wf-hero-copy">
                <WfTag style={{ left: -8, top: -7 }}>HEADLINE</WfTag>
                <span className="wf-line w90"/><span className="wf-line w70"/>
                <div className="wf-pills"><span>Primary CTA</span><span>Secondary</span></div>
                <WfTag style={{ left: 16, bottom: -7 }}>CTA PAIR</WfTag>
              </div>
              <div className="wf-img-ph"><span>IMAGE</span></div>
            </div>
            <div className="wf-cards"><span/><span/><span/><WfTag style={{ left: 8, top: -7 }}>VALUE CARDS ×3</WfTag></div>
            <span className="wf-line w40"/>
          </>
        )}
        {variant === "web-dash" && (
          <>
            <div className="wf-app">
              <div className="wf-side">
                <span className="wf-logo"/><i className="on"/><i/><i/><i/>
                <WfTag style={{ left: 8, bottom: -7 }}>NAV RAIL</WfTag>
              </div>
              <div className="wf-main">
                <div className="wf-stats"><span/><span/><span/><WfTag style={{ left: 8, top: -7 }}>KPI CARDS</WfTag></div>
                <div className="wf-chart">
                  <i style={{ height: "34%" }}/><i style={{ height: "58%" }}/><i style={{ height: "44%" }}/><i style={{ height: "72%" }}/><i style={{ height: "52%" }}/><i style={{ height: "86%" }}/>
                  <WfTag style={{ right: 8, top: -7 }}>TREND</WfTag>
                </div>
                <div className="wf-rows"><span className="w90"/><span className="w75"/><span className="w80"/></div>
              </div>
            </div>
          </>
        )}
        {variant === "web-table" && (
          <>
            <div className="wf-toolbar">
              <span className="wf-search">Search…</span><span className="wf-cta">+ Add supplier</span>
              <WfTag style={{ right: 8, top: -7 }}>TOOLBAR</WfTag>
            </div>
            <div className="wf-thead"><i className="w12"/><i className="w30"/><i className="w20"/><i className="w16"/><i className="w12"/></div>
            {[82, 70, 88, 64, 76].map((w, i) => (
              <div className="wf-trow" key={i}><i className="w12"/><i style={{ width: `${w * 0.4}%` }}/><i style={{ width: `${w * 0.24}%` }}/><i style={{ width: `${w * 0.18}%` }}/><i style={{ width: `${w * 0.14}%` }}/></div>
            ))}
            <WfTag style={{ left: 8, bottom: -7 }}>DATA TABLE — SORT + STATUS</WfTag>
          </>
        )}
        {variant === "mobile-feed" && (
          <>
            <div className="wf-status"/>
            <div className="wf-m-head"><span className="wf-logo"/> <span className="wf-line w30"/></div>
            {[0, 1].map(i => (
              <div className="wf-m-card" key={i}>
                <div className="wf-img-ph sm"><span>MEDIA</span></div>
                <span className="wf-line w80"/><span className="wf-line w55"/>
              </div>
            ))}
            <div className="wf-tabs"><i className="on"/><i/><i/><i/><WfTag style={{ right: 8, top: -7 }}>TAB BAR</WfTag></div>
          </>
        )}
        {variant === "mobile-checkout" && (
          <>
            <div className="wf-status"/>
            <div className="wf-steps"><i className="on"/><i className="on"/><i/><WfTag style={{ right: 8, top: -7 }}>STEPPER</WfTag></div>
            <span className="wf-line w60"/><span className="wf-line w40"/>
            <div className="wf-m-card"><span className="wf-line w85"/><span className="wf-line w50"/><WfTag style={{ left: 8, bottom: -7 }}>ORDER SUMMARY</WfTag></div>
            <div className="wf-fields"><span/><span/><WfTag style={{ left: 8, bottom: -7 }}>PAYMENT FIELDS</WfTag></div>
            <span className="wf-pay">Pay securely</span>
          </>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/* ------------------------------ service blueprint --------------------------- */

interface BlueprintLane { front: [number, string, string][]; back: [number, string, string][]; support?: [number, string, string][]; }
const blueprints: Record<string, BlueprintLane> = {
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

function BlueprintStep({ title, note }: { title: string; note: string }) {
  return <div className="bp-step"><b>{title}</b><small>{note}</small></div>;
}

function ServiceBlueprint({ p }: { p: Project }) {
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
  const showDep = (r: { cls: string }, item: [number, string, string]) =>
    setDep({ lane: r.cls, title: item[1], note: item[2] });
  return (
    <div className="sbp">
      <div className="sbp-toolbar">
        <p className="sbp-hint">Click a system dependency to see the design decision behind it. Lanes: <kbd>toggle</kbd> or click below.</p>
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
                    onClick={() => dep?.title === item[1] && dep?.lane === r.cls ? setDep(null) : showDep(r, item)}
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
          <motion.div
            className="dep-panel"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="dep-copy">
              <b>{dep.lane === "front" ? "FRONTSTAGE" : dep.lane === "back" ? "BACKSTAGE" : "SUPPORT"} — {dep.title.toUpperCase()}</b>
              <p>{p.decision}</p>
            </div>
            <button className="dep-clear" onClick={() => setDep(null)} aria-label="Close dependency detail"><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------ journey infographic ------------------------ */

function moodOf(v: number): { label: string; cls: string } {
  if (v >= 65) return { label: "positive", cls: "good" };
  if (v >= 45) return { label: "neutral", cls: "mid" };
  return { label: "strain", cls: "low" };
}

function JourneyMap({ p }: { p: Project }) {
  const W = 600, H = 110;
  const pts = p.sentiment.map((v, i) => [ (i / (p.sentiment.length - 1)) * W, H - 12 - (v / 100) * (H - 30) ] as const);
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

/* -------------------------------- evidence --------------------------------- */

function TestDonut({ rows }: { rows: [string, string, string][] }) {
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

/* ---------------------------------- chrome --------------------------------- */

const NAV = [["Work", "#work"], ["Craft", "#craft"], ["Practice", "#practice"], ["Journey", "#experience"], ["FAQ", "#faq"], ["Contact", "#contact"]];

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

/* ----------------------------------- hero ----------------------------------- */

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="q-circle" aria-hidden="true"/>
      <div className="arc" aria-hidden="true"/>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <i aria-hidden="true"/> PRODUCT EXPERIENCE · AI &amp; AGENT UX
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.06, ease: EASE }}>
            I turn <span className="accent-text">complex products</span> into clear systems.
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease: EASE }}>
            Ajay Kumar Myakala — Staff Product Designer with 11 years across FinTech, enterprise SaaS, GovTech and media. AI-native UX, product strategy and interface craft.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26, ease: EASE }}>
            <button className="btn btn-primary" onClick={() => scrollTo("#work")}>View selected work <ArrowDown size={16}/></button>
            <a className="btn btn-ghost" href={CV} target="_blank" rel="noreferrer"><FileText size={15}/> View CV</a>
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
      <div className="stats-band">
        <div><strong><Counter to={11}/></strong><span>years across product, digital and design systems</span></div>
        <div><strong><Counter to={37} suffix="%"/></strong><span>documented reduction in underwriting decision time</span></div>
        <div><strong><Counter to={5}/></strong><span>products shipped across consumer and enterprise</span></div>
        <div><strong><Counter to={6}/></strong><span>industry domains — fintech to govtech</span></div>
      </div>
      <Marquee items={["PRODUCT STRATEGY", "AI-NATIVE UX", "DESIGN SYSTEMS", "HUMAN + AI", "ENTERPRISE WORKFLOWS", "ZERO-TO-ONE", "RESEARCH", "MOTION"]}/>
    </section>
  );
}

/* ----------------------------------- work ----------------------------------- */

function BrowserFrame({ image, alt, accent }: { image: string; alt: string; accent: string }) {
  return (
    <div className="browser-frame">
      <div className="frame-bar">
        <span className="dot" style={{ background: accent }}/><span className="dot"/><span className="dot"/>
        <span className="frame-url">{alt}</span>
      </div>
      <div className="frame-body"><img src={image} alt={`${alt} product visual`} loading="lazy"/></div>
    </div>
  );
}

function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section className="work" id="work">
      <div className="section-head">
        <Reveal><p className="kicker">SELECTED WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Business challenges,<br/>translated into <span className="accent-text">design action</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">A focused set of product stories — each opening into a full study with wireframes, maps and an honest evidence ledger.</p></Reveal>
      </div>
      <div className="work-list">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.06}>
            <SpotlightCard accent={p.accent} className={`work-card ${i % 4 === 1 || i % 4 === 2 ? "dark" : ""}`}>
              <button className="work-card-btn" onClick={() => onOpen(p)} aria-label={`Open case study: ${p.title}`}>
                <span className="work-num">{String(i + 1).padStart(2, "0")} · {p.tag}</span>
                <h3>{p.title.split(" — ")[0]}</h3>
                <p>{p.subtitle}</p>
                <span className="work-meta">
                  <span className="work-tags">{p.impact[0].split(":")[0].toUpperCase()}</span>
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

/* ------------------------------ craft / concepts ----------------------------- */

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

interface CaseMap { map: string; mapAlt: string; title: string; desc: string; evidence: string; evidenceAlt: string; }

function MapPair({ m, n }: { m: CaseMap; n: number }) {
  return (
    <div className="map-pair">
      <figure className="map-frame">
        <figcaption><span>SYSTEM MAP</span><em>{String(n).padStart(2, "0")}</em></figcaption>
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
  );
}

function SystemMaps({ maps, accent }: { maps: CaseMap[]; accent: string }) {
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
          <MapPair m={m} n={sel + 1}/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Craft() {
  const [sel, setSel] = useState(0);
  const [, img, title, desc, Icon] = conceptArt[sel];
  return (
    <section className="craft" id="craft">
      <div className="section-head">
        <Reveal><p className="kicker">02 — CONCEPT MAPS</p></Reveal>
        <Reveal delay={0.06}><h2>Making the system<br/><span className="accent-text">visible first.</span></h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Working artefacts from real engagements — maps that turn people, rules and states into decisions before interface choices harden. Each case study below carries its own set.</p></Reveal>
      </div>
      <Reveal>
        <div className="concept-switcher">
          <div className="concept-tabs" role="tablist" aria-label="Concept map patterns">
            {conceptArt.map(([id, , label], i) => (
              <button key={id} role="tab" aria-selected={sel === i} className={sel === i ? "active" : ""} onClick={() => setSel(i)}>{label}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={sel} className="concept-stage" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="concept-copy">
                <Icon size={22} strokeWidth={1.6}/>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <div className="concept-img-wrap"><img src={img} alt={`${title} concept map`} loading="lazy" decoding="async"/></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- capabilities ------------------------------- */

function Practice() {
  return (
    <section className="practice" id="practice">
      <div className="section-head">
        <Reveal><p className="kicker">THE WORK BEHIND THE WORK</p></Reveal>
        <Reveal delay={0.06}><h2>Practice that scales<br/><span className="accent-text">beyond screens</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">The disciplines that make quality repeatable — carried across every engagement.</p></Reveal>
      </div>
      <div className="cap-grid">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={(i % 4) * 0.05}>
            <div className="cap-card">
              <span className="cap-top">
                <span className="cap-num">{String(i + 1).padStart(2, "0")}</span>
                <c.icon size={20} strokeWidth={1.6}/>
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- experience -------------------------------- */

function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section className="experience" id="experience">
      <div className="section-head">
        <Reveal><p className="kicker">CAREER JOURNEY</p></Reveal>
        <Reveal delay={0.06}><h2>From craft<br/>to <span className="accent-text">capability</span>.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">A career that moved from recruitment tech, to media and adtech, to govtech, enterprise and fintech — one continuous practice of reducing ambiguity.</p></Reveal>
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

/* ----------------------------------- FAQ ------------------------------------ */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="section-head">
        <Reveal><p className="kicker">QUESTIONS</p></Reveal>
        <Reveal delay={0.06}><h2>Answered here.<br/><span className="accent-text">More over a call.</span></h2></Reveal>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className={`faq-item ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.q}<ChevronDown size={18}/></button>
              <AnimatePresence initial={false}>
                {open === i && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }}><p>{f.a}</p></motion.div>}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="about-strip">
        <Reveal>
          <div>
            <h3>Beyond the job title</h3>
            <p>I began in recruitment technology, moved through media and adtech, designed citizen services in govtech, and now lead product design for one of the highest-stakes categories — US mortgage lending. The common thread: turning complex operational systems into experiences people can actually act on.</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <h3>How I work</h3>
            <p>Maps before screens. Evidence before claims. Systems before one-offs — and the front-end craft to ship what I design.</p>
            <div className="chip-row">
              <span>8PX GRID</span><span>TOKENS</span><span>MOTION</span><span>WCAG-MINDED</span><span>HTML/CSS/JS</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- contact --------------------------------- */

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-band" aria-hidden="true"/>
      <div className="contact-inner">
        <Reveal><p className="kicker">LET'S BUILD SOMETHING CLEAR</p></Reveal>
        <Reveal delay={0.06}><h2>Complex product?<br/>Let's make it simpler.</h2></Reveal>
        <Reveal delay={0.12}><p className="section-sub">Open to conversations around AI-native product experiences, enterprise workflows and design systems.</p></Reveal>
        <Reveal delay={0.18}>
          <div className="contact-actions">
            <a className="btn btn-accent btn-lg" href={`mailto:${EMAIL}`}><Mail size={17}/> Email me <ArrowUpRight size={15}/></a>
            <a className="btn btn-ghost on-dark btn-lg" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={15}/></a>
            <a className="btn btn-ghost on-dark btn-lg" href={CV} target="_blank" rel="noreferrer"><FileText size={16}/> Download CV</a>
          </div>
        </Reveal>
        <span className="contact-big-arrow" aria-hidden="true">↗</span>
      </div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Ajay Kumar Myakala</span>
        <a href="#home" onClick={e => { e.preventDefault(); scrollTo("#home"); }}>BACK TO TOP ↑</a>
      </footer>
      <p className="footer-legal">This is a personal portfolio. Employer and client names and trademarks are shown solely to identify the context of my work. Their inclusion does not imply endorsement. Product information reflects the time of each project and may no longer be current.</p>
    </section>
  );
}

/* ------------------------------ case study page ----------------------------- */

function CasePage({ project, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (p: Project) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const idx = projects.findIndex(x => x.id === project.id);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
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
      if (e.key === "ArrowRight") { e.preventDefault(); onNavigate(next); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); onNavigate(prev); return; }
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
  return (
    <motion.div className="case-fs" ref={caseRef} role="dialog" aria-modal="true" aria-label={`${project.title} case study`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.4, ease: EASE }}>
      <div className="case-bar">
        <button className="case-back" onClick={onClose}><ArrowLeft size={16}/> All work</button>
        <span className="case-bar-title">{project.title}</span>
        <div className="case-bar-actions">
          {project.link && <a className="btn btn-ghost btn-sm" href={project.link} target="_blank" rel="noreferrer">Live product <ExternalLink size={13}/></a>}
          <span className="case-kbd" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> cases</span>
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
          </div>
        </header>

        <div className="case-figure"><BrowserFrame image={project.image} alt={project.title} accent={project.accent}/></div>

        <section className="case-sec">
          <h2><span>01</span> The brief</h2>
          <p className="case-problem">{project.problem}</p>
          <p className="case-body">{project.summary}</p>
          <div className="case-pills">{project.contribution.map(x => <span key={x}>{x}</span>)}</div>
        </section>

        <section className="case-sec">
          <h2><span>02</span> Wireframes → production</h2>
          <p className="case-body">Structure first: low-fidelity frames fixing hierarchy, states and content priority — then the shipped interface.</p>
          <div className="wf-row">
            {project.wf.map(([v, cap]) => <Wireframe key={v + cap} variant={v} caption={cap}/>)}
            <div className="wf-arrow" aria-hidden="true"><ArrowRight size={20}/><span>SHIPPED</span></div>
          </div>
        </section>

        <section className="case-sec">
          <h2><span>03</span> Design process</h2>
          <div className="case-process">{project.process.map(([t, d], i) => <div key={t}><span>0{i + 1}</span><b>{t}</b><p>{d}</p></div>)}</div>
          <p className="case-decision"><Sparkles size={14}/><span><b>Key decision — </b>{project.decision}</span></p>
        </section>

        <section className="case-sec">
          <h2><span>04</span> User journey map</h2>
          <JourneyMap p={project}/>
        </section>

        <section className="case-sec">
          <h2><span>05</span> Service blueprint</h2>
          <p className="case-body">Frontstage actions wired to the backstage rules and support systems that make them work — toggle a lane to isolate it.</p>
          <ServiceBlueprint p={project}/>
        </section>

        <section className="case-sec">
          <h2><span>06</span> System maps → production evidence</h2>
          <p className="case-body">The maps this case was designed against, each paired with the shipped surface it informed.</p>
          <SystemMaps maps={project.maps} accent={project.accent}/>
        </section>

        <section className="case-sec">
          <h2><span>07</span> Evidence & measurement</h2>
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
        </section>

        <section className="case-sec">
          <h2><span>08</span> AI involvement</h2>
          <div className="case-ai">{project.ai.map((x, i) => <div key={x}><span>0{i + 1}</span><BrainCircuit size={15}/><b>{x}</b><small>{i === project.ai.length - 1 ? "Human accountability" : "Assistive workflow"}</small></div>)}</div>
        </section>

        <nav className="case-next" aria-label="More case studies">
          <button onClick={() => onNavigate(prev)}><ArrowLeft size={16}/><span><small>PREVIOUS · ←</small><b>{prev.title}</b></span></button>
          <button onClick={() => onNavigate(next)}><span><small>NEXT · →</small><b>{next.title}</b></span><ArrowRight size={16}/></button>
        </nav>
      </div>
    </motion.div>
  );
}

/* ----------------------------------- app ----------------------------------- */

export default function App() {
  const [active, setActive] = useState("home");
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);
  useEffect(() => {
    document.title = "Ajay Kumar Myakala — Staff Product Designer | AI & Agent Experience";
    const ids = NAV.map(([, href]) => href.slice(1)).concat("craft");
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
      <a className="skip-link" href="#work" onClick={e => { e.preventDefault(); scrollTo("#work"); }}>Skip to work</a>
      <div className="scroll-progress" aria-hidden="true"/>
      <Header active={active}/>
      <main>
        <Hero/>
        <Work onOpen={setCaseStudy}/>
        <Craft/>
        <Practice/>
        <Experience/>
        <Faq/>
        <Contact/>
      </main>
      <AnimatePresence>
        {caseStudy && <CasePage key={caseStudy.id} project={caseStudy} onClose={() => setCaseStudy(null)} onNavigate={setCaseStudy}/>}
      </AnimatePresence>
    </div>
  );
}
