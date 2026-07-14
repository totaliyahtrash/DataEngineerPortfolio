import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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

// SVG Assets for technology characters
const PythonAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <path d="M20 70 C 20 40, 50 30, 50 50 C 50 70, 80 60, 80 30" stroke="#1c1c1c" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 70 C 20 40, 50 30, 50 50 C 50 70, 80 60, 80 30" stroke="#005b9f" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="16" fill="#005b9f" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="10" fill="#ffd860" />
    <circle cx="46" cy="48" r="2.2" fill="#1c1c1c" />
    <circle cx="54" cy="48" r="2.2" fill="#1c1c1c" />
    <circle cx="45" cy="47" r="0.6" fill="#fff" />
    <circle cx="53" cy="47" r="0.6" fill="#fff" />
    <path d="M50 60 L50 67 L47 70 M50 67 L53 70" stroke="#ff4081" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 50 A 16 16 0 0 1 66 50" stroke="#1c1c1c" strokeWidth="4" fill="none" strokeLinecap="round" />
    <rect x="30" y="45" width="5" height="10" rx="2.5" fill="#1c1c1c" />
    <rect x="65" y="45" width="5" height="10" rx="2.5" fill="#1c1c1c" />
    <path d="M67 52 L73 55" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PostgresAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <circle cx="32" cy="50" r="16" fill="#ff73b5" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="68" cy="50" r="16" fill="#ff73b5" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="32" cy="50" r="10" fill="#ff4081" />
    <circle cx="68" cy="50" r="10" fill="#ff4081" />
    <ellipse cx="50" cy="52" rx="20" ry="18" fill="#a5cf4e" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="42" cy="48" r="2.5" fill="#1c1c1c" />
    <circle cx="58" cy="48" r="2.5" fill="#1c1c1c" />
    <circle cx="41" cy="46" r="0.8" fill="#fff" />
    <circle cx="57" cy="46" r="0.8" fill="#fff" />
    <circle cx="35" cy="55" r="2" fill="#ff4081" opacity="0.6" />
    <circle cx="65" cy="55" r="2" fill="#ff4081" opacity="0.6" />
    <path d="M50 58 Q 50 78, 62 76" stroke="#1c1c1c" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M50 58 Q 50 78, 62 76" stroke="#a5cf4e" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const AirflowAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <motion.g 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      style={{ transformOrigin: "50px 50px" }}
    >
      <circle cx="50" cy="50" r="28" stroke="#1c1c1c" strokeWidth="2" strokeDasharray="6 4" fill="none" />
    </motion.g>
    <path d="M30 65 A 12 12 0 0 1 35 42 A 16 16 0 0 1 65 38 A 12 12 0 0 1 72 65 Z" fill="#fff" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="45" cy="52" r="2" fill="#1c1c1c" />
    <circle cx="55" cy="52" r="2" fill="#1c1c1c" />
    <path d="M47 57 C 48 59, 52 59, 53 57" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <motion.path 
      d="M20 62 L10 62 M24 50 L12 50 M22 56 L8 56" 
      stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round"
      animate={{ x: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

const CloudAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <rect x="35" y="24" width="30" height="24" rx="4" fill="#ffd860" stroke="#1c1c1c" strokeWidth="2.5" />
    <line x1="39" y1="31" x2="61" y2="31" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" />
    <line x1="39" y1="40" x2="61" y2="40" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" />
    <circle cx="43" cy="31" r="1" fill="#ff4081" />
    <circle cx="43" cy="40" r="1" fill="#00e676" />
    <path d="M20 70 A 14 14 0 0 1 30 44 A 20 20 0 0 1 70 44 A 14 14 0 0 1 80 70 Z" fill="#ffd860" stroke="#1c1c1c" strokeWidth="2.5" />
    <circle cx="43" cy="58" r="2.5" fill="#1c1c1c" />
    <circle cx="57" cy="58" r="2.5" fill="#1c1c1c" />
    <path d="M48 64 C 49 66, 51 66, 52 64" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const SparkAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <path d="M50 15 C30 40, 25 65, 30 78 C35 90, 65 90, 70 78 C75 65, 70 40, 50 15 Z" fill="#9370db" stroke="#1c1c1c" strokeWidth="2.5" />
    <path d="M50 35 C38 52, 36 68, 40 76 C44 82, 56 82, 60 76 C64 68, 62 52, 50 35 Z" fill="#ff73b5" />
    <polygon points="35,50 45,50 48,42 51,50 61,50 53,55 56,64 50,59 44,64 47,55" fill="#1c1c1c" />
    <path d="M47 68 Q50 72 53 68" stroke="#1c1c1c" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarehouseAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    <polygon points="50,20 80,32 50,44 20,32" fill="#ffa500" stroke="#1c1c1c" strokeWidth="2.5" />
    <polygon points="50,44 80,32 80,68 50,80" fill="#cc7a00" stroke="#1c1c1c" strokeWidth="2.5" />
    <polygon points="20,32 50,44 50,80 20,68" fill="#ffb833" stroke="#1c1c1c" strokeWidth="2.5" />
    <path d="M50 32 L50 68" stroke="#1c1c1c" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
    <circle cx="35" cy="54" r="2" fill="#1c1c1c" />
    <circle cx="43" cy="58" r="2" fill="#1c1c1c" />
    <path d="M37 62 Q 39 64 41 62" stroke="#1c1c1c" strokeWidth="1" />
  </svg>
);

const RedshiftAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    {/* Red Database Stack */}
    <path d="M25 35 v12 c0 6 50 6 50 0 v-12" fill="#b91c1c" stroke="#1c1c1e" strokeWidth="2.5" />
    <path d="M25 55 v12 c0 6 50 6 50 0 v-12" fill="#b91c1c" stroke="#1c1c1e" strokeWidth="2.5" />
    
    <ellipse cx="50" cy="35" rx="25" ry="6" fill="#ef4444" stroke="#1c1c1e" strokeWidth="2.5" />
    <ellipse cx="50" cy="55" rx="25" ry="6" fill="#ef4444" stroke="#1c1c1e" strokeWidth="2.5" />
    
    {/* Connection lines / details */}
    <path d="M25 41 c0 5 50 5 50 0" stroke="#1c1c1e" strokeWidth="1.5" />
    <path d="M25 61 c0 5 50 5 50 0" stroke="#1c1c1e" strokeWidth="1.5" />
    
    {/* Face on the top cylinder */}
    <circle cx="42" cy="35" r="2.2" fill="#1c1c1e" />
    <circle cx="58" cy="35" r="2.2" fill="#1c1c1e" />
    <path d="M46 39 Q50 41 54 39" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Ascending Arrow block */}
    <motion.path 
      d="M50 15 L58 23 H53 V29 H47 V23 H42 Z" 
      fill="#ffd860" 
      stroke="#1c1c1e" 
      strokeWidth="2" 
      strokeLinejoin="miter"
      animate={{ y: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    />
  </svg>
);

const PowerBIAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 object-contain" fill="none">
    {/* Neobrutalist Power BI Bars */}
    {/* Bar 1 (Shortest, Yellow-Gold) */}
    <rect x="25" y="55" width="12" height="25" rx="1.5" fill="#f2c811" stroke="#1c1c1e" strokeWidth="2.5" />
    {/* Bar 2 (Medium, Yellow-Orange) */}
    <rect x="44" y="38" width="12" height="42" rx="1.5" fill="#f2a900" stroke="#1c1c1e" strokeWidth="2.5" />
    {/* Bar 3 (Tallest, Dark Orange) */}
    <rect x="63" y="20" width="12" height="60" rx="1.5" fill="#e07c00" stroke="#1c1c1e" strokeWidth="2.5" />

    {/* Highlight details on bars */}
    <path d="M29 59 v17 M48 42 v34 M67 24 v52" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    
    {/* Cute face on the tallest bar */}
    <circle cx="66" cy="27" r="1.5" fill="#1c1c1e" />
    <circle cx="72" cy="27" r="1.5" fill="#1c1c1e" />
    <path d="M67 31 Q69 32.5 71 31" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const PythonReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <path 
      d="M8 12c0-3 3-5 6-5s6 2 6 5v6c0 3-3 5-6 5s-6-2-6-5v-6z" 
      fill="#22c55e" 
      stroke="#1c1c1e" 
      strokeWidth="2.5" 
    />
    <path 
      d="M14 23c0 2 2 3 4 3s4-1 4-3v-6" 
      stroke="#22c55e" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    <path 
      d="M14 23c0 2 2 3 4 3s4-1 4-3v-6" 
      stroke="#1c1c1e" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <circle cx="11.5" cy="11.5" r="1.2" fill="#1c1c1e" />
    <circle cx="16.5" cy="11.5" r="1.2" fill="#1c1c1e" />
    <path d="M14 15v3" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PostgresReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <ellipse cx="8" cy="15" rx="5" ry="7" fill="#60a5fa" stroke="#1c1c1e" strokeWidth="2" />
    <ellipse cx="24" cy="15" rx="5" ry="7" fill="#60a5fa" stroke="#1c1c1e" strokeWidth="2" />
    <circle cx="16" cy="16" r="7" fill="#3b82f6" stroke="#1c1c1e" strokeWidth="2" />
    <circle cx="13.5" cy="14.5" r="1" fill="#1c1c1e" />
    <circle cx="18.5" cy="14.5" r="1" fill="#1c1c1e" />
    <path d="M16 19v4c0 1.5 1 2 2.5 1.5" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M11 18l-2.5 2M21 18l2.5 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M11 18l-2.5 2M21 18l2.5 2" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AirflowReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <path 
      d="M6 10h12a4 4 0 014 4v0a4 4 0 01-4 4H10a4 4 0 00-4 4v0a4 4 0 004 4h16" 
      stroke="#38bdf8" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <path 
      d="M6 10h12a4 4 0 014 4v0a4 4 0 01-4 4H10a4 4 0 00-4 4v0a4 4 0 004 4h16" 
      stroke="#1c1c1e" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
    />
  </svg>
);

const CloudReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <path 
      d="M9 20a4 4 0 01-1-7.87 6 6 0 0111.74-1.78 4 4 0 015.65 4.8A4 4 0 0123 20H9z" 
      fill="#a5f3fc" 
      stroke="#1c1c1e" 
      strokeWidth="2.2" 
      strokeLinejoin="round" 
    />
    <circle cx="12" cy="15" r="1" fill="#1c1c1e" />
    <circle cx="16" cy="15" r="1" fill="#1c1c1e" />
  </svg>
);

const SparkReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <path 
      d="M16 4l3.5 8.5L28 16l-8.5 3.5L16 28l-3.5-8.5L4 16l8.5-3.5Z" 
      fill="#facc15" 
      stroke="#1c1c1e" 
      strokeWidth="2.2" 
      strokeLinejoin="round" 
    />
  </svg>
);

const WarehouseReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <rect x="6" y="8" width="20" height="18" rx="2" fill="#fb923c" stroke="#1c1c1e" strokeWidth="2.2" />
    <path d="M6 14h20M16 14v12" stroke="#1c1c1e" strokeWidth="2.2" />
    <rect x="13" y="11" width="6" height="6" fill="#fdba74" stroke="#1c1c1e" strokeWidth="1.5" />
  </svg>
);

const RedshiftReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <path 
      d="M19 4L7 18h8v10l12-14h-8Z" 
      fill="#ef4444" 
      stroke="#1c1c1e" 
      strokeWidth="2.2" 
      strokeLinejoin="round" 
    />
  </svg>
);

const PowerBIReaction = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 object-contain" fill="none">
    <rect x="6" y="18" width="5" height="10" rx="0.5" fill="#f2c811" stroke="#1c1c1e" strokeWidth="2.2" />
    <rect x="14" y="12" width="5" height="16" rx="0.5" fill="#f2a900" stroke="#1c1c1e" strokeWidth="2.2" />
    <rect x="22" y="6" width="5" height="22" rx="0.5" fill="#e07c00" stroke="#1c1c1e" strokeWidth="2.2" />
  </svg>
);

export default function SkillsMeet() {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [handActive, setHandActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [reactions, setReactions] = useState([]); 
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    setIsSlow(isSlowNetworkOrDevice());
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile lively automatic participant reactions (since there is no hover on touchscreens)
  useEffect(() => {
    if (!isMobile || isSlow) return;
    
    const interval = setInterval(() => {
      const skills = ["Python", "Postgres", "Airflow", "GCP / Cloud", "PySpark", "Warehousing", "Redshift", "Power BI"];
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      setHoveredCard(randomSkill);
      
      const timer = setTimeout(() => {
        setHoveredCard(null);
      }, 1800);
      
      return () => clearTimeout(timer);
    }, 4500);

    return () => clearInterval(interval);
  }, [isMobile, isSlow]);
  
  // Animation states for the sequential introduction reveal
  const [startSequence, setStartSequence] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [hudPhase, setHudPhase] = useState("hidden"); // "hidden" | "red-pop" | "expanded"

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const controlsRef = useRef(null);

  const titleInView = useInView(sectionRef, { once: true, margin: "-10% 0px -10% 0px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-15% 0px -15% 0px" });
  const controlsInView = useInView(controlsRef, { once: true, margin: "-10% 0px -10% 0px" });

  // Stage 1: Title Reveal
  useEffect(() => {
    if (titleInView) {
      setShowTitle(true);
    }
  }, [titleInView]);

  // Stage 2: Cards Grid Reveal
  useEffect(() => {
    if (gridInView) {
      setShowCards(true);
    }
  }, [gridInView]);

  // Stage 3: HUD Controls & Typewriter Reveal
  useEffect(() => {
    if (controlsInView) {
      setHudPhase("red-pop");
      const timer = setTimeout(() => {
        setHudPhase("expanded");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [controlsInView]);

  // Typewriter effect state
  const [typedText, setTypedText] = useState("");
  const fullText = "hey! i'm a data analyst and engineer working remotely from india, open to remote roles globally or relocation for the right team. let's sync up and build something solid!";
  
  useEffect(() => {
    if (showCards) {
      let index = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.substring(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showCards]);

  // Handle raise hand toast
  useEffect(() => {
    if (handActive) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [handActive]);

  // Emoji stream
  const triggerReaction = () => {
    const emojis = ["😅", "✨", "✋", "🐍", "🐘", "🌀", "☁️", "📦", "🚀", "🔥"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji: randomEmoji,
      x: Math.random() * 80 + 10,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  const skillsList = [
    { name: "Python", bg: "bg-[#00A7FE]", component: <PythonAvatar />, reaction: <PythonReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "Postgres", bg: "bg-[#FFD860]", component: <PostgresAvatar />, reaction: <PostgresReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "Airflow", bg: "bg-[#FF73B5]", component: <AirflowAvatar />, reaction: <AirflowReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "GCP / Cloud", bg: "bg-[#A5CF4E]", component: <CloudAvatar />, reaction: <CloudReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "PySpark", bg: "bg-[#9370db]", component: <SparkAvatar />, reaction: <SparkReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "Warehousing", bg: "bg-[#ffa500]", component: <WarehouseAvatar />, reaction: <WarehouseReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "Redshift", bg: "bg-[#ef4444]", component: <RedshiftAvatar />, reaction: <RedshiftReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { name: "Power BI", bg: "bg-[#f2c811]", component: <PowerBIAvatar />, reaction: <PowerBIReaction />, gridClass: "col-span-12 sm:col-span-6 lg:col-span-3" },
  ];

  // Letters of SKILLS! title
  const skillsTitle = "SKILLS!".split("");
  const titleRotations = [-3, 2, -4, 3, -1, 4, -2];

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#191919] pt-24 pb-36 px-4 md:px-6 overflow-x-hidden select-none transition-all duration-700 section-contain"
    >
      
      {/* 1. SKILLS! Header (Step 2 in sequence) */}
      <div className="min-h-[100px] flex items-center justify-center mb-8 z-10 w-full">
        <AnimatePresence>
          {showTitle && (
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: { transition: { staggerChildren: 0.05 } }
              }}
              className="flex justify-center items-center flex-wrap text-white leading-[0.7] text-[12vw] sm:text-[9vw] md:text-[7vw] tracking-[-0.05em] font-black uppercase text-center w-full select-none"
            >
              {skillsTitle.map((char, index) => (
                <motion.span
                  key={`skills-${index}`}
                  variants={{
                    initial: { opacity: 0, scale: 0.6, y: 30 },
                    animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 15 } }
                  }}
                  style={{ 
                    fontFamily: "'Unbounded', sans-serif",
                    display: 'inline-block',
                    transform: `rotate(${titleRotations[index % titleRotations.length]}deg) translateY(${index % 2 === 0 ? '-3px' : '3px'})`,
                    marginRight: '-0.04em',
                  }}
                  className="hover:scale-110 transition-transform duration-200 cursor-default drop-shadow-[0_8px_0_rgba(0,0,0,0.3)] text-white"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Google Meet Participant Grid (Step 3 in sequence: 4 up, 3 down) */}
      <div ref={gridRef} className="w-full max-w-5xl grid grid-cols-12 gap-4 md:gap-6 px-2 sm:px-6 md:px-8 z-10 mb-28 md:mb-16 min-h-[380px]">
        <AnimatePresence>
          {showCards && (
            <>
              {skillsList.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.7, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.08 }}
                  onMouseEnter={() => setHoveredCard(skill.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative rounded-2xl overflow-hidden aspect-[16/10] border-2 border-black shadow-2xl flex items-center justify-center cursor-pointer group ${skill.gridClass}`}
                >
                  <div className={`absolute inset-0 ${skill.bg} transition-transform duration-300 group-hover:scale-105`} />
                  <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                  
                  <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1">
                    {skill.component}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2.5 py-1 text-white font-mono text-[10px] md:text-xs tracking-wider z-20 flex items-center space-x-1.5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>{skill.name}</span>
                  </div>

                  <AnimatePresence>
                    {hoveredCard === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="absolute top-3 left-3 bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center text-lg z-30 shadow-md"
                      >
                        {skill.reaction}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Control Bar Expansion HUD (Sticks strictly inside Skills Component - STICKY) */}
      <div ref={controlsRef} className="sticky bottom-6 z-40 w-full flex justify-center pointer-events-none mt-auto mb-4">
        <AnimatePresence>
          {hudPhase !== "hidden" && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                width: hudPhase === "red-pop" ? "110px" : "auto" 
              }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="pointer-events-auto flex items-center bg-[#2c2c2e]/95 backdrop-blur-md p-2.5 rounded-full border border-white/10 shadow-2xl select-none overflow-hidden"
            >
              <div className="flex items-center space-x-3.5">
                {/* Other controls (Mic, Cam, Reaction, Hand) */}
                <AnimatePresence>
                  {hudPhase === "expanded" && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-3 pr-3.5 border-r border-white/10 mr-1"
                    >
                      {/* Camera Button */}
                      <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.05 }}
                        onClick={() => setCamActive(!camActive)}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors ${camActive ? 'bg-[#3c4043] hover:bg-[#4c5054] text-white' : 'bg-red-500 text-white border border-red-400'}`}
                      >
                        {camActive ? (
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        ) : (
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" /></svg>
                        )}
                      </motion.button>

                      {/* Microphone Button */}
                      <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                        onClick={() => setMicActive(!micActive)}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors ${micActive ? 'bg-[#3c4043] hover:bg-[#4c5054] text-white' : 'bg-red-500 text-white border border-red-400'}`}
                      >
                        {micActive ? (
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        ) : (
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" /></svg>
                        )}
                      </motion.button>

                      {/* Reaction Button */}
                      <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
                        onClick={triggerReaction}
                        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#3c4043] hover:bg-[#4c5054] text-white flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </motion.button>

                      {/* Hand Raise Button */}
                      <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                        onClick={() => setHandActive(!handActive)}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors ${handActive ? 'bg-[#ffd860] text-black border border-yellow-300' : 'bg-[#3c4043] hover:bg-[#4c5054] text-white'}`}
                      >
                        <span className="text-sm">✋</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* End Call / Leave Button (Pops up first) */}
                <motion.button 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={() => setModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full flex items-center justify-center font-bold tracking-wider text-xs border border-red-400 transition-colors shadow-lg shrink-0"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" className="origin-center transform rotate-[135deg]" /></svg>
                  Leave
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Chat Box (Relocated on mobile below the grid, floating absolute on desktop) */}
      <AnimatePresence>
        {showCards && (
          <motion.div 
            initial={{ opacity: 0, scale: 0, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            className="relative w-full max-w-sm mx-auto mt-8 p-4 bg-white border-2 border-black rounded-2xl rounded-bl-sm shadow-xl z-30 select-none text-black flex flex-col justify-start md:absolute md:bottom-20 md:right-8 md:w-72 md:mt-0 md:max-w-none md:mx-0"
          >
            {/* Humanized sender label */}
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-black/50 font-bold uppercase tracking-wider mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A7FE] animate-pulse" />
              <span>Dhruv Saini</span>
            </div>
            
            {/* Chat message content */}
            <p className="font-mono text-xs md:text-sm text-black font-semibold leading-relaxed min-h-[48px]">
              {typedText}
              {typedText.length < fullText.length && (
                <span className="inline-block w-1.5 h-4 bg-black ml-0.5 animate-pulse" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Reaction Emojis Stream */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              style={{ left: `${r.x}vw`, bottom: isMobile ? "108px" : "32px" }}
              initial={{ y: 0, scale: 0.5, opacity: 0 }}
              animate={{ y: -500, scale: isMobile ? 3.5 : 1.5, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-4xl select-none"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toast Notification (Raise Hand, bottom-left) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, x: isMobile ? "-50%" : 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: isMobile ? "-50%" : 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, x: isMobile ? "-50%" : 0 }}
            className={`fixed md:absolute z-40 text-black font-mono font-bold text-xs flex items-center space-x-2 bg-[#A5CF4E] border-2 border-black px-4 py-3 rounded-xl shadow-2xl ${
              isMobile 
                ? "bottom-[92px] left-1/2 w-[90%] max-w-xs justify-center" 
                : "bottom-8 left-8"
            }`}
            style={isMobile ? { transform: "translateX(-50%)" } : {}}
          >
            <span>✋</span>
            <span>Raise your hand for real - book a call!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Call macOS Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white border-4 border-black w-[90%] max-w-[380px] rounded-2xl shadow-[8px_8px_0_rgba(0,0,0,1)] z-50 overflow-hidden flex flex-col text-black font-mono select-none"
            >
              <div className="bg-[#f0f0f0] border-b-2 border-black px-4 py-2 flex items-center space-x-2">
                <div onClick={() => setModalOpen(false)} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" />
              </div>
              
              <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-[#A5CF4E] mb-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#1c1c1c" strokeWidth="1.5" />
                </svg>
                
                <h3 className="font-bold text-base md:text-lg text-black uppercase tracking-wider mb-2">YOU LEFT THE MEETING</h3>
                <p className="text-xs text-black/60 leading-relaxed mb-6 font-semibold">Ready to build or chat? Book a Google Meet call directly with me.</p>
                
                <div className="w-full flex items-center justify-between border-t border-black/10 pt-5">
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="text-xs font-bold text-black underline underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    Go back
                  </button>
                  <a 
                    href={isMobile ? "mailto:dhruvsainiatwork@gmail.com" : "https://mail.google.com/mail/?view=cm&fs=1&to=dhruvsainiatwork@gmail.com"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00A7FE] text-white border-2 border-black px-4 py-2 rounded-full font-bold text-xs hover:bg-[#0092ff] transition-colors shadow-md"
                  >
                    Book a new meeting
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
