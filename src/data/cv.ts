/**
 * The CV module's content model — the one shape the admin portal edits and the
 * site renders.
 *
 * `cv` below is the bundled default: it is written from the current CV
 * (public/assets/Ajay_Kumar_Myakala_CV.pdf, Product Strategy & Design
 * Transformation Leader edition). The deployed site first asks the Worker for a
 * published override at /api/cv and falls back to this object when the API is
 * unavailable (local dev, preview, API outage).
 *
 * Nothing here may be invented: every string is either taken from the CV or is
 * a plain restatement of a CV bullet. The CV lists no certifications, so
 * `certifications` is empty and the section is simply not rendered until an
 * entry exists.
 */

export type CvExperience = {
  title: string;
  org: string;
  place: string;
  period: string;
  /** One-line descriptor shown inline. */
  tagline: string;
  /** 1–2 sentence impact statement, drawn from the CV bullets. */
  highlight: string;
  url?: string;
};

export type CvCertification = {
  title: string;
  issuer: string;
  issued: string;
  url?: string;
};

export type CvContent = {
  heading: string;
  role: string;
  intro: string;
  highlights: string[];
  careerSummary: string;
  experience: CvExperience[];
  certifications: CvCertification[];
  closing: string;
  contact: {
    displayName: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
};

export const cv: CvContent = {
  heading: 'Résumé',
  role: 'Product Strategy & Design Transformation Leader',

  intro:
    'Product strategy and design transformation professional with 10+ years across Enterprise SaaS, FinTech, mortgage and lending, procurement, GovTech, media, AdTech, MarTech and recruitment technology. My route has run from UX/UI craft into product discovery, business problem framing, workflow transformation and solution strategy.',

  highlights: [
    'Problem Framing & Product Strategy — translating ambiguity, business goals, user needs and operational constraints into product opportunities and solution direction.',
    'Transformation & Systems Thinking — simplifying complex workflows, service journeys and enterprise operating models into scalable digital experiences.',
    'AI-Native Experience Design — Human-Computer Interaction (HCI), Artificial Intelligence Experience (AIX), Machine Learning UX (MLUX), human-centered AI, voice, computer vision and AI ethics.',
    'Data, Marketing & Growth Platforms — audience intelligence, customer data, campaign management, monetisation, behaviour analytics and marketing technology collaboration.',
    'Consulting & Stakeholder Influence — discovery sessions, workshops, roadmap conversations and executive stakeholder communication.',
  ],

  careerSummary:
    'I combine systems thinking, product thinking and human-centered design with HCI, AIX and MLUX knowledge, translating complex business, user, operational and technical constraints into scalable product direction, data-driven platforms and customer experiences.\n\n'
    + 'The through-line is evidence. I frame the problem before anyone draws a screen, map the journey to find where time and decisions are lost, and keep business objectives, user needs and implementation reality aligned as the work moves.\n\n'
    + 'I have worked end to end — from discovery workshops and roadmap conversations through to production-ready interfaces — with product, engineering, editorial, marketing and executive stakeholders.',

  experience: [
    {
      title: 'Lead Product Design Consultant',
      org: 'HomeLoc Solutions LLP',
      place: 'Hyderabad, India',
      period: 'Apr 2024 – May 2026',
      tagline: 'US mortgage & lending platforms — origination to servicing.',
      highlight:
        'Led product strategy and end-to-end design for US mortgage and lending platforms; an implemented underwriting workflow improvement reduced decision time by 37%.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Computech Corporation',
      place: '',
      period: 'Mar 2023 – Mar 2024',
      tagline: 'CashTrax and DiversityTrax enterprise procurement platforms.',
      highlight:
        'Led UX strategy and product design for CashTrax and DiversityTrax, spanning procurement, supplier diversity, compliance, spend visibility and reconciliation, with role-based information architecture for enterprise users.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Visual IT Solution',
      place: '',
      period: 'Sep 2022 – Mar 2023',
      tagline: 'GovTech and citizen-service ecosystems, including ePragathi.',
      highlight:
        'Designed citizen-facing and administrative workflows for public-sector platforms, simplifying complex service processes through information architecture, process mapping and accessibility-focused interaction design.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Gaian Solution',
      place: '',
      period: 'Oct 2021 – Aug 2022',
      tagline: 'Enterprise broadcasting, TV technology and media monetisation.',
      highlight:
        'Designed content-management workflows, operational dashboards and scalable interaction models across a complex media ecosystem, and contributed to ATSC 3.0 next-generation broadcasting initiatives.',
    },
    {
      title: 'Sr UI/UX Designer',
      org: 'Way2News Interactive Pvt. Ltd',
      place: '',
      period: 'May 2018 – Jun 2021',
      tagline: 'Consumer media, AdTech, MarTech and audience intelligence.',
      highlight:
        'Designed mobile-first content discovery and enterprise interfaces for customer segmentation, campaign management, audience intelligence and monetisation across five brands — Way2News, AudiencePlay, AudiencePrime, DigitalKites and TheTasteCompany.',
    },
    {
      title: 'UI/UX Designer',
      org: 'Nitya Software India Pvt. Ltd',
      place: '',
      period: 'Jan 2016 – May 2018',
      tagline: 'Recruitment technology and communication products.',
      highlight:
        'Designed recruitment technology, communication products and client-facing web applications including JobsNProfiles and VioTalk, collaborating with development teams through front-end implementation.',
    },
  ],

  /* The CV lists no credentials. Leave empty rather than invent any — the section
     only renders once the admin portal adds a real entry. */
  certifications: [],

  closing:
    'Ten years, eight industries, one method: start with the customer, build the case, and make the outcome visible. I would like to bring that same rigour to the work you do next.',

  contact: {
    displayName: 'Ajay Kumar Myakala',
    role: 'Product Strategy & Design Transformation Leader',
    email: 'ajaykumarmyakala@outlook.com',
    phone: '+91 7382328066',
    location: 'Bengaluru, India',
    linkedin: 'https://www.linkedin.com/in/ajaykumarmyakala',
  },
};

/** Runtime shape-check for a value that arrived from the API. */
export function isCvContent(value: unknown): value is CvContent {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<CvContent>;
  return (
    typeof v.heading === 'string' &&
    typeof v.intro === 'string' &&
    Array.isArray(v.highlights) &&
    typeof v.careerSummary === 'string' &&
    Array.isArray(v.experience) &&
    typeof v.closing === 'string' &&
    !!v.contact &&
    typeof v.contact === 'object'
  );
}

/** Published content is a partial override; anything missing keeps the default. */
export function mergeCv(published: unknown): CvContent {
  if (!isCvContent(published)) return cv;
  const p = published;
  return {
    ...cv,
    ...p,
    highlights: p.highlights.length ? p.highlights : cv.highlights,
    experience: p.experience.length ? p.experience : cv.experience,
    contact: { ...cv.contact, ...p.contact },
  };
}
