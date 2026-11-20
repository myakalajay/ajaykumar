/**
 * Central portfolio data — generated from Ajay Kumar Myakala's CV
 * (Ajay_Kumar_Myakala-Design_Leader_CV.pdf).
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Nothing here should be added unless it appears on the CV.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

/**
 * The CV's "Strategic Responsibilities" — five statements, kept verbatim.
 * `profile.interests` is derived from these titles, so the two can never drift apart.
 */
export const strategicValue = [
  {
    title: 'Product Alignment',
    detail:
      'Address fragmented requirements by translating business priorities and user needs into clear product direction and prioritised experiences.',
  },
  {
    title: 'People Accountability',
    detail: 'Lead a team of five designers through clear ownership, mentoring, design reviews and delivery expectations.',
  },
  {
    title: 'Platform Modernisation',
    detail:
      'Simplify legacy interfaces and complex workflows through scalable information architecture and consistent interaction patterns.',
  },
  {
    title: 'Responsible AI Adoption',
    detail:
      'Identify suitable AI-enabled experience opportunities while considering transparency, usability and human oversight.',
  },
  {
    title: 'Design Governance',
    detail: 'Reduce inconsistent experiences and design rework through reusable systems, accessibility standards and quality reviews.',
  },
];

/**
 * The CV's "Leadership & Design Capabilities" — eight lines the About section lays out
 * as the operating model behind the five responsibilities above.
 */
export const leadershipCapabilities = [
  {
    title: 'Product Strategy',
    detail: 'Product vision, UX strategy, discovery, roadmap alignment and prioritisation.',
  },
  {
    title: 'Design Leadership',
    detail: 'Leadership and management of a 5-member design team, mentoring, ownership and design quality.',
  },
  {
    title: 'Enterprise UX',
    detail: 'Complex workflows, dashboards, role-based experiences and platform modernisation.',
  },
  {
    title: 'Design Systems',
    detail: 'Component architecture, reusable patterns, design standards and governance.',
  },
  {
    title: 'AI & Emerging Technology',
    detail: 'AI-enabled experience concepts, intelligent automation and responsible UX principles.',
  },
  {
    title: 'Data & Research',
    detail: 'User research, usability evaluation, behavioural insights and outcome measurement.',
  },
  {
    title: 'Cross-functional Delivery',
    detail:
      'Product, Engineering, Architecture and QA collaboration; design specifications and implementation reviews.',
  },
  {
    title: 'Stakeholder Management',
    detail: 'Client communication, executive presentations, strategic workshops and decision alignment.',
  },
];

/** The career progression the CV describes, as stages — the arc the About section draws. */
export const careerArc = [
  'UX/UI Craft',
  'Product Discovery',
  'Business Problem Framing',
  'Workflow Transformation',
  'Solution Strategy',
  'Design Leadership',
];

/** The CV's "Platform streams" line, split into the kinds of system that get built. */
export const platformStreams = [
  'Enterprise workflows',
  'Operational systems',
  'Data-driven dashboards',
  'Customer data & audience intelligence platforms',
  'Campaign & monetisation systems',
];

export const profile = {
  fullName: 'Ajay Kumar',
  displayName: 'Ajay Kumar',
  firstName: 'Ajay Kumar',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A MYAKALA ORIGINAL',
  role: 'Lead Product Designer · UX Strategy · Design Leadership',
  /** The CV's own sub-headline, kept verbatim. */
  headline: 'Lead Product Designer • UX Strategy • Enterprise Product Experience • Design Leadership',
  tagline: ['UX Strategy', 'Enterprise Product Experience', 'Design Leadership'],
  intro:
    'Ten years from UI/UX craft to lead product designer and design leader — 13 industries, a five-member design team and a career of turning complex enterprise workflows into products people can use. An implemented underwriting improvement I shaped cut decision time by 37%.',
  tenure: '10+ years',
  location: 'Hyderabad, India · open to relocation',
  email: 'ajaykumarmyakala@outlook.com',
  phone: '+91 7382328066',
  links: {
    linkedin: 'https://www.linkedin.com/in/ajaykumarmyakala',
  },
  resumePdf: '/assets/Ajay_Kumar_Myakala_CV.pdf',
  resumeFile: 'Ajay_Kumar_Myakala_CV.pdf',
  portrait: {
    src: '/assets/portrait-640.webp',
    srcSet: '/assets/portrait-300.webp 300w, /assets/portrait-420.webp 420w, /assets/portrait-640.webp 640w',
    alt: 'Portrait of Ajay Kumar',
  },
  /** Strategic value proposition — the titles of `strategicValue`, used as chips and CV bullets. */
  interests: strategicValue.map((v) => v.title),
};

/** Industry domains, straight from the CV's "Domain Experience". */
export const industries = [
  'FinTech',
  'Mortgage Technology',
  'Procurement',
  'GovTech',
  'Media',
  'AdTech',
  'MarTech',
  'Recruitment Technology',
  'Healthcare',
  'Health Insurance',
  'Care Management',
  'Clinical Systems',
  'E-commerce',
];

export const productModels = ['B2B', 'B2C', 'B2B2C', 'SaaS', 'Marketplace / P2P', 'D2C'];

export const experience = [
  {
    company: 'HomeLoc Solutions LLP',
    role: 'Lead Product Design Consultant',
    place: 'Hyderabad, India',
    period: 'Apr 2024 – May 2026',
    points: [
      'Lead product discovery and UX strategy across origination, underwriting, onboarding and servicing, addressing complex US mortgage and lending workflows and improving enterprise usability.',
      'Translated borrower and operational requirements into structured journeys, dashboards and scalable interface experiences, supporting faster business decisions.',
      'Managed client discussions and presented design recommendations to senior leadership, aligning product direction with business priorities.',
      'Led underwriting workflow improvements that reduced decision time by 37%, mentored designers and established reusable design frameworks.',
      'Established reusable design standards and scalable interaction patterns across customer and operational experiences; collaborated with teams working across AWS and Azure ecosystems.',
    ],
  },
  {
    company: 'Computech Corporation',
    role: 'Sr UX Designer',
    place: '',
    period: 'Mar 2023 – Mar 2024',
    points: [
      'Led end-to-end UX strategy and product design for CashTrax and DiversityTrax across financial and supplier operations, spanning procurement, supplier diversity, compliance, spend visibility and reconciliation.',
      'Simplified financial analytics, reconciliation, supplier onboarding, compliance and reporting workflows, improving enterprise information access.',
      'Structured role-based information architecture and workflows for enterprise users, balancing business process requirements with usability and scalability.',
      'Presented product designs and recommendations to the CEO and senior stakeholders, aligning experience decisions with business requirements.',
      'Contributed to a team redesign associated with a 20% improvement in operational reporting efficiency.',
    ],
  },
  {
    company: 'Visual IT Solutions Pvt. Ltd',
    role: 'Sr UX Designer',
    place: '',
    period: 'Oct 2022 – Feb 2023',
    points: [
      'Addressed complex citizen and administrative service journeys across ePragathi and government digital platforms.',
      'Structured information architecture, user flows and responsive interfaces to simplify access to public services.',
      'Applied accessibility-focused design to improve service usability for diverse public audiences and collaborated with business analysts, architects and engineering teams.',
      'Produced process flows, wireframes, prototypes and production-ready interfaces.',
    ],
  },
  {
    company: 'Gaian Solution',
    role: 'Sr UX Designer',
    place: '',
    period: 'Oct 2021 – Aug 2022',
    points: [
      'Addressed fragmented enterprise media and broadcasting experiences through UX strategy and end-to-end product design.',
      'Designed experiences for media and ATSC 3.0 initiatives, supporting content and operational workflows.',
      'Created a self-service low-code workflow builder to simplify automation configuration and reduce dependence on engineering support.',
      'Designed monetisation and performance analytics dashboards to improve visibility into operational and product performance.',
      'Designed content-management workflows, operational dashboards and scalable interaction models for complex media ecosystems.',
    ],
  },
  {
    company: 'Way2Online Interactive Pvt. Ltd',
    role: 'Sr UI/UX Designer',
    place: '',
    period: 'May 2018 – Jun 2021',
    points: [
      'Addressed content discovery and audience engagement challenges through mobile-first product design for Way2News.',
      'Designed audience intelligence and campaign management experiences for AudiencePlay, supporting segmentation and monetisation workflows.',
      'Contributed to product improvements associated with a 30% team-level increase in daily active users (DAU).',
      'Collaborated with product, editorial, marketing and engineering teams across customer engagement and campaign experience initiatives.',
    ],
  },
  {
    company: 'Nitya Software India Pvt. Ltd',
    role: 'UI Designer',
    place: '',
    period: 'Jan 2016 – May 2018',
    points: [
      'Addressed recruitment and communication product needs through end-to-end UX/UI design for JobsNProfiles and VioTalk.',
      'Translated product requirements into user journeys, wireframes, information architecture and responsive interfaces.',
      'Collaborated with stakeholders and developers on prototypes, visual design and implementation handoff.',
      'Supported branding, marketing websites and digital product initiatives using WordPress, Joomla, PHP and MySQL.',
    ],
  },
];

/** Education, straight from the CV — no institution is named there, so none is named here. */
export const education = [
  {
    title: 'B.Com — Mass Communication and Public Relations',
    detail: 'Bachelor of Commerce · communication, media and public relations.',
  },
  {
    title: 'Diploma in Graphic and Web Design',
    detail: 'Graphic design and web design.',
  },
];

export type Metric = { value: string; label: string };

export type Motif =
  | 'lending'
  | 'supplier'
  | 'civic'
  | 'broadcast'
  | 'audience'
  | 'recruit'
  | 'engineering'
  | 'vision';

export type Project = {
  id: string;
  title: string;
  /** The years the platform was worked on — the CV's role dates. */
  year: string;
  genre: string;
  logline: string;
  /** Methods and tooling used, shown as the "stack" of the case study. */
  stack: string[];
  features: string[];
  metrics: Metric[];
  palette: Palette;
  motif: Motif;
  /** The case-study spine. Every string is drawn from the CV — nothing invented here. */
  client: string;
  role: string;
  problem: string;
  /** What I personally owned on this work, as distinct from what the team shipped. */
  contribution: string;
  /** Why the work mattered — the change it was meant to make, in the client's terms. */
  purpose: string;
  approach: string[];
  outcome: string;
};

/**
 * ORIGINALS — the flagship platforms from the CV, told as case studies.
 * There is no thesis/coursework work here; each entry is a platform the CV names.
 */
export const projects: Project[] = [
  {
    id: 'homeratesyard',
    title: 'Homeratesyard',
    year: '2024 – 2026',
    genre: 'Mortgage • Lending • Enterprise SaaS',
    logline: 'Product strategy and end-to-end design for US mortgage and lending platforms, from origination through servicing.',
    stack: ['Product Strategy', 'Journey Mapping', 'Service Design', 'Design Standards', 'Figma'],
    features: [
      'Borrower and operational journeys across the lending lifecycle',
      'Underwriting workflow optimisation',
      'Discovery, product-vision and design-review facilitation',
      'Reusable design standards and interaction patterns',
      'Roadmap alignment with Product, Engineering and business stakeholders',
    ],
    metrics: [
      { value: '37%', label: 'faster underwriting decisions' },
      { value: '5', label: 'journey stages: origination → servicing' },
      { value: 'US', label: 'mortgage & lending market' },
      { value: 'AWS · Azure', label: 'engineering ecosystems' },
    ],
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'lending',
    client: 'Homeratesyard · HomeLoc Solutions LLP · US mortgage & lending market',
    role: 'Lead Product Design Consultant - product strategy and end-to-end design',
    contribution:
      'Owned product strategy and end-to-end design: framed the business, user and operational constraints into product opportunities, mapped the borrower and operational journeys across origination, underwriting, onboarding and servicing, facilitated discovery and design-review sessions, and set the reusable design standards and interaction patterns.',
    purpose:
      'To replace lending processes that each ran on their own tooling with one shared journey and design language, so a decision stops waiting on handoffs — the work that took 37% off underwriting decision time.',
    problem:
      'Borrower and operational problems were spread across origination, underwriting, onboarding, servicing and lending operations, with no shared journey or design language tying them together.',
    approach: [
      'Framed the business, user and operational constraints into concrete product opportunities before any interface was drawn.',
      'Mapped end-to-end customer and operational journeys across the five lending stages to find where time and decisions were being lost.',
      'Ran discovery, product-vision and design-review sessions to keep business objectives, user needs and implementation reality aligned.',
      'Established reusable design standards and scalable interaction patterns, partnering with teams across AWS and Azure ecosystems.',
    ],
    outcome:
      'An implemented underwriting workflow improvement cut decision time by 37%, and the design standards now scale across both customer and operational experiences.',
  },
  {
    id: 'cashtrax',
    title: 'CashTrax & DiversityTrax',
    year: '2023 – 2024',
    genre: 'Procurement • Supplier Diversity • Compliance',
    logline: 'Enterprise procurement platforms spanning supplier diversity, compliance, spend visibility and reconciliation.',
    stack: ['Enterprise UX', 'Information Architecture', 'Stakeholder Discovery', 'Dashboards', 'Figma'],
    features: [
      'Supplier onboarding workflows',
      'Spend visibility and reconciliation views',
      'Supplier diversity and compliance reporting',
      'Role-based information architecture',
      'Operational dashboards for enterprise users',
    ],
    metrics: [
      { value: '2', label: 'enterprise platforms' },
      { value: '5', label: 'capability areas: procurement → reconciliation' },
      { value: 'C-suite', label: 'alignment with CEO, PM & Engineering' },
      { value: 'Role-based', label: 'information architecture' },
    ],
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'supplier',
    client: 'Computech Corporation · enterprise procurement',
    role: 'Sr UX Designer — UX strategy and product design across two platforms',
    contribution:
      'Designed across both platforms: stakeholder discovery with the CEO, product managers and engineering, service and supplier-onboarding flows, the role-based information architecture, and the operational dashboards that made spend and reconciliation legible to non-analyst users.',
    purpose:
      'To give procurement, supplier-diversity and finance teams one role-based structure over the same supplier data, so compliance, spend visibility and reconciliation stop being separate tools.',
    problem:
      'Procurement, supplier diversity, compliance, spend visibility and reconciliation lived in separate enterprise tools, each with its own roles, rules and reporting.',
    approach: [
      'Ran stakeholder discovery with the CEO, product managers and engineering to align business goals with delivery constraints.',
      'Translated complex business requirements into service experiences, supplier onboarding workflows and reporting systems.',
      'Structured role-based information architecture so each enterprise user saw the process that applied to them.',
      'Designed operational dashboards that made spend and reconciliation legible to non-analyst users.',
    ],
    outcome:
      'Two enterprise platforms — CashTrax and DiversityTrax — now cover the full procurement path from onboarding through reconciliation under one role-based structure.',
  },
  {
    id: 'epragathi',
    title: 'ePragathi & Citizen Services',
    year: '2022 – 2023',
    genre: 'GovTech • Public Sector • Accessibility',
    logline: 'Digital transformation for government and public-sector platforms, designing citizen and administrative workflows.',
    stack: ['Accessibility / WCAG', 'Process Mapping', 'Information Architecture', 'Prototyping', 'Figma'],
    features: [
      'Citizen-facing service journeys',
      'Administrative back-office workflows',
      'Accessibility-focused design for diverse public audiences',
      'Process flows, wireframes and prototypes',
      'Production-ready interface delivery',
    ],
    metrics: [
      { value: 'GovTech', label: 'public-sector service ecosystems' },
      { value: '2', label: 'audiences: citizens & administrators' },
      { value: 'WCAG', label: 'accessibility-led design' },
      { value: 'E2E', label: 'process flows to production UI' },
    ],
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'civic',
    client: 'Visual IT Solution · Government & public sector (ePragathi)',
    role: 'Sr UX Designer — citizen and administrative workflow design',
    contribution:
      'Mapped the service processes before drawing screens, then designed the citizen-facing and administrative workflows, wireframes, prototypes and production-ready interfaces, with accessibility treated as a design requirement rather than a final check.',
    purpose:
      'To make public services usable by citizens with very different access needs, while keeping the front office and the back office on one consistent design language.',
    problem:
      'Public-service processes were complex and written for the institution, not the citizen, and had to serve audiences with very different access needs.',
    approach: [
      'Redrew complex service processes through information architecture and process mapping before designing screens.',
      'Designed citizen-facing and administrative workflows as one system, so front and back office stayed consistent.',
      'Applied accessibility-focused design so the services remained usable for diverse public audiences.',
      'Delivered process flows, wireframes, prototypes and production-ready interfaces alongside business analysts and architects.',
    ],
    outcome:
      'Citizen-service ecosystems including ePragathi, designed accessibility-first from process flows through to production-ready interfaces for two distinct audiences.',
  },
  {
    id: 'gaian-broadcast',
    title: 'Broadcast & Monetisation',
    year: '2021 – 2022',
    genre: 'Media • Broadcasting • AdTech',
    logline: 'Enterprise broadcasting, television technology and media monetisation experiences, including ATSC 3.0 initiatives.',
    stack: ['Content Management', 'Operational Dashboards', 'Interaction Models', 'ATSC 3.0', 'Figma'],
    features: [
      'Content-management workflows for broadcast operations',
      'Advertising and monetisation workflows',
      'Reporting dashboards and operational tooling',
      'Scalable interaction models for media ecosystems',
      'ATSC 3.0 next-generation broadcasting initiatives',
    ],
    metrics: [
      { value: 'ATSC 3.0', label: 'next-generation broadcasting initiatives' },
      { value: '3', label: 'workstreams: content, ads, reporting' },
      { value: 'Enterprise', label: 'TV technology & media distribution' },
      { value: 'Monetisation', label: 'audience-engagement experiences' },
    ],
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'broadcast',
    client: 'Gaian Solution · enterprise broadcasting & media',
    role: 'Sr UX Designer — broadcast operations, advertising and reporting',
    contribution:
      'Designed the content-management workflows, advertising and monetisation screens and operational reporting dashboards, and set the interaction models that carried across the media estate, alongside the ATSC 3.0 initiative work.',
    purpose:
      'To give broadcast operations one coherent layer across content, advertising and reporting, and a shared interaction model ready for the ATSC 3.0 shift.',
    problem:
      'Broadcast and monetisation operations ran across content management, advertising workflows and reporting, each with its own tooling and no shared interaction model.',
    approach: [
      'Designed content-management workflows and operational dashboards for the people running broadcast operations day to day.',
      'Built scalable interaction models so one pattern could carry across a complex media ecosystem.',
      'Contributed to ATSC 3.0 next-generation broadcasting initiatives, partnering with engineering on the standard shift.',
      'Worked across advertising workflows, reporting dashboards and audience-engagement experiences.',
    ],
    outcome:
      'A coherent operations layer across content, advertising and reporting, plus a contribution to ATSC 3.0 next-generation broadcasting work.',
  },
  {
    id: 'audience-intelligence',
    title: 'Audience Intelligence Suite',
    year: '2018 – 2021',
    genre: 'AdTech • MarTech • Audience Platforms',
    logline: 'Consumer media and enterprise audience platforms — content discovery, segmentation, campaigns and monetisation.',
    stack: ['Mobile-first UX', 'Customer Segmentation', 'Behaviour Analytics', 'Campaign Management', 'Figma'],
    features: [
      'Mobile-first content discovery and engagement',
      'Customer segmentation and audience intelligence',
      'Campaign management interfaces',
      'Behaviour analytics and reporting',
      'Monetisation experiences for publishers and brands',
    ],
    metrics: [
      { value: '5', label: 'brands: Way2News → TheTasteCompany' },
      { value: '3', label: 'platform families: consumer, AdTech, MarTech' },
      { value: '4', label: 'disciplines: product, editorial, marketing, engineering' },
      { value: 'Mobile-first', label: 'content discovery experiences' },
    ],
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'audience',
    client: 'Way2News Interactive · five consumer & enterprise brands',
    role: 'Sr UI/UX Designer — consumer media and enterprise audience platforms',
    contribution:
      'Designed the mobile-first consumer experiences and the enterprise segmentation, campaign-management and monetisation tooling built on the same audience data, using behaviour analytics and reporting to steer the next iteration.',
    purpose:
      'To grow daily engagement on the reader side while making that same audience legible and sellable to advertisers and brands — one audience base, two surfaces.',
    problem:
      'Five brands needed both mobile-first content discovery for readers and enterprise tooling for segmentation, campaigns and monetisation — two very different surfaces from one audience base.',
    approach: [
      'Designed mobile-first content discovery and engagement experiences for the consumer media products.',
      'Built enterprise interfaces for customer segmentation, campaign management and monetisation on the same audience data.',
      'Used audience insight, behaviour analytics and reporting to steer retention, engagement and adoption decisions.',
      'Worked across product, editorial, marketing and engineering to keep the platforms moving together.',
    ],
    outcome:
      'One suite spanning five brands and three platform families — consumer, AdTech and MarTech — from discovery through to monetisation.',
  },
  {
    id: 'jobsnprofiles',
    title: 'JobsNProfiles & VioTalk',
    year: '2016 – 2018',
    genre: 'Recruitment Tech • Communication Products',
    logline: 'Recruitment technology, communication products and client-facing digital solutions, designed and shipped to front-end.',
    stack: ['Wireframes', 'Information Architecture', 'Responsive UX', 'WordPress', 'PHP · MySQL'],
    features: [
      'Recruitment technology platform design',
      'Communication product interfaces',
      'Wireframes, IA and responsive product experiences',
      'Front-end implementation collaboration',
      'Branding and marketing website delivery',
    ],
    metrics: [
      { value: '2', label: 'flagship products: JobsNProfiles, VioTalk' },
      { value: '4', label: 'CMS & server technologies' },
      { value: 'E2E', label: 'concept to front-end implementation' },
      { value: 'Client-facing', label: 'enterprise web applications' },
    ],
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'recruit',
    client: 'Nitya Software India · recruitment & communication products',
    role: 'UI/UX Designer — concept through front-end implementation',
    contribution:
      'Took JobsNProfiles and VioTalk from wireframes and information architecture through responsive interface design to front-end implementation, plus the branding and marketing sites around them.',
    purpose:
      'To ship recruitment and communication products end to end on a small stack, where a design decision had to survive straight through into the build.',
    problem:
      'Recruitment and communication products needed to be designed and shipped end to end, on a stack where design and front-end were the same pair of hands.',
    approach: [
      'Designed recruitment technology and communication products including JobsNProfiles and VioTalk.',
      'Created wireframes, information architecture and responsive product experiences for client-facing web applications.',
      'Collaborated directly with development teams through front-end implementation, closing the gap between design and build.',
      'Supported branding, marketing websites and digital product initiatives across WordPress, Joomla, PHP and MySQL.',
    ],
    outcome:
      'Two flagship products shipped end to end — from concept and wireframes through to front-end implementation on a PHP and MySQL stack.',
  },
  {
    id: 'pem-pro',
    title: 'PEM Pro Engineering Portal',
    year: '2025 – 2026',
    genre: 'Manufacturing • Precision Engineering • Enterprise SaaS',
    logline:
      'An engineering workspace portal for PennEngineering — a secure enclave that provisions a full design environment, guides first-run onboarding and drives an AI-assisted product lifecycle from CAD import to validation.',
    stack: ['Product Strategy', 'Enterprise Onboarding', 'Design Systems', 'AI-Assisted Workflows', 'Figma'],
    features: [
      'First-run workspace provisioning with a live 4-step status sequence',
      'Engineering Command Center for lifecycle, readiness and AI synthesis',
      'Product Lifecycle Engine: Project → CAD Import → AI Analysis → Fasteners → Validation',
      'AI Engineering Copilot embedded for assisted engineering decisions',
      'Guided product tour and a 7-step project roadmap wizard',
      'Knowledge Center with design guides and CAD standards',
    ],
    metrics: [
      { value: '4-Step', label: 'secure workspace provisioning flow' },
      { value: '7-Stage', label: 'project creation roadmap wizard' },
      { value: 'AI Copilot', label: 'in-product engineering assistant' },
      { value: 'SOC 2 · ISO 9001', label: 'enterprise trust & compliance' },
    ],
    palette: { from: '#041a33', via: '#0b4a86', to: '#05070d', accent: '#4cc9ff' },
    motif: 'engineering',
    client: 'PennEngineering (PEM®) · precision fastening & manufacturing',
    role: 'Product Strategy & Design — enterprise engineering portal & AI lifecycle tooling',
    contribution:
      'Set the product structure — secure first-run provisioning, the Engineering Command Center, the Product Lifecycle Engine and the AI Copilot — and the role-aware design system, trust signals and guided tour around it.',
    purpose:
      'To give engineering teams one trusted workspace from CAD assembly to manufacturing validation, instead of four tools and a handoff in between.',
    problem:
      'Manufacturing and engineering teams had no single secure workspace that tied enterprise identity, CAD assemblies, AI component analysis and manufacturing validation together — each step lived in a different tool with no shared lifecycle or design language.',
    approach: [
      'Framed the first-run experience as a secure provisioning sequence so users trust the workspace before they ever touch a project.',
      'Structured the whole platform around one Product Lifecycle Engine — Project, CAD Import, AI Analysis, Fasteners, Validation — so every screen reinforces the same journey.',
      'Designed the Engineering Command Center as the operational home: lifecycle integrity, AI synthesis results and manufacturing readiness at a glance.',
      'Embedded an AI Engineering Copilot and a guided product tour so complex engineering decisions stay assisted, not intimidating.',
      'Built a role-aware design system around enterprise trust signals — SOC 2, ISO 9001 and a secure enclave — for a manufacturing audience.',
    ],
    outcome:
      'A cohesive engineering portal where a new user provisions a secure workspace in seconds, then drives projects from CAD import through AI analysis to validation — all inside one AI-assisted lifecycle.',
  },
  {
    id: 'kenvision',
    title: 'KenVision Video Intelligence',
    year: '2025 – 2026',
    genre: 'AI • Video Analytics • Retail & Smart Spaces',
    logline:
      'An AI video intelligence platform that turns existing CCTV into real-time operational insight — footfall, dwell, conversion, heatmaps and AI-recommended store actions.',
    stack: ['Product Strategy', 'Data Visualisation', 'AI/ML UX', 'Dashboard Design', 'Figma'],
    features: [
      'Store Health Score with a live AI Command Center',
      'Store Intelligence Map: footfall, dwell, conversion, revenue and staff heatmaps',
      'AI Recommended Actions ranked by impact and effort',
      'Operations Health tiles: queue, staff coverage, camera health, uptime, AI accuracy',
      'Executive Insights with weekly revenue trends',
      'Privacy-first analytics that reuse existing camera hardware',
    ],
    metrics: [
      { value: '6', label: 'live KPI streams on one command center' },
      { value: '5', label: 'store-intelligence heatmap layers' },
      { value: 'Real-time', label: 'footfall, dwell & conversion insight' },
      { value: 'No New HW', label: 'privacy-first, existing CCTV only' },
    ],
    palette: { from: '#0a0730', via: '#2b1a8c', to: '#05060f', accent: '#7c5cff' },
    motif: 'vision',
    client: 'KenVision (by Intelense) · AI video intelligence for retail & smart spaces',
    role: 'Product Strategy & Design — real-time video intelligence & retail analytics UX',
    contribution:
      'Designed the Store Health Score, the layered Store Intelligence Map, the AI Recommended Actions and the executive reporting, working within privacy-first constraints that reuse the cameras stores already have.',
    purpose:
      'To turn footage retail teams already own into decisions they can act on — queue congestion, staff coverage and revenue risk — without buying new hardware.',
    problem:
      'Retail and operations teams had cameras everywhere but no operational picture — footfall, dwell time, queue congestion, conversion and staffing decisions were made on intuition because the video data was never turned into insight.',
    approach: [
      'Designed a Store Health Score that collapses many signals into one number operators can act on immediately.',
      'Built the Store Intelligence Map so footfall, dwell, conversion, revenue and staff coverage read as layered heatmaps over the real floor plan.',
      'Turned raw detections into AI Recommended Actions ranked by impact and effort, so insight always ends in a concrete next step.',
      'Balanced real-time AI accuracy against privacy-first constraints, reusing existing CCTV with no new hardware.',
      'Gave executives a weekly revenue trend and per-store ranking so location-level and portfolio-level decisions share one interface.',
    ],
    outcome:
      'Existing store cameras became a measurement layer — queue congestion, revenue risk and staffing moves now surface as AI-recommended actions inside a single real-time command center.',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
  /** When set, the highlight opens that Original as its case study. */
  projectId?: string;
};

/** The CV's headline outcomes — no invented awards, only what the CV states. */
export const achievements: Achievement[] = [
  {
    id: 'underwriting-37',
    title: '37% Faster',
    org: 'HomeLoc Solutions',
    detail:
      'An implemented underwriting workflow improvement, found by mapping end-to-end customer and operational journeys, reduced decision time by 37%.',
    laurel: 'Measured Impact',
    projectId: 'homeratesyard',
  },
  {
    id: 'dau-30',
    title: '30% DAU',
    org: 'Way2News',
    detail:
      'Mobile-first content discovery and engagement work contributed to a 30% team-level increase in daily active users.',
    laurel: 'Audience Growth',
    projectId: 'audience-intelligence',
  },
  {
    id: 'reporting-20',
    title: '20% Efficiency',
    org: 'Computech Corporation',
    detail:
      'A team redesign of financial analytics, reconciliation and reporting workflows was associated with a 20% improvement in operational reporting efficiency.',
    laurel: 'Operational Impact',
    projectId: 'cashtrax',
  },
  {
    id: 'team-five',
    title: '5 Designers',
    org: 'Design Leadership',
    detail:
      'Leads a five-member design team through clear ownership, mentoring, design reviews and delivery expectations.',
    laurel: 'People Leadership',
  },
  {
    id: 'tenure',
    title: '10+ Years',
    org: 'Product Design & Leadership',
    detail:
      'Career progression from UI/UX craft into product discovery, business problem framing, workflow transformation and design leadership.',
    laurel: 'Career Arc',
  },
  {
    id: 'domains',
    title: `${industries.length} Domains`,
    org: 'Enterprise SaaS → Healthcare',
    detail:
      'FinTech, mortgage and lending, procurement, GovTech, media, AdTech, MarTech, recruitment, healthcare, insurance, care management, clinical systems and e-commerce.',
    laurel: 'Industry Range',
  },
  {
    id: 'govtech',
    title: 'ePragathi',
    org: 'GovTech Transformation',
    detail: 'Citizen-service ecosystems designed accessibility-first for diverse public audiences, from process flows to production-ready interfaces.',
    laurel: 'Public Sector',
    projectId: 'epragathi',
  },
  {
    id: 'atsc',
    title: 'ATSC 3.0',
    org: 'Next-Gen Broadcasting',
    detail: 'Contributed to ATSC 3.0-related product initiatives and partnered with Engineering on next-generation broadcasting experiences.',
    laurel: 'Broadcast',
    projectId: 'gaian-broadcast',
  },
];

export type Tool = { name: string; group: string };

/** Technical fluency, straight from the CV's tools list. */
export const toolbox: Tool[] = [
  { name: 'Figma', group: 'Design & Workshop' },
  { name: 'FigJam', group: 'Design & Workshop' },
  { name: 'Miro', group: 'Design & Workshop' },
  { name: 'Design Systems', group: 'Design & Workshop' },
  { name: 'SAP Fiori', group: 'Enterprise' },
  { name: 'Jira', group: 'Delivery' },
  { name: 'Confluence', group: 'Delivery' },
  { name: 'Azure DevOps', group: 'Delivery' },
  { name: 'Word', group: 'Microsoft Office' },
  { name: 'Excel', group: 'Microsoft Office' },
  { name: 'PowerPoint', group: 'Microsoft Office' },
  { name: 'Visio', group: 'Microsoft Office' },
  { name: 'Teams', group: 'Microsoft Office' },
  { name: 'Outlook', group: 'Microsoft Office' },
  { name: 'React', group: 'Web' },
  { name: 'Next.js', group: 'Web' },
  { name: 'TypeScript', group: 'Web' },
  { name: 'JavaScript', group: 'Web' },
  { name: 'HTML5', group: 'Web' },
  { name: 'CSS3', group: 'Web' },
  { name: 'REST API-aware UI', group: 'Web' },
  { name: 'JSON', group: 'Web' },
  { name: 'PHP', group: 'Web' },
  { name: 'MySQL', group: 'Web' },
  { name: 'Google Analytics', group: 'Analytics' },
  { name: 'Hotjar', group: 'Analytics' },
  { name: 'Microsoft Clarity', group: 'Analytics' },
  { name: 'ChatGPT', group: 'AI' },
  { name: 'Claude', group: 'AI' },
  { name: 'Gemini', group: 'AI' },
  { name: 'Cursor', group: 'AI' },
  { name: 'Unity', group: '3D & Immersive' },
  { name: 'Blender', group: '3D & Immersive' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'strategy',
    title: 'Strategy',
    subtitle: 'Product direction out of ambiguity',
    skills: [
      { name: 'Business Problem Framing', mono: 'BF', note: 'Core' },
      { name: 'Product Strategy', mono: 'PS' },
      { name: 'Product Discovery', mono: 'PD' },
      { name: 'Solution Strategy', mono: 'So' },
      { name: 'Service Design', mono: 'SD' },
      { name: 'Systems Thinking', mono: 'Sy' },
      { name: 'Product Thinking', mono: 'PT' },
      { name: 'Digital Transformation', mono: 'DT' },
      { name: 'Workflow Transformation', mono: 'WF' },
      { name: 'Product Vision', mono: 'PV' },
      { name: 'Roadmap Definition', mono: 'RD' },
      { name: 'Platform Modernisation', mono: 'PM' },
      { name: 'Design Governance', mono: 'DG' },
    ],
  },
  {
    id: 'ai',
    title: 'AI / ML / HCI',
    subtitle: 'AI-native experience design',
    skills: [
      { name: 'AI Experience (AIX)', mono: 'AX' },
      { name: 'Machine Learning UX (MLUX)', mono: 'MX' },
      { name: 'Human-Computer Interaction', mono: 'HC' },
      { name: 'Human-Centered AI', mono: 'HA' },
      { name: 'Voice Interfaces', mono: 'Vo' },
      { name: 'Computer Vision', mono: 'CV' },
      { name: 'Machine Learning', mono: 'ML' },
      { name: 'Responsible AI', mono: 'RA' },
      { name: 'Autonomous Vehicle Interfaces', mono: 'AV' },
      { name: 'AI Ethics & Data Privacy', mono: 'AE' },
    ],
  },
  {
    // AI automation sits between the AI/ML craft above and the toolchain below:
    // the places where AI stops being a design topic and becomes a workflow.
    id: 'automation',
    title: 'AI & Automation',
    subtitle: 'Agentic workflows & AI tooling',
    skills: [
      { name: 'AI Workflow Automation', mono: 'AW', note: 'Core' },
      { name: 'Prompt & Agent Design', mono: 'PA' },
      { name: 'Workflow Orchestration', mono: 'WO' },
      { name: 'LLM Tooling & Integration', mono: 'LL' },
      { name: 'Copilot Experience Design', mono: 'CX' },
      { name: 'RPA & Process Automation', mono: 'RP' },
      { name: 'Automation Opportunity Mapping', mono: 'AM' },
      { name: 'AI Governance & Guardrails', mono: 'AG' },
      { name: 'ChatGPT · Claude · Gemini', mono: 'CG' },
      { name: 'Cursor · n8n · Make · Zapier', mono: 'Cu' },
    ],
  },
  {
    id: 'consulting',
    title: 'Consulting',
    subtitle: 'Facilitation & stakeholder influence',
    skills: [
      { name: 'Stakeholder Management', mono: 'SM' },
      { name: 'Design Team Leadership', mono: 'DL', note: 'Core' },
      { name: 'Mentoring & Coaching', mono: 'MC' },
      { name: 'Design Quality Reviews', mono: 'DQ' },
      { name: 'Stakeholder Facilitation', mono: 'SF' },
      { name: 'Discovery Workshops', mono: 'DW' },
      { name: 'Ideation Workshops', mono: 'IW' },
      { name: 'Design Reviews', mono: 'DR' },
      { name: 'Cross-Functional Leadership', mono: 'XL' },
      { name: 'Product & Engineering Partnership', mono: 'PE' },
      { name: 'Executive Communication', mono: 'EC' },
    ],
  },
  {
    id: 'product',
    title: 'Product & UX',
    subtitle: 'The craft behind the strategy',
    skills: [
      { name: 'Enterprise UX', mono: 'EX' },
      { name: 'UX Architecture', mono: 'UX' },
      { name: 'Information Architecture', mono: 'IA' },
      { name: 'User Research', mono: 'UR' },
      { name: 'Journey Mapping', mono: 'JM' },
      { name: 'Interaction Design', mono: 'ID' },
      { name: 'Prototyping', mono: 'Pr' },
      { name: 'Design Systems', mono: 'DS' },
      { name: 'Accessibility / WCAG', mono: 'WC' },
      { name: 'Usability Testing', mono: 'UT' },
      { name: 'Zero-to-One Product Development', mono: '0→1' },
    ],
  },
  {
    id: 'growth',
    title: 'Data & Growth',
    subtitle: 'Audience, marketing & monetisation',
    skills: [
      { name: 'Data-Driven Platforms', mono: 'DD' },
      { name: 'Audience Intelligence', mono: 'AI' },
      { name: 'Customer Data Platforms', mono: 'CD' },
      { name: 'Customer Segmentation', mono: 'CS' },
      { name: 'Campaign Management', mono: 'CM' },
      { name: 'Omnichannel Marketing Experience', mono: 'OM' },
      { name: 'Customer Engagement', mono: 'CE' },
      { name: 'Behaviour Analytics', mono: 'BA' },
      { name: 'Growth Experimentation', mono: 'GE' },
      { name: 'Conversion Optimisation', mono: 'CO' },
      { name: 'Monetisation', mono: 'Mo' },
    ],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack',
    subtitle: 'Design through production code',
    skills: [
      { name: 'Design Engineering', mono: 'DE', note: 'Core' },
      { name: 'React & Next.js', mono: 'RN' },
      { name: 'JavaScript (ES6+)', mono: 'JS' },
      { name: 'HTML5 & CSS3', mono: 'H5' },
      { name: 'Responsive & Fluid Layouts', mono: 'RL' },
      { name: 'Design-to-Code Handoff', mono: 'DC' },
      { name: 'Component Architecture', mono: 'CA' },
      { name: 'REST API Integration', mono: 'RA' },
      { name: 'PHP & MySQL', mono: 'PM' },
      { name: 'Web Performance', mono: 'WP' },
      { name: 'Accessibility Engineering', mono: 'A1' },
    ],
  },
  {
    id: 'immersive',
    title: '3D & Immersive',
    subtitle: 'Real-time 3D & spatial craft',
    skills: [
      { name: 'Unity', mono: 'Un' },
      { name: 'Blender', mono: 'Bl' },
      { name: '3D Modelling', mono: '3D' },
      { name: 'Texturing & Materials', mono: 'Tx' },
      { name: 'Lighting & Rendering', mono: 'Li' },
      { name: 'Scene Composition', mono: 'Sc' },
      { name: 'Real-time Rendering', mono: 'Rt' },
      { name: 'Animation & Rigging', mono: 'Ar' },
      { name: 'Interactive Prototyping', mono: 'Ip' },
      { name: 'Spatial Interfaces', mono: 'Si' },
    ],
  },
  {
    // Branding sits with the craft: the CV names branding and marketing websites
    // in the Nitya role, and art direction has been part of every platform since.
    id: 'brand',
    title: 'Brand & Story',
    subtitle: 'Identity, art direction & narrative',
    skills: [
      { name: 'Brand Systems', mono: 'BS', note: 'Core' },
      { name: 'Visual Identity', mono: 'VI' },
      { name: 'Art Direction', mono: 'AD' },
      { name: 'Typography & Type Systems', mono: 'TY' },
      { name: 'Narrative & Storytelling', mono: 'NS' },
      { name: 'Marketing Site Design', mono: 'MS' },
      { name: 'Pitch & Presentation Design', mono: 'PD' },
      { name: 'Campaign & Content Design', mono: 'CD' },
      { name: 'Brand Guidelines', mono: 'BG' },
    ],
  },
  {
    id: 'domains',
    title: 'Domains',
    subtitle: 'Industry coverage',
    skills: industries.map((name) => ({ name, mono: name.slice(0, 2) })),
  },
  {
    id: 'models',
    title: 'Product Models',
    subtitle: 'How the business goes to market',
    skills: productModels.map((name) => ({ name, mono: name.slice(0, 2) })),
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Technical fluency',
    skills: toolbox.map((t) => ({ name: t.name, mono: t.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2) })),
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill shows up in the platforms and roles on the CV.
 */
export const skillEvidence: Record<string, string[]> = {
  'Business Problem Framing': ['HomeLoc · borrower & operational problems', 'Computech · stakeholder discovery'],
  'Product Strategy': ['Homeratesyard', 'CashTrax & DiversityTrax'],
  'Product Discovery': ['Discovery workshops · HomeLoc, Computech'],
  'Solution Strategy': ['Origination → servicing solution direction'],
  'Service Design': ['ePragathi citizen-service ecosystems'],
  'Systems Thinking': ['Enterprise workflows, procurement → reconciliation'],
  'Product Thinking': ['HomeLoc roadmap alignment'],
  'Digital Transformation': ['ePragathi · public-sector platforms'],
  'Workflow Transformation': ['37% faster underwriting decisions'],
  'Product Vision': ['Product-vision conversations at HomeLoc'],
  'Roadmap Definition': ['Roadmap priorities with Product & Engineering'],
  'AI Experience (AIX)': ['CV: Artificial Intelligence Experience (AIX)'],
  'Machine Learning UX (MLUX)': ['CV: Machine Learning UX (MLUX)'],
  'Human-Computer Interaction': ['CV: HCI knowledge'],
  'Human-Centered AI': ['CV: human-centered AI'],
  'Voice Interfaces': ['CV: AI / ML / HCI capability'],
  'Computer Vision': ['CV: AI / ML / HCI capability'],
  'Machine Learning': ['CV: Machine Learning UX (MLUX)'],
  'Autonomous Vehicle Interfaces': ['CV: AI / ML / HCI capability'],
  'AI Ethics & Data Privacy': ['CV: AI ethics & data privacy'],
  'Stakeholder Management': ['Client discussions & senior leadership · HomeLoc', 'CEO, PM & Engineering alignment · Computech'],
  'Design Team Leadership': ['5-member design team · HomeLoc'],
  'Mentoring & Coaching': ['Mentored designers · HomeLoc'],
  'Design Quality Reviews': ['Design reviews & delivery expectations'],
  'Platform Modernisation': ['Legacy interfaces & complex workflows'],
  'Design Governance': ['Reusable systems, accessibility standards & quality reviews'],
  'Responsible AI': ['AI-enabled experience opportunities with human oversight'],
  'Stakeholder Facilitation': ['Discovery sessions across 7 roles'],
  'Discovery Workshops': ['Computech · HomeLoc'],
  'Ideation Workshops': ['CV: ideation workshops'],
  'Design Reviews': ['Design-review conversations · HomeLoc'],
  'Cross-Functional Leadership': ['Product, Engineering, business stakeholders'],
  'Product & Engineering Partnership': ['ATSC 3.0 initiatives · Gaian Solution'],
  'Executive Communication': ['CEO partnership · Computech'],
  'Enterprise UX': ['CashTrax & DiversityTrax', 'Homeratesyard'],
  'UX Architecture': ['Role-based IA for enterprise users'],
  'Information Architecture': ['Computech · ePragathi'],
  'User Research': ['Stakeholder discovery & usability work'],
  'Journey Mapping': ['Borrower & operational journeys · HomeLoc'],
  'Interaction Design': ['Scalable interaction patterns · HomeLoc'],
  Prototyping: ['Process flows, wireframes & prototypes · Visual IT'],
  'Design Systems': ['Reusable design standards · HomeLoc'],
  'Accessibility / WCAG': ['Accessibility-focused design · ePragathi'],
  'Usability Testing': ['Diverse public audiences · ePragathi'],
  'Zero-to-One Product Development': ['Recruitment products · JobsNProfiles, VioTalk'],
  'Data-Driven Platforms': ['Audience insights & reporting · Way2News'],
  'Audience Intelligence': ['AudiencePlay, AudiencePrime, DigitalKites'],
  'Customer Data Platforms': ['Customer engagement products · Way2News'],
  'Customer Segmentation': ['Enterprise interfaces · Way2News'],
  'Campaign Management': ['DigitalKites · campaign experiences'],
  'Omnichannel Marketing Experience': ['MarTech products · Way2News'],
  'Customer Engagement': ['TheTasteCompany · engagement products'],
  'Behaviour Analytics': ['Retention & adoption reporting'],
  'Growth Experimentation': ['Platform adoption improvements'],
  'Conversion Optimisation': ['Retention, engagement & adoption'],
  Monetisation: ['Media monetisation · Gaian Solution', 'AdTech platforms'],
  FinTech: ['Enterprise SaaS · CV summary'],
  'Mortgage Technology': ['Homeratesyard · US mortgage'],
  Procurement: ['CashTrax & DiversityTrax'],
  GovTech: ['ePragathi & citizen services'],
  Media: ['Gaian Solution · broadcasting'],
  AdTech: ['Gaian advertising workflows · Way2News'],
  MarTech: ['DigitalKites · campaign platforms'],
  'Recruitment Technology': ['JobsNProfiles · VioTalk'],
  'B2B': ['Enterprise platforms · Computech, HomeLoc'],
  'B2C': ['Consumer media · Way2News'],
  'B2B2C': ['CV: product models'],
  SaaS: ['Enterprise SaaS · CV summary'],
  'Marketplace / P2P': ['CV: product models'],
  D2C: ['CV: product models'],
  Figma: ['Design standards & patterns · HomeLoc', 'Enterprise UX · Computech'],
  FigJam: ['Discovery & ideation workshops'],
  Miro: ['Journey mapping & service design'],
  Jira: ['Delivery with Product & Engineering'],
  Confluence: ['Roadmap & design-review documentation'],
  'Azure DevOps': ['Enterprise delivery · Computech'],
  React: ['Front-end implementation', 'REST API-aware UI'],
  'Next.js': ['Front-end implementation'],
  JavaScript: ['REST API-aware UI', 'JSON interfaces'],
  HTML5: ['Responsive product experiences'],
  CSS3: ['Responsive product experiences'],
  'REST API-aware UI': ['Data-driven platforms · Way2News'],
  JSON: ['REST API-aware UI'],
  PHP: ['WordPress & Joomla sites · Nitya Software'],
  MySQL: ['Database-backed products · Nitya Software'],
  'Google Analytics': ['Behaviour analytics & reporting'],
  Hotjar: ['Usability signals · enterprise platforms'],
  'Microsoft Clarity': ['Behaviour analytics & reporting'],
  ChatGPT: ['AI-enabled product development'],
  Claude: ['AI-enabled product development'],
  Gemini: ['AI-enabled product development'],
  Cursor: ['AI-enabled product development'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Craft Years',
    period: '2016 – 2018',
    synopsis: 'Nitya Software India — recruitment technology, communication products and client-facing web applications.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The Designer',
        description: 'Designed recruitment technology and communication products, including JobsNProfiles and VioTalk — wireframes, information architecture and responsive product experiences.',
        tags: ['UI/UX', 'Wireframes', 'Information Architecture'],
        runtime: 'Nitya Software',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'The Builder',
        description: 'Collaborated with development teams through front-end implementation and supported branding, marketing websites and digital product initiatives using WordPress, Joomla, PHP and MySQL.',
        tags: ['WordPress', 'PHP', 'MySQL'],
        runtime: 'Nitya Software',
        palette: ocean,
      },
    ],
  },
  {
    number: 2,
    title: 'Media & Audience',
    period: '2018 – 2021',
    synopsis: 'Way2News Interactive — consumer media, AdTech, MarTech and audience intelligence products across five brands.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'The Audience',
        description: 'Addressed content discovery and audience engagement through mobile-first product design for Way2News.',
        tags: ['Mobile-first', 'Content Discovery', 'Consumer Media'],
        runtime: 'Way2News',
        palette: crimson,
      },
      {
        code: 'S02 E02',
        title: 'The Platform',
        description: 'Designed audience intelligence and campaign management experiences for AudiencePlay, supporting segmentation and monetisation workflows across the brand family.',
        tags: ['AdTech', 'MarTech', 'Segmentation'],
        runtime: 'AudiencePlay → TheTasteCompany',
        palette: violet,
      },
      {
        code: 'S02 E03',
        title: 'The Analyst',
        description: 'Product improvements associated with a 30% team-level increase in daily active users (DAU), steered by audience insights, behaviour analytics and reporting.',
        tags: ['Behaviour Analytics', 'Reporting', 'Retention'],
        runtime: 'Way2News',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'The Broadcast Chapter',
    period: '2021 – 2022',
    synopsis: 'Gaian Solution — enterprise broadcasting, television technology and media monetisation experiences.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'On Air',
        description: 'Designed enterprise broadcasting and television technology experiences supporting digital content distribution and audience engagement.',
        tags: ['Broadcasting', 'Content Management', 'Dashboards'],
        runtime: 'Gaian Solution',
        palette: violet,
      },
      {
        code: 'S03 E02',
        title: 'The Next Standard',
        description: 'Contributed to ATSC 3.0-related product initiatives and partnered with Engineering on next-generation broadcasting experiences, alongside advertising workflows and reporting.',
        tags: ['ATSC 3.0', 'Advertising', 'Reporting'],
        runtime: 'Gaian Solution',
        palette: amber,
      },
      {
        code: 'S03 E03',
        title: 'The Workflow Builder',
        description: 'Created a self-service low-code workflow builder to simplify automation configuration and reduce dependence on engineering support, alongside monetisation and performance analytics dashboards.',
        tags: ['Low-code', 'Automation', 'Analytics'],
        runtime: 'Gaian Solution',
        palette: jade,
      },
    ],
  },
  {
    number: 4,
    title: 'The Public Service Season',
    period: '2022 – 2023',
    synopsis: 'Visual IT Solution — digital transformation for government and public-sector citizen-service platforms.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'For the Citizen',
        description: 'Contributed to digital transformation for government and public-sector platforms, including ePragathi and citizen-service ecosystems.',
        tags: ['GovTech', 'ePragathi', 'Service Design'],
        runtime: 'Visual IT Solution',
        palette: ocean,
      },
      {
        code: 'S04 E02',
        title: 'Accessible by Default',
        description: 'Designed citizen-facing and administrative workflows accessibility-first, simplifying complex service processes through IA, process mapping and responsive interaction design.',
        tags: ['Accessibility', 'Process Mapping', 'Prototyping'],
        runtime: 'Visual IT Solution',
        palette: jade,
      },
    ],
  },
  {
    number: 5,
    title: 'The Enterprise Procurement Season',
    period: '2023 – 2024',
    synopsis: 'Computech Corporation — procurement, supplier diversity, compliance, spend visibility and reconciliation platforms.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'CashTrax',
        description: 'Led UX strategy and product design for procurement, spend visibility and reconciliation, with role-based information architecture for enterprise users.',
        tags: ['Procurement', 'Spend Visibility', 'Enterprise UX'],
        runtime: 'Computech Corporation',
        palette: amber,
      },
      {
        code: 'S05 E02',
        title: 'DiversityTrax',
        description: 'Supplier diversity and compliance experiences, including supplier onboarding workflows, reporting systems and operational dashboards.',
        tags: ['Supplier Diversity', 'Compliance', 'Onboarding'],
        runtime: 'Computech Corporation',
        palette: crimson,
      },
      {
        code: 'S05 E03',
        title: 'The Room',
        description: 'Conducted stakeholder discovery and worked closely with the CEO, Product Managers and Engineering teams to align business goals, product priorities and delivery constraints.',
        tags: ['Discovery', 'Executive Communication', 'Alignment'],
        runtime: 'Computech Corporation',
        palette: violet,
      },
      {
        code: 'S05 E04',
        title: 'Efficiency, Measured',
        description: 'Simplified financial analytics, reconciliation, supplier onboarding, compliance and reporting workflows — a team redesign associated with a 20% improvement in operational reporting efficiency.',
        tags: ['Financial Analytics', 'Reporting', '20% efficiency'],
        runtime: 'Computech Corporation',
        palette: jade,
      },
    ],
  },
  {
    number: 6,
    title: 'The Mortgage Season',
    period: '2024 – 2026',
    synopsis: 'HomeLoc Solutions — product strategy and end-to-end design for US mortgage and lending platforms.',
    episodes: [
      {
        code: 'S06 E01',
        title: 'The Borrower',
        description: 'Framed borrower and operational problems across origination, underwriting, onboarding, servicing and lending operations, and translated them into journeys and solution direction.',
        tags: ['Mortgage', 'Lending Journeys', 'Problem Framing'],
        runtime: 'HomeLoc Solutions',
        palette: crimson,
      },
      {
        code: 'S06 E02',
        title: 'The Operator',
        description: 'Mapped end-to-end customer and operational journeys and drove workflow optimisation — an implemented underwriting workflow improvement cut decision time by 37%.',
        tags: ['37% faster decisions', 'Workflow Optimisation'],
        runtime: 'HomeLoc Solutions',
        palette: jade,
      },
      {
        code: 'S06 E03',
        title: 'Scaling the Language',
        description: 'Established reusable design standards and scalable interaction patterns across customer and operational experiences, mentored designers and partnered with teams across AWS and Azure ecosystems.',
        tags: ['Design Standards', 'Interaction Patterns', 'AWS · Azure'],
        runtime: 'HomeLoc Solutions',
        palette: ocean,
      },
    ],
  },
  {
    number: 7,
    title: "What's Next",
    period: 'Now streaming',
    synopsis: 'The CV closes on product strategy and design transformation leadership for AI-enabled product development.',
    episodes: [
      {
        code: 'S07 E01',
        title: 'The Next Episode',
        description: 'Product strategy, enterprise transformation and AI-native experience design — HCI, AIX and MLUX — for the next set of platforms.',
        tags: ['Product Strategy', 'AIX · MLUX · HCI', 'Transformation'],
        runtime: 'In production',
        palette: violet,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Tenure', title: '10+ Years', detail: 'UI/UX craft → design leadership', palette: amber },
  { label: 'Measured impact', title: '37% Faster', detail: 'underwriting decision time', palette: crimson },
  { label: 'Audience growth', title: '30% DAU', detail: 'team-level daily active users', palette: jade },
  { label: 'Operational impact', title: '20% Efficiency', detail: 'reporting workflow redesign', palette: ocean },
  { label: 'People leadership', title: '5 Designers', detail: 'team led, mentored & reviewed', palette: violet },
  { label: 'Industry range', title: `${industries.length} Domains`, detail: 'FinTech → Healthcare', palette: ocean },
  { label: 'Current chapter', title: 'HomeLoc', detail: 'Lead Product Design Consultant', palette: crimson },
  { label: 'Public sector', title: 'ePragathi', detail: 'GovTech citizen services', palette: ocean },
  { label: 'Enterprise UX', title: 'CashTrax', detail: 'procurement & diversity', palette: amber },
  { label: 'Toolbox', title: `${toolbox.length} Tools`, detail: 'Figma → Cursor', palette: jade },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'The Lead',
    title: '10+ years.',
    lines: ['Lead product designer · UX strategy · enterprise product experience', 'FinTech · Mortgage · Healthcare · Procurement · GovTech · Media'],
    chips: ['10+ years'],
  },
  {
    kicker: 'The Arc',
    title: 'Craft to leadership.',
    lines: ['Progression from UI/UX craft into product discovery,', 'problem framing, workflow transformation and design leadership.'],
    chips: ['Discovery', 'Problem Framing', 'Leadership'],
  },
  {
    kicker: 'People',
    title: 'Five designers.',
    lines: ['Leading a five-member design team through clear ownership,', 'mentoring, design reviews and delivery expectations.'],
    chips: ['Team Leadership', 'Mentoring', 'Design Quality'],
  },
  {
    kicker: 'Strategy',
    title: 'Governance.',
    lines: ['Reducing inconsistent experiences and design rework', 'through reusable systems, accessibility standards and reviews.'],
    chips: ['Design Systems', 'Accessibility', 'Governance'],
  },
  {
    kicker: 'AI-native',
    title: 'HCI · AIX · MLUX',
    lines: ['Responsible AI adoption — AI-enabled experience concepts', 'with transparency, usability and human oversight.'],
  },
  {
    kicker: 'Platforms',
    title: `${projects.length} originals.`,
    lines: ['Homeratesyard · CashTrax · ePragathi · Broadcast & Monetisation', 'Audience Intelligence · JobsNProfiles · PEM Pro · KenVision'],
  },
  {
    kicker: 'Domains',
    title: `${industries.length} industries.`,
    lines: ['FinTech · Mortgage · Healthcare · Procurement · GovTech', 'Media · AdTech · MarTech · Recruitment · E-commerce'],
  },
  {
    kicker: 'Next',
    title: 'Now exploring.',
    lines: ['Design leadership and product strategy', 'for AI-enabled product development.'],
  },
];

export type ProfileId = 'ajay' | 'recruiter' | 'product' | 'design';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story' | 'continueWatching';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'ajay',
    name: 'Ajay',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'continueWatching', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, impact & capabilities first',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks', 'continueWatching'],
  },
  {
    id: 'product',
    name: 'Product Lead',
    blurb: 'Strategy, platforms & outcomes first',
    color: '#46e3a8',
    order: ['originals', 'picks', 'moments', 'skills', 'journey', 'about', 'continueWatching', 'story'],
  },
  {
    id: 'design',
    name: 'Design Lead',
    blurb: 'The craft & the story arc first',
    color: '#ffb547',
    order: ['journey', 'skills', 'originals', 'about', 'picks', 'moments', 'continueWatching', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Lead • Positioning & focus', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'My Platforms', meta: `${projects.length} Originals • 2016–2026`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 from the CV', palette: jade },
  skills: { nav: 'Capabilities', card: 'My Capabilities', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: { nav: 'Impact', card: 'Signature Impact', meta: `${achievements.length} Moments • ${toolbox.length} Tools`, palette: crimson },
  continueWatching: { nav: 'Continue Watching', card: 'Now Streaming', meta: '2 Platforms • latest', palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'CV • View & download', palette: violet },
};
