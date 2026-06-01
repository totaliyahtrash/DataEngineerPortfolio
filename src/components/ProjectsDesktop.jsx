import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Helper to detect slow connection or low-performance device
const isSlowNetworkOrDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    if (conn.saveData) return true;
    const slowModes = ['slow-2g', '2g', '3g'];
    if (slowModes.includes(conn.effectiveType)) return true;
    if (conn.downlink && conn.downlink < 2.0) return true;
    if (conn.rtt && conn.rtt > 200) return true;
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return true;
  }
  return false;
};

// ScatteredWord helper component
const ScatteredWord = ({ word, scrollProgress, triggerRange, outputRange, sizeClass = "text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem]" }) => {
  const letters = word.split("");
  const panelOffset = useTransform(scrollProgress, triggerRange, outputRange);
  const springOffset = useSpring(panelOffset, { stiffness: 60, damping: 18 });

  // Generate random target offsets once on mount
  const randomCoords = useRef(letters.map(() => ({
    x: (Math.random() - 0.5) * 500,
    y: (Math.random() - 0.5) * 400,
    rotate: (Math.random() - 0.5) * 180
  }))).current;

  return (
    <div className="flex select-none flex-wrap justify-center mb-6">
      {letters.map((char, index) => {
        const coords = randomCoords[index];
        if (char === " ") {
          return <span key={index} className="w-5" />;
        }
        
        const x = useTransform(springOffset, [0, 1], [0, coords.x]);
        const y = useTransform(springOffset, [0, 1], [0, coords.y]);
        const rotate = useTransform(springOffset, [0, 1], [0, coords.rotate]);
        const opacity = useTransform(springOffset, [0, 1], [1, 0.15]);

        return (
          <motion.span
            key={index}
            style={{ x, y, rotate, opacity, display: 'inline-block' }}
            className={`font-bubble ${sizeClass} tracking-[-0.05em] font-black uppercase text-black cursor-default drop-shadow-[2px_2px_0_#000] gpu-accelerated`}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
};

// Spinning GitHub postage stamp sticker (with holographic glow adaptation)
const GitHubStamp = ({ repoUrl, isGlowing }) => {
  return (
    <motion.a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15, rotate: 360, transition: { duration: 0.8 } }}
      className={`absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-dashed border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_#000] z-30 cursor-pointer pointer-events-auto gpu-accelerated transition-all duration-300 ${isGlowing ? 'holo-stamp-active' : ''}`}
    >
      <svg viewBox="0 0 16 16" fill="black" className="w-6 h-6">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </motion.a>
  );
};

// Wrapper card container to track hover and viewport in-view intersection
const ProjectTextCard = ({ children, repoUrl, rotateClass }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isGlowing = isHovered || (isMobile && isInView);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full p-6 sm:p-8 bg-white border-3 border-black text-black rounded shadow-[6px_6px_0_rgba(0,0,0,1)] relative transition-all duration-300 gpu-accelerated ${rotateClass}`}
    >
      <GitHubStamp repoUrl={repoUrl} isGlowing={isGlowing} />
      {children}
    </div>
  );
};

export default function ProjectsDesktop() {
  const containerRef = useRef(null);
  const [isSlow, setIsSlow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsSlow(isSlowNetworkOrDevice());
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track vertical scroll progress of container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform vertical scroll to horizontal track offset
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const springX = useSpring(xTranslate, { stiffness: 45, damping: 15 });

  // Multiplayer cursor variant paths
  const cursor1Variants = {
    animate: {
      x: [40, 240, 120, 320, 40],
      y: [60, 160, 280, 80, 60],
      rotate: [0, 15, -10, 20, 0],
      transition: { repeat: Infinity, duration: 10, ease: "easeInOut" }
    }
  };

  const cursor2Variants = {
    animate: {
      x: [300, 100, 280, 150, 300],
      y: [220, 80, 190, 310, 220],
      rotate: [0, -15, 10, -25, 0],
      transition: { repeat: Infinity, duration: 12, ease: "easeInOut" }
    }
  };

  return (
    <>
      {isMobile ? (
        /* Mobile Viewport: Swipeable Horizontal Carousel */
        <div id="projects" className="w-full bg-[#191919] py-16 flex flex-col section-contain overflow-hidden">
          {/* Section Header */}
          <div className="w-full text-center mb-8 px-6">
            <span className="font-bubble text-white text-3xl font-black block tracking-tight uppercase drop-shadow-[2.5px_2.5px_0_#000]">
              PROJECT TIMELINE
            </span>
            <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mt-1">
              swipe horizontally • click github stamp to view repo
            </span>
          </div>

          {/* Carousel Track */}
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-6 space-x-5 scroll-smooth w-full">
            
            {/* PANEL 1: Steam Market Intel */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#00A7FE] border-4 border-black p-5 rounded-3xl relative overflow-hidden shadow-[5px_5px_0_#000] flex flex-col space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
              {/* Visual Sketch */}
              <div className="w-full bg-white border-3 border-black p-3 rounded-xl shadow-[3px_3px_0_#000] relative rotate-[-1.5deg] shrink-0">
                <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-20 h-20 mx-auto mb-1 float-element">
                  <path d="M55 45 v25 c0 6 25 6 25 0 v-25" fill="#FFD860" stroke="black" strokeWidth="2.5" />
                  <ellipse cx="67.5" cy="45" rx="12.5" ry="4.5" fill="#FFE28A" stroke="black" strokeWidth="2.5" />
                  <path d="M55 53 c0 5 25 5 25 0" stroke="black" strokeWidth="2" />
                  <path d="M55 61 c0 5 25 5 25 0" stroke="black" strokeWidth="2" />
                  <rect x="15" y="28" width="34" height="22" rx="7" fill="#FF73B5" stroke="black" strokeWidth="2.5" />
                  <path d="M22 39 h6 m-3 -3 v6" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="39" cy="36" r="2" fill="black" />
                  <circle cx="43" cy="41" r="2" fill="black" />
                  <path d="M35 50 c 5 12 18 12 24 5" stroke="black" strokeWidth="2.5" strokeDasharray="3,3" strokeLinecap="round" fill="none" />
                  <polygon points="59,57 60,52 55,54" fill="black" />
                </svg>
                <h4 className="font-mono font-bold text-[8px] uppercase text-black/50 text-center mb-0.5">[steam market intel]</h4>
                <p className="font-mono text-[8px] text-center font-semibold leading-tight text-black/80">Processes 27,000+ Steam game records into a production-grade PostgreSQL star schema.</p>
              </div>
              {/* Text Card */}
              <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/steam-market-intel" rotateClass="rotate-[1deg] flex-grow">
                <div className="inline-flex items-center space-x-1.5 bg-[#FFD860] border-2 border-black rounded px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0_#000]">
                  <span>ETL Pipeline</span>
                  <span>⚙️</span>
                </div>
                <h3 className="font-bubble text-base sm:text-lg font-black text-black mb-1 uppercase leading-none">STEAM MARKET INTEL</h3>
                <p className="font-mono text-[9px] font-semibold leading-relaxed mb-3 text-black/85">
                  An end-to-end data pipeline processing 27,000+ Steam records into a Postgres star schema.
                </p>
                <div className="border-t border-dashed border-black/25 pt-2.5 space-y-1">
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>ingest & clean</strong>: pandas transformations & null cleaning.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>star schema</strong>: maps dim_genre, dim_developer, dim_release.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>db integrity</strong>: database-enforced FK constraints.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>idempotency</strong>: safe re-runs via pre-load verification.</span>
                  </div>
                </div>
              </ProjectTextCard>
            </div>

            {/* PANEL 2: Sentiment Analyzer */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#FFD860] border-4 border-black p-5 rounded-3xl relative overflow-hidden shadow-[5px_5px_0_#000] flex flex-col space-y-4">
              <div className="absolute inset-[0] bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
              {/* Visual Sketch */}
              <div className="w-full bg-white border-3 border-black p-3 rounded-xl shadow-[3px_3px_0_#000] relative rotate-[1.5deg] shrink-0 z-10">
                <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-20 h-20 mx-auto mb-1 float-element">
                  <path d="M20 25 h60 v40 h-20 l-15 15 l-5-15 h-20 z" fill="#FF73B5" />
                  <circle cx="40" cy="40" r="5" fill="black" />
                  <circle cx="60" cy="40" r="5" fill="black" />
                  <path d="M42 52 Q50 58 58 52" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <rect x="25" y="75" width="12" height="15" fill="#A5CF4E" stroke="black" strokeWidth="2" />
                  <rect x="42" y="70" width="12" height="20" fill="#FFD860" stroke="black" strokeWidth="2" />
                  <rect x="59" y="80" width="12" height="10" fill="#FF73B5" stroke="black" strokeWidth="2" />
                </svg>
                <h4 className="font-mono font-bold text-[8px] uppercase text-black/50 text-center mb-0.5">[sentiment analyzer]</h4>
                <p className="font-mono text-[8px] text-center font-semibold leading-tight text-black/80">Fetches comments from the YouTube API and conducts fanbase sentiment analysis using VADER.</p>
              </div>
              {/* Text Card */}
              <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/SentimentPipeline" rotateClass="rotate-[-1deg] flex-grow">
                <div className="inline-flex items-center space-x-1.5 bg-[#FF73B5] text-white border-2 border-black rounded px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0_#000]">
                  <span>NLP Pipeline</span>
                  <span>⚡</span>
                </div>
                <h3 className="font-bubble text-base sm:text-lg font-black text-black mb-1 uppercase leading-none">SENTIMENT ANALYZER</h3>
                <p className="font-mono text-[9px] font-semibold leading-relaxed mb-3 text-black/85">
                  A Python data pipeline crawling YouTube comments and analyzing fanbase sentiment using VADER.
                </p>
                <div className="border-t border-dashed border-black/25 pt-2.5 space-y-1">
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#FF73B5] font-bold">✶</span>
                    <span><strong>comments fetch</strong>: grabs 100 comments via API.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#FF73B5] font-bold">✶</span>
                    <span><strong>sentiment engine</strong>: VADER analyzer for social text.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#FF73B5] font-bold">✶</span>
                    <span><strong>parquet storage</strong>: outputs tabular parquet files.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#FF73B5] font-bold">✶</span>
                    <span><strong>key insight</strong>: Mitski fanbase shows higher sadness.</span>
                  </div>
                </div>
              </ProjectTextCard>
            </div>

            {/* PANEL 3: Open Library */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#A5CF4E] border-4 border-black p-5 rounded-3xl relative overflow-hidden shadow-[5px_5px_0_#000] flex flex-col space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
              {/* Visual Sketch */}
              <div className="w-full bg-white border-3 border-black p-3 rounded-xl shadow-[3px_3px_0_#000] relative rotate-[-1.5deg] shrink-0">
                <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-20 h-20 mx-auto mb-1 float-element">
                  <rect x="15" y="25" width="40" height="50" rx="3" fill="#FFD860" />
                  <line x1="22" y1="35" x2="48" y2="35" />
                  <line x1="22" y1="45" x2="48" y2="45" />
                  <line x1="22" y1="55" x2="48" y2="55" />
                  <rect x="60" y="45" width="30" height="35" rx="2" fill="#FFD860" />
                  <path d="M70 55 h10 M70 65 h10" stroke="black" strokeWidth="2" />
                  <path d="M40 50 Q52 40 60 50" stroke="black" strokeWidth="2.5" fill="none" />
                  <polygon points="58,52 62,50 58,47" fill="black" />
                </svg>
                <h4 className="font-mono font-bold text-[8px] uppercase text-black/50 text-center mb-0.5">[open library]</h4>
                <p className="font-mono text-[8px] text-center font-semibold leading-tight text-black/80">API book data cleaning pipeline built with zero pandas dependencies.</p>
              </div>
              {/* Text Card */}
              <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/openLibrary" rotateClass="rotate-[-1deg] flex-grow">
                <div className="inline-flex items-center space-x-1.5 bg-[#00A7FE] text-white border-2 border-black rounded px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0_#000]">
                  <span>ETL Engine</span>
                  <span>⚙️</span>
                </div>
                <h3 className="font-bubble text-base sm:text-lg font-black text-black mb-1 uppercase leading-none">OPEN LIBRARY PIPELINE</h3>
                <p className="font-mono text-[9px] font-semibold leading-relaxed mb-3 text-black/85">
                  A pagination ETL pipeline fetching book records and outputting CSV/Parquet.
                </p>
                <div className="border-t border-dashed border-black/25 pt-2.5 space-y-1">
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>pagination</strong>: pages search responses dynamically.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>cleaning</strong>: parses missing and nested JSON fields.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>parquet storage</strong>: compressed, schema-aware files.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#00A7FE] font-bold">✶</span>
                    <span><strong>pure python</strong>: built using pyarrow and requests.</span>
                  </div>
                </div>
              </ProjectTextCard>
            </div>

            {/* PANEL 4: F1 Pipeline */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-[#FF73B5] border-4 border-black p-5 rounded-3xl relative overflow-hidden shadow-[5px_5px_0_#000] flex flex-col space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
              {/* Visual Sketch */}
              <div className="w-full bg-white border-3 border-black p-3 rounded-xl shadow-[3px_3px_0_#000] relative rotate-[-1.5deg] shrink-0">
                <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-20 h-20 mx-auto mb-1 float-element">
                  <circle cx="50" cy="50" r="30" fill="#1c1c1e" stroke="black" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="14" fill="#A5CF4E" stroke="black" strokeWidth="2" />
                  <rect x="47" y="20" width="6" height="15" fill="black" />
                  <rect x="20" y="47" width="15" height="6" fill="black" />
                  <rect x="65" y="47" width="15" height="6" fill="black" />
                  <path d="M22 72 Q35 58 50 67 T78 52" stroke="#FF73B5" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <text x="50" y="53" textAnchor="middle" fill="black" fontSize="7" fontWeight="black" fontFamily="sans-serif">F1</text>
                </svg>
                <h4 className="font-mono font-bold text-[8px] uppercase text-black/50 text-center mb-0.5">[f1 race pipeline]</h4>
                <p className="font-mono text-[8px] text-center font-semibold leading-tight text-black/80">End-to-end race telemetry ETL engine pulling FastF1 session details.</p>
              </div>
              {/* Text Card */}
              <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/f1-pipeline" rotateClass="rotate-[-1deg] flex-grow">
                <div className="inline-flex items-center space-x-1.5 bg-[#A5CF4E] border-2 border-black rounded px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0_#000]">
                  <span>Telemetry</span>
                  <span>📦</span>
                </div>
                <h3 className="font-bubble text-base sm:text-lg font-black text-black mb-1 uppercase leading-none">F1 RACE DATA PIPELINE</h3>
                <p className="font-mono text-[9px] font-semibold leading-relaxed mb-3 text-black/85">
                  ETL telemetry data pipeline pulling FastF1 session laps and driver metrics.
                </p>
                <div className="border-t border-dashed border-black/25 pt-2.5 space-y-1">
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#A5CF4E] font-bold">✶</span>
                    <span><strong>extraction</strong>: pulls telemetry via FastF1 API.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#A5CF4E] font-bold">✶</span>
                    <span><strong>transformation</strong>: normalizes NaN and DNF records.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#A5CF4E] font-bold">✶</span>
                    <span><strong>json storage</strong>: stores raw & cleaned JSON formats.</span>
                  </div>
                  <div className="flex items-start space-x-1 font-mono text-[8px] leading-tight text-black/75">
                    <span className="text-[#A5CF4E] font-bold">✶</span>
                    <span><strong>reporting</strong>: formats Monza 2024 race output.</span>
                  </div>
                </div>
              </ProjectTextCard>
            </div>

          </div>

          {/* Carousel dots indicators */}
          <div className="flex justify-center space-x-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-white opacity-90" />
            <span className="w-2 h-2 rounded-full bg-white opacity-30" />
            <span className="w-2 h-2 rounded-full bg-white opacity-30" />
            <span className="w-2 h-2 rounded-full bg-white opacity-30" />
          </div>
        </div>
      ) : (
        /* Desktop Viewport: Sticky screen horizontal track scroll */
        <div ref={containerRef} id="projects" className="relative h-[400vh] bg-[#191919] w-full section-contain">
          {/* Sticky screen container */}
          <div className="sticky top-0 h-screen w-screen overflow-hidden flex items-center justify-start z-10">
            
            {/* Horizontal track */}
            <motion.div 
              style={{ x: springX }}
              className="flex h-full w-[400vw] pointer-events-auto"
            >
              {/* PANEL 1: Steam Market Intel */}
              <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center bg-[#00A7FE] p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full pt-16 pb-12">
                  {/* Left Column: Visual card */}
                  <div className="flex justify-center items-center h-full">
                    <motion.div 
                      whileHover={{ rotate: 1.5 }}
                      className="w-full max-w-[360px] p-6 bg-white border-3 border-black rounded shadow-[6px_6px_0_rgba(0,0,0,1)] relative rotate-[-2deg] gpu-accelerated"
                    >
                      <div className="absolute top-[-8px] left-[30px] w-12 h-4 paper-tape rotate-[3deg] border-x border-black/10" />
                      {/* Steam SVG sketch */}
                      <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-36 h-36 mx-auto mb-4 float-element gpu-accelerated">
                        <path d="M55 45 v25 c0 6 25 6 25 0 v-25" fill="#FFD860" stroke="black" strokeWidth="2.5" />
                        <ellipse cx="67.5" cy="45" rx="12.5" ry="4.5" fill="#FFE28A" stroke="black" strokeWidth="2.5" />
                        <path d="M55 53 c0 5 25 5 25 0" stroke="black" strokeWidth="2" />
                        <path d="M55 61 c0 5 25 5 25 0" stroke="black" strokeWidth="2" />
                        <rect x="15" y="28" width="34" height="22" rx="7" fill="#FF73B5" stroke="black" strokeWidth="2.5" />
                        <path d="M22 39 h6 m-3 -3 v6" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="39" cy="36" r="2" fill="black" />
                        <circle cx="43" cy="41" r="2" fill="black" />
                        <path d="M35 50 c 5 12 18 12 24 5" stroke="black" strokeWidth="2.5" strokeDasharray="3,3" strokeLinecap="round" fill="none" />
                        <polygon points="59,57 60,52 55,54" fill="black" />
                      </svg>
                      <h4 className="font-mono font-bold text-xs uppercase text-black/50 text-center mb-1">[steam market intel]</h4>
                      <p className="font-mono text-[10px] text-center font-semibold leading-snug">Processes 27,000+ Steam game records into a production-grade PostgreSQL star schema.</p>
                    </motion.div>
                  </div>

                  {/* Right Column: Text card */}
                  <div className="flex flex-col justify-center items-start relative h-full w-full">
                    <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/steam-market-intel" rotateClass="rotate-[1.5deg]">
                      <div className="absolute top-[-9px] right-[40px] w-16 h-5 paper-tape rotate-[-5deg] border-x border-black/10 z-20" />
                      
                      {/* Header Pill */}
                      <div className="inline-flex items-center space-x-1.5 bg-[#FFD860] border-2 border-black rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#000] z-20 relative">
                        <span>ETL Pipeline</span>
                        <span>⚡</span>
                      </div>

                      {/* Text Assembly Header */}
                      <ScatteredWord 
                        word="STEAM MARKET INTEL" 
                        scrollProgress={scrollYProgress} 
                        triggerRange={[0.0, 0.16, 0.28]} 
                        outputRange={[0.0, 0.0, 1.0]} 
                        sizeClass="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]"
                      />

                      <p className="font-mono text-xs font-semibold leading-relaxed mb-6">
                        An end-to-end Python data engineering pipeline processing 27,000+ Steam records into a production-grade PostgreSQL star schema.
                      </p>

                      <div className="border-t-2 border-dashed border-black/25 pt-4 space-y-2">
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>pandas transform</strong>: cleans raw game data using Pandas with custom null-handling and dtype conversions.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>star schema</strong>: creates dim_genre, dim_developer, dim_release, and fact_games with strict DB-level constraints.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>idempotency engine</strong>: safe to run multiple times with pre-load checks to prevent duplicate records.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>sqlalchemy loading</strong>: loads transformed tables using SQLAlchemy, parameterized queries, and psycopg2.</span>
                        </div>
                      </div>
                    </ProjectTextCard>
                  </div>
                </div>
              </div>

              {/* PANEL 2: Sentiment Analyzer */}
              <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center bg-[#FFD860] p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none z-0" />
                
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full pt-16 pb-12 z-10">
                  {/* Left Column: Visual card */}
                  <div className="flex justify-center items-center h-full">
                    <motion.div 
                      whileHover={{ rotate: -1.5 }}
                      className="w-full max-w-[360px] p-6 bg-white border-3 border-black rounded shadow-[6px_6px_0_rgba(0,0,0,1)] relative rotate-[2deg] gpu-accelerated"
                    >
                      <div className="absolute top-[-8px] right-[30px] w-12 h-4 paper-tape rotate-[-4deg] border-x border-black/10" />
                      
                      {/* Sentiment SVG sketch */}
                      <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-36 h-36 mx-auto mb-4 float-element gpu-accelerated" style={{ animationDelay: "1s" }}>
                        <path d="M20 25 h60 v40 h-20 l-15 15 l-5-15 h-20 z" fill="#FF73B5" />
                        <circle cx="40" cy="40" r="5" fill="black" />
                        <circle cx="60" cy="40" r="5" fill="black" />
                        <path d="M42 52 Q50 58 58 52" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <rect x="25" y="75" width="12" height="15" fill="#A5CF4E" stroke="black" strokeWidth="2" />
                        <rect x="42" y="70" width="12" height="20" fill="#FFD860" stroke="black" strokeWidth="2" />
                        <rect x="59" y="80" width="12" height="10" fill="#FF73B5" stroke="black" strokeWidth="2" />
                      </svg>
                      
                      <h4 className="font-mono font-bold text-xs uppercase text-black/50 text-center mb-1">[sentiment analyzer]</h4>
                      <p className="font-mono text-[10px] text-center font-semibold leading-snug">Fetches comments from the YouTube API and conducts fanbase sentiment analysis using VADER.</p>
                    </motion.div>
                  </div>

                  {/* Right Column: Text card */}
                  <div className="flex flex-col justify-center items-start h-full w-full">
                    <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/SentimentPipeline" rotateClass="rotate-[-1deg]">
                      <div className="absolute top-[-9px] left-[40px] w-16 h-5 paper-tape rotate-[3deg] border-x border-black/10 z-20" />
                      
                      {/* Header Pill */}
                      <div className="inline-flex items-center space-x-1.5 bg-[#FF73B5] text-white border-2 border-black rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#000] z-20 relative">
                        <span>NLP Pipeline</span>
                        <span>⚡</span>
                      </div>

                      {/* Text Assembly Header */}
                      <ScatteredWord 
                        word="SENTIMENT ANALYZER" 
                        scrollProgress={scrollYProgress} 
                        triggerRange={[0.08, 0.22, 0.44, 0.56]} 
                        outputRange={[1.0, 0.0, 0.0, 1.0]} 
                        sizeClass="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]"
                      />

                      <p className="font-mono text-xs font-semibold leading-relaxed mb-6">
                        A Python data pipeline crawling real YouTube comments and aggregating sentiment metrics across artists using VADER sentiment analysis.
                      </p>

                      <div className="border-t-2 border-dashed border-black/25 pt-4 space-y-2">
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#FF73B5] font-bold">✶</span>
                          <span><strong>comments crawler</strong>: grabs 100 comments via YouTube API v3.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#FF73B5] font-bold">✶</span>
                          <span><strong>sentiment analysis</strong>: uses VADER optimized for social media text.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#FF73B5] font-bold">✶</span>
                          <span><strong>parquet output</strong>: aggregates average sentiment and saves to Parquet.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#FF73B5] font-bold">✶</span>
                          <span><strong>fanbase insight</strong>: Mitski fans show high negative scores (sad lyrics).</span>
                        </div>
                      </div>
                    </ProjectTextCard>
                  </div>
                </div>
              </div>

              {/* PANEL 3: Open Library */}
              <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center bg-[#A5CF4E] p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full pt-16 pb-12">
                  {/* Left Column: Visual card */}
                  <div className="flex justify-center items-center h-full">
                    <motion.div 
                      whileHover={{ rotate: 1.5 }}
                      className="w-full max-w-[360px] p-6 bg-white border-3 border-black rounded shadow-[6px_6px_0_rgba(0,0,0,1)] relative rotate-[-2deg] gpu-accelerated"
                    >
                      <div className="absolute top-[-8px] left-[30px] w-12 h-4 paper-tape rotate-[3deg] border-x border-black/10" />
                      
                      {/* Library SVG sketch */}
                      <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2.5" className="w-36 h-36 mx-auto mb-4 float-element gpu-accelerated" style={{ animationDelay: "1.5s" }}>
                        <rect x="15" y="25" width="40" height="50" rx="3" fill="#FFD860" />
                        <line x1="22" y1="35" x2="48" y2="35" />
                        <line x1="22" y1="45" x2="48" y2="45" />
                        <line x1="22" y1="55" x2="48" y2="55" />
                        <rect x="60" y="45" width="30" height="35" rx="2" fill="#FFD860" />
                        <path d="M70 55 h10 M70 65 h10" stroke="black" strokeWidth="2" />
                        <path d="M40 50 Q52 40 60 50" stroke="black" strokeWidth="2.5" fill="none" />
                        <polygon points="58,52 62,50 58,47" fill="black" />
                      </svg>
                      
                      <h4 className="font-mono font-bold text-xs uppercase text-black/50 text-center mb-1">[open library api]</h4>
                      <p className="font-mono text-[10px] text-center font-semibold leading-snug">API book data cleaning pipeline built with zero pandas dependencies.</p>
                    </motion.div>
                  </div>

                  {/* Right Column: Text card */}
                  <div className="flex flex-col justify-center items-start h-full w-full">
                    <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/openLibrary" rotateClass="rotate-[1.5deg]">
                      <div className="absolute top-[-9px] right-[40px] w-16 h-5 paper-tape rotate-[-5deg] border-x border-black/10 z-20" />
                      
                      {/* Header Pill */}
                      <div className="inline-flex items-center space-x-1.5 bg-[#00A7FE] text-white border-2 border-black rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#000] z-20 relative">
                        <span>ETL Engine</span>
                        <span>⚙️</span>
                      </div>

                      {/* Text Assembly Header */}
                      <ScatteredWord 
                        word="OPEN LIBRARY PIPELINE" 
                        scrollProgress={scrollYProgress} 
                        triggerRange={[0.33, 0.46, 0.70, 0.82]} 
                        outputRange={[1.0, 0.0, 0.0, 1.0]} 
                        sizeClass="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]"
                      />

                      <p className="font-mono text-xs font-semibold leading-relaxed mb-6">
                        A Python data pipeline fetching books from the Open Library Search API, cleaning response fields, and outputting to CSV and Parquet formats.
                      </p>

                      <div className="border-t-2 border-dashed border-black/25 pt-4 space-y-2">
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>auto pagination</strong>: automatically requests multiple pages of search results.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>data cleaning</strong>: drops unneeded headers and resolves missing/empty fields.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>saving formats</strong>: outputs to CSV as well as optimized schema-aware Parquet.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#00A7FE] font-bold">✶</span>
                          <span><strong>pure python de</strong>: zero shortcuts - uses requests, pyarrow, and csv packages.</span>
                        </div>
                      </div>
                    </ProjectTextCard>
                  </div>
                </div>
              </div>

              {/* PANEL 4: F1 Pipeline */}
              <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center bg-[#FF73B5] p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full pt-16 pb-12">
                  {/* Left Column: visual UI Card */}
                  <div className="flex flex-col justify-center items-start h-full w-full">
                    <ProjectTextCard repoUrl="https://github.com/totaliyahtrash/f1-pipeline" rotateClass="rotate-[-1deg]">
                      <div className="absolute top-[-9px] left-[35px] w-16 h-5 paper-tape rotate-[3deg] border-x border-black/10 z-20" />
                      
                      {/* Header Pill */}
                      <div className="inline-flex items-center space-x-1.5 bg-[#A5CF4E] border-2 border-black rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#000] z-20 relative">
                        <span>Telemetry</span>
                        <span>📦</span>
                      </div>

                      {/* Text Assembly Header */}
                      <ScatteredWord 
                        word="F1 RACE DATA PIPELINE" 
                        scrollProgress={scrollYProgress} 
                        triggerRange={[0.58, 0.70, 1.0]} 
                        outputRange={[1.0, 0.0, 0.0]} 
                        sizeClass="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]"
                      />

                      <p className="font-mono text-xs font-semibold leading-relaxed mb-6">
                        An end-to-end Python ETL pipeline that extracts telemetry and race statistics using the FastF1 library and generates summaries.
                      </p>

                      <div className="border-t-2 border-dashed border-black/25 pt-4 space-y-2">
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#A5CF4E] font-bold">✶</span>
                          <span><strong>extract</strong>: pulls live telemetry and session statistics via FastF1 API.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#A5CF4E] font-bold">✶</span>
                          <span><strong>transform</strong>: converts data types, formats times, and normalizes DNF codes.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#A5CF4E] font-bold">✶</span>
                          <span><strong>json storage</strong>: writes intermediate states to raw and cleaned JSON files.</span>
                        </div>
                        <div className="flex items-start space-x-2 font-mono text-[11px] leading-tight">
                          <span className="text-[#A5CF4E] font-bold">✶</span>
                          <span><strong>reporting</strong>: outputs a formatted Monza 2024 summary text report.</span>
                        </div>
                      </div>
                    </ProjectTextCard>
                  </div>

                  {/* Right Column: Interactive Whiteboard Simulation */}
                  <div className="flex justify-center items-center h-full relative">
                    {/* Whiteboard Circle */}
                    <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full border-4 border-black bg-[#9370db] relative overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,1)] flex items-center justify-center gpu-accelerated">
                      
                      {/* Grid Overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.8px,transparent_1.8px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                      
                      {/* Whiteboard Elements */}
                      
                      {/* Connecting lines - Dotted Track Loop */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white stroke-[2] fill-none stroke-dasharray-[4,4] z-10">
                        <path d="M100 150 C 100 80, 300 80, 300 150 C 300 220, 200 220, 200 280 C 200 340, 100 340, 100 150 Z" />
                      </svg>

                      {/* Green Rectangle (F1 Board title) */}
                      <motion.div 
                        initial={{ x: -10, y: -80 }}
                        className="absolute z-20 bg-[#A5CF4E] border-2 border-black w-24 h-12 flex items-center justify-center rounded text-[10px] font-mono font-bold shadow-[3px_3px_0_#000] rotate-[-5deg] gpu-accelerated"
                      >
                        <span>F1 Telemetry</span>
                      </motion.div>

                      {/* Yellow Sticky Note (Lap stats) */}
                      <motion.div 
                        initial={{ x: 30, y: 50 }}
                        className="absolute z-20 bg-[#FFD860] border-2 border-black w-20 h-20 p-2 flex flex-col justify-between rounded shadow-[3px_3px_0_#000] rotate-[8deg] gpu-accelerated"
                      >
                        <span className="font-mono text-[8px] font-bold leading-tight block uppercase">telemetry:</span>
                        <span className="font-mono text-[9px] leading-tight block">LEC: 1:21.432 (L42)</span>
                      </motion.div>

                      {/* Blue Steering Wheel Icon */}
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        initial={{ x: 60, y: -60 }}
                        className="absolute z-20 w-16 h-16 cursor-pointer pointer-events-auto gpu-accelerated"
                      >
                        <svg viewBox="0 0 100 100" fill="#00A7FE" stroke="black" strokeWidth="4">
                          <circle cx="50" cy="50" r="32" fill="#1c1c1e" stroke="black" strokeWidth="3" />
                          <circle cx="50" cy="50" r="16" fill="#A5CF4E" stroke="black" strokeWidth="2.5" />
                          <rect x="46" y="18" width="8" height="16" fill="black" />
                          <rect x="18" y="46" width="16" height="8" fill="black" />
                          <rect x="66" y="46" width="16" height="8" fill="black" />
                        </svg>
                      </motion.div>

                      {/* Multiplayer Driver 1: Hamilton */}
                      {!isSlow && (
                        <motion.div 
                          variants={cursor1Variants}
                          animate="animate"
                          className="absolute z-30 flex items-center space-x-1 pointer-events-none gpu-accelerated"
                        >
                          <svg className="w-5 h-5 text-teal-400 fill-current drop-shadow" viewBox="0 0 24 24">
                            <path d="M4 2v18l5-5h8l-13-13z" />
                          </svg>
                          <span className="bg-teal-500 text-white font-mono font-bold text-[8px] px-1 rounded shadow">ham (mercedes)</span>
                        </motion.div>
                      )}

                      {/* Multiplayer Driver 2: Verstappen */}
                      {!isSlow && (
                        <motion.div 
                          variants={cursor2Variants}
                          animate="animate"
                          className="absolute z-30 flex items-center space-x-1 pointer-events-none gpu-accelerated"
                        >
                          <svg className="w-5 h-5 text-red-500 fill-current drop-shadow" viewBox="0 0 24 24">
                            <path d="M4 2v18l5-5h8l-13-13z" />
                          </svg>
                          <span className="bg-red-600 text-white font-mono font-bold text-[8px] px-1 rounded shadow">ver (red bull)</span>
                        </motion.div>
                      )}

                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
