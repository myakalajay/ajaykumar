import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { viewerProfiles, type ProfileId, type Project, type SectionId } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import { track, useAnalytics } from './hooks/useAnalytics';
import { useSectionSeo } from './hooks/useSeo';
import CustomCursor from './components/CustomCursor';
import OpeningSequence from './components/OpeningSequence';
import ProfileSelector from './components/ProfileSelector';
import Navbar from './components/Navbar';
import SeekBar from './components/SeekBar';
import Hero from './components/Hero';
import { ContinueWatching } from './components/ContinueWatching';
import Scene from './components/Scene';
import About from './components/About';
import Seasons from './components/Seasons';
import Originals from './components/Originals';
import TopPicks from './components/TopPicks';
import Skills from './components/Skills';

import Achievements from './components/Achievements';
import ResumeSection from './components/ResumeViewer';
import FinalCTA from './components/FinalCTA';
import { EASE } from './components/fx';

// Overlays are only needed on demand — split them out of the first load.
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

type Stage = 'opening' | 'profiles' | 'home';

// NOTE: we deliberately do NOT skip the opening/profile picker based on a
// stored session value — every fresh visit (regardless of URL query params)
// must show the same flow, otherwise returning visitors see a different site
// than first-time ones and deep links appear "broken".

export default function App() {
  return (
    <SmoothScrollProvider>
      <Series />
    </SmoothScrollProvider>
  );
}

function Series() {
  const [stage, setStage] = useState<Stage>('opening');
  const [profileId, setProfileId] = useState<ProfileId>('ajay');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { scrollTo, lock, unlock } = useSmoothScroll();
  useAnalytics(stage === 'home' ? `profile:${profileId}` : undefined);

  const order = viewerProfiles.find((p) => p.id === profileId)!.order;

  // Title/description follow the section being watched, and reset while the
  // opening sequence and profile picker are on screen.
  useSectionSeo(order, stage === 'home');

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  const pickProfile = useCallback(
    (id: ProfileId) => {
      setProfileId(id);
      if (stage !== 'home') {
        window.scrollTo(0, 0);
        setStage('home');
        track('profile-switch', id);
      } else {
        track('profile-switch', id);
        const p = viewerProfiles.find((v) => v.id === id)!;
        setToast(`Now watching as ${p.name} — ${p.blurb.toLowerCase()}`);
        scrollTo(0, { offset: 0 });
      }
    },
    [stage, scrollTo],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Opening a case study is the site's strongest signal of interest, so it is
  // reported by project id rather than inferred from a pageview.
  const openProject = useCallback((p: Project) => {
    track('project-open', p.id);
    setProject(p);
  }, []);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: <Seasons />,
    originals: <Originals onOpen={openProject} />,
    picks: <TopPicks />,
    skills: <>
      <Skills />
    </>,
    continueWatching: <ContinueWatching onOpen={openProject} order={order} profileId={profileId} />,
    moments: <Achievements onOpen={openProject} />,
    story: <ResumeSection onView={() => setResumeOpen(true)} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-md focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {stage === 'opening' && <OpeningSequence key="opening" onDone={() => setStage('profiles')} />}
        {stage === 'profiles' && <ProfileSelector key="profiles" onPick={pickProfile} />}
      </AnimatePresence>

      {/* Outside the home wrapper: `filter`/`scale` on that element would make it
          the containing block for a fixed child and the bar would scroll away. */}
      {stage === 'home' && <SeekBar order={order} />}

      {/* No `scale` on this wrapper: scaled it is 3% wider than the viewport, which adds
          a horizontal scrollbar on load. Opacity + blur carry the same entrance. */}
      {stage === 'home' && (
        <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease: EASE }}>
          <Navbar order={order} profileId={profileId} onSwitch={pickProfile} />
          <main id="main" tabIndex={-1}>
            <Hero
              key={`hero-${profileId}`}
              onPlay={() => {
                track('cta', 'play-intro');
                setPlaying(true);
              }}
              onResume={() => setResumeOpen(true)}
              profileId={profileId}
            />
            {order.map((id) => (
              // `overflow-x-clip` on the resume scene only: its sheet enters with a
              // perspective rotateX, and while that is still un-triggered (the section
              // is off-screen) the projected box is ~30px wider than the viewport,
              // which lets an iPad-width page pan sideways before you reach it.
              <Scene
                key={id}
                id={id}
                className={id === 'originals' ? '!py-0 sm:!py-0' : id === 'story' ? 'overflow-x-clip' : ''}
              >
                {sections[id]}
              </Scene>
            ))}
            <FinalCTA onReplay={() => setStage('opening')} />
          </main>
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={openProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
