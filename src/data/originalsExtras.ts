/**
 * Deeper case-study material for each Original: representative product screens,
 * the wireframe/flow artifacts behind them, and the deliverables list.
 *
 * The screen and wireframe drawings are vector reconstructions — stylised
 * renderings of the interface families described in each case study, not
 * screenshots of shipping products. Captions stay factual and drawn from the
 * same CV-sourced story as the rest of the modal.
 */

export type ScreenKind =
  | 'command' // KPI command center: score + tiles + trend
  | 'dashboard' // sidebar + charts + table
  | 'workflow' // staged stepper with an approval rail
  | 'mobile' // phone frame, feed-like
  | 'form' // long guided form with side help
  | 'map' // floor-plan / journey canvas with layers
  | 'portal' // onboarding portal: hero + steps
  | 'copilot'; // assistant panel beside engineering content

export type WireKind = 'flow' | 'ia' | 'screen' | 'journey';

export type ProjectScreen = {
  kind: ScreenKind;
  title: string;
  caption: string;
};

export type ProjectWireframe = {
  kind: WireKind;
  title: string;
  caption: string;
};

export type OriginalDetail = {
  /** What the key art for this Original depicts, in words. */
  keyArt: string;
  screens: ProjectScreen[];
  wireframes: ProjectWireframe[];
  deliverables: string[];
};

export const originalDetails: Record<string, OriginalDetail> = {
  'homeloc-lending': {
    keyArt:
      'A house drawn in the platform\u2019s crimson against a dark lending sky, with an approval track running beneath it and a single tick at the end of the bar \u2014 the decision, made faster.',
    screens: [
      {
        kind: 'workflow',
        title: 'Underwriting Workbench',
        caption: 'The staged decision workspace — file context on the left, findings and the decision rail on the right.',
      },
      {
        kind: 'dashboard',
        title: 'Operations Pipeline',
        caption: 'Queue health across origination, underwriting, onboarding and servicing in one operational view.',
      },
      {
        kind: 'form',
        title: 'Borrower Intake',
        caption: 'Guided intake that adapts to loan type, with validation surfaced at the field — not at submit.',
      },
    ],
    wireframes: [
      { kind: 'journey', title: 'Lending lifecycle map', caption: 'Five stages, two audiences, one spine.' },
      { kind: 'flow', title: 'Underwriting decision flow', caption: 'Where the 37% time saving was found.' },
      { kind: 'ia', title: 'Role-based IA', caption: 'LO, underwriter, ops — each entry point.' },
    ],
    deliverables: [
      'End-to-end customer & operational journey maps',
      'Underwriting workflow redesign (implemented)',
      'Reusable design standards & interaction patterns',
      'Discovery, product-vision & design-review facilitation',
      'Roadmap alignment with Product, Engineering & business',
    ],
  },
  cashtrax: {
    keyArt:
      'Four supplier tiles with a rising spend chart in amber underneath: procurement, diversity, spend and reconciliation read as one movement rather than four separate tools.',
    screens: [
      {
        kind: 'dashboard',
        title: 'Spend Visibility',
        caption: 'Category, supplier and reconciliation status on one screen for non-analyst enterprise users.',
      },
      {
        kind: 'form',
        title: 'Supplier Onboarding',
        caption: 'Progressive onboarding with compliance evidence collected in context of each supplier type.',
      },
      {
        kind: 'workflow',
        title: 'Diversity Compliance Review',
        caption: 'DiversityTrax review rail — submissions, evidence, exceptions and sign-off in one queue.',
      },
    ],
    wireframes: [
      { kind: 'ia', title: 'Role-based IA', caption: 'Procurement, diversity and finance each get their own spine.' },
      { kind: 'flow', title: 'Onboarding → reconciliation', caption: 'One process across two platforms.' },
      { kind: 'screen', title: 'Dashboard lo-fi', caption: 'Table density studies before visual design.' },
    ],
    deliverables: [
      'Stakeholder discovery with CEO, PMs & Engineering',
      'Service experiences & supplier onboarding workflows',
      'Reporting systems for diversity & compliance',
      'Role-based information architecture',
      'Operational dashboards for enterprise users',
    ],
  },
  epragathi: {
    keyArt:
      'A civic building on stepped ground in cool blue \u2014 the citizen and the back office sharing one structure, with the steps standing for the service layers between them.',
    screens: [
      {
        kind: 'portal',
        title: 'Citizen Service Portal',
        caption: 'Service discovery by life event, with status tracking that survives the session.',
      },
      {
        kind: 'workflow',
        title: 'Back-office Verification',
        caption: 'Administrative workflow: application, verification queue, officer action and audit trail.',
      },
      {
        kind: 'mobile',
        title: 'Mobile Service Access',
        caption: 'Low-bandwidth service flow designed for first-time internet users.',
      },
    ],
    wireframes: [
      { kind: 'journey', title: 'Citizen journey', caption: 'Two audiences, designed as one system.' },
      { kind: 'screen', title: 'WCAG form wireframes', caption: 'Label, error and help patterns locked before UI.' },
      { kind: 'flow', title: 'Verification process flow', caption: 'Officer steps mapped with business analysts.' },
    ],
    deliverables: [
      'Process flows for citizen & administrative services',
      'Wireframes and interactive prototypes',
      'Accessibility-focused design across services',
      'Production-ready interface delivery',
      'Consistent front/back-office design language',
    ],
  },
  'gaian-broadcast': {
    keyArt:
      'A transmitter mast with three arcs of signal radiating past it in violet \u2014 broadcast reach, with the mast doubling as the content, advertising and reporting workstreams beneath.',
    screens: [
      {
        kind: 'dashboard',
        title: 'Broadcast Operations Dashboard',
        caption: 'Content, ad and reporting workstreams side by side for the operations floor.',
      },
      {
        kind: 'workflow',
        title: 'Content Management Rail',
        caption: 'Ingest → rights → scheduling → playout status in a single operational rail.',
      },
      {
        kind: 'command',
        title: 'Monetisation Performance',
        caption: 'Campaign and inventory performance for advertising teams.',
      },
    ],
    wireframes: [
      { kind: 'ia', title: 'Ecosystem IA', caption: 'One interaction model across a complex media estate.' },
      { kind: 'flow', title: 'Content lifecycle flow', caption: 'From ingest to playout, including rights checks.' },
      { kind: 'screen', title: 'Dashboard density studies', caption: 'Operational screens tuned for control-room use.' },
    ],
    deliverables: [
      'Content-management workflows for broadcast operations',
      'Advertising & monetisation workflow design',
      'Reporting dashboards & operational tooling',
      'Scalable interaction models for media ecosystems',
      'ATSC 3.0 initiative participation',
    ],
  },
  'audience-intelligence': {
    keyArt:
      'Concentric audience rings in jade over a segmentation chart \u2014 one audience base, read at four distances, with the bars showing how it breaks down into behaviour.',
    screens: [
      {
        kind: 'mobile',
        title: 'Content Discovery',
        caption: 'Mobile-first discovery feed tuned for retention across five consumer brands.',
      },
      {
        kind: 'dashboard',
        title: 'Segmentation Studio',
        caption: 'Audience segments built from behaviour signals, with reach and overlap estimates.',
      },
      {
        kind: 'command',
        title: 'Campaign Command',
        caption: 'Campaign setup, pacing and monetisation performance in one enterprise console.',
      },
    ],
    wireframes: [
      { kind: 'screen', title: 'Feed wireframes', caption: 'Discovery patterns shared across brands.' },
      { kind: 'ia', title: 'Three platform families', caption: 'Consumer, AdTech and MarTech on one audience base.' },
      { kind: 'journey', title: 'Reader → revenue journey', caption: 'Where engagement converts for publishers.' },
    ],
    deliverables: [
      'Mobile-first discovery & engagement experiences',
      'Customer segmentation interfaces',
      'Campaign management tooling',
      'Behaviour analytics & reporting',
      'Monetisation experiences for publishers & brands',
    ],
  },
  jobsnprofiles: {
    keyArt:
      'Two candidate cards linked by a dashed connector, with a message thread beneath in clay \u2014 candidate and employer on one side of the product, conversation on the other.',
    screens: [
      {
        kind: 'form',
        title: 'Recruitment Flow',
        caption: 'Candidate profile and job-match flow designed and shipped to front-end.',
      },
      {
        kind: 'mobile',
        title: 'VioTalk Messaging',
        caption: 'Communication product interface — conversations, presence and notifications.',
      },
      {
        kind: 'portal',
        title: 'Client Delivery Portal',
        caption: 'Client-facing web application delivered end to end on a PHP/MySQL stack.',
      },
    ],
    wireframes: [
      { kind: 'screen', title: 'Low-fi screens', caption: 'The wireframes the products were built from.' },
      { kind: 'flow', title: 'Registration → match flow', caption: 'Shortest path to a usable candidate profile.' },
      { kind: 'ia', title: 'Site IA', caption: 'Product and marketing surfaces under one structure.' },
    ],
    deliverables: [
      'JobsNProfiles & VioTalk product design',
      'Wireframes, IA & responsive experiences',
      'Front-end implementation collaboration',
      'Branding & marketing website delivery',
      'WordPress / Joomla / PHP / MySQL build support',
    ],
  },
  'pem-pro': {
    keyArt:
      'A drafting grid with an exploded fastener on it in steel blue \u2014 the engineering detail being worked on, with the grid standing for the CAD precision around it.',
    screens: [
      {
        kind: 'command',
        title: 'Engineering Command Center',
        caption: 'Lifecycle integrity, AI synthesis results and manufacturing readiness at a glance.',
      },
      {
        kind: 'portal',
        title: 'Workspace Provisioning',
        caption: 'The 4-step secure provisioning sequence that builds trust before the first project.',
      },
      {
        kind: 'workflow',
        title: 'Product Lifecycle Engine',
        caption: 'Project → CAD Import → AI Analysis → Fasteners → Validation as one guided spine.',
      },
      {
        kind: 'copilot',
        title: 'AI Engineering Copilot',
        caption: 'In-product assistant for engineering decisions, beside the work — not in the way.',
      },
    ],
    wireframes: [
      { kind: 'flow', title: 'Provisioning flow', caption: 'Trust signals sequenced through first run.' },
      { kind: 'ia', title: 'Portal IA', caption: 'Lifecycle, knowledge and administration surfaces.' },
      { kind: 'screen', title: 'Command center lo-fi', caption: 'Tile hierarchy before the design system pass.' },
      { kind: 'journey', title: 'CAD → validation journey', caption: 'The seven-stage roadmap wizard, mapped.' },
    ],
    deliverables: [
      'First-run provisioning & onboarding design',
      'Engineering Command Center UX',
      'Product Lifecycle Engine flows',
      'AI Copilot interaction model',
      'Role-aware design system with trust signals',
      'Guided product tour & 7-step roadmap wizard',
    ],
  },
  kenvision: {
    keyArt:
      'A camera frame with a scan beam and a detected box in green \u2014 a store seen as a stream of events, with the box marking the moment vision becomes something an operator can act on.',
    screens: [
      {
        kind: 'command',
        title: 'Store Health Command Center',
        caption: 'Health score, live KPI streams and recommended actions on one real-time screen.',
      },
      {
        kind: 'map',
        title: 'Store Intelligence Map',
        caption: 'Footfall, dwell, conversion, revenue and staff heatmaps layered over the real floor plan.',
      },
      {
        kind: 'dashboard',
        title: 'Executive Insights',
        caption: 'Weekly revenue trends and per-store ranking for portfolio-level decisions.',
      },
    ],
    wireframes: [
      { kind: 'screen', title: 'Command center lo-fi', caption: 'Six KPI streams ranked by operator priority.' },
      { kind: 'journey', title: 'Detection → action journey', caption: 'How a camera event becomes a staff move.' },
      { kind: 'ia', title: 'Heatmap layer IA', caption: 'Five layers, one map, no mode confusion.' },
    ],
    deliverables: [
      'Store Health Score & AI Command Center UX',
      'Store Intelligence Map with 5 heatmap layers',
      'AI Recommended Actions (impact × effort ranking)',
      'Operations health tiles & camera diagnostics',
      'Executive insights & weekly reporting',
      'Privacy-first analytics design',
    ],
  },
};
