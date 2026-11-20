/**
 * The CV module's content model — the one shape the admin portal edits and the
 * site renders.
 *
 * `cv` below is the bundled default: it is written from the current CV
 * (public/assets/Ajay_Kumar_Myakala_CV.pdf, Lead Product Designer / Design
 * Leadership edition). The deployed site first asks the Worker for a published
 * override at /api/cv and falls back to this object when the API is unavailable
 * (local dev, preview, API outage).
 *
 * Nothing here may be invented: every string is either taken from the CV or is
 * a plain restatement of a CV line. The CV names no education institutions, so
 * `education` names none either.
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

export type CvEducation = {
  title: string;
  detail: string;
};

export type CvContent = {
  heading: string;
  role: string;
  intro: string;
  highlights: string[];
  careerSummary: string;
  experience: CvExperience[];
  education: CvEducation[];
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
  role: 'Lead Product Designer · UX Strategy · Enterprise Product Experience · Design Leadership',

  intro:
    'Lead Product Designer with 10+ years of IT experience shaping digital products and enterprise platforms across FinTech, healthcare, mortgage and lending, procurement, GovTech, media, AdTech, MarTech and recruitment. I translate complex business requirements into product strategy, intuitive workflows and scalable design systems, combining hands-on UX expertise with people leadership, executive stakeholder engagement and cross-functional delivery.',

  highlights: [
    'Product Strategy - product vision, UX strategy, discovery, roadmap alignment and prioritisation.',
    'Design Leadership - leadership and management of a 5-member design team, mentoring, ownership and design quality.',
    'Enterprise UX - complex workflows, dashboards, role-based experiences and platform modernisation.',
    'Design Systems - component architecture, reusable patterns, design standards and governance.',
    'AI & Emerging Technology - AI-enabled experience concepts, intelligent automation and responsible UX principles.',
    'Data & Research - user research, usability evaluation, behavioural insights and outcome measurement.',
    'Cross-functional Delivery - Product, Engineering, Architecture and QA collaboration; design specifications and implementation reviews.',
    'Stakeholder Management - client communication, executive presentations, strategic workshops and decision alignment.',
  ],

  careerSummary:
    'I connect user needs, technical feasibility and measurable business outcomes, translating complex business, user, operational and technical constraints into scalable product direction and enterprise experiences.\n\n'
    + 'The through-line is evidence. I frame the problem before anyone draws a screen, map the journey to find where time and decisions are lost, and keep business priorities, user needs and implementation reality aligned as the work moves.\n\n'
    + 'I have worked end to end - from product discovery and client conversations through to production-ready interfaces - leading a design team and partnering with Product, Engineering, Architecture and QA.',

  experience: [
    {
      title: 'Lead Product Design Consultant',
      org: 'HomeLoc Solutions LLP',
      place: 'Hyderabad, India',
      period: 'Apr 2024 – May 2026',
      tagline: 'US mortgage & lending platforms - origination to servicing.',
      highlight:
        'Lead product discovery and UX strategy across origination, underwriting, onboarding and servicing; an implemented underwriting workflow improvement reduced decision time by 37%. Mentors designers and has established reusable design frameworks.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Computech Corporation',
      place: '',
      period: 'Mar 2023 – Mar 2024',
      tagline: 'CashTrax and DiversityTrax enterprise procurement platforms.',
      highlight:
        'Led end-to-end UX strategy and product design across financial and supplier operations, simplifying analytics, reconciliation, onboarding, compliance and reporting; a team redesign was associated with a 20% improvement in operational reporting efficiency.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Visual IT Solutions Pvt. Ltd',
      place: '',
      period: 'Oct 2022 – Feb 2023',
      tagline: 'GovTech and citizen-service ecosystems, including ePragathi.',
      highlight:
        'Addressed complex citizen and administrative service journeys across ePragathi and government digital platforms, structuring information architecture, user flows and responsive interfaces to simplify access to public services.',
    },
    {
      title: 'Sr UX Designer',
      org: 'Gaian Solution',
      place: '',
      period: 'Oct 2021 – Aug 2022',
      tagline: 'Enterprise broadcasting, TV technology and media monetisation.',
      highlight:
        'Created a self-service low-code workflow builder to simplify automation configuration and reduce dependence on engineering support, and designed monetisation and performance analytics dashboards across media and ATSC 3.0 initiatives.',
    },
    {
      title: 'Sr UI/UX Designer',
      org: 'Way2Online Interactive Pvt. Ltd',
      place: '',
      period: 'May 2018 – Jun 2021',
      tagline: 'Consumer media, AdTech, MarTech and audience intelligence.',
      highlight:
        'Designed mobile-first content discovery for Way2News and audience intelligence and campaign management for AudiencePlay; the product improvements were associated with a 30% team-level increase in daily active users (DAU).',
    },
    {
      title: 'UI Designer',
      org: 'Nitya Software India Pvt. Ltd',
      place: '',
      period: 'Jan 2016 – May 2018',
      tagline: 'Recruitment technology and communication products.',
      highlight:
        'Addressed recruitment and communication product needs through end-to-end UX/UI design for JobsNProfiles and VioTalk, translating product requirements into user journeys, wireframes, information architecture and responsive interfaces.',
    },
  ],

  /* The CV names no institutions, so none are named here. */
  education: [
    { title: 'B.Com - Mass Communication and Public Relations', detail: 'Bachelor of Commerce · communication, media and public relations.' },
    { title: 'Diploma in Graphic and Web Design', detail: 'Graphic design and web design.' },
  ],

  certifications: [
    { title: 'Innovating with AI Design Using Autonomous Vehicles', issuer: 'LinkedIn Learning', issued: 'September 2026' },
  ],

  closing:
    'Ten years, thirteen industries, one method: start with the customer, build the case, and make the outcome visible. I would like to bring that same rigour - and a design team that ships - to the work you do next.',

  contact: {
    displayName: 'Ajay Kumar Myakala',
    role: 'Lead Product Designer · UX Strategy · Design Leadership',
    email: 'ajaykumarmyakala@outlook.com',
    phone: '+91 7382328066',
    location: 'Hyderabad, India · open to relocation',
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
    education: Array.isArray(p.education) && p.education.length ? p.education : cv.education,
    certifications: Array.isArray(p.certifications) ? p.certifications : cv.certifications,
    contact: { ...cv.contact, ...p.contact },
  };
}
