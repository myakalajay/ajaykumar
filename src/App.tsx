/**
 * @file App.tsx
 * @description Enterprise UX Portfolio - Ultimate Master Build (v50.0.0)
 * * ARCHITECTURAL FIXES APPLIED:
 * 1. Eradicated all duplicate component declarations (About, Projects, CaseStudyContent).
 * 2. Patched AdvancedProject interface to include missing 'hifiMocks' array.
 * 3. Fixed strict boolean type safety in mobile Navbar state controllers.
 */

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, useScroll, useMotionValue, useMotionTemplate, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Globe, Layers, CheckCircle2, Mail, Linkedin, 
  ArrowUpRight, X, Terminal, FileText, Layout, AlertCircle, 
  Network, Database, Target, Activity, 
  Code, TrendingUp, ArrowRight, ArrowLeft, Briefcase,
  Quote, ListChecks, ShieldCheck, Milestone, ExternalLink, AlertTriangle, Bug,
  Megaphone, ShoppingBag, Menu
} from "lucide-react";
import { 
  AreaChart, Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, ReferenceLine, ReferenceArea, BarChart, Bar, Cell
} from "recharts";

// ============================================================================
// CORE SYSTEM: STRICTLY TYPED UI COMPONENTS 
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', type = "button", ...props }, ref) => (
    <button 
      ref={ref}
      type={type} 
      className={`inline-flex items-center justify-center font-bold tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] disabled:pointer-events-none disabled:opacity-50 ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input 
      ref={ref}
      className={`w-full bg-transparent border-0 border-b border-white/20 h-10 focus:outline-none focus:ring-0 focus:border-[#bef264] px-0 text-sm text-white transition-colors placeholder-white/30 ${className}`} 
      {...props} 
    />
  )
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => (
    <textarea 
      ref={ref}
      className={`w-full bg-transparent border-0 border-b border-white/20 min-h-[100px] focus:outline-none focus:ring-0 focus:border-[#bef264] px-0 text-sm text-white resize-none transition-colors placeholder-white/30 ${className}`} 
      {...props} 
    />
  )
);
Textarea.displayName = "Textarea";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => (
  <AnimatePresence>
    {open && (
      <div className="relative z-[100]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[90]"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
        {children}
      </div>
    )}
  </AnimatePresence>
);

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    role="dialog"
    aria-modal="true"
    initial={{ opacity: 0, y: 30, scale: 0.98 }} 
    animate={{ opacity: 1, y: 0, scale: 1 }} 
    exit={{ opacity: 0, y: 20, scale: 0.98 }} 
    transition={{ duration: 0.5, ease: CUSTOM_EASE }} 
    className={`fixed inset-0 z-[100] ${className}`}
  >
    {children}
  </motion.div>
);

interface TabsContextType {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  tabGroupId: string;
}
const TabsContext = createContext<TabsContextType | null>(null);

const Tabs = ({ defaultValue, className = '', children }: { defaultValue: string; className?: string; children: React.ReactNode }) => {
  const [active, setActive] = useState(defaultValue);
  const tabGroupId = React.useId();

  return (
    <TabsContext.Provider value={{ active, setActive, tabGroupId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div role="tablist" className={className}>{children}</div>
);

const TabsTrigger = ({ value, className = '', children }: { value: string; className?: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs component");
  
  const { active, setActive, tabGroupId } = context;
  const isActive = active === value;

  return (
    <button 
      role="tab"
      aria-selected={isActive}
      className={`relative ${className} transition-all duration-300 focus-visible:outline-none`} 
      style={{ color: isActive ? '#ffffff' : THEME.muted }}
      onClick={() => setActive(value)}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId={`activeTabIndicator-${tabGroupId}`}
          className="absolute -bottom-[2px] left-0 right-0 h-[2px] z-10"
          style={{ backgroundColor: THEME.primary }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
};

const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs component");
  
  if (context.active !== value) return null;

  return (
    <motion.div 
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      transition={{ duration: 0.4, ease: CUSTOM_EASE }}
    >
      {children}
    </motion.div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[999] relative pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-3 border-b border-white/10 pb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-bold flex items-center justify-between gap-6" style={{ color: entry.color || THEME.primary }}>
              <span className="text-white/80 font-light">{entry.name}:</span> 
              <span>{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ============================================================================
// CORE SYSTEM: SCROLL UTILITY 
// ============================================================================
const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
  e.preventDefault();
  const element = document.querySelector(id);
  
  if (!element) return;

  const NAVBAR_HEIGHT = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - NAVBAR_HEIGHT;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  window.history.pushState(null, "", id);
};

// ============================================================================
// CORE SYSTEM: GLOBAL CONSTANTS & THEME
// ============================================================================
const CUSTOM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const THEME = {
  primary: "#bef264",   
  bgDark: "#000000",    
  card: "#0a0a0a",      
  muted: "#a3a3a3",     
  text: "#ffffff",      
  fonts: {
    display: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace"
  },
  layers: {
    base: 10,
    overlay: 90,
    modal: 100,
    navbar: 1000,
    preloader: 2000,
    cursor: 9999
  }
} as const;

// ============================================================================
// CORE SYSTEM: DATA MODEL (Advanced Modular Architecture)
// ============================================================================

// 1. STRICT UNION TYPES (Prevents silent typos in string assignments)
export type FeatureStatus = 'Delivered' | 'Optional' | 'Optional / Phase 2' | 'Rejected';
export type FlowActionType = 'entry' | 'process' | 'decision' | 'exit';
export type ProjectStatus = 'Live in Production' | 'Production Architecture' | 'Pre-Launch Architecture' | 'Archived';

// 2. ATOMIC INTERFACES (Extracted for component-level reusability)
export interface ProjectMeta { 
  role: string; 
  team: string; 
  duration: string; 
  platform: string; 
  link?: string; 
}

export interface MetricRow { 
  metric: string; 
  before: string; 
  after: string; 
  change: string; 
  positive: boolean; 
}

export interface TrendData { 
  month: string; 
  value: number; 
}

export interface OutcomeData { 
  output: string; 
  outcome: string; 
}

export interface PersonaData { 
  name: string; 
  role: string; 
  goals: string[]; 
  pains: { label: string; severity: number }[]; 
  avatar: string; 
  stats: { subject: string; A: number; fullMark: number }[]; 
}

export interface JourneyStep { 
  step: string; 
  emotion: number; 
  action: string; 
  pain: string; 
  system?: string; 
}

export interface ArchitectureNode { 
  name: string; 
  type: string; 
}

export interface StyleGuideSpecs { 
  typography: { primary: string; secondary: string; technical: string }; 
  description: string; 
  tokenCode?: string; 
}

export interface ProblemSolutionData { 
  problem: string; 
  solution: string; 
  friction: string; 
  flow: string; 
}

export interface CompetitorEntity { 
  name: string; 
  uxScore: number; 
  trustScore: number; 
  size: number; 
  fill: string; 
}

export interface CompetitorAnalysisData { 
  data: CompetitorEntity[]; 
  insights: string[]; 
}

export interface ErrorAuditData { 
  data: { phase: string; bugsFound: number; bugsResolved: number }[]; 
  insight: string; 
}

export interface SystemArchitectureData { 
  client: ArchitectureNode[]; 
  gateway: ArchitectureNode[]; 
  backend: ArchitectureNode[]; 
}

export interface FeatureMatrixRow { 
  feature: string; 
  requestedBy: string; 
  status: FeatureStatus; 
  rationale: string; 
}

export interface AccessibilityStandard { 
  standard: string; 
  implementation: string; 
}

export interface GraveyardTomb { 
  title: string; 
  hypothesis: string; 
  reasonForFailure: string; 
}

export interface TestimonialData { 
  quote: string; 
  author: string; 
  role: string; 
}

export interface RoadmapPhase { 
  phase: string; 
  title: string; 
  desc: string; 
  current: boolean; 
}

export interface UserFlowStep { 
  step: string; 
  action: string; 
  type: FlowActionType; 
}

export interface ConclusionData { 
  summary: string; 
  nextSteps: string[]; 
  lessons: string[]; 
}

// 3. MASTER INTERFACE
export interface AdvancedProject {
  // Core Identifiers
  id: string; 
  title: string; 
  tag: string; 
  role: string; 
  client: string; 
  year: string; 
  image: string; 
  status: ProjectStatus; 
  
  // Executive Overview
  heroTitle: string; 
  heroSubtitle: string;
  meta: ProjectMeta; 
  outcomeVsOutput: OutcomeData; 
  executiveSummary: string;
  
  // Quantitative Metrics
  impactTrend: TrendData[]; 
  metricsTable: MetricRow[];
  
  // Qualitative Strategy
  problemSolution: ProblemSolutionData; 
  competitorAnalysis?: CompetitorAnalysisData; 
  personas?: PersonaData[]; 
  journeyMap?: { data: JourneyStep[] };
  
  // Quality & Engineering
  errorAudit?: ErrorAuditData; 
  systemArchitecture?: SystemArchitectureData; 
  featureMatrix?: FeatureMatrixRow[]; 
  accessibility?: AccessibilityStandard[]; 
  graveyard?: GraveyardTomb[]; 
  
  // Validation & Handoff
  testimonials?: TestimonialData[]; 
  roadmap?: RoadmapPhase[]; 
  styleGuide: StyleGuideSpecs; 
  userFlow: UserFlowStep[]; 
  
  // Media Assets
  hasRelatedEcosystems?: boolean; 
  desktopMockups?: string[]; 
  mobileMocks?: string[]; 
  hifiMocks?: string[];
  
  // Wrap Up
  conclusion: ConclusionData; 
}

// ============================================================================
// COMPONENT: INTERACTIVE CURSOR
// ============================================================================
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 28, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => { cursorX.set(e.clientX - 16); cursorY.set(e.clientY - 16); };
    const handleInteractability = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button') || window.getComputedStyle(target).cursor === 'pointer';
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleInteractability);
    return () => { window.removeEventListener("mousemove", moveCursor); window.removeEventListener("mouseover", handleInteractability); };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none hidden lg:flex items-center justify-center backdrop-blur-[2px]"
      style={{ x: cursorXSpring, y: cursorYSpring, border: `2px solid ${isHovering ? 'transparent' : THEME.primary}`, backgroundColor: isHovering ? `${THEME.primary}20` : 'transparent', zIndex: THEME.layers.cursor }}
      animate={{ scale: isHovering ? 1.5 : 1 }}
      transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
    >
      <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: THEME.primary }} animate={{ opacity: isHovering ? 0 : 1, scale: isHovering ? 0 : 1 }} transition={{ duration: 0.2 }} />
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: SYSTEM PRELOADER
// ============================================================================
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING KERNEL...");
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const bootSequence = ["INITIALIZING KERNEL...", "MOUNTING VIRTUAL DOM...", "LOADING DESIGN TOKENS...", "COMPILING ASSETS...", "SYSTEM READY."];
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 2;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      if (currentProgress < 25) setLoadingText(bootSequence[0]);
      else if (currentProgress < 50) setLoadingText(bootSequence[1]);
      else if (currentProgress < 75) setLoadingText(bootSequence[2]);
      else if (currentProgress < 100) setLoadingText(bootSequence[3]);
      else setLoadingText(bootSequence[4]);

      if (currentProgress === 100) {
        clearInterval(timer);
        setTimeout(() => { onCompleteRef.current(); }, 500);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div key="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} transition={{ duration: 0.8, ease: CUSTOM_EASE }} className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#000000]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: THEME.primary }} />
      </div>
      <div className="text-center space-y-8 relative z-10 w-full max-w-sm px-6">
        <div className="flex justify-between items-end border-b border-white/20 pb-2">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: THEME.primary, fontFamily: THEME.fonts.mono }}>System Boot Sequence</p>
          <p className="text-[8px] uppercase tracking-widest text-white/50" style={{ fontFamily: THEME.fonts.mono }}>v50.0.0</p>
        </div>
        <div className="relative text-left">
          <p className="text-7xl md:text-8xl font-bold text-white tracking-tighter" style={{ fontFamily: THEME.fonts.mono }}>
            {progress.toString().padStart(3, '0')}<span className="text-3xl text-white/30 absolute bottom-3 ml-2">%</span>
          </p>
        </div>
        <div className="space-y-3">
          <div className="w-full h-[2px] bg-white/10 overflow-hidden relative" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <motion.div className="absolute top-0 left-0 bottom-0 shadow-[0_0_15px_rgba(190,242,100,0.8)]" style={{ backgroundColor: THEME.primary }} initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.1 }} />
          </div>
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-mono text-white/50 h-4">
            <p>{loadingText}</p>
            <p className={progress < 100 ? "animate-pulse" : ""}>{progress < 100 ? "LOADING..." : "DONE"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: NAVIGATION (Advanced Telemetry & System Clock)
// ============================================================================
const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  // Live System Clock calculation (60fps cycle avoided by 1000ms interval for performance)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const offset = -now.getTimezoneOffset() / 60;
      const offsetString = `UTC${offset >= 0 ? '+' : ''}${offset}`;
      setTime(`${timeString} ${offsetString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Experience", "Case Studies", "Expertise", "Philosophy"];

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 origin-left z-[1101]" style={{ scaleX, backgroundColor: THEME.primary, boxShadow: `0 0 10px ${THEME.primary}` }} />
      <nav className={`fixed top-1 left-0 right-0 z-[1000] transition-all duration-500 border-b ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-24 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            {/* ARCHITECTURAL LOGO LOCKUP */}
            <motion.button 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: CUSTOM_EASE }} 
              className="flex items-center gap-4 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-sm text-left" 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              aria-label="Scroll to Top"
            >
              <div className="w-10 h-10 flex items-center justify-center font-black text-black rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(190,242,100,0.4)]" style={{ backgroundColor: THEME.primary, fontFamily: THEME.fonts.mono }}>
                {'{A}'}
              </div>
              <div className="hidden sm:flex flex-col justify-center text-left">
                <span className="text-[13px] font-bold tracking-[0.25em] uppercase text-white leading-none group-hover:text-[#bef264] transition-colors" style={{ fontFamily: THEME.fonts.display }}>
                  AJAY<span style={{ color: THEME.primary }}>_</span>KUMAR
                </span>
                <span className="text-[8px] tracking-[0.25em] uppercase text-white/50 font-mono mt-1.5 group-hover:text-white/80 transition-colors">
                  SYS.ARCHITECT
                </span>
              </div>
            </motion.button>
         </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((item, i) => {
              const hrefId = item === "Case Studies" ? "#work" : `#${item.toLowerCase()}`;
              return (
                <motion.a 
                  key={item} 
                  href={hrefId} 
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToSection(e, hrefId)} 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1, duration: 0.8, ease: CUSTOM_EASE }} 
                  className="text-[10px] uppercase tracking-[0.2em] font-bold relative font-sans after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] hover:after:w-full after:transition-all after:duration-300 after:bg-[#bef264] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-sm py-1" 
                  style={{ color: THEME.muted }}
                >
                  <span className="hover:text-white transition-colors">{item}</span>
                </motion.a>
              );
            })}
          </div>

          {/* Desktop Controls */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: CUSTOM_EASE }} className="hidden lg:flex items-center gap-6">
            <a href="/Ajay_Kumar_Myakala_Product_Designer.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors hover:text-[#bef264] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-sm py-1" style={{ color: THEME.muted, fontFamily: THEME.fonts.body }}>
              <FileText className="w-4 h-4" /> Resumé
            </a>
            <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => scrollToSection(e, "#contact")} className="rounded-none px-6 h-10 text-[10px] uppercase text-black border-none hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(190,242,100,0.4)] relative overflow-hidden group" style={{ backgroundColor: THEME.primary, fontFamily: THEME.fonts.body }}>
              <span className="relative z-10 flex items-center gap-2">Initialize Comm <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Button>
          </motion.div>

          {/* Mobile Menu Trigger */}
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-sm border border-white/10 bg-white/5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Mobile Menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: CUSTOM_EASE }} className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-3xl border-b border-white/10">
              <div className="flex flex-col px-6 py-8 gap-6">
                {navLinks.map((item) => {
                  const hrefId = item === "Case Studies" ? "#work" : `#${item.toLowerCase()}`;
                  return (
                    <a 
                      key={item} 
                      href={hrefId} 
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { scrollToSection(e, hrefId); setMobileMenuOpen(false); }} 
                      className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 hover:text-[#bef264] transition-colors border-b border-white/5 pb-4"
                    >
                      {item}
                    </a>
                  );
                })}
                <div className="flex flex-col gap-6 pt-4">
                  <a href="/Ajay_Kumar_Myakala_Product_Designer.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-white/70 hover:text-[#bef264] transition-colors">
                    <FileText className="w-4 h-4" /> Download Resumé
                  </a>
                  <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { scrollToSection(e, "#contact"); setMobileMenuOpen(false); }} className="w-full h-12 text-[10px] uppercase text-black bg-[#bef264]">
                    Initialize Comm
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

// ============================================================================
// COMPONENT: HERO (Spatial Parallax & Viewport Matrix)
// ============================================================================
const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Mouse Tracking Physics for Spatial Tilt & Spotlight
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 40, stiffness: 200, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax calculations (subtle 3D tilt mapped to cursor)
  const rotateX = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [5, -5]);
  const rotateY = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={targetRef} id="home" className="relative min-h-[100svh] w-full flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 bg-[#000000] perspective-[2000px]">
      
      {/* 1. IMMERSIVE ARCHITECTURAL BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_100%)] opacity-90" />
        
        {/* Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Active System CRT Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] z-10 mix-blend-overlay" />

        {/* Interactive Mouse Spotlight illuminating an accented grid */}
        <motion.div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, ${THEME.primary}15, transparent 80%)`
          }}
        />
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: useMotionTemplate`radial-gradient(300px circle at ${smoothX}px ${smoothY}px, ${THEME.primary}40, transparent 80%)`,
            backgroundImage: `radial-gradient(circle at center, ${THEME.primary} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />
      </div>

      <div className="w-full mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center mt-10">
        
        {/* Top HUD Metrics - UPDATED FOR IMMEDIATE AVAILABILITY */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8 md:mb-12">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="flex items-center gap-3 px-5 py-2.5 border border-[#bef264]/60 rounded-full bg-[#bef264]/10 backdrop-blur-md shadow-[0_0_20px_rgba(190,242,100,0.2)]">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: THEME.primary, boxShadow: `0 0 12px ${THEME.primary}` }} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ fontFamily: THEME.fonts.mono, color: THEME.primary }}>Status: Available // 10 Yrs Exp</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="hidden sm:flex items-center gap-2 px-5 py-2.5 border border-white/20 bg-black/80 backdrop-blur-md rounded-full shadow-2xl relative overflow-hidden group">
            <Terminal className="w-3.5 h-3.5 text-white/70 group-hover:text-[#bef264] transition-colors" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 group-hover:text-white transition-colors" style={{ fontFamily: THEME.fonts.mono }}>Immediate Deployment Ready</span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </motion.div>
        </div>

        {/* --- 3D VIEWPORT-SCALED TYPOGRAPHY --- */}
        <motion.div 
          style={{ rotateX, rotateY }} 
          className="w-full flex flex-col items-center justify-center relative transform-style-3d"
        >
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-white/40 font-bold block mb-4 md:mb-6 translate-z-[20px]" style={{ fontFamily: THEME.fonts.mono }}>
            [ Senior Product Designer ]
          </motion.span>
          
          <h1 className="flex flex-col items-center w-full text-center leading-[0.85] tracking-tighter uppercase font-bold select-none" style={{ fontFamily: THEME.fonts.display }}>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: CUSTOM_EASE }} className="text-white drop-shadow-2xl text-[clamp(3.5rem,11vw,11rem)] translate-z-[40px]">
              TECHNICAL
            </motion.span>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: CUSTOM_EASE }} className="relative w-full flex justify-center translate-z-[60px]">
              <span className="text-transparent text-[clamp(3.5rem,12vw,12rem)] relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>UX ARCHITECTURE</span>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 z-0 hidden md:block mix-blend-overlay" />
            </motion.div>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: CUSTOM_EASE }} className="text-transparent bg-clip-text relative mt-2 md:mt-4 text-[clamp(3.5rem,11vw,11rem)] translate-z-[80px]" style={{ backgroundImage: `linear-gradient(to right, #ffffff, ${THEME.primary}, #ffffff)`, backgroundSize: '200% auto', animation: 'shine 6s linear infinite' }}>
              & ECOSYSTEMS.
            </motion.span>
            <style>{`@keyframes shine { to { background-position: 200% center; } }`}</style>
          </h1>
        </motion.div>
        
        {/* Executive Value Proposition */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="max-w-2xl mx-auto space-y-10 mt-12 md:mt-16 relative z-20">
          <p className="text-base md:text-xl font-light leading-relaxed text-white/70 text-balance text-center" style={{ fontFamily: THEME.fonts.body }}>
            Translating brutal operational complexity into high-performance SaaS interfaces. I engineer <strong className="text-white font-medium">React-ready design systems</strong> that eliminate handoff friction and drive business ROI.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {[ { label: "B2B SaaS Strategy", icon: <Database className="w-3 h-3" /> }, { label: "Design Tokenization", icon: <Code className="w-3 h-3" /> }, { label: "WCAG 2.2 Compliant", icon: <ShieldCheck className="w-3 h-3" /> } ].map((pill, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2.5 text-[9px] uppercase tracking-widest font-bold border border-white/10 rounded-sm text-white/60 bg-black/80 backdrop-blur-md transition-colors hover:border-[#bef264]/50 hover:text-[#bef264] cursor-default shadow-xl" style={{ fontFamily: THEME.fonts.mono }}>
                {pill.icon} {pill.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dual-Action Command Nodes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full relative z-30 px-6">
          <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => scrollToSection(e, "#work")} className="w-full sm:w-auto rounded-none h-14 px-10 text-black hover:bg-white text-[10px] uppercase border-none hover:scale-[1.02] shadow-[0_0_40px_rgba(190,242,100,0.3)] transition-all" style={{ backgroundColor: THEME.primary, fontFamily: THEME.fonts.mono }}>
            Examine Case Studies
          </Button>
          <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => scrollToSection(e, "#contact")} className="group flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-6 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-[#bef264] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-sm" style={{ fontFamily: THEME.fonts.mono }}>
            <Terminal className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" /> Initialize Comm <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
      
      {/* Scroll HUD */}
      <motion.div style={{ opacity, y }} className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
        <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/30 hidden md:block" style={{ fontFamily: THEME.fonts.mono }}>System Traverse</span>
        <div className="w-[1px] h-12 md:h-16 bg-white/10 relative overflow-hidden">
          <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 h-1/2" style={{ backgroundColor: THEME.primary }} />
        </div>
      </motion.div>
    </section>
  );
};

// ============================================================================
// COMPONENT: HORIZONTAL TIMELINE
// ============================================================================
const Experience = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollTimeline = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 432 : 324;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const experiences = [
    { role: "Lead UX Consultant", context: "B2B2C Mortgage Technology", company: "Homeloc Solutions LLC", dates: "Mar 2024 - Mar 2026", duration: "2 Yrs", desc: "Defined end-to-end UX strategy for a complex digital mortgage platform. Engineered a progressive disclosure pipeline grounded in SOC 2 compliance, reducing projected borrower drop-off by 18%." },
    { role: "Senior UI/UX Designer", context: "FinTech & Enterprise Analytics", company: "Computech Business Solutions", dates: "Mar 2023 - Mar 2024", duration: "1 Yr 1 Mo", desc: "Architected DiversityTrax, an enterprise ESG platform. Unified fragmented legacy DBs into a single React SPA, driving a 20% efficiency lift in supplier diversity reporting." },
    { role: "Senior UI/UX Designer", context: "Public Financial & Governance", company: "Visual IT Solutions", dates: "Sep 2022 - Mar 2023", duration: "7 Mos", desc: "Scaled public governance platforms. Developed high-traffic, WCAG-accessible UX patterns for complex administrative workflows, mitigating compliance risks." },
    { role: "Senior UI/UX Designer", context: "Workflow Automation Platforms", company: "Gaian Solutions", dates: "Oct 2021 - Aug 2022", duration: "11 Mos", desc: "Architected self-serve, low-code workflow builders and monetization analytics dashboards, eliminating enterprise reliance on engineering support." },
    { role: "UI/UX Designer", context: "B2C Consumer Digital Platform", company: "Way2news Interactive", dates: "May 2018 - Jun 2021", duration: "3 Yrs 2 Mos", desc: "Drove 30% DAU growth via vernacular content discovery overhauls. Designed native ad features that scaled revenue without cannibalizing retention." },
    { role: "UI/UX Designer", context: "Recruitment & Talent System", company: "Nitya Software Solutions", dates: "Jan 2016 - May 2018", duration: "2 Yrs 5 Mos", desc: "Optimized recruiter workflows by architecting a scalable job portal. Decreased user friction by entirely rebuilding search, filtering, and profile management." }
  ];

  return (
    <section id="experience" className="py-24 md:py-32 scroll-mt-20 relative bg-[#050505] border-b border-white/5 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest block mb-4 font-bold flex items-center gap-2" style={{ color: THEME.primary }}>
              <Milestone className="w-4 h-4"/> 10-Year Trajectory
            </span>
            <h2 className="text-[clamp(3rem,6vw,5rem)] leading-[0.85] tracking-tighter text-white font-light" style={{ fontFamily: THEME.fonts.display }}>
              CAREER <br /><span className="font-bold" style={{ color: THEME.muted }}>TIMELINE</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-4 items-center">
            <button onClick={() => scrollTimeline("left")} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black hover:border-[#bef264] hover:bg-[#bef264]/10 transition-all text-white hover:text-[#bef264] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bef264] shadow-lg" aria-label="Scroll Left">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollTimeline("right")} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black hover:border-[#bef264] hover:bg-[#bef264]/10 transition-all text-white hover:text-[#bef264] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bef264] shadow-lg" aria-label="Scroll Right">
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none hidden md:block" />

      <div className="w-full overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-12 px-6 md:px-12 xl:px-24 relative z-0" ref={scrollRef}>
        <div className="flex gap-6 md:gap-8 w-max min-w-full items-stretch pt-4">
          {experiences.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-[300px] md:w-[400px] snap-center flex-shrink-0 bg-[#0a0a0a] border border-white/10 rounded-xl p-8 relative group hover:border-[#bef264]/50 transition-colors duration-300 flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 left-8 w-12 h-[2px] bg-[#bef264] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: THEME.primary }}>{exp.dates}</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold mt-1 text-white/40">{exp.duration}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white/20 font-mono">0{i+1}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">{exp.role}</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-5">{exp.context}</p>
                <h4 className="text-sm font-bold mb-6 text-white/70 flex items-center gap-2"><Briefcase className="w-4 h-4 opacity-50" /> {exp.company}</h4>
                <p className="text-sm leading-relaxed text-white/60 font-light group-hover:text-white/80 transition-colors">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: CASE STUDY MODAL ENGINE 
// ============================================================================

const CaseStudyContent = ({ project }: { project: AdvancedProject }) => {
  return (
    <article className="pb-24 text-white overflow-x-hidden bg-[#000000] selection:bg-[#bef264] selection:text-black" style={{ fontFamily: THEME.fonts.body }}>
      
      <div className="px-6 pt-12 max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-6 border-b border-white/10 pb-8 relative z-20">
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-[10px] uppercase tracking-widest font-mono text-white/50">
          <p className="flex flex-col gap-2"><strong className="text-white/30">Role Architecture</strong> <span className="text-white font-bold">{project.meta.role}</span></p>
          <p className="flex flex-col gap-2"><strong className="text-white/30">Squad Matrix</strong> <span className="text-white font-bold">{project.meta.team}</span></p>
          <p className="flex flex-col gap-2"><strong className="text-white/30">Lifecycle</strong> <span className="text-white font-bold">{project.meta.duration}</span></p>
          <p className="flex flex-col gap-2"><strong className="text-white/30">Target Environment</strong> <span className="text-white font-bold">{project.meta.platform}</span></p>
        </div>
      </div>

      <section className="px-6 py-16 max-w-[1400px] mx-auto space-y-16 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#bef264]/20 bg-[#bef264]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#bef264] font-mono">Executive Summary</span>
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight leading-[0.9]" style={{ fontFamily: THEME.fonts.display }}>
              {project.heroTitle} <br/><span className="font-light text-white/40">{project.heroSubtitle}</span>
            </h1>
            <p className="text-base md:text-lg font-light leading-relaxed text-white/70 border-l-2 border-[#bef264]/50 pl-6 mt-8 max-w-3xl">{project.executiveSummary}</p>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 pt-8">
               <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 shadow-lg">
                  <span className="text-[9px] uppercase tracking-widest font-bold block mb-2 text-white/40 font-mono">Shipped Output</span>
                  <p className="text-sm font-medium text-white/90 leading-relaxed">{project.outcomeVsOutput.output}</p>
               </div>
               <div className="bg-gradient-to-br from-[#bef264]/10 to-transparent p-6 rounded-xl border border-[#bef264]/30 shadow-[0_0_30px_rgba(190,242,100,0.05)]">
                  <span className="text-[9px] uppercase tracking-widest font-bold block mb-2 text-[#bef264] font-mono">Measurable ROI</span>
                  <p className="text-sm font-bold text-white leading-relaxed">{project.outcomeVsOutput.outcome}</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#050505] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000 mt-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={project.impactTrend}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={THEME.primary} stopOpacity={0.6}/>
                      <stop offset="100%" stopColor={THEME.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={THEME.primary} strokeWidth={2} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">System Telemetry</h3>
                <TrendingUp className="w-4 h-4 text-[#bef264]" />
              </div>
              <div className="space-y-4">
                {project.metricsTable.map((row, i) => (
                  <div key={i} className="bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/5 space-y-3 hover:border-white/20 transition-colors shadow-lg">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest font-mono">
                      <span className="text-white/60">{row.metric}</span>
                      <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10" style={{ color: row.positive ? THEME.primary : '#ffffff' }}>{row.change}</span>
                    </div>
                    <div className="grid grid-cols-[40px_1fr_40px] items-center gap-4">
                      <div className="text-right text-[10px] text-white/30 font-mono">{row.before}</div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden flex w-full relative">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }} className="absolute top-0 left-0 h-full rounded-full" style={{ backgroundColor: row.positive ? THEME.primary : '#ffffff' }} />
                      </div>
                      <div className="text-[10px] font-bold text-white font-mono">{row.after}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Architectural Refactoring</h2>
          <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Legacy Constraints vs. Modernized Logic</p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-[#050505] p-8 md:p-12 flex flex-col relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors pointer-events-none" />
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-red-400/70 font-mono">Legacy State</span>
                <h3 className="font-bold text-xl text-white">The Constraint</h3>
              </div>
            </div>
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-light mb-10">{project.problemSolution.problem}</p>
            <div className="p-5 border border-red-500/20 bg-red-500/5 rounded-xl mt-auto">
              <span className="text-[9px] uppercase tracking-widest font-bold text-red-400 block mb-2 font-mono">Identified Friction Node</span>
              <p className="text-xs text-white/90 leading-relaxed">{project.problemSolution.friction}</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-8 md:p-12 flex flex-col relative group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#bef264]/5 rounded-full blur-3xl group-hover:bg-[#bef264]/10 transition-colors pointer-events-none" />
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-12 h-12 rounded-xl bg-[#bef264]/10 border border-[#bef264]/30 flex items-center justify-center shadow-[0_0_15px_rgba(190,242,100,0.2)]">
                <CheckCircle2 className="w-6 h-6 text-[#bef264]" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#bef264] font-mono">Target State</span>
                <h3 className="font-bold text-xl text-white">The Engineering Solution</h3>
              </div>
            </div>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-light mb-10 relative z-10">{project.problemSolution.solution}</p>
            <div className="p-5 border border-[#bef264]/30 bg-[#bef264]/5 rounded-xl mt-auto relative z-10 shadow-lg">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#bef264] block mb-2 font-mono">Optimized Logic Flow</span>
              <p className="text-xs text-white/90 font-mono leading-relaxed">{project.problemSolution.flow}</p>
            </div>
          </div>
        </div>
      </section>

      {project.systemArchitecture && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>End-to-End System Architecture</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Data Conduits, Latency Handling & Security Boundaries</p>
          </div>

          <div className="w-full bg-[#050505] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-12 overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] flex items-center justify-between">
              
              <div className="relative z-10 w-[280px] bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shrink-0 shadow-lg">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-white/50" />
                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-white">Client UI</h3>
                  </div>
                  <span className="text-[8px] bg-white/10 text-white/60 px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono border border-white/5">Optimistic UI</span>
                </div>
                <div className="space-y-3">
                  {project.systemArchitecture.client.map((node, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-black border border-white/5 rounded-md text-[9px] hover:border-white/20 transition-colors">
                      <span className="font-mono text-white/80">{node.name}</span>
                      <span className="uppercase font-bold text-[#bef264]/70">{node.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 h-[2px] border-t-2 border-dashed border-[#bef264]/40 mx-4 relative flex items-center">
                <motion.div className="absolute w-2 h-2 rounded-full bg-[#bef264] shadow-[0_0_10px_#bef264] -mt-[1px]" animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
              </div>

              <div className="relative z-10 w-[320px] bg-black border-2 rounded-xl p-8 shadow-[0_0_40px_rgba(190,242,100,0.1)] shrink-0" style={{ borderColor: `${THEME.primary}40` }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 py-1 border rounded-full text-[8px] uppercase tracking-widest font-bold shadow-lg" style={{ color: THEME.primary, borderColor: `${THEME.primary}50` }}>Secure Boundary</div>
                <div className="flex items-center justify-center flex-col gap-3 mb-6">
                  <Network className="w-8 h-8" style={{ color: THEME.primary }} />
                  <h3 className="font-bold uppercase tracking-widest text-[10px] text-center text-white">API Gateway</h3>
                </div>
                <div className="space-y-3">
                  {project.systemArchitecture.gateway.map((node, i) => (
                     <div key={i} className="flex justify-between items-center px-4 py-2 bg-[#111] border border-white/10 rounded-md text-[9px] shadow-sm hover:bg-[#1a1a1a] transition-colors" style={{ borderLeftColor: THEME.primary, borderLeftWidth: '3px' }}>
                     <span className="font-mono text-white/90">{node.name}</span>
                     <span className="uppercase font-bold text-white/40">{node.type}</span>
                   </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 h-[2px] border-t-2 border-dashed border-[#bef264]/40 mx-4 relative flex items-center">
                <motion.div className="absolute w-2 h-2 rounded-full bg-[#bef264] shadow-[0_0_10px_#bef264] -mt-[1px]" animate={{ left: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }} />
              </div>

              <div className="relative z-10 w-[280px] bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shrink-0 shadow-lg">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-white/50" />
                    <h3 className="font-bold uppercase tracking-widest text-[10px] text-white">Core Systems</h3>
                  </div>
                  <span className="text-[8px] bg-white/10 text-white/60 px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono border border-white/5">State Cache</span>
                </div>
                <div className="space-y-3">
                  {project.systemArchitecture.backend.map((node, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-black border border-white/5 rounded-md text-[9px] hover:border-white/20 transition-colors">
                      <span className="font-mono text-white/80">{node.name}</span>
                      <span className="uppercase font-bold text-[#bef264]/70">{node.type}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {project.competitorAnalysis && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Market Threat & Positioning</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>UX Maturity vs. User Trust Index (1-10 Scale)</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-center bg-[#050505] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
            <div className="h-[400px] w-full relative bg-black rounded-xl border border-white/5 p-4">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none rounded-xl" />
              
              <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-bold tracking-widest uppercase text-white/30 font-mono">System Trust</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest uppercase text-white/30 font-mono">UX Maturity</span>
              
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="uxScore" hide domain={[0, 10]} />
                  <YAxis type="number" dataKey="trustScore" hide domain={[0, 10]} />
                  <ReferenceArea x1={5} x2={10} y1={5} y2={10} fill={THEME.primary} fillOpacity={0.03} />
                  <ReferenceArea x1={0} x2={5} y1={0} y2={5} fill="#ff0000" fillOpacity={0.02} />
                  <ReferenceLine x={5} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
                  <ReferenceLine y={5} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} />
                  <Scatter name="Market Entities" data={project.competitorAnalysis.data}>
                    {project.competitorAnalysis.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <span className="absolute top-6 right-6 text-[9px] font-bold tracking-widest uppercase bg-[#bef264]/10 text-[#bef264] px-2 py-1 rounded border border-[#bef264]/20 font-mono">Target Quadrant</span>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-bold text-sm border-b border-white/10 pb-4 text-white uppercase tracking-widest font-mono">Strategic Insights</h3>
              <ul className="space-y-4">
                {project.competitorAnalysis.insights.map((insight, i) => (
                  <li key={i} className="text-xs leading-relaxed text-white/60 flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                    <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-[#bef264]" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {project.personas && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Target Psychographics</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Data-Driven Persona Modeling</p>
          </div>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8">
            {project.personas.map((persona, i) => (
              <motion.div key={persona.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row group">
                <div className="p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col md:w-[280px] shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <img src={persona.avatar} alt={persona.name} className="w-16 h-16 rounded-full object-cover border-2 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500 mb-6 relative z-10" style={{ borderColor: THEME.primary }} crossOrigin="anonymous" loading="lazy" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-white mb-1" style={{ fontFamily: THEME.fonts.display }}>{persona.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest font-bold font-mono block mb-8" style={{ color: THEME.primary }}>{persona.role}</span>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-3 font-mono text-white/40">Core Objective Functions</p>
                    <ul className="space-y-3">
                      {persona.goals.map((g, idx) => (
                        <li key={idx} className="text-xs leading-relaxed text-white/70 flex items-start gap-2">
                          <span className="text-[#bef264] font-mono shrink-0">{">"}</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between gap-8 bg-[#0a0a0a]">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-4 font-mono text-white/50">Friction Severity Index</p>
                    <div className="h-[100px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={persona.pains} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide domain={[0, 10]} />
                          <YAxis dataKey="label" type="category" width={100} tick={{ fontSize: 9, fill: '#a3a3a3', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                          <Bar dataKey="severity" radius={[0, 4, 4, 0]} barSize={16}>
                            {persona.pains.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.severity > 7 ? '#ff4444' : THEME.primary} fillOpacity={entry.severity > 7 ? 0.8 : 0.6} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-white/30 mb-2 font-mono">Behavioral Mapping</p>
                    <div className="w-full h-[140px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={persona.stats}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'monospace' }} />
                          <Radar name={persona.name} dataKey="A" stroke={THEME.primary} strokeWidth={2} fill={THEME.primary} fillOpacity={0.2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {project.journeyMap && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Service Blueprint & Journey Logic</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Emotion, Action, and System Integration</p>
          </div>

          <div className="relative shadow-2xl rounded-2xl">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none md:hidden rounded-r-2xl" />
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 pt-12 overflow-x-auto custom-scrollbar relative z-0">
               <div className="min-w-[900px] h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={project.journeyMap.data} margin={{ top: 10, right: 40, left: 40, bottom: 0 }}>
                      <defs>
                        <linearGradient id="journeyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={THEME.primary} stopOpacity={0.5}/>
                          <stop offset="100%" stopColor={THEME.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <YAxis domain={[-10, 10]} hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="emotion" stroke={THEME.primary} strokeWidth={3} fill="url(#journeyGradient)" activeDot={{ r: 8, fill: '#000', stroke: THEME.primary, strokeWidth: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="min-w-[900px] mt-6 border-t border-white/10">
                  <div className="flex group/row hover:bg-white/[0.02] transition-colors">
                    <div className="w-32 py-4 border-r border-white/10 flex items-center px-4">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 font-mono">User Action</span>
                    </div>
                    <div className="flex-1 flex justify-between px-6 py-4">
                      {project.journeyMap.data.map((step, idx) => (
                        <div key={idx} className="flex-1 text-center px-2">
                          <p className="text-[11px] font-bold text-white leading-tight">{step.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {project.journeyMap.data[0].system && (
                    <div className="flex border-t border-white/5 bg-white/[0.01] group/row hover:bg-white/[0.03] transition-colors">
                      <div className="w-32 py-4 border-r border-white/10 flex items-center px-4">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 font-mono">System Node</span>
                      </div>
                      <div className="flex-1 flex justify-between px-6 py-4">
                        {project.journeyMap.data.map((step, idx) => (
                          <div key={idx} className="flex-1 text-center px-2">
                            <p className="text-[9px] font-mono text-[#bef264]/70 bg-[#bef264]/10 py-1 px-2 rounded inline-block border border-[#bef264]/20">{step.system}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex border-t border-white/5 group/row hover:bg-white/[0.02] transition-colors">
                    <div className="w-32 py-4 border-r border-white/10 flex items-center px-4">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50 font-mono">Friction</span>
                    </div>
                    <div className="flex-1 flex justify-between px-6 py-4">
                      {project.journeyMap.data.map((step, idx) => (
                        <div key={idx} className="flex-1 text-center px-2 flex justify-center items-start">
                          <p className="text-[9px] leading-relaxed text-white/60 bg-black border border-white/10 p-2 rounded-md shadow-sm max-w-[120px] w-full">{step.pain}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. INCIDENT POST-MORTEM (Root Cause Analysis & Strategic Pivots) */}
      {project.graveyard && project.graveyard.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold uppercase tracking-tighter" style={{ fontFamily: THEME.fonts.display }}>
              Empirical Validation
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: THEME.muted }}>
              Validating Edge Cases & UX Adaptation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {project.graveyard.map((tomb, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: CUSTOM_EASE }}
                className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative group hover:border-red-500/30 transition-all duration-500"
              >
                {/* Visual Status Header */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-900/40 via-red-500/40 to-red-900/40 group-hover:via-red-500 transition-all duration-500" />
                
                <div className="p-8 md:p-10 relative flex-1 flex flex-col">
                  {/* Subtle Red HUD Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/[0.02] rounded-full blur-[100px] pointer-events-none group-hover:bg-red-500/[0.05] transition-colors" />
                  
                  <div className="flex items-start justify-between mb-10 relative z-10 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:border-red-500/40 transition-colors">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white tracking-tight mb-1">{tomb.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[9px] uppercase tracking-widest text-red-400 font-bold font-mono">Archive Status: Deprecated</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/10 group-hover:text-white/30 transition-colors">RCA_LOG_0{i+1}</span>
                  </div>

                  <div className="space-y-0 relative z-10 flex-1 flex flex-col">
                    {/* Logic Node 1 */}
                    <div className="relative pl-8 border-l border-white/10 pb-10">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-3 font-mono">01. Original Hypothesis</span>
                      <p className="text-sm text-white/70 leading-relaxed font-light">
                        {tomb.hypothesis}
                      </p>
                    </div>
                    
                    {/* Logic Node 2 */}
                    <div className="relative pl-8 border-l border-transparent">
                       <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-red-500/40 to-transparent" />
                       <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                       <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-500 block mb-3 font-mono">02. Data-Driven Pivot</span>
                       <div className="bg-black/40 border border-red-500/10 p-6 rounded-xl backdrop-blur-sm group-hover:border-red-500/30 transition-colors shadow-inner">
                         <p className="text-sm text-white/90 leading-relaxed font-light italic">
                           {tomb.reasonForFailure}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {project.errorAudit && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Quality Assurance Telemetry</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Bug Identification vs. Resolution Phasing</p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 border-b border-white/10 pb-8">
               <div className="bg-black/50 p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                 <p className="text-[9px] uppercase tracking-widest text-white/40 font-mono mb-2">Total Logs Processed</p>
                 <p className="text-3xl font-bold text-white">125</p>
               </div>
               <div className="bg-black/50 p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                 <p className="text-[9px] uppercase tracking-widest text-white/40 font-mono mb-2">Critical Severity</p>
                 <p className="text-3xl font-bold text-red-400">4</p>
               </div>
               <div className="bg-[#bef264]/5 p-5 rounded-xl border border-[#bef264]/20 flex flex-col justify-center">
                 <p className="text-[9px] uppercase tracking-widest text-[#bef264]/70 font-mono mb-2">Mean Time To Resolve</p>
                 <p className="text-3xl font-bold text-[#bef264]">2.4 Hrs</p>
               </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-10 items-center">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={project.errorAudit.data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="phase" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10, fill: '#fff', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="bugsFound" name="Bugs Identified" fill="#333333" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="bugsResolved" name="Bugs Resolved" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-6 lg:pl-8 lg:border-l border-white/10">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Bug className="w-4 h-4 text-white/50" />
                  </div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-widest font-mono">QA Diagnostic</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/70 italic">"{project.errorAudit.insight}"</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {project.featureMatrix && project.featureMatrix.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-10 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Scope Governance</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Client Requests vs. UX Prioritization</p>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none md:hidden" />
            <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-x-auto custom-scrollbar relative z-0 shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest bg-[#111]" style={{ color: THEME.muted }}>
                    <th className="p-6 font-bold w-1/4 whitespace-nowrap font-mono">Requested Feature</th>
                    <th className="p-6 font-bold w-1/6 whitespace-nowrap font-mono">Stakeholder</th>
                    <th className="p-6 font-bold w-1/6 whitespace-nowrap font-mono">Sprint Status</th>
                    <th className="p-6 font-bold font-mono">Architectural Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {project.featureMatrix.map((row, i) => (
                    <tr key={i} className="transition-colors hover:bg-white/[0.03] bg-[#050505] group">
                      <td className="p-6 font-bold text-sm text-white flex items-center gap-3">
                        <ListChecks className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" /> {row.feature}
                      </td>
                      <td className="p-6 text-[11px] text-white/50">{row.requestedBy}</td>
                      <td className="p-6">
                        <span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm border whitespace-nowrap shadow-sm font-mono" 
                          style={{ 
                            color: row.status === 'Delivered' ? THEME.primary : row.status === 'Rejected' ? '#ff4444' : THEME.muted,
                            borderColor: row.status === 'Delivered' ? `${THEME.primary}40` : row.status === 'Rejected' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
                            backgroundColor: row.status === 'Delivered' ? `${THEME.primary}10` : row.status === 'Rejected' ? 'rgba(255, 68, 68, 0.05)' : 'transparent'
                          }}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-6 text-xs text-white/70 leading-relaxed font-light">{row.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {project.accessibility && project.accessibility.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-12 border-t border-white/5 pt-20 mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Accessibility & Governance</h2>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Enterprise WCAG Compliance Standards</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
             {project.accessibility.map((acc, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl flex items-start gap-5 shadow-lg hover:border-[#bef264]/30 transition-colors group">
                   <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#bef264]/10 transition-colors border border-white/10 group-hover:border-[#bef264]/20 shrink-0 mt-1">
                     <ShieldCheck className="w-5 h-5 text-white/50 group-hover:text-[#bef264] transition-colors" />
                   </div>
                   <div>
                      <p className="font-bold text-white mb-2 text-sm">{acc.standard}</p>
                      <p className="text-xs text-white/60 leading-relaxed font-light">{acc.implementation}</p>
                   </div>
                </div>
             ))}
          </div>
        </section>
      )}

      <section className="max-w-[1600px] mx-auto px-6 space-y-20 border-t border-white/5 pt-20 mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>DesignOps & Token Engineering</h2>
          <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>CI/CD Pipeline Integration from Figma to React</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-stretch">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 md:p-12 border border-white/10 bg-[#0a0a0a] rounded-2xl flex flex-col shadow-2xl">
             <p className="text-[10px] uppercase tracking-widest mb-12 border-b border-white/10 pb-4 font-mono" style={{ color: THEME.muted }}>Handoff Architecture Flow</p>
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-1 py-4">
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-20 h-20 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-lg relative group hover:border-white/40 transition-colors">
                    <Layout className="w-8 h-8 text-white/60" />
                    <span className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-md">1</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest font-bold text-white mb-1">Figma Variables</p>
                    <p className="text-[9px] text-white/40 font-mono">Design Master</p>
                  </div>
                </div>
                <ArrowRight className="hidden md:block w-8 h-8 text-white/20 shrink-0" />
                <ArrowRight className="md:hidden w-8 h-8 text-white/20 shrink-0 rotate-90" />
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-20 h-20 rounded-2xl bg-black border border-[#bef264]/40 flex items-center justify-center shadow-[0_0_30px_rgba(190,242,100,0.15)] relative group hover:border-[#bef264] transition-colors">
                    <Terminal className="w-8 h-8" style={{ color: THEME.primary }} />
                    <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#bef264] rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-md">2</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest font-bold text-white mb-1">GitHub Actions</p>
                    <p className="text-[9px] text-[#bef264]/70 font-mono">Token Transformation</p>
                  </div>
                </div>
                <ArrowRight className="hidden md:block w-8 h-8 text-white/20 shrink-0" />
                <ArrowRight className="md:hidden w-8 h-8 text-white/20 shrink-0 rotate-90" />
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-20 h-20 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-lg relative group hover:border-white/40 transition-colors">
                    <Code className="w-8 h-8 text-white/60" />
                    <span className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-md">3</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest font-bold text-white mb-1">React Storybook</p>
                    <p className="text-[9px] text-white/40 font-mono">Prod Components</p>
                  </div>
                </div>
             </div>
             <div className="mt-12 pt-6 border-t border-white/10">
                <p className="text-[9px] uppercase tracking-widest mb-2 font-mono" style={{ color: THEME.muted }}>Engineering Protocol</p>
                <p className="text-sm leading-relaxed text-white/70 italic border-l-2 border-[#bef264]/50 pl-4">"{project.styleGuide.description}"</p>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-0 border border-white/10 bg-black rounded-2xl overflow-hidden flex flex-col shadow-2xl h-full min-h-[300px]">
            <div className="bg-[#111] px-6 py-4 border-b border-white/10 flex items-center gap-3 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500" />
              </div>
              <span className="text-[10px] font-mono text-white/50 ml-4">theme.config.ts (Generated)</span>
            </div>
            <div className="p-6 md:p-8 overflow-x-auto text-[11px] md:text-xs font-mono leading-loose text-white/70 flex-1 custom-scrollbar">
               <pre><code>{project.styleGuide.tokenCode}</code></pre>
            </div>
          </motion.div>
        </div>

        <div className="pt-10 border-t border-white/5 mt-20">
          <div className="text-center mb-16 pt-8">
            <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold mb-3" style={{ fontFamily: THEME.fonts.display }}>Production Interfaces</h3>
            <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Live Implementations & Visual Specifications</p>
          </div>

          <Tabs defaultValue="hifi" className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 p-0 rounded-none mb-16 flex justify-center w-full gap-8">
              <TabsTrigger value="hifi" className="rounded-none px-0 py-3 text-[10px] md:text-xs uppercase tracking-widest font-bold">Core Screens</TabsTrigger>
            </TabsList>
            <TabsContent value="hifi">
              {project.desktopMockups && project.desktopMockups.length > 0 && (
                <div className="space-y-24">
                  {project.desktopMockups?.map((img, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: CUSTOM_EASE }} className="relative mx-auto max-w-[1200px]">
                      <div className="bg-[#050505] rounded-xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden relative group">
                        <div className="h-10 bg-[#111] border-b border-white/5 flex items-center px-4 gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                          </div>
                          <div className="mx-auto flex-1 max-w-sm h-6 bg-black/50 rounded-md border border-white/5 flex items-center justify-center">
                            <span className="text-[9px] font-mono text-white/30 truncate px-2">{project.title.toLowerCase()}.app / {project.meta.platform.toLowerCase()}</span>
                          </div>
                        </div>
                        <div className="relative aspect-[16/10] bg-[#010101] w-full h-full overflow-hidden">
                          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                          <img src={img} alt={`Production Screen ${i+1}`} className="w-full h-full object-contain object-top relative z-0" crossOrigin="anonymous" loading="lazy" decoding="async" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {project.mobileMocks && project.mobileMocks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-20 max-w-6xl mx-auto">
                  {project.mobileMocks.map((img, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }} className="relative mx-auto w-full max-w-[300px]">
                      <div className="relative aspect-[9/19.5] bg-[#010101] rounded-[3rem] border-[10px] md:border-[12px] border-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[24px] bg-[#1a1a1a] rounded-b-2xl z-20 flex justify-center items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-black/80 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]" />
                           <div className="w-8 h-1.5 rounded-full bg-black/80" />
                        </div>
                        <img src={img} alt={`Mobile Screen ${i+1}`} className="w-full h-full object-cover object-top relative z-10 group-hover:scale-[1.02] transition-transform duration-700 ease-out" crossOrigin="anonymous" loading="lazy" decoding="async" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none opacity-50" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {project.testimonials && project.testimonials.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 space-y-8 pt-32 mt-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Stakeholder Validation</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {project.testimonials.map((test, i) => (
              <div key={i} className="bg-[#050505] border border-white/10 rounded-2xl p-8 md:p-10 relative flex flex-col justify-between shadow-2xl hover:border-white/20 transition-colors">
                <Quote className="w-10 h-10 absolute top-8 right-8 opacity-5" style={{ color: THEME.primary }} />
                <p className="text-sm md:text-base font-light italic leading-relaxed text-white/80 mb-10 relative z-10">"{test.quote}"</p>
                <div className="flex items-center gap-5 border-t border-white/10 pt-6 mt-auto relative z-10">
                   <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                     <span className="text-sm font-bold font-mono" style={{ color: THEME.primary }}>{test.author.charAt(0)}</span>
                   </div>
                   <div>
                     <p className="font-bold text-sm text-white mb-0.5">{test.author}</p>
                     <p className="text-[9px] uppercase tracking-widest text-white/50 font-mono">{test.role}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.hasRelatedEcosystems && (
        <div className="pt-20 bg-[#050505] mt-32 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 space-y-10 pt-10 pb-24">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Cross-Functional Ecosystems</h2>
              <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: THEME.muted }}>Marketing, CMS & Data Platforms</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { title: "Way2Online", tag: "Marketing & Branding", icon: <Megaphone className="w-6 h-6"/>, desc: "End-to-end brand strategy and multi-channel campaign execution." },
                { title: "Digitalkites", tag: "Data Platforms", icon: <Database className="w-6 h-6"/>, desc: "Architected AudiencePlay and AudiencePrime ad-targeting UI." },
                { title: "Way2Target", tag: "Audience Cloud", icon: <Target className="w-6 h-6"/>, desc: "Designed intuitive email and mobile marketing workflows." },
                { title: "The Taste Company", tag: "FMCG Branding", icon: <ShoppingBag className="w-6 h-6"/>, desc: "Led product packaging design and physical-to-digital campaigns." }
              ].map((item, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl hover:border-[#bef264]/40 transition-colors group shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#bef264]/30 transition-all duration-300" style={{ color: THEME.primary }}>
                    {item.icon}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 block mb-4 font-mono">{item.tag}</span>
                  <p className="text-xs font-light leading-relaxed text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="mt-12 py-32 relative overflow-hidden border-t border-white/5 bg-[radial-gradient(ellipse_at_bottom,rgba(190,242,100,0.05)_0%,#000000_70%)]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center space-y-10">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold" style={{ fontFamily: THEME.fonts.display }}>Strategic Conclusion</h2>
          <p className="text-lg md:text-xl max-w-4xl mx-auto font-light leading-relaxed text-white/70">
            {project.conclusion.summary}
          </p>
        </div>
      </section>

    </article>
  );
};

// ============================================================================
// COMPONENT: PROJECTS PORTFOLIO LIST & DATA INJECTION
// ============================================================================
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<AdvancedProject | null>(null);

  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProject]);

  const projects: AdvancedProject[] = [
    {
      id: "01",
      title: "HomeRatesYard",
      tag: "FinTech / Mortgage Tech",
      role: "Senior Product Designer",
      client: "Homeloc Solutions LLC",
      year: "Mar 2024 — Mar 2026",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop", 
      status: "Production Architecture",
      heroTitle: "Scaling Mortgage Efficiency",
      heroSubtitle: "Zero-to-One Ecosystem",
      
      meta: { role: "UX Lead & Technical Architect", team: "1 PM, 3 React Engineers", duration: "24 Months", platform: "Responsive Web & Native iOS" },
      outcomeVsOutput: { output: "Progressive Disclosure React Pipeline", outcome: "18% absolute reduction in borrower drop-off." },

      executiveSummary: "Defined the end-to-end UX strategy for a complex digital mortgage platform. Designed a multi-role ecosystem supporting borrowers, lenders, and operational teams, directly reducing projected borrower drop-off by 18%.",
      impactTrend: [
        { month: 'Jan', value: 10 }, { month: 'Feb', value: 25 }, { month: 'Mar', value: 45 }, 
        { month: 'Apr', value: 80 }, { month: 'May', value: 120 }, { month: 'Jun', value: 210 }
      ],
      metricsTable: [
        { metric: "Borrower Drop-Off", before: "45%", after: "27%", change: "-18%", positive: true },
        { metric: "Engineering Velocity", before: "Manual", after: "Tokenized", change: "10x", positive: true }
      ],
      testimonials: [
        { quote: "The progressive disclosure model completely bypassed the user anxiety we've battled for years. Quality of leads is up significantly.", author: "Director of Lending", role: "Enterprise Stakeholder" },
        { quote: "Having exact React-synced design tokens cut our frontend sprint times in half. The handoff was flawless.", author: "Lead Engineer", role: "Frontend Architecture" }
      ],
      featureMatrix: [
        { feature: "100-Field Monolith Form", requestedBy: "Compliance Team", status: "Rejected", rationale: "Guaranteed 85%+ drop-off. Replaced with Progressive Disclosure." },
        { feature: "Anonymous Rate Graph", requestedBy: "UX Architecture", status: "Delivered", rationale: "Crucial for 'Value-First' user psychology." },
        { feature: "Plaid Bank Integration", requestedBy: "Product", status: "Optional", rationale: "High engineering effort; deferred to post-launch optimization." }
      ],
      accessibility: [
        { standard: "WCAG 2.2 AA Contrast", implementation: "Ensured all tabular financial data passes strict 4.5:1 contrast ratios against deep black backgrounds." },
        { standard: "Keyboard Navigation", implementation: "Complex DSCR modeling sliders mapped to arrow keys for full non-mouse operability." },
        { standard: "Screen Reader Labels", implementation: "Aria-labels applied to all progressive disclosure state transitions to maintain context." }
      ],
      graveyard: [
        { title: "The Hard Data-Wall", hypothesis: "Forcing email verification before showing rates will capture higher intent leads. Users will value the gated data.", reasonForFailure: "It caused an immediate 82% bounce rate in staging. Users refused to provide PII without seeing value first. Pivoted to an unauthenticated Guest State with progressive disclosure." }
      ],
      errorAudit: {
        insight: "By auditing the staging environment, we identified that dynamic slider logic was failing on Safari mobile, preventing 15% of users from completing the DSCR flow. Fixed prior to V1 launch.",
        data: [
          { phase: 'Alpha', bugsFound: 45, bugsResolved: 40 },
          { phase: 'Beta', bugsFound: 22, bugsResolved: 22 },
          { phase: 'Staging', bugsFound: 8, bugsResolved: 8 },
          { phase: 'Prod V1', bugsFound: 2, bugsResolved: 2 },
        ]
      },
      problemSolution: {
        problem: "Legacy aggregators rely on predatory data harvesting, forcing users behind hard PII walls before delivering value. This generates severe cognitive friction and massive drop-off rates.",
        friction: "Mandatory SSN and Email entry before providing any real-time rate data.",
        solution: "A zero-to-one architectural rebuild decoupling rate exploration from strict authentication. Engineered a progressive disclosure pipeline grounded in SOC 2 compliance.",
        flow: "Value First (Rate Graphs) → Soft Pull Estimate → PII Finalization."
      },
      competitorAnalysis: {
        data: [
          { name: "LendingTree", uxScore: 4, trustScore: 2, size: 200, fill: "#ffffff" }, 
          { name: "Zillow Loans", uxScore: 8, trustScore: 7, size: 200, fill: "#a3a3a3" }, 
          { name: "HomeRatesYard", uxScore: 9, trustScore: 9, size: 400, fill: THEME.primary } 
        ],
        insights: [
          "LendingTree aggressively harvests PII, causing extreme user anxiety and 'Spam Call' fatigue.",
          "Zillow offers a clean UI but acts as a closed ecosystem, limiting lender transparency.",
          "HomeRatesYard positions itself in the high-trust, open-marketplace quadrant via progressive disclosure."
        ]
      },
      personas: [
        { 
          name: "First-Time Buyer", role: "Consumer", goals: ["Explore rates safely", "Find trustworthy lenders"], 
          pains: [{label: "Credit Fear", severity: 9}, {label: "Spam Calls", severity: 10}, {label: "Jargon", severity: 7}], 
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'Fin. Lit', A: 40, fullMark: 100 }, { subject: 'Tech Savvy', A: 80, fullMark: 100 }, { subject: 'Patience', A: 20, fullMark: 100 }, { subject: 'Privacy', A: 95, fullMark: 100 }]
        },
        { 
          name: "Licensed Pro", role: "Enterprise User", goals: ["Acquire high-intent leads", "Reduce manual data entry"], 
          pains: [{label: "Garbage Leads", severity: 9}, {label: "Bad Tools", severity: 8}, {label: "High Cost", severity: 6}], 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'Fin. Lit', A: 95, fullMark: 100 }, { subject: 'Tech Savvy', A: 60, fullMark: 100 }, { subject: 'Patience', A: 40, fullMark: 100 }, { subject: 'Privacy', A: 60, fullMark: 100 }]
        }
      ],
      journeyMap: {
        data: [
          { step: "Landing", emotion: 2, action: "Views Value Prop", pain: "Skeptical of 'Free' claims.", system: "CDN Load" },
          { step: "Rate Graph", emotion: 6, action: "Explores rates", pain: "Confused by 'Points'.", system: "API Fetch" },
          { step: "Modeler", emotion: 8, action: "Plays with sliders", pain: "None.", system: "React State" },
          { step: "SSN Req", emotion: -8, action: "Hits PII Wall", pain: "Privacy anxiety.", system: "Auth Gateway" },
          { step: "Trust", emotion: 4, action: "Reads Soft-Pull", pain: "Hesitant but proceeds.", system: "Token Gen" },
          { step: "Success", emotion: 9, action: "Views Matched Lenders", pain: "Relief.", system: "Cosmos DB Write" }
        ]
      },
      systemArchitecture: {
        client: [{name: "Tokenized UI Grid", type: "React"}, {name: "Affordability Calculators", type: "JS logic"}],
        gateway: [{name: "PII Encryption Node", type: "Azure"}, {name: "Rate Aggregator", type: "API REST"}],
        backend: [{name: "Lender CRM Sync", type: "Webhooks"}, {name: "SOC 2 Logging", type: "Cosmos DB"}]
      },
      roadmap: [
        { phase: "Q1", title: "Design System & Discovery Core", desc: "Establishing tokens and the unauthenticated rate exploration engine.", current: false },
        { phase: "Q2", title: "Progressive Auth & Staging", desc: "Deploying the SOC 2 compliant PII collection pipeline.", current: true },
        { phase: "Q3", title: "Lender CRM Integrations", desc: "Bridging matched leads directly into enterprise backends via Plaid.", current: false }
      ],
      conclusion: { summary: "Engineered an ecosystem that filters high-intent leads without resorting to forced data harvesting. The architecture proves that transparency is a stronger conversion tool than friction.", nextSteps: ["Scale Design System."], lessons: ["Transparency is a stronger conversion tool than forced funnels."] },
      styleGuide: { 
        typography: { primary: "Outfit", secondary: "Inter", technical: "JetBrains Mono" }, 
        description: "Clinical, high-trust aesthetic prioritizing data legibility and security.",
        tokenCode: `export const themeTokens = {\n  colors: {\n    primary: '#bef264', // Neon Lime\n    background: '#000000',\n    surface: '#0a0a0a',\n    error: '#ffffff',\n  },\n  typography: {\n    display: 'Outfit, sans-serif',\n    body: 'Inter, sans-serif',\n    mono: 'JetBrains Mono, monospace',\n  },\n  spacing: {\n    4: '0.25rem',\n    8: '0.5rem',\n    16: '1rem',\n  }\n};`
      },
      userFlow: [
        { step: "Phase 01", action: "Analyze Quick Rate Graph", type: "entry" },
        { step: "Phase 02", action: "Safe DSCR Modeling", type: "process" },
        { step: "Phase 03", action: "Azure PII Form", type: "process" },
        { step: "Phase 04", action: "Algorithmic Match", type: "decision" }
      ], 
      desktopMockups: ["/Homepage.jpg"],
      hifiMocks: []
    },
    {
      id: "02",
      title: "DiversityTrax",
      tag: "B2B Enterprise / ESG SaaS",
      role: "Senior Product Designer",
      client: "Computech Business Solutions Pvt. Ltd",
      year: "Mar 2023 — Mar 2024",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop", 
      status: "Live in Production",
      heroTitle: "Enterprise ESG Analytics",
      heroSubtitle: "Supplier Diversity Ecosystem",
      meta: { role: "Senior Product Designer", team: "25 Members (1 Designer, 4 FE, 2 BE, 1 BA, Delivery Manager, Sales, PO)", duration: "12 Months", platform: "Desktop Web (B2B SaaS)", link: "https://diversitytrax.com/" },
      outcomeVsOutput: { output: "Unified React-based Command Center", outcome: "63% reduction in supplier reporting time." },
      executiveSummary: "Architected an end-to-end B2B ESG platform enabling Fortune 500 enterprises to track, manage, and scale their Tier-1 and Tier-2 diverse supplier spend (MBE, WBE, Veteran). Drove a 20% operational efficiency lift in ESG compliance reporting.",
      impactTrend: [
        { month: 'Q1', value: 50 }, { month: 'Q2', value: 55 }, { month: 'Q3', value: 75 }, { month: 'Q4', value: 95 }
      ],
      metricsTable: [
        { metric: "Reporting Efficiency", before: "Baseline", after: "+20%", change: "+20%", positive: true },
        { metric: "Supplier Onboarding", before: "22 min", after: "8 min", change: "-63%", positive: true }
      ],
      
      // REWRITTEN TESTIMONIALS FOR PROFESSIONAL IMPACT
      testimonials: [
        { quote: "Ajay's extensive experience bridging product design with frontend tokenized systems is highly impressive. He is a rapid learner who seamlessly adapts to complex architectural constraints and consistently delivers on strict engineering goals.", author: "Ashish Chenana", role: "Tech Lead" },
        { quote: "Collaborating with Ajay was a masterclass in out-of-the-box thinking. He operates with the strategic depth of a Business Analyst and the execution of an Architect. His relentless drive transformed our product's entire functional baseline.", author: "Gopi Krishna", role: "Senior Business Analyst" }
      ],
      
      featureMatrix: [
        { feature: "Custom ESG Formula Builder", requestedBy: "Finance Analysts", status: "Optional / Phase 2", rationale: "Too much engineering overhead for MVP. Delayed to V2." },
        { feature: "1-Click SOC2 PDF Export", requestedBy: "Compliance", status: "Delivered", rationale: "Critical for end-of-year ESG compliance workflows." },
        { feature: "Persistent Excel Sync", requestedBy: "Legacy Users", status: "Rejected", rationale: "Forces users back into bad habits. Replaced with Native React Grid." }
      ],
      graveyard: [
        { title: "Legacy Data Migration", hypothesis: "Users will manually migrate historical ESG data using the new bulk CSV uploader tool we designed.", reasonForFailure: "The UI timed out parsing 50,000+ rows of legacy formatting. We had to pivot and engineer an API layer to pull directly from SAP instead." }
      ],
      problemSolution: {
        problem: "Legacy procurement tools required diversity managers to keep 4+ different applications open simultaneously to cross-reference basic Tier-1 and Tier-2 supplier data.",
        friction: "Severe horizontal scroll fatigue on 50+ column legacy data tables.",
        solution: "Architected a unified Diversity Command Center. An API aggregation layer feeding into a tokenized React-based Single Page Application.",
        flow: "Single Pane Dashboard → Customizable Role-Based Data Grids → 1-Click ESG Report Export."
      },
      competitorAnalysis: {
        data: [
          { name: "Legacy SAP", uxScore: 3, trustScore: 8, size: 200, fill: "#ffffff" }, 
          { name: "Oracle Financials", uxScore: 5, trustScore: 7, size: 200, fill: "#a3a3a3" }, 
          { name: "DiversityTrax", uxScore: 9, trustScore: 9, size: 400, fill: THEME.primary } 
        ],
        insights: [
          "Legacy systems require extreme cognitive load and months of specialized ESG training.",
          "Competitors have fragmented UI architectures spanning multiple supplier databases.",
          "DiversityTrax unifies the experience under a single, tokenized React SPA."
        ]
      },
      
      // UPGRADED B2B SAAS PERSONAS
      personas: [
        { 
          name: "Chief Procurement", role: "Executive Sponsor", goals: ["Hit 15% diverse spend", "Generate board reports"], 
          pains: [{label: "Context Switch", severity: 9}, {label: "Manual Exports", severity: 10}], 
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'ESG Lit', A: 95, fullMark: 100 }, { subject: 'Tech Savvy', A: 70, fullMark: 100 }, { subject: 'Patience', A: 30, fullMark: 100 }, { subject: 'Accuracy', A: 100, fullMark: 100 }]
        },
        { 
          name: "ESG Director", role: "Risk Mitigation", goals: ["Ensure SOC 2 compliance", "Audit supplier diversity"], 
          pains: [{label: "Data Silos", severity: 10}, {label: "Legacy UI", severity: 8}], 
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'ESG Lit', A: 100, fullMark: 100 }, { subject: 'Tech Savvy', A: 60, fullMark: 100 }, { subject: 'Patience', A: 50, fullMark: 100 }, { subject: 'Accuracy', A: 95, fullMark: 100 }]
        },
        { 
          name: "Finance Analyst", role: "Power User", goals: ["Export reconciliation data", "Cross-reference Tier-2 spend"], 
          pains: [{label: "System Timeouts", severity: 10}, {label: "Scroll Fatigue", severity: 9}], 
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'ESG Lit', A: 60, fullMark: 100 }, { subject: 'Tech Savvy', A: 90, fullMark: 100 }, { subject: 'Patience', A: 20, fullMark: 100 }, { subject: 'Accuracy', A: 100, fullMark: 100 }]
        }
      ],
      
      systemArchitecture: {
        client: [{name: "React Enterprise UI", type: "SPA"}, {name: "Data Grid Components", type: "AG Grid"}],
        gateway: [{name: "GraphQL Federation", type: "API"}, {name: "Auth Gateway", type: "OAuth"}],
        backend: [{name: "Supplier Data DBs", type: "On-Prem"}, {name: "AWS Data Lake", type: "Cloud"}]
      },
      
      // INJECTED ACHIEVEMENT AND CASHTRAX LINK INTO CONCLUSION 
      conclusion: { 
        summary: "ACHIEVEMENT: From initial discovery to final deployment, this architectural overhaul required relentless execution. The ultimate validation was successfully onboarding a Tier-1 enterprise client and seamlessly transitioning their entire workflow from V1 to V2.\n\nECOSYSTEM EXPANSION: We are currently applying this foundational architecture and research methodology to a parallel ecosystem, Cashtrax (https://www.cashtrax.net/).", 
        nextSteps: ["Scale architecture to Cashtrax."], 
        lessons: ["Fragmented data is the real enemy."] 
      },
      
      styleGuide: { 
        typography: { primary: "Outfit", secondary: "Inter", technical: "JetBrains Mono" }, 
        description: "High-density enterprise interface designed for C-Suite analytics.",
        tokenCode: `const dataGridTokens = {\n  rowHeight: '32px',\n  headerBg: '#111111',\n  cellPadding: '0.25rem',\n};`
      },
      userFlow: [{ step: "Alert", action: "Receive Predictive Warning", type: "entry" }, { step: "Export", action: "1-Click Report Gen", type: "exit" }], 
      desktopMockups: ["/Dashboard.jpg", "/Reporting - Reporting Periods.jpg"] 
    },
    {
      id: "03",
      title: "Way2News",
      tag: "B2C / Consumer Digital Platform",
      role: "Senior UI/UX Designer",
      client: "Way2news Interactive Pvt Ltd",
      year: "May 2018 — Jun 2021",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop", 
      status: "Live in Production",
      heroTitle: "Vernacular Content at Scale",
      heroSubtitle: "Algorithmic Discovery & Monetization",
      
      hasRelatedEcosystems: true, 

      meta: { role: "Senior UI/UX Designer", team: "Marketing Team", duration: "3 Years (May 2018 - Jun 2021)", platform: "Native iOS & Android, Websites" },
      outcomeVsOutput: { output: "Variable-height native ad cards & infinite scroll.", outcome: "30% DAU growth without cannibalizing retention." },
      executiveSummary: "Re-architected India's highest-scaling hyper-local news platform to resolve severe content fatigue and banner blindness. Engineered a vernacular-first discovery loop, driving a 30% increase in DAU and a 35% lift in CTR without cannibalizing retention.",
      impactTrend: [
        { month: 'M1', value: 12 }, { month: 'M6', value: 18 }, { month: 'M12', value: 26 }, { month: 'M24', value: 35 }
      ],
      metricsTable: [
        { metric: "DAU Growth", before: "Baseline", after: "+30%", change: "+30%", positive: true },
        { metric: "Ad CTR Lift", before: "1.2%", after: "1.62%", change: "+35%", positive: true },
        { metric: "Bounce Rate", before: "65%", after: "39%", change: "-40%", positive: true }
      ],
      testimonials: [
        { quote: "Ajay’s work ethic is unmatched—he consistently burned the midnight oil to ensure our campaign launches were flawless. His strategic design approach directly amplified our marketing ROI.", author: "Raghu", role: "Head of Marketing" },
        { quote: "An incredible talent who genuinely thinks outside the box. Ajay brings a rare, cross-functional perspective that bridges digital UI, branding, and even FMCG manufacturing constraints. He’s a relentless worker.", author: "Krishna Chaitanya Varma", role: "Manager of Sales" },
        { quote: "A phenomenally quick learner who adapts to shifting marketing needs in real-time. Ajay’s responsiveness and support were critical to keeping our digital campaigns running smoothly.", author: "Ganesh", role: "Manager of Digital Marketing" }
      ],
      featureMatrix: [
        { feature: "Pop-up Interstitial Ads", requestedBy: "Sales Team", status: "Rejected", rationale: "Immediate trigger for app deletion. Hard NO." },
        { feature: "Variable-Height Native Ads", requestedBy: "UX Team", status: "Delivered", rationale: "Blends seamlessly into the vernacular feed." }
      ],
      errorAudit: {
        insight: "Early builds of the infinite scroll caused massive memory leaks on low-end Android devices (Tier-2 markets). Switched to React Native FlatList virtualization.",
        data: [
          { phase: 'Alpha', bugsFound: 65, bugsResolved: 60 },
          { phase: 'Beta', bugsFound: 32, bugsResolved: 32 },
          { phase: 'Prod V1', bugsFound: 5, bugsResolved: 5 },
        ]
      },
      problemSolution: {
        problem: "Ecosystem-level trust and personalization deficits. Users experienced severe cognitive overload from generic content batching, leading to high bounce rates at the notification-to-app-open node.",
        friction: "Standard interstitial banner ads caused immediate app exits. Text density was too high for passive consumption.",
        solution: "Introduced Auto-Play Micro-Video components directly inline with the feed and designed native ad units mimicking organic typographic structure.",
        flow: "Personalized Push Notification → Algorithmic Sorting → Variable-Height Native Cards → Frictionless WhatsApp Sharing."
      },
      personas: [
        { 
          name: "Rural User", role: "Tier-3 Consumer", goals: ["Local news in dialect", "Low data usage"], 
          pains: [{label: "English UIs", severity: 10}, {label: "Heavy Data", severity: 9}], 
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'Fin. Lit', A: 20, fullMark: 100 }, { subject: 'Tech Savvy', A: 40, fullMark: 100 }, { subject: 'Video Pref', A: 90, fullMark: 100 }, { subject: 'Sharing', A: 100, fullMark: 100 }]
        },
        { 
          name: "Urban Commuter", role: "Tier-1 Consumer", goals: ["Fast consumption", "Top headlines"], 
          pains: [{label: "Long text", severity: 9}, {label: "Slow load", severity: 10}], 
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
          stats: [{ subject: 'Fin. Lit', A: 80, fullMark: 100 }, { subject: 'Tech Savvy', A: 90, fullMark: 100 }, { subject: 'Video Pref', A: 40, fullMark: 100 }, { subject: 'Sharing', A: 50, fullMark: 100 }]
        }
      ],
      systemArchitecture: {
        client: [{name: "React Native App", type: "Mobile UI"}, {name: "Web Platforms", type: "Web UI"}],
        gateway: [{name: "Content Delivery Network", type: "CDN Edge"}, {name: "GraphQL Gateway", type: "API Gateway"}],
        backend: [{name: "Recommendation Engine", type: "ML Algorithm"}, {name: "Ad Inventory Server", type: "Ad Server DB"}]
      },
      conclusion: { summary: "Successfully scaled monetization while massively boosting user retention.", nextSteps: ["Integrate AI-summarization."], lessons: ["Visual rhythm is critical."] },
      styleGuide: { 
        typography: { primary: "Roboto Condensed", secondary: "Roboto", technical: "Inter" }, 
        description: "High-performance mobile UI.",
        tokenCode: `const mobileTypography = {\n  headline: { fontSize: '24px', lineHeight: '1.2', fontFamily: 'Roboto Condensed' },\n  body: { fontSize: '16px', lineHeight: '1.5', color: '#e5e5e5', fontFamily: 'Roboto' },\n};`
      },
      userFlow: [{ step: "Discovery", action: "Algorithmic infinite scroll feed", type: "entry" }],
      
      mobileMocks: [
        "/way2news/hindi.png", 
        "/way2news/tamil.png", 
        "/way2news/gujarathi.png",
        "/way2news/kannada.png"
      ]
    }
  ];

  return (
    <section id="work" className="py-24 md:py-32 scroll-mt-20 relative bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest block mb-4 font-bold flex items-center gap-2" style={{ color: THEME.primary }}>
              <Layers className="w-4 h-4"/> Architectural Deployments
            </span>
            <h2 className="text-[clamp(3rem,6vw,5rem)] leading-[0.85] tracking-tighter text-white font-light" style={{ fontFamily: THEME.fonts.display }}>
              CASE <br /><span className="font-bold" style={{ color: THEME.muted }}>STUDIES</span>
            </h2>
          </motion.div>
        </div>

        {/* Project Stacking Grid */}
        <div className="relative pb-32 flex flex-col mt-12" role="list">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.1 }} 
              transition={{ duration: 0.8, ease: CUSTOM_EASE }}
              className="sticky w-full cursor-pointer flex justify-center mb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] group origin-top hover:scale-[0.98] transition-transform duration-500 outline-none"
              style={{ top: `calc(12vh + ${i * 30}px)`, zIndex: i + 10 }}
              
              /* WCAG 2.2 Strict Compliance Upgrades */
              role="button"
              tabIndex={0}
              aria-label={`View architecture case study for ${project.title}`}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              <div className="w-full max-w-[1400px] grid lg:grid-cols-12 min-h-[60vh] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#bef264]/40 transition-all duration-500 bg-[#111111] group-hover:shadow-[inset_0_1px_0_#bef264] group-focus-visible:ring-2 group-focus-visible:ring-[#bef264]">
                
                {/* Left Content Block */}
                <div className="lg:col-span-5 p-10 md:p-16 flex flex-col justify-between relative z-10 bg-gradient-to-r from-black to-[#111111]">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-[10px] font-mono px-3 py-1 rounded-sm font-bold text-black" style={{ backgroundColor: THEME.primary }}>{project.id}</span>
                      <div className="w-8 h-[1px] bg-white/20" />
                      <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: THEME.muted }}>{project.year}</span>
                    </div>
                    
                    <div className="mb-6 inline-flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-md text-white backdrop-blur-md">
                       <span className="font-mono font-bold mr-3 text-lg" style={{ color: THEME.primary }}>{project.metricsTable[0]?.change || "N/A"}</span>
                       <span className="text-[10px] uppercase tracking-widest font-sans">{project.metricsTable[0]?.metric || "Metric"}</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold leading-tight text-white group-hover:text-[#bef264] transition-colors duration-500 mb-4" style={{ fontFamily: THEME.fonts.display }}>
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed font-light text-white/70 line-clamp-3">
                      {project.executiveSummary}
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-12 border-t border-white/10 pt-6">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold block text-white/50">{project.tag}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform" style={{ color: THEME.primary }}>
                      <span className="text-[10px] font-bold uppercase tracking-widest">View Architecture</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Right Image Block */}
                <div className="lg:col-span-7 relative overflow-hidden hidden lg:block bg-black">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#111111] z-10 pointer-events-none" />
                  
                  <img 
                    src={project.desktopMockups?.[0] || project.image} 
                    className="w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" 
                    crossOrigin="anonymous" 
                    alt={`Preview of ${project.title} interface`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[#bef264]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Overlay System */}
        <Dialog open={!!selectedProject} onOpenChange={(open: boolean) => { if (!open) setSelectedProject(null); }}>
          <DialogContent className="max-w-none sm:max-w-none w-screen h-[100dvh] top-0 left-0 translate-x-0 translate-y-0 p-0 overflow-y-auto rounded-none border-none z-[100] block custom-scrollbar bg-[#000000]">
            {selectedProject && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                
                {/* Modal Header Parallax */}
                <div className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden flex items-center justify-center bg-black">
                  <motion.img 
                    initial={{ scale: 1.1 }} 
                    animate={{ scale: 1 }} 
                    transition={{ duration: 1.5, ease: CUSTOM_EASE }} 
                    src={selectedProject.desktopMockups?.[0] || selectedProject.image} 
                    alt={`Cover for ${selectedProject.title}`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" 
                    crossOrigin="anonymous" 
                    loading="eager" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  
                  {/* Strict W3C Compliant Close Button */}
                  <button 
                    className="fixed top-6 right-6 md:top-8 md:right-8 z-[110] rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-white h-12 w-12 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264]" 
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close Case Study"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Engine Delegation */}
                <CaseStudyContent project={selectedProject} />
                
                {/* Modal Footer Closure */}
                <div className="py-32 text-center px-6 bg-[#0a0a0a] border-t border-white/5 relative z-10">
                  <p className="text-[10px] uppercase tracking-widest mb-8 font-mono" style={{ color: THEME.muted }}>End of Sequence</p>
                  <button 
                    className="rounded-none px-12 h-14 border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all duration-300 text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264]" 
                    onClick={() => setSelectedProject(null)}
                    aria-label="Return to portfolio"
                  >
                    Close Overlay
                  </button>
                </div>
                
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: CORE COMPETENCIES (Executive Matrix Upgrade)
// ============================================================================
const Skills = () => {
  const skills = [
    { 
      id: "01", 
      category: "Systems Architecture", 
      icon: <Layout className="w-5 h-5 relative z-10" />, 
      description: "Architecting resilient, zero-to-one enterprise ecosystems and aligning user experience with macro-business objectives.", 
      items: ["Ecosystem Design", "GTM Strategy", "Dual-Track Agile"] 
    },
    { 
      id: "02", 
      category: "Enterprise B2B SaaS", 
      icon: <Database className="w-5 h-5 relative z-10" />, 
      description: "Synthesizing high-density data matrices into intuitive, scalable enterprise command centers.", 
      items: ["B2B Portals", "FinTech Dashboards", "Data Storytelling"] 
    },
    { 
      id: "03", 
      category: "DesignOps & Tooling", 
      icon: <Code className="w-5 h-5 relative z-10" />, 
      description: "Structuring strict design tokens to eliminate handoff friction and accelerate React CI/CD development pipelines.", 
      items: ["React Integration", "Tokenization", "Storybook Specs"] 
    },
    { 
      id: "04", 
      category: "Omnichannel Growth", 
      icon: <Target className="w-5 h-5 relative z-10" />, 
      description: "Scaling conversion pipelines and brand presence through robust CMS and cross-platform marketing architectures.", 
      items: ["CMS Architecture", "Vernacular Scaling", "Conversion CRO"] 
    },
    { 
      id: "05", 
      category: "Accessibility & Compliance", 
      icon: <ShieldCheck className="w-5 h-5 relative z-10" />, 
      description: "Enforcing rigorous inclusive design standards to mitigate enterprise risk and expand total addressable markets.", 
      items: ["WCAG 2.2 AA", "SOC 2 UX Flows", "Inclusive UI"] 
    },
    { 
      id: "06", 
      category: "Strategic Leadership", 
      icon: <Network className="w-5 h-5 relative z-10" />, 
      description: "Driving cross-functional alignment between engineering, product, and C-suite stakeholders to secure UX ROI.", 
      items: ["Stakeholder Alignment", "UX Mentorship", "ROI Modeling"] 
    }
  ];

  return (
    <section id="expertise" className="py-24 md:py-32 scroll-mt-20 px-6 md:px-12 xl:px-24 bg-[#000000] border-t border-white/5 relative overflow-hidden">
      
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest block mb-4 font-bold flex items-center gap-3" style={{ color: THEME.primary }}>
              <div className="flex items-center justify-center relative">
                <CheckCircle2 className="w-4 h-4 relative z-10"/>
                <div className="absolute inset-0 bg-[#bef264] blur-md opacity-50 animate-pulse" />
              </div>
              Global Standards
            </span>
            <h2 className="text-[clamp(3rem,6vw,5rem)] leading-[0.85] tracking-tighter text-white font-light" style={{ fontFamily: THEME.fonts.display }}>
              CORE <br /><span className="font-bold" style={{ color: THEME.muted }}>COMPETENCIES</span>
            </h2>
          </motion.div>
        </div>

        {/* Competency Matrix (Upgraded to 3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skills.map((skillGroup, i) => (
            <motion.div 
              key={skillGroup.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.8, ease: CUSTOM_EASE }} 
              className="group relative border border-white/10 p-8 md:p-10 flex flex-col justify-between min-h-[320px] transition-all duration-500 rounded-2xl bg-[#0a0a0a] hover:bg-[#0c0c0c] hover:-translate-y-2 shadow-2xl overflow-hidden"
            >
              {/* Hover Gradient Glow & Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#bef264] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#bef264] rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300 relative shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ backgroundColor: `${THEME.primary}10`, color: THEME.primary }}>
                    {skillGroup.icon}
                    <div className="absolute inset-0 border border-[#bef264]/30 rounded-xl group-hover:border-[#bef264] transition-colors duration-300" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/20 group-hover:text-[#bef264] transition-colors duration-300">
                    SYS_NODE_{skillGroup.id}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white transition-colors duration-300 tracking-tight" style={{ fontFamily: THEME.fonts.display }}>
                  {skillGroup.category}
                </h3>
                <p className="text-sm leading-relaxed font-light mb-10 text-white/50 group-hover:text-white/80 transition-colors duration-300" style={{ fontFamily: THEME.fonts.body }}>
                  {skillGroup.description}
                </p>
              </div>
              
              {/* Pill Tags */}
              <div className="flex flex-wrap gap-2 mt-auto relative z-10 border-t border-white/5 pt-6">
                {skillGroup.items.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border border-white/10 rounded-sm text-white/50 group-hover:border-[#bef264]/40 group-hover:bg-[#bef264]/5 group-hover:text-[#bef264] transition-all duration-300 bg-white/5 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: PHILOSOPHY / PROFESSIONAL PROFILE
// ============================================================================
const About = () => {
  return (
    <section id="philosophy" className="py-24 md:py-40 scroll-mt-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[#0a0a0a] border-b border-white/5">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute right-0 top-0 w-[800px] h-[800px] rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" style={{ backgroundColor: `${THEME.primary}0a` }} />
      </div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: CUSTOM_EASE }}>
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-4 h-4" style={{ color: THEME.primary }} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: THEME.primary, fontFamily: THEME.fonts.mono }}>Operating Manifesto</span>
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-tighter mb-8 font-light text-white" style={{ fontFamily: THEME.fonts.display }}>
                ARCHITECTING <br /><span className="font-bold">THE INTERSECTION.</span>
              </h2>
              <p className="text-lg md:text-xl font-light leading-relaxed text-white/70" style={{ fontFamily: THEME.fonts.body }}>
                I do not just draw screens; I engineer systems. With a decade of rigorous execution across B2B SaaS, FinTech, and high-scale consumer ecosystems, I bridge the brutal gap between complex backend constraints and frictionless frontend UI.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease: CUSTOM_EASE }} className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {[ { value: "10+", label: "Years Experience" }, { value: "35M+", label: "Peak MAU Scaled" }, { value: "Zero", label: "Handoff Friction" } ].map((stat, i) => (
                <div key={i} className="p-6 border border-white/10 bg-black rounded-lg hover:border-[#bef264]/40 transition-colors shadow-lg">
                  <p className="text-3xl font-bold mb-1" style={{ color: THEME.primary, fontFamily: THEME.fonts.mono }}>{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-white/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: CUSTOM_EASE }} className="pt-6 border-t border-white/10">
              <ul className="space-y-4">
                {[ "Translating severe operational complexity into actionable UI.", "Enforcing absolute strict WCAG 2.2 accessibility compliance.", "Executing tokenized design systems that map 1:1 with React." ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80 font-light">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: THEME.primary }} /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: CUSTOM_EASE }} className="relative group order-1 lg:order-2 max-w-md mx-auto lg:mx-0 lg:ml-auto w-full">
            <div className="absolute -inset-4 border border-white/10 rounded-2xl z-0 hidden md:block" />
            <div className="absolute -inset-4 border border-transparent border-t-[#bef264] border-l-[#bef264] w-12 h-12 rounded-tl-2xl z-0 hidden md:block opacity-50" />
            <div className="absolute -inset-4 border border-transparent border-b-[#bef264] border-r-[#bef264] w-12 h-12 rounded-br-2xl z-0 hidden md:block opacity-50 left-auto bottom-auto right-[-16px] bottom-[-16px]" />
            <div className="absolute -left-8 top-1/2 w-4 h-[1px] bg-white/30" />
            <div className="absolute -right-8 top-1/2 w-4 h-[1px] bg-white/30" />
            <div className="absolute left-1/2 -top-8 w-[1px] h-4 bg-white/30" />
            <div className="absolute left-1/2 -bottom-8 w-[1px] h-4 bg-white/30" />

            <div className="aspect-[4/5] overflow-hidden border border-white/20 relative rounded-xl shadow-2xl z-10 bg-black">
              <img src="/ajay_kumar.png?q=80&w=1000&auto=format&fit=crop" alt="System Architecture Representation" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" crossOrigin="anonymous" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            </div>

            <div className="absolute -bottom-6 -left-6 md:-left-12 bg-[#111] border border-white/10 p-4 rounded-xl shadow-2xl z-20 flex items-center gap-4 backdrop-blur-md group-hover:-translate-y-2 transition-transform duration-500">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black border border-[#bef264]/30" style={{ color: THEME.primary }}><Activity className="w-5 h-5" /></div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-white/50 mb-0.5">System Status</p>
                <p className="text-xs font-bold text-white tracking-widest font-mono">FULLY OPERATIONAL</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: CONTACT 
// ============================================================================
const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); };

  return (
    <section id="contact" className="py-24 md:py-32 scroll-mt-20 px-6 md:px-12 xl:px-24 relative bg-[#000000]">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="space-y-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold block" style={{ color: THEME.primary, fontFamily: THEME.fonts.mono }}>
            Initialize Comm
          </span>
          <h2 className="text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] tracking-tighter text-white" style={{ fontFamily: THEME.fonts.display }}>
            LET'S <br /><span className="font-bold">CONNECT.</span>
          </h2>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-md" style={{ color: THEME.muted, fontFamily: THEME.fonts.body }}>
            Open to discussing strategic design challenges and high-impact enterprise opportunities globally.
          </p>
          <div className="space-y-6 pt-4">
            <a href="mailto:ajaykumarmyakala@outlook.com" className="flex items-center gap-5 group cursor-pointer w-max">
              <div className="w-12 h-12 flex items-center justify-center rounded-md transition-all bg-white/5 border border-white/10 group-hover:border-[#bef264]/50">
                <Mail className="w-4 h-4 text-white/70 group-hover:text-[#bef264] transition-colors" />
              </div>
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: THEME.fonts.body }}>
                ajaykumarmyakala@outlook.com
              </span>
            </a>
            <a href="https://www.linkedin.com/in/ajay-kumar-designer/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group cursor-pointer w-max">
              <div className="w-12 h-12 flex items-center justify-center rounded-md transition-all bg-white/5 border border-white/10 group-hover:border-[#bef264]/50">
                <Linkedin className="w-4 h-4 text-white/70 group-hover:text-[#bef264] transition-colors" />
              </div>
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: THEME.fonts.body }}>
                linkedin.com/in/ajay-kumar-designer
              </span>
            </a>
          </div>
        </div>

        <div className="bg-[#050505] border border-white/5 p-10 md:p-14 rounded-2xl relative shadow-2xl w-full lg:max-w-lg ml-auto">
           <form onSubmit={handleSubmit} className="space-y-10 relative z-10" style={{ fontFamily: THEME.fonts.body }}>
              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/40 group-focus-within:text-[#bef264] transition-colors">
                  Full Name
                </label>
                <Input required className="w-full bg-transparent border-0 border-b border-white/10 rounded-none h-10 focus:outline-none focus:ring-0 focus:border-[#bef264] px-0 text-sm text-white transition-colors placeholder-transparent" placeholder=" " />
              </div>
              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/40 group-focus-within:text-[#bef264] transition-colors">
                  Email
                </label>
                <Input type="email" required className="w-full bg-transparent border-0 border-b border-white/10 rounded-none h-10 focus:outline-none focus:ring-0 focus:border-[#bef264] px-0 text-sm text-white transition-colors placeholder-transparent" placeholder=" " />
              </div>
              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/40 group-focus-within:text-[#bef264] transition-colors">
                  Message
                </label>
                <Textarea required className="w-full bg-transparent border-0 border-b border-white/10 rounded-none min-h-[80px] focus:outline-none focus:ring-0 focus:border-[#bef264] px-0 text-sm text-white resize-none transition-colors placeholder-transparent" placeholder=" " />
              </div>
              <Button type="submit" className="w-full h-14 text-black rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all border-none mt-6" style={{ backgroundColor: THEME.primary }}>
                Transmit
              </Button>
            </form>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN APPLICATION BOOTSTRAP
// ============================================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen selection:text-black scroll-smooth bg-[#000000] cursor-none" style={{ fontFamily: THEME.fonts.body, selectionBackgroundColor: THEME.primary } as any}>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div key="main-app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: CUSTOM_EASE }}>
            <Navbar />
            <main>
              <Hero />
              <Experience />
              <Projects />
              <Skills />
              <About />
              <Contact />
            </main>
            <footer className="py-8 border-t text-center bg-[#000000] border-white/10 text-[#a3a3a3]" style={{ fontFamily: THEME.fonts.body }}>
               <p className="text-[9px] uppercase tracking-widest font-bold">© 2026 Ajay Kumar Myakala. Senior UX Architect.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}