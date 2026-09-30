/* ------------------------------ shared types ------------------------------ */

export type WfVariant = "web-hero" | "web-dash" | "web-table" | "mobile-feed" | "mobile-checkout";
export type MockVariant = "rates" | "dash" | "supplier" | "spend" | "feed" | "segments" | "shop" | "checkout";

export interface Bar { label: string; pct: number; display: string; }

export interface DesignDecision { what: string; why: string; evidence: string; result: string; }

export interface ResearchChain { observation: string; pattern: string; insight: string; decision: string; validation: string; }

export interface CaseMap { map: string; mapAlt: string; title: string; desc: string; evidence: string; evidenceAlt: string; }

/* -------- case-02 editorial upgrade: all content grounded in existing copy ------- */

export interface InsightCard { title: string; insight: string; implication: string; }
export interface JourneyStage { stage: string; goal: string; response: string; pain: string; }
export interface DecisionUi { what: string; why: string; evidence: string; result: string; mock: MockVariant; ui: string; }
export interface Hotspot { x: number; y: number; label: string; text: string; }
export interface ProtoFrame { stage: string; caption: string; mock: MockVariant; phone?: boolean; }

export interface Project {
  id: string; tag: string; domain: string; title: string; short: string; subtitle: string;
  role: string; client: string; period: string; status: string;
  image: string; link?: string; accent: string;
  domains: string[];
  platforms: string[];
  systemRole: string;
  outcomeLine: string;
  scope: string[];
  overview: string;
  challenge: string[];
  rolePoints: string[]; collaborated: string[];
  constraints: string[];
  research: ResearchChain;
  maps: CaseMap[];
  insights: string[];
  actors: string[]; journey: string[]; sentiment: number[]; pains: string[];
  wf: [WfVariant, string][];
  hifi: [MockVariant, string][];
  decisions: DesignDecision[];
  beforeAfter: { before: string[]; after: string[] };
  prototypeNote: string;
  systemNote: string;
  chart: Bar[];
  evidence: { label: string; value: string; note: string; kind: "measured" | "scope" | "objective" | "gap" }[];
  testing: [string, string, string][];
  improve: string[];
}

/* --------------------------------- projects -------------------------------- */

export const projects: Project[] = [
  {
    id: "01",
    tag: "FINTECH / MORTGAGE",
    domain: "Mortgage / Lending",
    title: "HomeRatesYard — Mortgage Platform",
    short: "HomeRatesYard",
    subtitle: "Simplifying how people explore, compare and act on mortgage options.",
    role: "Senior Product Designer / Lead Product Design Consultant",
    client: "HomeLoc Solutions LLP",
    period: "Apr 2024 – May 2026",
    status: "LIVE PRODUCT",
    image: "/Homepage.jpg",
    link: "https://homeratesyard.com/",
    accent: "#e4572e",
    domains: ["B2C", "FINTECH"],
    platforms: ["Web", "Mobile web", "Borrower portal"],
    systemRole: "Rate cards, status milestones and form patterns systematized for new loan products",
    outcomeLine: "Unified borrower journey from rate discovery to servicing — with a documented 37% reduction in underwriting decision time (CV-documented).",
    scope: ["UX Strategy", "IA", "Interaction", "UI", "Prototype"],
    overview: "A mortgage and lending ecosystem spanning origination, underwriting, onboarding, servicing and lending operations — design direction that connected borrower intent to operational decisions instead of treating rate discovery and underwriting as separate experiences.",
    challenge: [
      "Mortgage is one of the highest-stakes journeys a person makes: large amounts, long timelines and dense regulated language. At HomeRatesYard the product risked mirroring that internal complexity back at borrowers — too many rate options, jargon-heavy forms and a status experience that felt like a black box between application and closing.",
      "The deeper problem sat behind the interface: rate discovery, application and underwriting were designed as separate experiences, so the borrower's intent collected at the start never travelled with them. Operational teams had the full picture; borrowers had a progress bar.",
      "The design challenge was to make a high-stakes workflow feel clearer without hiding its operational complexity — to connect borrower intent to the operational decision points that actually determine outcomes."
    ],
    rolePoints: ["UX strategy", "Experience architecture", "Interaction design", "Design direction", "Prototype"],
    collaborated: ["Product", "Engineering", "Business stakeholders", "Underwriting operations"],
    constraints: [
      "Underwriting rules are fixed by compliance — design could re-sequence, explain and expose them, but not change the decisions themselves.",
      "Regulated language limits how far marketing-style simplification can go; clarity had to come from structure, not rewording.",
      "Third-party document verification timing sits outside the product's control, so status design had to make waiting legible.",
      "Four actor groups — borrower, mortgage professional, underwriting ops, product + engineering — share one workflow with different needs."
    ],
    research: {
      observation: "Borrowers compared multiple rate options side by side, but the options were described in lender language — APR, points, ARM resets — that most could not act on.",
      pattern: "Confidence in the next step mattered more than the number of options. Where status was opaque, borrowers paused the journey entirely rather than proceed on trust.",
      insight: "Borrowers need the operational state of their loan visible alongside the financial choice — the two decision streams were being designed apart.",
      decision: "Connect borrower intent to operational decision points: show live underwriting milestones with plain-language explanation beside rate and payment choices.",
      validation: "Stakeholder walkthroughs of the decision paths and a documented 37% reduction in underwriting decision time after the workflow shipped (CV-documented outcome)."
    },
    maps: [
      { map: "/concept-maps/concept-paper-pencil-clean.png", mapAlt: "Original paper and pencil ecosystem sketch for the mortgage product", title: "Paper ecosystem sketch", desc: "The original hand-drawn map: borrower intent on one side, operational decisions on the other — the frame the whole product was designed against.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "HomeRatesYard product surface the sketch informed" },
      { map: "/concept-maps/ecosystem-map-realistic-clean.png", mapAlt: "Lending ecosystem map with actors and dependencies", title: "Lending ecosystem map", desc: "Borrower, mortgage professional, underwriting operations and engineering as one connected system — used to find the handoffs that caused black-box status.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "Shipped mortgage platform surface" },
      { map: "/concept-maps/decision-tree-realistic-clean.png", mapAlt: "Underwriting decision tree with recovery paths", title: "Underwriting decision tree", desc: "High-consequence underwriting choices with explicit paths, recovery and explanation — the map behind the documented decision-time reduction.", evidence: "/real-work/homeratesyard-1600x900.jpg", evidenceAlt: "Underwriting workflow surface in production" }
    ],
    insights: [
      "Too many rate options without decision context creates comparison paralysis, not empowerment.",
      "Jargon-heavy forms push borrowers into passive compliance — they complete steps without understanding them.",
      "Side-by-side comparison only works when the differences between options are operational, not just numerical.",
      "Document upload anxiety comes from not knowing what happens after the upload.",
      "Black-box status is the single largest trust failure in the journey — silence reads as risk.",
      "Without a servicing entry point, the journey ends at closing instead of continuing into the relationship."
    ],
    actors: ["Borrower", "Mortgage professional", "Underwriting ops", "Product + Eng"],
    journey: ["Explore", "Qualify", "Compare", "Apply", "Underwrite", "Service"],
    sentiment: [70, 55, 62, 40, 48, 78],
    pains: ["Too many rate options", "Jargon-heavy forms", "Side-by-side unclear", "Document upload anxiety", "Black-box status", "No servicing entry"],
    wf: [["web-hero", "Rate discovery — landing structure"], ["web-dash", "Borrower dashboard states"]],
    hifi: [["rates", "homeratesyard.com — rate discovery"], ["dash", "Borrower dashboard — application state"]],
    decisions: [
      { what: "Surface live underwriting milestones with plain-language explanation inside the borrower dashboard.", why: "Black-box status was the largest trust failure — silence between application and closing read as risk.", evidence: "Journey mapping showed the steepest sentiment drop at Underwrite; borrowers paused rather than proceed on trust.", result: "The underwriting workflow improvement shipped with a documented 37% reduction in decision time (CV-documented)." },
      { what: "One guided form language replacing per-lender jargon, with side-by-side rate comparison anchored on total cost.", why: "Jargon-heavy forms produced passive compliance — borrowers completed steps without understanding them.", evidence: "Rate-comparison observations: options described in lender language could not be acted on by most borrowers.", result: "Comparison became decision-ready; objective — no fabricated metric attached." },
      { what: "Treat rate discovery, application and underwriting as one connected journey rather than separate products.", why: "Intent collected at discovery never travelled; operational teams had the full picture while borrowers had a progress bar.", evidence: "The ecosystem map exposed the handoffs where borrower context was dropped between systems.", result: "A live product spanning the full borrowing journey — origination through servicing." }
    ],
    beforeAfter: {
      before: ["Multiple disconnected systems", "5+ workflow steps without continuity", "Low status visibility between stages", "High cognitive load at every decision"],
      after: ["Unified workflow across the journey", "Clear system status at each milestone", "Decision context beside every choice", "Servicing continuation after closing"]
    },
    prototypeNote: "Interactive rate explorer below is an illustrative prototype built for this portfolio — the payment logic is real, the data is conceptual.",
    systemNote: "Rate cards, status milestones and form patterns were built as a reusable system so new loan products inherit the same decision language.",
    chart: [{ label: "Underwriting decision time", pct: 37, display: "−37%" }, { label: "Journey stages mapped", pct: 75, display: "6 stages" }, { label: "Actor groups designed for", pct: 50, display: "4 groups" }],
    evidence: [
      { label: "Underwriting decision time", value: "37% faster", note: "Documented CV outcome", kind: "measured" },
      { label: "Workflow clarity", value: "Objective", note: "Design objective — not a measured result", kind: "objective" },
      { label: "Stakeholder alignment", value: "Objective", note: "Design objective — not a measured result", kind: "objective" }
    ],
    testing: [["Workflow comprehension", "Task walkthrough + stakeholder review", "Documented design activity"], ["Decision-time outcome", "Production workflow observation", "Measured: 37% reduction"], ["Usability", "Moderated borrower / operator testing", "Test plan; result not supplied"]],
    improve: ["Run quantified usability testing at each journey stage rather than stakeholder walkthroughs alone.", "Instrument service-level metrics with operations, not only decision time.", "Test plain-language form copy with first-time borrowers specifically."]
  },
  {
    id: "02",
    tag: "ENTERPRISE / B2B",
    domain: "Enterprise / B2B",
    title: "Procurement & Supplier Experience",
    short: "Procurement & Supplier Experience",
    subtitle: "Making operational data usable for people who act on it.",
    role: "Senior Product Designer",
    client: "Computech Corporation",
    period: "Mar 2023 – Mar 2024",
    status: "ENTERPRISE PRODUCT",
    image: "/Dashboard.jpg",
    accent: "#2563eb",
    domains: ["B2B", "ENTERPRISE", "AI / DATA"],
    platforms: ["Web app", "Reporting", "Reconciliation"],
    systemRole: "Table, filter, status and dashboard patterns reused across five workflow families",
    outcomeLine: "Five workflow families shipped as one system across four data-heavy surfaces; outcome metrics not supplied — marked honestly.",
    scope: ["UX Strategy", "Research", "IA", "Interaction", "UI", "Design System"],
    overview: "Procurement, supplier diversity, compliance, spend visibility and reconciliation brought together through service experiences, onboarding workflows, reporting and dashboards — five workflow families and four data-heavy surfaces designed as one system.",
    challenge: [
      "Procurement teams live in dense operational data: supplier records, compliance states, spend ledgers and reconciliation mismatches. The existing surfaces exposed that data as undifferentiated dashboards — everything visible, nothing prioritised.",
      "The cost was operational: scattered data requests between roles, records that didn't match across systems, static reports that required manual interpretation, and no signal for what to do next. Data volume was never the problem; decision visibility was.",
      "The design challenge was to make dense operational data expose the next decision instead of simply exposing more data — for procurement leads, suppliers, compliance reviewers and finance simultaneously."
    ],
    rolePoints: ["Information architecture", "Workflow design", "Dashboard UX", "Reusable UI patterns", "Research"],
    collaborated: ["Product", "Engineering", "Data", "Compliance", "Business stakeholders"],
    constraints: [
      "Five workflow families — procurement, supplier, compliance, spend, reconciliation — had to ship as one coherent system, not five products.",
      "Four data-heavy surfaces (dashboards, reporting, reconciliation, supplier views) shared components but served different roles.",
      "Enterprise data joins (supplier ↔ spend records) were imperfect; the UI had to make mismatches resolvable, not hide them.",
      "Compliance and diversity rules were non-negotiable inputs to every workflow."
    ],
    research: {
      observation: "Users compared multiple supplier attributes — price, lead time, certifications, delivery history — across scattered views.",
      pattern: "Delivery confidence influenced decisions more than expected: a cheaper supplier with uncertain delivery lost to a pricier, reliable one.",
      insight: "Users need operational risk visible alongside supplier cost — price alone was an incomplete decision input.",
      decision: "Surface delivery risk beside supplier cost in every comparison and recommendation surface.",
      validation: "With risk made explicit beside cost, users identified preferred suppliers faster in walkthroughs of the comparison flow (qualitative validation)."
    },
    maps: [
      { map: "/concept-maps/service-blueprint-realistic-clean.png", mapAlt: "Procurement service blueprint with frontstage and backstage lanes", title: "Procurement service blueprint", desc: "Frontstage supplier actions wired to backstage compliance and finance rules — exposed the dependencies behind scattered data requests.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Procurement platform surface in production" },
      { map: "/concept-maps/ecosystem-map-realistic-clean.png", mapAlt: "Supplier ecosystem map across procurement roles", title: "Supplier ecosystem map", desc: "Procurement lead, supplier, compliance reviewer and finance as actors in one system — the base for role-based dashboard IA.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Enterprise dashboard surface shipped" },
      { map: "/concept-maps/opportunity-matrix-realistic-clean.png", mapAlt: "Opportunity matrix balancing user value and delivery confidence", title: "Opportunity matrix", desc: "Workflow gaps prioritised by user value against delivery confidence — decided which of the five families shipped first.", evidence: "/real-work/procurement-1600x900.jpg", evidenceAlt: "Operational data product evidence" }
    ],
    insights: [
      "Lengthy supplier registration with scattered data requests stalls onboarding before value is reached.",
      "Unclear review priorities turn compliance from a gate into a bottleneck.",
      "Mismatched records between supplier and spend systems erode trust in every number downstream.",
      "Static reports shift the analytical burden onto the reader instead of the interface.",
      "Dashboards without a next action become wallpaper — checked, then ignored."
    ],
    actors: ["Procurement lead", "Supplier", "Compliance reviewer", "Finance / ops"],
    journey: ["Onboard", "Collect", "Review", "Reconcile", "Report", "Act"],
    sentiment: [55, 48, 42, 38, 58, 70],
    pains: ["Lengthy registration", "Scattered data requests", "Unclear priorities", "Mismatched records", "Static reports", "No next action"],
    wf: [["web-table", "Supplier register — table patterns"], ["web-dash", "Spend visibility overview"]],
    hifi: [["supplier", "Supplier network — performance"], ["segments", "Audience console — segment states"]],
    decisions: [
      { what: "Role-based dashboard IA: each role lands on its decisions, with the next operational action surfaced first.", why: "Undifferentiated dashboards made everything visible and nothing prioritised.", evidence: "Stakeholder interviews mapped operational jobs per role; the opportunity matrix ranked gaps by user value and delivery confidence.", result: "Five workflow families shipped as one system across four data-heavy surfaces (scope, documented)." },
      { what: "Delivery risk displayed beside supplier cost in comparisons and recommendations.", why: "Price was an incomplete decision input without operational risk context.", evidence: "Comparison observation: delivery confidence influenced decisions more than expected.", result: "Users identified preferred suppliers faster in walkthroughs (qualitative)." },
      { what: "Reconciliation designed as a mismatch-resolution flow rather than a static report.", why: "Mismatched records eroded trust in downstream numbers.", evidence: "Blueprint exposed where supplier and spend data joins failed silently.", result: "Mismatch review became an actionable workflow; objective — no fabricated metric attached." }
    ],
    beforeAfter: {
      before: ["Scattered data requests between roles", "Static reports needing manual interpretation", "No signal for the next action", "Mismatches discovered late"],
      after: ["Role-based surfaces per decision", "Next action surfaced on every dashboard", "Mismatch resolution as a guided flow", "Compliance state visible at the point of action"]
    },
    prototypeNote: "The supplier comparison demo below is an illustrative prototype built for this portfolio — the comparison logic is real, the supplier data is conceptual.",
    systemNote: "Table, filter, status and dashboard patterns were built once and reused across all five workflow families so new operational surfaces inherit the same decision language.",
    chart: [{ label: "Workflow families covered", pct: 83, display: "5" }, { label: "Data-heavy surfaces", pct: 66, display: "4" }, { label: "Validation streams run", pct: 50, display: "3" }],
    evidence: [
      { label: "Workflow coverage", value: "5 families", note: "Procurement • supplier • compliance • spend • reconciliation", kind: "scope" },
      { label: "Data-heavy surfaces", value: "4 surfaces", note: "Dashboards, reporting, reconciliation, supplier views", kind: "scope" },
      { label: "Outcome metrics", value: "Not supplied", note: "No quantified result in source CV", kind: "gap" }
    ],
    testing: [["Information findability", "Task-based usability testing", "Test plan; result not supplied"], ["Dashboard comprehension", "Scenario walkthrough + heuristic review", "Design validation"], ["Supplier onboarding", "End-to-end workflow test", "Test plan; result not supplied"]],
    improve: ["Quantify onboarding-time and reconciliation outcomes with instrumentation.", "Run longitudinal studies with procurement leads, not only task-based tests.", "Extend the pattern system to predictive supplier-risk views."]
  },
  {
    id: "03",
    tag: "AI / MEDIA / DATA",
    domain: "AI / Media / Data",
    title: "Audience Intelligence & Media Products",
    short: "Audience Intelligence",
    subtitle: "Connecting content, audience signals and monetisation.",
    role: "Senior Product Designer",
    client: "Way2News Interactive Pvt. Ltd",
    period: "May 2018 – Jun 2021",
    status: "MULTI-PRODUCT",
    image: "/way2news/product-screens.svg",
    accent: "#7c3aed",
    domains: ["B2B", "ADTECH", "AI / DATA"],
    platforms: ["Mobile app", "Web console", "4 languages"],
    systemRole: "Feed cards, segment builders and campaign states sharing one pattern language",
    outcomeLine: "Five products across discovery, segmentation, campaigns and monetisation — one connected audience-signal system.",
    scope: ["Product UX", "Research", "IA", "Interaction", "Data Viz"],
    overview: "Experiences across Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany — content discovery, segmentation, campaign management and monetisation. Five products, four Indian languages, one connected audience-signal system.",
    challenge: [
      "Consumer discovery and enterprise intelligence were two different jobs sharing one underlying asset: audience signals. Readers needed language-first content discovery with zero friction; marketers and analysts needed segmentation, targeting and monetisation built on the same behaviour data.",
      "The failure mode was flattening them — forcing enterprise dashboards on readers or feed thinking onto analysts. The other failure mode was disconnecting them: discovery producing signals that never reached campaign and monetisation surfaces.",
      "The design challenge was to keep consumer discovery and operational intelligence connected without flattening their different jobs."
    ],
    rolePoints: ["Product UX", "Content discovery", "Audience workflows", "Interface systems", "Data visualization"],
    collaborated: ["Product", "Engineering", "Data", "Editorial", "Demand partners"],
    constraints: [
      "Five named products — Way2News, AudiencePlay, AudiencePrime, DigitalKites, TheTasteCompany — needed distinct jobs without divergent patterns.",
      "Mobile-first discovery shipped in four Indian languages; the feed had to work across scripts and reading directions.",
      "Behavioural signals were the shared asset; consumer and enterprise surfaces had to stay connected to them.",
      "Monetisation depended on demand partners outside product control."
    ],
    research: {
      observation: "Readers engaged most with language-first feeds; segment builders treated audience definitions as static lists rather than live behaviour.",
      pattern: "Fragmented segments and blind targeting appeared wherever the discovery-side behaviour signals were disconnected from campaign surfaces.",
      insight: "Audience intelligence stays trustworthy only when discovery behaviour, segment definition and campaign targeting read from the same signals.",
      decision: "Separate consumer discovery from operational intelligence as products, while wiring both to one behavioural signal system.",
      validation: "Scenario-based workflow tests of segmentation and campaign flows validated the separation (test plans documented; quantified results not supplied)."
    },
    maps: [
      { map: "/concept-maps/journey-map-realistic-clean.png", mapAlt: "Reader journey map across discovery and retention", title: "Reader journey map", desc: "Discover → engage → retain for four language editions — kept consumer discovery separate from the operational intelligence underneath.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Reporting product evidence" },
      { map: "/concept-maps/research-loop-realistic-clean.png", mapAlt: "Audience research loop from observation to validation", title: "Audience research loop", desc: "Behavioural analytics feeding hypotheses and validation — how audience insights stayed connected to both consumer and enterprise surfaces.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Audience intelligence reporting surface" },
      { map: "/concept-maps/opportunity-matrix-realistic-clean.png", mapAlt: "Monetisation opportunity matrix", title: "Monetisation opportunity matrix", desc: "Campaign and monetisation opportunities ranked by audience value and platform confidence across the five products.", evidence: "/real-work/reporting-1600x900.jpg", evidenceAlt: "Campaign and monetisation surface" }
    ],
    insights: [
      "Content overload without language-first structure breaks retention before value is reached.",
      "Weak retention hooks compound: every session without a next-read reason lowers the next session's odds.",
      "Segments defined as static lists go stale; behaviour-defined segments stay actionable.",
      "Blind targeting is a signal-connectivity problem, not a data-volume problem.",
      "Vanity metrics disconnect content investment from revenue reality."
    ],
    actors: ["Reader", "Marketer", "Audience analyst", "Editorial / product"],
    journey: ["Discover", "Engage", "Segment", "Target", "Measure", "Monetise"],
    sentiment: [82, 74, 50, 46, 60, 66],
    pains: ["Content overload", "Weak retention hooks", "Fragmented segments", "Blind targeting", "Vanity metrics", "Unconnected revenue"],
    wf: [["mobile-feed", "Discover feed — mobile-first"], ["web-dash", "Audience segmentation console"]],
    hifi: [["feed", "Way2News — discover feed"], ["dash", "Audience console — workflow states"]],
    decisions: [
      { what: "Separate products for discovery and intelligence, wired to one behavioural signal system.", why: "Flattening the two jobs would fail both; disconnecting them would orphan the signals.", evidence: "Journey mapping showed discovery and monetisation failing at exactly the disconnected handoffs.", result: "Five products shipped across discovery, segmentation, campaigns and monetisation (scope, documented)." },
      { what: "Language-first discovery across four Indian languages.", why: "Content overload without language structure broke retention before value was reached.", evidence: "Feed behaviour patterns: engagement concentrated in language-matched feeds.", result: "Mobile-first discovery shipped in 4 languages (scope, documented)." },
      { what: "Behaviour-defined segments replacing static audience lists in the console.", why: "Static segments went stale and produced blind targeting.", evidence: "Segmentation workflow tests: stale definitions were the recurring failure point.", result: "Campaign states made explicit; objective — no fabricated metric attached." }
    ],
    beforeAfter: {
      before: ["Fragmented segments across products", "Blind targeting from stale lists", "Vanity metrics guiding content investment", "Revenue unconnected to behaviour"],
      after: ["One signal system behind all products", "Behaviour-defined live segments", "Explicit campaign and targeting states", "Monetisation traceable to audience signals"]
    },
    prototypeNote: "The AI segment demo below is a conceptual prototype built for this portfolio — it demonstrates the human-review pattern, not a live AI system.",
    systemNote: "Feed cards, segment builders and campaign states shared one pattern language across the five products, so enterprise surfaces felt like siblings of the consumer app.",
    chart: [{ label: "Named products designed", pct: 83, display: "5" }, { label: "Indian languages shipped", pct: 66, display: "4" }, { label: "Workflow families", pct: 66, display: "4" }],
    evidence: [
      { label: "Named products", value: "5 products", note: "Way2News + AudiencePlay + AudiencePrime + DigitalKites + TheTasteCompany", kind: "scope" },
      { label: "Workflow families", value: "4 families", note: "Discovery • segmentation • campaigns • monetisation", kind: "scope" },
      { label: "Quantified outcomes", value: "Not supplied", note: "No metric supplied in source CV", kind: "gap" }
    ],
    testing: [["Content discovery", "Tree test / usability task", "Test plan; result not supplied"], ["Audience segmentation", "Scenario-based workflow test", "Test plan; result not supplied"], ["Campaign management", "Prototype review + task test", "Design validation"]],
    improve: ["Instrument retention and monetisation to quantify the signal-connectivity decision.", "Run longitudinal audience research across language editions.", "Prototype AI-assisted segmentation with human review as a product feature, not just a process."]
  },
  {
    id: "04",
    tag: "COMMERCE",
    domain: "Commerce",
    title: "E-commerce Product Experience",
    short: "E-commerce Product Experience",
    subtitle: "An end-to-end build from discovery to checkout.",
    role: "Product Designer",
    client: "Independent end-to-end project",
    period: "2025 – 2026",
    status: "NEW CHAPTER",
    image: "/ecommerce-art.svg",
    accent: "#0d9488",
    domains: ["D2C", "E-COMMERCE"],
    platforms: ["Mobile-first web", "Cart", "Checkout"],
    systemRole: "Product cards, cart rows, form fields and status pills as one small system",
    outcomeLine: "Six journey stages — discovery, evaluation, cart, checkout, fulfilment, support — defined as one connected flow.",
    scope: ["UX Strategy", "IA", "Interaction", "UI", "Prototype"],
    overview: "A new portfolio chapter focused on product discovery, evaluation, cart, checkout and responsive states — six journey stages defined as one connected flow, with honest evidence boundaries where results were not supplied.",
    challenge: [
      "Commerce is a trust problem wearing a shopping cart. Shoppers must understand value, trust the product and complete purchase — and every point of cognitive friction gives them a reason to leave.",
      "The classic failure pattern: unclear value, weak filters, missing trust cues at decision points, hidden costs surfacing at checkout, form friction, and no clarity after the order is placed.",
      "The design challenge was to reduce that friction by making value, trust and purchase state explicit throughout the journey — and to design the failure states, not just the happy path."
    ],
    rolePoints: ["End-to-end UX", "Product architecture", "Responsive interaction", "Checkout states", "Prototype"],
    collaborated: ["Engineering", "Merchant / business stakeholder"],
    constraints: [
      "Six journey stages — land, browse, evaluate, add, checkout, return — had to work as one connected flow, not six screens.",
      "Four UI states (loading, empty, error, success) were in scope from the start; the happy path alone was not acceptable.",
      "Mobile-first: most of the journey happens on a phone, so checkout states were designed mobile-up.",
      "No production analytics yet — outcomes are stated as design objectives, not metrics."
    ],
    research: {
      observation: "Shoppers abandoned evaluation where trust cues were missing, and abandoned checkout where costs or fields surprised them.",
      pattern: "The friction clustered at exactly the steps where the interface asked for commitment without giving certainty first.",
      insight: "Purchase confidence is built by sequencing certainty before commitment at every step of the journey.",
      decision: "Place trust cues at each decision point, show honest totals early, and make every checkout state explicit.",
      validation: "Journey walked end-to-end against the six stages and four states; structured test plans exist, quantified results not yet supplied."
    },
    maps: [
      { map: "/concept-maps/decision-tree-realistic-clean.png", mapAlt: "Purchase decision tree with trust and recovery paths", title: "Purchase decision tree", desc: "Evaluate → trust → commit with explicit recovery at every risky step — the map that shaped checkout state coverage.", evidence: "/ecommerce-art.svg", evidenceAlt: "E-commerce experience cover" },
      { map: "/concept-maps/service-blueprint-realistic-clean.png", mapAlt: "Checkout service blueprint with payment backstage", title: "Checkout service blueprint", desc: "Cart and payment frontstage wired to fulfilment and failure backstage — where hidden costs and error states were designed, not discovered.", evidence: "/ecommerce-art.svg", evidenceAlt: "Checkout experience cover" },
      { map: "/concept-maps/journey-map-realistic-clean.png", mapAlt: "Shopper journey map from landing to return", title: "Shopper journey map", desc: "Land → browse → evaluate → add → checkout → return as one connected journey — the six stages the interface had to carry.", evidence: "/ecommerce-art.svg", evidenceAlt: "E-commerce journey cover" }
    ],
    insights: [
      "Unclear value kills evaluation before filters even matter.",
      "Missing trust cues at the add-to-cart moment cost more than missing features.",
      "Hidden costs at checkout don't just lose the order — they lose the return visit.",
      "Form friction is a sequencing problem: fields asked for commitment before certainty.",
      "No order clarity after payment is the cheapest trust repair most stores skip."
    ],
    actors: ["Shopper", "Evaluator", "Buyer", "Commerce operator"],
    journey: ["Land", "Browse", "Evaluate", "Add", "Checkout", "Return"],
    sentiment: [76, 68, 58, 52, 44, 72],
    pains: ["Unclear value", "Weak filters", "Missing trust cues", "Hidden costs", "Form friction", "No order clarity"],
    wf: [["mobile-checkout", "Checkout flow — mobile states"], ["web-hero", "Product landing structure"]],
    hifi: [["shop", "Storefront — product grid"], ["checkout", "Checkout — payment state"]],
    decisions: [
      { what: "Trust cues placed at each decision point — reviews, returns, guarantees at evaluate and add-to-cart.", why: "The interface was asking for commitment before giving certainty.", evidence: "Journey mapping clustered abandonment at commitment steps without prior certainty.", result: "Evaluation and add-to-cart became explicit trust moments; objective — no fabricated metric attached." },
      { what: "Honest totals from the cart onward — shipping, tax and fees visible before payment fields.", why: "Hidden costs at checkout lose the order and the return visit.", evidence: "Checkout blueprint showed totals computation happening backstage, invisible to the shopper until the last step.", result: "Cart and checkout show the same total; state coverage designed, not discovered." },
      { what: "State-explicit checkout: loading, empty, error and success designed as first-class screens.", why: "A happy path alone means failures are improvised at runtime.", evidence: "The four-state scope was fixed at project start as a quality bar.", result: "Six journey stages × four states covered as one connected flow (scope, documented)." }
    ],
    beforeAfter: {
      before: ["Hidden costs surfacing at payment", "Form friction from early commitment", "No order clarity after payment", "Failure states improvised"],
      after: ["Honest totals from cart onward", "Certainty sequenced before commitment", "Explicit order confirmation and follow-up", "Loading, empty, error and success designed"]
    },
    prototypeNote: "The storefront mock and checkout state shown in the case are coded prototypes built for this portfolio.",
    systemNote: "Product cards, cart rows, form fields and status pills form one small system, so responsive states inherit consistent behaviour.",
    chart: [{ label: "Journey stages connected", pct: 75, display: "6" }, { label: "UI states covered", pct: 66, display: "4" }, { label: "Validation streams planned", pct: 50, display: "3" }],
    evidence: [
      { label: "Journey stages", value: "6 stages", note: "Discovery → checkout defined as one connected journey", kind: "scope" },
      { label: "State coverage", value: "4 states", note: "Loading • empty • error • success", kind: "scope" },
      { label: "Performance metrics", value: "Not supplied", note: "No invented numbers", kind: "gap" }
    ],
    testing: [["Product findability", "Tree test / moderated task", "Test plan; result not supplied"], ["Product comprehension", "Task-based usability test", "Test plan; result not supplied"], ["Checkout completion", "End-to-end task + analytics", "Test plan; result not supplied"]],
    improve: ["Instrument analytics to quantify checkout completion and return rates.", "A/B test checkout step sequencing.", "Extend state coverage to multi-address and split-shipment scenarios."]
  }
];/* ------------------------------ domain taxonomy ------------------------------ */

export const DOMAINS: { key: string; label: string; tagline: string; areas: string[] }[] = [
  { key: "b2b", label: "B2B", tagline: "Enterprise workflows", areas: ["Procurement", "Operations", "Compliance"] },
  { key: "b2c", label: "B2C", tagline: "Consumer platforms", areas: ["Decision journeys", "Self-service"] },
  { key: "d2c", label: "D2C", tagline: "Commerce", areas: ["Conversion", "Retention"] },
  { key: "fintech", label: "FINTECH", tagline: "Financial workflows", areas: ["Decision support", "Trust"] },
  { key: "adtech", label: "ADTECH", tagline: "Audience intelligence", areas: ["Data platforms", "Campaign workflows"] },
  { key: "aidata", label: "AI / DATA", tagline: "AI-assisted workflows", areas: ["Analytics", "Decision systems"] },
  { key: "enterprise", label: "ENTERPRISE", tagline: "Operational systems", areas: ["Complex workflows", "Role-based surfaces"] },
  { key: "ecommerce", label: "E-COMMERCE", tagline: "Commerce journeys", areas: ["Discovery", "Product detail", "Cart", "Checkout"] },
  { key: "design-systems", label: "DESIGN SYSTEMS", tagline: "Foundations, tokens, governance", areas: ["Components", "States", "Documentation"] },
];

export const WORK_FILTERS: readonly string[] = ["ALL", "B2B", "B2C", "D2C", "ENTERPRISE", "FINTECH", "ADTECH", "AI / DATA", "E-COMMERCE", "DESIGN SYSTEMS"];

export const THINK_STAGES: { stage: string; items: string[]; project: string }[] = [
  { stage: "DISCOVER", items: ["Research", "Context", "Constraints"], project: "Procurement — comparison observation → delivery-risk insight" },
  { stage: "DEFINE", items: ["Problem framing", "Opportunity"], project: "Procurement — opportunity matrix ranked five workflow families" },
  { stage: "DESIGN", items: ["Flows", "Systems", "Interfaces"], project: "HomeRatesYard — one journey across discovery, application, underwriting" },
  { stage: "VALIDATE", items: ["Prototype", "Testing", "Evidence"], project: "HomeRatesYard — 37% decision-time reduction (CV-documented)" },
  { stage: "SCALE", items: ["Design system", "Governance", "Measurement"], project: "Procurement — patterns reused across five workflow families" },
];

/* ---------------------------- recruiter / hiring manager -------------------- */

export const RECRUITER = {
  availability: "Open to opportunities",
  whyThis: [
    "Complex enterprise products — procurement, mortgage and audience-data platforms shipped at scale.",
    "Scalable design systems — tokens, components, states and documentation reused across products.",
    "AI-assisted design workflows — AI-readable specifications with human-owned decisions.",
  ],
  specialization: [
    ["Complex product UX", "Enterprise platforms"],
    ["AI-enabled experiences", "Design systems"],
    ["Data-heavy workflows", "B2B · B2C · D2C"],
  ],
  domains: ["Fintech", "B2B", "SaaS", "E-commerce", "AdTech", "MediaTech", "EdTech", "Enterprise"],
  tools: ["Figma", "FigJam", "Prototyping", "Design Systems", "UX Research", "AI-assisted Design"],
  links: [
    { label: "Selected work", kind: "work" },
    { label: "Résumé", kind: "resume" },
    { label: "LinkedIn", kind: "linkedin" },
    { label: "Contact", kind: "contact" },
  ] as { label: string; kind: string }[],
};

export const ARTIFACTS: { src: string; alt: string; label: string; kind: string }[] = [
  { src: "/concept-maps/service-blueprint-realistic-clean.png", alt: "Procurement service blueprint", label: "Service blueprint", kind: "Procurement case" },
  { src: "/concept-maps/journey-map-realistic-clean.png", alt: "Reader journey map", label: "Journey map", kind: "Audience Intelligence case" },
  { src: "/concept-maps/decision-tree-realistic-clean.png", alt: "Underwriting decision tree", label: "Decision tree", kind: "HomeRatesYard case" },
  { src: "/concept-maps/research-loop-realistic-clean.png", alt: "Research loop", label: "Research synthesis", kind: "Audience Intelligence case" },
  { src: "/real-work/procurement-1600x900.jpg", alt: "Procurement platform dashboard", label: "Production dashboard", kind: "Shipped product" },
];

/* -------------------------- case-02 editorial upgrade -------------------------- */

export const case02Facts: { label: string; value: string }[] = [
  { label: "ROLE", value: "Senior Product Designer" },
  { label: "DOMAIN", value: "B2B / Enterprise" },
  { label: "PRODUCT", value: "Procurement platform" },
  { label: "FOCUS", value: "Workflow / Data / Operations" },
];

export const case02Complexity = ["MULTIPLE SYSTEMS", "SUPPLIER DATA", "OPERATIONAL DECISIONS", "PROCUREMENT ACTION"];

export const case02EvidenceBoard: { key: string; icon: string; title: string; desc: string }[] = [
  { key: "OBSERVE", icon: "observe", title: "Scattered comparison", desc: "Users compared supplier attributes — price, lead time, certifications, delivery history — across views that didn't talk to each other." },
  { key: "PATTERN", icon: "pattern", title: "Delivery confidence outweighs price", desc: "A cheaper supplier with uncertain delivery lost to a pricier, reliable one — repeatedly." },
  { key: "INSIGHT", icon: "insight", title: "Risk belongs beside cost", desc: "Operational risk visible alongside price is what makes a supplier decision complete." },
  { key: "DESIGN RESPONSE", icon: "response", title: "Risk beside cost, everywhere", desc: "Delivery risk surfaced beside supplier cost in every comparison and recommendation surface." },
];

export const case02InsightCards: InsightCard[] = [
  { title: "Dashboards became wallpaper", insight: "Dashboards without a next action get checked once, then ignored.", implication: "Every surface leads with the next operational action for the role viewing it." },
  { title: "Mismatched records erode trust", insight: "When supplier and spend records don't match, users stop trusting every number downstream.", implication: "Reconciliation designed as a guided mismatch-resolution flow, not a static report." },
  { title: "Compliance became a bottleneck", insight: "Unclear review priorities turned compliance from a gate into a queue with no order.", implication: "Review priorities made explicit inside the workflow at the point of action." },
  { title: "Static reports shift the burden", insight: "Reports that require manual interpretation move analytical work onto the reader.", implication: "Reporting surfaces carry interpretation — status, exception and next step together." },
];

export const case02Journey: JourneyStage[] = [
  { stage: "Onboard", goal: "Register as a supplier without chasing scattered data requests.", response: "One intake flow with clear, staged asks.", pain: "Lengthy registration stalled onboarding before value." },
  { stage: "Collect", goal: "See supplier records and spend data in one place.", response: "Role-based dashboards grounded in one supplier registry.", pain: "Data arrived scattered across roles and systems." },
  { stage: "Review", goal: "Know which reviews matter now.", response: "Priorities and compliance state at the point of action.", pain: "Unclear priorities turned compliance into a bottleneck." },
  { stage: "Reconcile", goal: "Resolve mismatches between supplier and spend records.", response: "Guided mismatch-resolution flow with both records side by side.", pain: "Mismatches surfaced late, eroding trust in numbers." },
  { stage: "Report", goal: "Interpret spend without manual analysis.", response: "Status, exception and next step carried inside reporting surfaces.", pain: "Static reports shifted analysis onto the reader." },
  { stage: "Act", goal: "Take the next procurement action with confidence.", response: "Next action surfaced first on every dashboard.", pain: "No signal for what to do next became wallpaper." },
];

export const case02Decisions: DecisionUi[] = [
  { what: "Role-based dashboard IA — each role lands on its decisions, next action first.", why: "Undifferentiated dashboards made everything visible and nothing prioritised.", evidence: "Stakeholder interviews mapped jobs per role; the opportunity matrix ranked gaps by user value and delivery confidence.", result: "Five workflow families shipped as one system across four data-heavy surfaces (scope, documented).", mock: "supplier", ui: "Supplier Network — role landing surface" },
  { what: "Delivery risk displayed beside supplier cost in comparisons and recommendations.", why: "Price was an incomplete decision input without operational risk context.", evidence: "Comparison observation: delivery confidence influenced decisions more than expected.", result: "Users identified preferred suppliers faster in walkthroughs (qualitative).", mock: "segments", ui: "Comparison states — risk beside cost" },
  { what: "Reconciliation as a mismatch-resolution flow, not a static report.", why: "Mismatched records eroded trust in every downstream number.", evidence: "Blueprint exposed where supplier and spend data joins failed silently.", result: "Mismatch review became an actionable workflow; objective — no fabricated metric attached.", mock: "spend", ui: "Spend visibility — reconciliation states" },
];

export const case02Hotspots: Hotspot[] = [
  { x: 21, y: 24, label: "Supplier performance", text: "On-time delivery and risk states visible beside cost — the core comparison input." },
  { x: 68, y: 24, label: "Next action", text: "Each role's surface leads with the next operational step, not raw data." },
  { x: 21, y: 68, label: "Exception states", text: "Records in review or mismatched are flagged inline, not buried in reports." },
  { x: 68, y: 68, label: "Operational trend", text: "Delivery and spend trends framed as decisions to make, not charts to read." },
];

export const case02Proto: ProtoFrame[] = [
  { stage: "01", caption: "Supplier discovery — register and performance at a glance", mock: "supplier" },
  { stage: "02", caption: "Comparison — risk displayed beside cost", mock: "segments" },
  { stage: "03", caption: "Reconciliation — guided mismatch resolution", mock: "spend" },
];

export const case02SystemStrip: { name: string; kind: string }[] = [
  { name: "Buttons", kind: "Primary / ghost / destructive" },
  { name: "Inputs & selects", kind: "Field, search, filter chips" },
  { name: "Tables", kind: "Sortable, selectable, expandable" },
  { name: "Status", kind: "Active · review · mismatch" },
  { name: "Charts", kind: "Trend, donut, category bars" },
  { name: "Navigation", kind: "Role-based landing rails" },
  { name: "Notifications", kind: "Inline, actionable, quiet" },
];

/* case 04 — commerce */
export const case04Facts: { label: string; value: string }[] = [
  { label: "ROLE", value: "Product Designer" },
  { label: "PERIOD", value: "2025 – 26" },
  { label: "PRODUCT", value: "End-to-end D2C storefront" },
  { label: "FOCUS", value: "Journey · Trust · Checkout states" },
];

/* case 04 — commerce */
export const case04Proto: ProtoFrame[] = [
  { stage: "01", caption: "Storefront — value and filters up front", mock: "shop" },
  { stage: "02", caption: "Product page — trust cues at the decision point", mock: "checkout" },
  { stage: "03", caption: "Checkout — honest totals, explicit states", mock: "checkout" },
  { stage: "04", caption: "Order state — clarity after payment", mock: "checkout" },
];

export const case04SystemStrip: { name: string; kind: string }[] = [
  { name: "Product cards", kind: "Value, price, rating, trust cues" },
  { name: "Cart rows", kind: "Quantity, remove, honest totals" },
  { name: "Checkout form", kind: "Sequenced certainty before commitment" },
  { name: "Status pills", kind: "Loading · empty · error · success" },
];

/* case 03 — audience intelligence */
export const case03Facts: { label: string; value: string }[] = [
  { label: "ROLE", value: "Senior Product Designer" },
  { label: "PERIOD", value: "2018 – 21" },
  { label: "PRODUCT", value: "Five products · 4 languages" },
  { label: "FOCUS", value: "Discovery · Segments · Campaigns" },
];

export const case03InsightCards: InsightCard[] = [
  { title: "Static segments go stale", insight: "Segments defined as fixed lists stop matching live behaviour.", implication: "Segments defined by behaviour, refreshed from the signal system." },
  { title: "Blind targeting is a connectivity problem", insight: "Targeting failed where discovery signals never reached campaign surfaces.", implication: "One behavioural signal system wired into every surface." },
  { title: "Flattening fails both jobs", insight: "Enterprise consoles for readers, feed thinking for analysts — both failed.", implication: "Separate products for discovery and intelligence, one shared signal core." },
  { title: "Vanity metrics misdirect investment", insight: "Content investment tracked numbers that never reached revenue reality.", implication: "Monetisation traceable to audience signals, not vanity counters." },
];

export const case03Hotspots: Hotspot[] = [
  { x: 22, y: 26, label: "Language-first discovery", text: "The feed leads with the reader's language — retention structure for four editions." },
  { x: 70, y: 26, label: "Live segments", text: "Behaviour-defined segments replace stale static lists in the console." },
  { x: 22, y: 70, label: "Campaign states", text: "Targeting, budget and measurement states made explicit per campaign." },
  { x: 70, y: 70, label: "Monetisation trail", text: "Revenue traceable back to the audience signals that produced it." },
];

export const case03Proto: ProtoFrame[] = [
  { stage: "01", caption: "Discover feed — language-first, zero friction", mock: "feed", phone: true },
  { stage: "02", caption: "Audience console — live segments", mock: "segments" },
  { stage: "03", caption: "Campaigns — explicit targeting states", mock: "dash" },
  { stage: "04", caption: "AI recommendation — evidence + human review", mock: "supplier" },
];

export const case03SystemStrip: { name: string; kind: string }[] = [
  { name: "Feed cards", kind: "Language-first, image-led, minimal chrome" },
  { name: "Segment builder", kind: "Behaviour-defined, live refresh" },
  { name: "Campaign states", kind: "Draft · targeting · live · measured" },
  { name: "Signal chips", kind: "Source, freshness, confidence" },
];

/* case 01 — mortgage */
export const case01Facts: { label: string; value: string }[] = [
  { label: "ROLE", value: "Lead Product Design Consultant" },
  { label: "PERIOD", value: "2024 – 26" },
  { label: "PRODUCT", value: "Mortgage origination → servicing" },
  { label: "FOCUS", value: "Trust · Underwriting · Status clarity" },
];

export const case01InsightCards: InsightCard[] = [
  { title: "Black-box status is the trust failure", insight: "Silence between application and closing reads as risk to borrowers.", implication: "Live underwriting milestones with plain-language explanation." },
  { title: "Jargon creates passive compliance", insight: "Borrowers completed dense forms without understanding them.", implication: "One guided form language anchored on total cost." },
  { title: "Comparison needs operational context", insight: "Rate options in lender language could not be acted on.", implication: "Differences framed operationally, not just numerically." },
  { title: "The journey ended at closing", insight: "No servicing entry meant the relationship stopped at the loan.", implication: "Servicing continuation designed into the journey." },
];

export const case01Hotspots: Hotspot[] = [
  { x: 22, y: 26, label: "Rate discovery", text: "Options anchored on total cost, not lender jargon — decision-ready comparison." },
  { x: 70, y: 26, label: "Live milestones", text: "Underwriting state visible in plain language beside the rate choice." },
  { x: 22, y: 70, label: "Guided forms", text: "One form language replacing per-lender jargon across the application." },
  { x: 70, y: 70, label: "Servicing entry", text: "The journey continues after closing instead of ending at it." },
];

export const case01Proto: ProtoFrame[] = [
  { stage: "01", caption: "Rate discovery — total-cost-anchored options", mock: "rates" },
  { stage: "02", caption: "Borrower dashboard — live underwriting milestones", mock: "dash" },
  { stage: "03", caption: "Decision — affordability read beside the payment", mock: "rates" },
];

export const case01SystemStrip: { name: string; kind: string }[] = [
  { name: "Rate cards", kind: "Total-cost anchor, term tradeoffs" },
  { name: "Status milestones", kind: "Plain-language underwriting states" },
  { name: "Guided forms", kind: "One language across lenders" },
  { name: "Evidence panel", kind: "What changed and why, at each step" },
];

/* --------------------------------- about ---------------------------------- */

export const capabilities: { icon: string; title: string; desc: string }[] = [
  { icon: "layers", title: "Design Systems", desc: "Scalable components, tokens, variants and governance." },
  { icon: "workflow", title: "Complex Workflows", desc: "Enterprise and operational systems designed for clarity and recovery." },
  { icon: "brain", title: "AI Product Design", desc: "Human-in-the-loop and intelligent interfaces: evidence, confidence, accountability." },
  { icon: "chart", title: "Data Visualization", desc: "Dense operational data made decision-ready." }
];

export const experience = [
  { period: "2024 – 26", org: "HomeLoc Solutions LLP", role: "Lead Product Design Consultant", domain: "Mortgage / FinTech", note: "US mortgage workflows; documented 37% underwriting decision-time reduction." },
  { period: "2023 – 24", org: "Computech Corporation", role: "Sr UX Designer", domain: "Enterprise / Procurement", note: "Procurement, supplier diversity, compliance and spend platforms." },
  { period: "2022 – 23", org: "Visual IT Solution", role: "Sr UX Designer", domain: "GovTech / Accessibility", note: "ePragathi and citizen-service ecosystems; accessibility-first design." },
  { period: "2021 – 22", org: "Gaian Solution", role: "Sr UX Designer", domain: "Media / Broadcasting", note: "Broadcasting, TV technology and media monetisation experiences." },
  { period: "2018 – 21", org: "Way2News Interactive", role: "Sr UI/UX Designer", domain: "Media / MarTech", note: "Five products across discovery, audience intelligence and monetisation." },
  { period: "2016 – 18", org: "Nitya Software India", role: "UI/UX Designer", domain: "Recruitment Tech", note: "JobsNProfiles, VioTalk; IA, flows and responsive product design." }
];

/* -------------------------------- how I work ------------------------------- */

export interface Method { id: string; label: string; map: string; mapAlt: string; method: string; project: string; evidence: string; decision: string; }

export const methods: Method[] = [
  {
    id: "research", label: "Research",
    map: "/concept-maps/research-loop-realistic-clean.png", mapAlt: "Research loop from observation to validation",
    method: "Observation → pattern → insight → decision → validation. Research exists to change a decision, not to produce a report.",
    project: "Procurement & Supplier Experience — supplier comparison behaviour",
    evidence: "Delivery confidence influenced decisions more than expected; price alone was an incomplete input.",
    decision: "Surface delivery risk beside supplier cost in every comparison surface."
  },
  {
    id: "journey", label: "Journey",
    map: "/concept-maps/journey-map-realistic-clean.png", mapAlt: "Journey map across stages with sentiment and pain points",
    method: "Stages, sentiment and pain points mapped per actor group — so friction is located, not guessed.",
    project: "HomeRatesYard — six-stage borrowing journey across four actor groups",
    evidence: "Steepest sentiment drop at underwriting; silence between stages read as risk.",
    decision: "Live underwriting milestones with plain-language explanation inside the borrower dashboard."
  },
  {
    id: "systems", label: "Systems",
    map: "/concept-maps/ecosystem-map-realistic-clean.png", mapAlt: "Ecosystem map of actors and dependencies",
    method: "Ecosystem and service blueprints before screens: actors, rules and handoffs made visible first.",
    project: "Procurement — five workflow families as one connected system",
    evidence: "The blueprint exposed where supplier and spend data joins failed silently.",
    decision: "Role-based IA with the next operational action surfaced on every dashboard."
  },
  {
    id: "ai", label: "AI",
    map: "/concept-maps/ai-human-loop-realistic-clean.png", mapAlt: "AI human loop with evidence and human review",
    method: "Context → AI generate → evidence → human review → decision → action. Assistance without accountability is not a product.",
    project: "Supplier risk prompts with evidence, confidence and human approval",
    evidence: "Every AI recommendation needed traceable evidence to be actionable in operations.",
    decision: "Evidence and confidence shown beside every AI output; humans own the approve/modify/reject call."
  },
  {
    id: "validation", label: "Validation",
    map: "/concept-maps/quality-loop-realistic-clean.png", mapAlt: "Quality loop of critique, accessibility and testing",
    method: "Test plans, critique and accessibility as continuous loops — and honest evidence boundaries where results aren't measured.",
    project: "Every case carries a validation ledger: measured, documented, or not supplied",
    evidence: "One measured outcome (37% decision-time reduction); the rest are declared objectives or gaps.",
    decision: "Instrument before claiming — no metric appears on this site without a source."
  }
];

export const CV = "/Ajay_Kumar_Myakala_Design_Strategist_CV.pdf";
export const EMAIL = "ajaykumarmyakala@outlook.com";
export const LINKEDIN = "https://www.linkedin.com/in/ajaykumarmyakala";
