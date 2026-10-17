/**
 * Deeper case-study material for each Original: the interfaces, the artifacts
 * behind them, and the deliverables list.
 *
 * Two kinds of material live here, and they are never mixed:
 *
 *  - `screens` / `wireframes` are vector reconstructions — stylised renderings of
 *    the interface families each case study describes, not screenshots of
 *    shipping products. They exist for the Originals where no real screens could
 *    be shown.
 *  - `visualDesign` / `flows` are the real artifacts, supplied as images: the
 *    shipped screens and the hand-drawn journey boards. Where these exist they
 *    replace the reconstructions, since a drawing of work you can actually show
 *    is just an extra step away from the work.
 *
 * Captions stay factual either way, and drawn from the same CV-sourced story as
 * the rest of the modal.
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

/**
 * A board: one real artifact of the work, supplied as an image.
 *
 * Used for both galleries — photographed hand-drawn flow boards and shipped
 * product screens. These are not reconstructions, so the drawings and the
 * screen data are shown exactly as they were produced.
 */
export type Board = {
  /** Path under public/ — a photographed flow board or a product screen. */
  src: string;
  /** The board's real pixel dimensions, so a gallery can reserve its space. */
  w: number;
  h: number;
  title: string;
  caption: string;
  /** Spoken description, since the text lives in the image. */
  alt: string;
};

export type OriginalDetail = {
  /** What the key art for this Original depicts, in words. */
  keyArt: string;
  /**
   * Drawn reconstructions of the interface families described in the case study.
   * Optional: where the real screens are available they replace these entirely
   * (see `visualDesign`), because a reconstruction of work you can show is noise.
   */
  screens?: ProjectScreen[];
  wireframes?: ProjectWireframe[];
  /** The shipped screens, supplied as images. Shown instead of `screens`. */
  visualDesign?: Board[];
  /** Photographed hand-drawn flow boards. */
  flows?: Board[];
  deliverables: string[];
};

export const originalDetails: Record<string, OriginalDetail> = {
  homeratesyard: {
    keyArt:
      'A house drawn in the platform\u2019s crimson against a dark lending sky, with an approval track running beneath it and a single tick at the end of the bar \u2014 the decision, made faster.',
    /* No drawn `screens` / `wireframes` here: this Original has the real ones. */
    visualDesign: [
      {
        src: '/assets/homeratesyard/screens/01-login.webp',
        w: 1920,
        h: 1080,
        title: 'Login',
        caption: 'Sign-in — the entry point to the journey, before any case exists.',
        alt: 'Homeratesyard screen 1, Login, presented in the case-study frame with its numbered title block above it.',
      },
      {
        src: '/assets/homeratesyard/screens/02-dashboard.webp',
        w: 1920,
        h: 1080,
        title: 'Dashboard',
        caption:
          'Overview of applications, pipeline and KPIs: total applications, in review, approved and disbursed as counters, a six-month applications trend, a status breakdown and a recent-applications table.',
        alt: 'Homeratesyard screen 2, Dashboard. A left navigation lists Dashboard, Applications, Underwriting, Documents, Operations, Reports and Settings. The panel greets the user by name above four counters — total applications 328, in review 124, approved 86 and disbursed 54, each with a percentage change — a six-month applications trend bar chart, a status donut showing 328 total split across in review, approved, rejected, on hold and disbursed, and a recent-applications table listing applicant, loan type, amount, status and last update.',
      },
      {
        src: '/assets/homeratesyard/screens/03-borrower-intake.webp',
        w: 1920,
        h: 1080,
        title: 'Borrower Intake',
        caption:
          'Capture applicant and loan details — step 1 of a six-step intake, with the whole sequence visible down the left so the applicant always knows where they are.',
        alt: 'Homeratesyard screen 3, Borrower Intake. A six-step rail on the left runs borrower details, loan details, employment & income, assets & liabilities, documents and review & submit. The borrower information panel is step 1 of 6, with full name, mobile number, email address, date of birth, PAN number, Aadhaar number and a current address block, over a Save & Continue action.',
      },
      {
        src: '/assets/homeratesyard/screens/04-document-upload.webp',
        w: 1920,
        h: 1080,
        title: 'Document Upload',
        caption:
          'Collect and verify required documents — completed steps ticked in the rail, upload status shown per document across applicant, co-applicant, property and additional tabs.',
        alt: 'Homeratesyard screen 4, Document Upload. The step rail shows borrower details and loan details completed. The upload panel is step 3 of 6 with tabs for applicant, co-applicant, property and additional, listing identity proof, address proof, income proof, bank statements for six months and property documents, each with an uploaded state or an upload action and a accepted-file-types note.',
      },
      {
        src: '/assets/homeratesyard/screens/05-verification-checklist.webp',
        w: 1920,
        h: 1080,
        title: 'Verification Checklist',
        caption:
          'Track document and data verification status — KYC, income and property verification grouped, each line carrying its own state from verified through in progress and under review to pending.',
        alt: 'Homeratesyard screen 5, Verification Checklist. The panel is step 4 of 6. Under KYC verification, Aadhaar verification and PAN verification read verified while address verification reads in progress. Under income verification, salary slips for the last three months read verified, bank statements for six months read under review and ITR for the last two years reads pending. Under property verification, property documents, valuation report and legal check all read pending.',
      },
      {
        src: '/assets/homeratesyard/screens/06-underwriting-review.webp',
        w: 1920,
        h: 1080,
        title: 'Underwriting Review',
        caption:
          'Detailed assessment by the underwriter: application #HYD001234 in review, a risk assessment panel of credit score, income stability, obligations, property valuation, LTV and DTI, and a recommendation the underwriter has to commit to.',
        alt: 'Homeratesyard screen 6, Underwriting Review, headed Application #HYD001234 with an in-review status and a submitted date, over tabs for overview, applicant details, documents, credit bureau, property, risk assessment and notes. The risk assessment panel shows a 720 credit score marked good beside income stability high, existing obligations moderate, property valuation, loan to value 62% and debt to income 28%. The recommendation panel offers approve, approve with conditions, refer to credit committee or reject, with a comments box and a submit decision action.',
      },
      {
        src: '/assets/homeratesyard/screens/07-approval-rejection.webp',
        w: 1920,
        h: 1080,
        title: 'Approval / Rejection',
        caption:
          'Final decision with conditions — the approved amount, rate, tenure and monthly repayment on one line, then the conditions that have to be met before disbursement.',
        alt: 'Homeratesyard screen 7, Approval / Rejection. An “Application Approved” panel states that the home loan application has been approved, above a summary strip of loan amount 50,00,000 rupees, interest rate 8.25%, tenure 20 years and monthly EMI 43,391 rupees. A numbered conditions list requires property insurance before disbursement, a salary account with the partner bank and a final legal check, over actions to proceed to agreement or view the approval letter.',
      },
      {
        src: '/assets/homeratesyard/screens/08-loan-agreement-esign.webp',
        w: 1920,
        h: 1080,
        title: 'Loan Agreement & E-Sign',
        caption:
          'Review and e-sign loan documents — the agreement read in place, with the sanction letter, repayment schedule, terms and declarations as its own signed items.',
        alt: 'Homeratesyard screen 8, Loan Agreement & E-Sign. A left rail lists sanction letter, loan agreement, repayment schedule, terms & conditions and declarations, all marked complete with the loan agreement selected. A document viewer shows the Homeratesyard home loan agreement, naming the lender and applicant and the loan details, with the toolbar for zoom, rotate, print and download. An agreement checkbox sits beside a Sign Document action.',
      },
      {
        src: '/assets/homeratesyard/screens/09-disbursement-confirmation.webp',
        w: 1920,
        h: 1080,
        title: 'Disbursement Confirmation',
        caption:
          'Loan amount disbursed successfully — the amount, date, reference number and a completed status, with the detail view and the way back to the dashboard.',
        alt: 'Homeratesyard screen 9, Disbursement Confirmation. A house illustration above a “Loan Disbursed Successfully” message states that the amount has been transferred to the applicant’s bank account. A strip lists loan amount 50,00,000 rupees, the disbursement date, reference number HY0001234 and a completed status, over actions to view disbursement details or return to the dashboard.',
      },
    ],
    flows: [
      {
        src: '/assets/homeratesyard/flows/01-loan-journey-full-application-flow.jpg',
        w: 1600,
        h: 865,
        title: 'Loan application journey · full path',
        caption:
          'Ten steps across two rows: landing/login, dashboard, new application, document upload and review & submit, then underwriting review, decision, loan agreement and disbursal — with rejection drawn at the same level as the approved path.',
        alt:
          'Hand-drawn user flow on paper, titled “User Flow — Loan Application Journey”. Five numbered screens run across the top: landing/login, dashboard with the applications list, new application with personal, employment, income and loan details, document upload with identity, address, income and bank statement proofs, and review & submit. A second row continues with underwriting review showing application ID #12345 and a risk-assessment checklist of KYC verification, income validation, credit check and fraud check, then a decision diamond labelled “Approved?”, a loan agreement screen with a signature line and an accept-and-sign button, and a disbursal confirmation reading “Loan Disbursed Successfully”. The rejected branch leads to a tenth screen reading “Application Not Approved”.',
      },
      {
        src: '/assets/homeratesyard/flows/02-loan-journey-customer-view.jpg',
        w: 1600,
        h: 854,
        title: 'Loan application journey · customer side',
        caption:
          'The same journey drawn from the borrower inwards: start application, borrower intake, review & submit, underwriting and decision, with Offer, Manual Review and Application Closed as the three outcomes the decision can produce.',
        alt:
          'Hand-drawn flow on paper titled “User Flow — Loan Application Journey”. A stick figure labelled Customer points into six numbered boxes: 1 Start Application (select loan type, basic details, Apply Now), 2 Borrower Intake (personal details, employment, income details, documents upload, Next), 3 Review & Submit (review information, agree to terms, Submit), 4 Underwriting (verification, risk assessment, policy checks, credit check), 5 Decision drawn as a diamond, and 6 Offer (View Offer, showing loan amount, interest rate, tenure and terms & conditions). An “Approved” arrow runs from Decision to Offer; a “Needs Review” arrow runs down to a Manual Review box (underwriter review, additional documents, re-assessment), which branches to Declined → Application Closed (reason for decline, reapply option) and back to Borrower Intake via a dashed “More Info Required” arrow.',
      },
      {
        src: '/assets/homeratesyard/flows/03-loan-journey-screen-by-screen.jpg',
        w: 1572,
        h: 1001,
        title: 'Loan application journey · screen by screen',
        caption:
          'Eleven stages with the fields named beneath each screen — product info, personal details, employment details, loan details, document upload, review & submit, application received, underwriting, decision, offer & agreement and disbursal.',
        alt:
          'Hand-drawn two-row flow on paper, titled “User Flow — Loan Application Journey”. The top row runs 1 Landing/Welcome (product info, key benefits, Apply Now), 2 Personal Details (name, contact, date of birth, PAN/ID), 3 Employment Details (employment type, company name, monthly income, work experience), 4 Loan Details (loan type, amount, tenure, purpose), 5 Document Upload (ID, address and income proof) and 6 Review & Submit (verify all details, check documents, submit application). The lower row continues 7 Application Received (confirmation message, application reference number, next steps), 8 Underwriting (document verification, credit check, risk assessment, policy validation), 9 Decision as a diamond, 10 Offer & Agreement (loan offer details, interest rate, EMI and tenure, terms & conditions, e-sign agreement) and 11 Disbursal (loan disbursed, account details, email/SMS notification). A “No” branch from the decision leads to Application Rejected with a reason and next steps or re-apply.',
      },
      {
        src: '/assets/homeratesyard/flows/04-loan-journey-post-disbursal.jpg',
        w: 1536,
        h: 1024,
        title: 'Loan application journey · through to servicing',
        caption:
          'Nine stages carrying the journey past disbursal into post-disbursal servicing: repayment schedule, document downloads, status tracking and support. Underwriting is drawn with a credit-score read-out of 750.',
        alt:
          'Hand-drawn two-row flow on paper, titled “User Flow — Loan Application Journey”. Top row: 1 Start (product selection, check eligibility, get started, Apply Now), 2 Borrower Intake (personal, employment and income details, loan amount and purpose, Continue), 3 Document Upload (ID proof, address proof, income documents, bank statements), 4 Verification (KYC verification, document validation, bank verification, employment check, reference check) and 5 Underwriting, showing a dial reading 750 above credit score, risk assessment, policy check, income analysis and fraud check. Bottom row: 6 Decision as an “Approve?” diamond whose No branch leads to Declined with a reason for rejection and feedback to the applicant, 7 Offer & Agreement (loan offer details with a rupee amount, terms & conditions, e-sign agreement, an “I agree to the terms” checkbox and an Accept Offer button), 8 Disbursal (Loan Disbursed, amount transferred, transaction details, notification to customer) and 9 Post Disbursal with rows for repayment schedule, download documents, track status and customer support, listed against EMI schedule, view statements and raise service requests.',
      },
      {
        src: '/assets/homeratesyard/flows/05-loan-journey-clarification-loop.jpg',
        w: 1600,
        h: 800,
        title: 'Loan application journey · clarification loop',
        caption:
          'Seven stages with the rework path drawn explicitly: where verification or underwriting needs more, the flow returns to borrower intake for documents and clarification, and rejects with a reason and a re-apply or appeal route when it cannot proceed.',
        alt:
          'Hand-drawn two-row flow on paper, titled “User Flow — Loan Application Journey”. Numbered boxes run 1 Start (landing page, product info, get started, sign in), 2 Borrower Intake (full name, mobile number, email, loan amount and details, Next), 3 Document Upload (KYC documents, income proof, bank statements, additional documents), 4 Verification (identity verification, income verification, credit check, document validation, Continue), 5 Underwriting Review, showing a risk score of 720 with eligibility check, risk evaluation, policy rules and manual review, 6 Offer & Approval (Loan Approved, approved amount, interest rate, tenure, terms & conditions, View Offer) and 7 Disbursal (Loan Disbursed, amount credited, transaction details, repayment schedule). A dashed rail labelled “Back to Borrower Intake” leads from an Additional Information Required box (request more documents, clarification) into step 2, and a further branch leads to Rejected with a reason for rejection and a re-apply or appeal option.',
      },
      {
        src: '/assets/homeratesyard/flows/06-back-office-application-to-disbursement.jpg',
        w: 1536,
        h: 1024,
        title: 'Back office · application to disbursement',
        caption:
          'The lender side, on eight screens: an operations dashboard counting applications, in review, approved and declined, application details across tabs, document verification with verified, pending and upload states, risk assessment, underwriting review with checklists and reviewer comments, decision and disbursement.',
        alt:
          'Hand-drawn two-row flow on paper, titled “User Flow”. The top row shows 1 Login (email, password, remember me, forgot password), 2 Dashboard with counters reading Applications 24, In Review 12, Approved 08 and Declined 04 above a recent-applications table of name, product, status and date, 3 Application Details with personal, employment, financial and documents tabs over full name, date of birth, PAN number, mobile number and email address fields, and 4 Document Verification listing identity proof and address proof as verified, income proof as pending, and bank statement and photo as upload. The bottom row runs 5 Risk Assessment (credit score, income stability, existing loans, debt-to-income ratio and risk category as dropdowns), 6 Underwriting Review with checkboxes for identity verification, income validation, credit bureau check, fraud check, eligibility rules and final recommendation over a reviewer comments box, plus send-for-clarification and approve actions, 7 Decision showing Application Approved with View Offer and Download Letter, and 8 Disbursement showing Loan Disbursed with loan amount, disbursement date and reference number.',
      },
      {
        src: '/assets/homeratesyard/flows/07-lending-journey-end-to-end.jpg',
        w: 1600,
        h: 854,
        title: 'Lending journey · end to end',
        caption:
          'Nine stages from landing and login through decision and loan offer to customer acceptance and disbursal, with decline, notify-customer and re-apply drawn as the alternate rail back into the application.',
        alt:
          'Hand-drawn flow on paper, titled “User Flow — Lending Journey, End to End”. Nine numbered stages run left to right: 1 Landing/Login, 2 Dashboard (overview, applications, tasks, quick actions), 3 New Application (personal info, employment info, loan details, document upload), 4 Verification (KYC check, income verification, credit check, document validation, fraud check), 5 Underwriting Review (risk assessment, eligibility check, policy rules, manual review), 6 Decision drawn as an “Approve?” diamond, 7 Loan Offer with a Generate Offer button, 8 Customer Acceptance with an Accept Offer button and 9 Disbursal ending in “Loan Disbursed Successfully”. The No branch from the decision leads to a Decline box (reason for decline, notify customer) with a dashed Re-apply route back to verification.',
      },
      {
        src: '/assets/homeratesyard/flows/08-lending-journey-kyc-to-disbursement.jpg',
        w: 1536,
        h: 1024,
        title: 'Lending journey · KYC to disbursement',
        caption:
          'Six stages under their actors — customer, application, verification, assessment, agreement and funds. The approved case is drawn as a rupee-five-lakh loan over 36 months at 10.5%, with the rejected path running to re-apply or appeal.',
        alt:
          'Hand-drawn flow on paper, titled “User Flow — Lending Journey”. Actor symbols across the top — customer, document, magnifying glass, decision, signing document and rupee sign — sit above six numbered stages: 1 Start Application (loan application form with name, mobile, email, loan type and loan amount), 2 KYC & Verification (personal details, address proof, identity proof, income details, bank statement, consent), 3 Underwriting & Assessment (credit score 730, income check, risk assessment and fraud check all ticked, recommended limit of five lakh), 4 Decision (Approved, loan amount five lakh, tenure 36 months, interest rate 10.5%, proceed to disbursement), 5 Agreement & E-Sign (terms & conditions, repayment schedule, e-sign consent, sign & continue) and 6 Disbursement (funds disbursed to your bank account, view details). A rejected branch lists high risk, insufficient income, document mismatch and policy not eligible, with a notify-customer action and a re-apply or appeal box for updating information and uploading documents, plus dashed “re-evaluation” and “track & monitor” rails back through the flow.',
      },
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
