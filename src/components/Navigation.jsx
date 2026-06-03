import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cute Database SVG Component
export const DatabaseSVG = ({ className, isBlinking }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top Disk (Green) */}
    <path d="M4 6C4 4.34 7.58 3 12 3C16.42 3 20 4.34 20 6V8C20 9.66 16.42 11 12 11C7.58 11 4 9.66 4 8V6Z" fill="#A5CF4E" stroke="#1c1c1c" strokeWidth="1.5" />
    
    {/* Middle Disk (Blue) */}
    <path d="M4 11C4 9.34 7.58 8 12 8C16.42 8 20 9.34 20 11V13.5C20 15.16 16.42 16.5 12 16.5C7.58 16.5 4 15.16 4 13.5V11Z" fill="#00A7FE" stroke="#1c1c1c" strokeWidth="1.5" />
    
    {/* Bottom Disk (Pink) */}
    <path d="M4 16.5C4 14.84 7.58 13.5 12 13.5C16.42 13.5 20 14.84 20 16.5V18.5C20 20.16 16.42 21.5 12 21.5C7.58 21.5 4 20.16 4 18.5V16.5Z" fill="#FF73B5" stroke="#1c1c1c" strokeWidth="1.5" />

    {/* Blinking indicator lights */}
    <motion.circle 
      cx="6.5" cy="5.8" r="0.8" 
      animate={isBlinking ? { fill: ["#1c1c1c", "#ff3d00", "#1c1c1c"] } : { fill: "#1c1c1c" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    />
    <motion.circle 
      cx="6.5" cy="10.8" r="0.8" 
      animate={isBlinking ? { fill: ["#1c1c1c", "#00e676", "#1c1c1c"] } : { fill: "#1c1c1c" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.circle 
      cx="6.5" cy="16.3" r="0.8" 
      animate={isBlinking ? { fill: ["#1c1c1c", "#ffeb3b", "#1c1c1c"] } : { fill: "#1c1c1c" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.6 }}
    />

    {/* Cute Face on the Middle Disk */}
    {/* Eyes */}
    <circle cx="10.5" cy="11.2" r="0.7" fill="#1c1c1c" />
    <circle cx="13.5" cy="11.2" r="0.7" fill="#1c1c1c" />
    {/* Smile */}
    <path d="M11.5 12.5C11.5 12.9 12.5 12.9 12.5 12.5" stroke="#1c1c1c" strokeWidth="0.6" strokeLinecap="round" />
    {/* Blushing Cheeks */}
    <circle cx="9.2" cy="11.5" r="0.5" fill="#ff80ab" />
    <circle cx="14.8" cy="11.5" r="0.5" fill="#ff80ab" />
  </svg>
);

// GitHub Cat SVG Component
export const GithubCatSVG = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

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

// Premium TcgCard component with holographic glare/shimmer and tilt
const TcgCard = ({ mousePos }) => {
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    setIsSlow(isSlowNetworkOrDevice());
  }, []);

  const tiltX = isSlow ? 0 : (mousePos.y - 0.5) * 20;
  const tiltY = isSlow ? 0 : (mousePos.x - 0.5) * -20;
  
  // Shimmer/glare coordinate-based positions
  const bgPos = `${mousePos.x * 100}% ${mousePos.y * 100}%`;

  return (
    <motion.a
      href="https://github.com/totaliyahtrash"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1.05, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 15 }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="absolute top-[140%] left-0 w-[270px] h-[375px] bg-white border-4 border-black rounded-2xl shadow-[10px_10px_0_#000] flex flex-col p-3 z-[100] text-black select-none pointer-events-auto cursor-pointer hover:shadow-[14px_14px_0_#000] transition-shadow duration-200 block"
    >
      {/* Card Face Inner Frame */}
      <div className="relative flex-1 flex flex-col border-2 border-black/20 rounded-xl p-2 overflow-hidden bg-[#faf9f5]">
        
        {/* Holographic foil shine layer overlay */}
        {!isSlow && (
          <div 
            style={{ 
              backgroundPosition: bgPos,
            }}
            className="absolute inset-0 holo-shimmer-bg opacity-55 z-30"
          />
        )}
        
        {/* Holographic light glare overlay */}
        {!isSlow && (
          <div 
            style={{ 
              backgroundPosition: bgPos,
            }}
            className="absolute inset-0 holo-glare opacity-65 z-30"
          />
        )}

        {/* Card Header */}
        <div className="flex justify-between items-center px-1 z-10">
          <span className="font-bubble text-xs font-black tracking-tight text-black">totaliyahtrash</span>
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[9px] font-bold text-black/50">BASIC</span>
            <span className="font-mono text-xs font-black text-[#7C3AED]">999 HP ⚡</span>
          </div>
        </div>

        {/* Card Illustration Window */}
        <div className="border-2 border-black bg-slate-900 h-32 my-1.5 relative rounded overflow-hidden flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)] z-10">
          {/* Cyber matrix background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.08)_1px,transparent_1px)] [background-size:8px_8px]" />
          
          {/* GitHub Octocat SVG - ENLARGED */}
          <svg viewBox="0 0 16 16" fill="white" className="w-24 h-24 z-20 drop-shadow-[0_0_12px_rgba(124,58,237,0.9)] transition-all duration-300 group-hover:scale-105">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          
          <div className="absolute bottom-1.5 right-2 bg-yellow-400 border border-black px-1 rounded text-[7px] font-mono font-bold z-20 shadow-[1px_1px_0_#000]">
            No. 128
          </div>
        </div>

        {/* Card Role Info Ribbon */}
        <div className="bg-[#7C3AED] text-white border-y-2 border-black py-0.5 text-[9px] font-mono text-center font-bold tracking-wider z-10">
          DATA ENGINEER POKÉMON
        </div>

        {/* Card Moves / Abilities Details */}
        <div className="flex-1 flex flex-col justify-start py-1.5 space-y-1.5 z-10">
          
          {/* Ability 1 */}
          <div className="flex items-start px-0.5 text-[8.5px] leading-tight">
            <span className="bg-yellow-400 border border-black rounded-full w-4 h-4 flex items-center justify-center text-[7px] font-bold mr-1.5 shadow-[0.5px_0.5px_0_#000] shrink-0">⚡</span>
            <div className="flex-1 text-left font-mono">
              <span className="font-bold border-b border-black/20 pb-0.5">Kafka Stream</span>
              <p className="text-[7.5px] text-black/75 mt-0.5 leading-snug">Streams raw log events directly to storage at 15k events/sec.</p>
            </div>
            <span className="font-bold text-[9.5px] ml-1">30+</span>
          </div>

          {/* Ability 2 */}
          <div className="flex items-start px-0.5 text-[8.5px] leading-tight">
            <span className="bg-purple-400 border border-black rounded-full w-4 h-4 flex items-center justify-center text-[7px] font-bold mr-1.5 shadow-[0.5px_0.5px_0_#000] shrink-0">🔮</span>
            <div className="flex-1 text-left font-mono">
              <span className="font-bold border-b border-black/20 pb-0.5">Schema Smash</span>
              <p className="text-[7.5px] text-black/75 mt-0.5 leading-snug">Parses messy nested JSON structures and locks schemas instantly.</p>
            </div>
            <span className="font-bold text-[9.5px] ml-1">90</span>
          </div>

        </div>

        {/* Card Stats Footer */}
        <div className="border-t border-black/25 pt-1.5 flex justify-between items-center text-[7.5px] font-mono font-bold z-10 px-0.5">
          <div className="flex items-center space-x-0.5">
            <span>weakness</span>
            <span className="text-[9px]">☕</span>
          </div>
          <div className="flex items-center space-x-0.5">
            <span>resistance</span>
            <span className="text-[9px]">🐛</span>
          </div>
          <div className="flex items-center space-x-0.5">
            <span>retreat</span>
            <span>*</span>
          </div>
        </div>

        {/* Small Copyright Footer */}
        <div className="text-[6px] font-mono text-center text-black/40 mt-1 z-10">
          illus. Dhruv Saini © 2026 Pokémon/GitHub
        </div>

      </div>
    </motion.a>
  );
};

export default function Navigation({ setMarioTriggered }) {
  const [gitHovered, setGitHovered] = useState(false);
  const [cardMousePos, setCardMousePos] = useState({ x: 0.5, y: 0.5 });
  const [dbHovered, setDbHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnLandingPage, setIsOnLandingPage] = useState(true);

  // Mobile database warning states
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  const [mobileDbMessage, setMobileDbMessage] = useState(false);
  const [showMobileToast, setShowMobileToast] = useState(false);
  const [dbCooldown, setDbCooldown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsOnLandingPage(window.scrollY < 400);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: isMobile ? 0.4 : 0.8 }}
        className="fixed top-0 left-0 w-full flex justify-between items-center px-4 pt-8 pb-3 md:px-8 md:py-5 z-50 pointer-events-none"
      >
        {/* Left Element: Made By / Developer Badge */}
        <div 
          onMouseEnter={() => setGitHovered(true)}
          onMouseLeave={() => setGitHovered(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setCardMousePos({ x, y });
          }}
          className="flex items-center space-x-2 pointer-events-auto shrink-0 relative group"
        >
          <a 
            href="https://github.com/totaliyahtrash" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 font-mono text-xs sm:text-sm md:text-base text-black bg-[#FFD860] border-3 border-black px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-[4px_4px_0_#000] hover:shadow-[1.5px_1.5px_0_#000] hover:translate-x-[2.5px] hover:translate-y-[2.5px] transition-all duration-150 font-black tracking-tight"
          >
            <GithubCatSVG className="w-4 h-4 md:w-5 md:h-5 text-black shrink-0" />
            <span className="underline decoration-black/20">@totaliyahtrash</span>
          </a>
          <AnimatePresence>
            {gitHovered && <TcgCard mousePos={cardMousePos} />}
          </AnimatePresence>
        </div>

        {/* Center Nav Pill */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="bg-white text-black rounded-full px-3 py-1.5 md:px-5 md:py-2.5 flex items-center shadow-lg border border-black/5 pointer-events-auto select-none max-w-full"
        >
          {/* Color Dots */}
          <div className="hidden sm:flex space-x-1 mr-3 md:mr-6 border-r border-black/10 pr-2 md:pr-4">
            <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            <div className="w-2 h-2 rounded-full bg-[#A5CF4E]" />
            <div className="w-2 h-2 rounded-full bg-[#00A7FE]" />
            <div className="w-2 h-2 rounded-full bg-[#FFD860]" />
          </div>

          {/* Links (Desktop) */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="hidden md:flex items-center space-x-3 md:space-x-5 text-xs md:text-sm font-medium mr-3 md:mr-6"
          >
            {['skills', 'projects', 'bio', 'experience'].map((link) => (
              <a 
                key={link} 
                href={`#${link.replace(' ', '-')}`} 
                className="text-black/80 hover:text-black hover:opacity-60 transition-all duration-150 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
              </a>
            ))}
            <AnimatePresence>
              {!isOnLandingPage && (
                <motion.a 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -1,
                    boxShadow: "3.5px 3.5px 0px #000"
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    x: 1,
                    y: 1,
                    boxShadow: "0.5px 0.5px 0px #000"
                  }}
                  href="/resume.pdf" 
                  download="Dhruv_Saini_Resume.pdf"
                  className="bg-[#A5CF4E] text-black border-2 border-black px-3.5 py-1 rounded-full font-mono font-black text-[9px] tracking-tight shadow-[2px_2px_0_#000] ml-3 shrink-0 uppercase cursor-pointer"
                >
                  resume
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden items-center space-x-1 text-black font-mono text-[10px] font-bold mr-3 border border-black/25 rounded-md px-1.5 py-0.5 hover:bg-black/5 transition-colors"
          >
            <span>menu</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Let's Talk Button linked to #contact */}
          <motion.a 
            layout
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact" 
            className="bg-black text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold hover:bg-black/90 transition-colors shrink-0"
          >
            Let's talk
          </motion.a>
        </motion.div>

        {/* Right Element: Data Engineer & Cute Database */}
        <div className="flex items-center space-x-1.5 md:space-x-2.5 pointer-events-auto shrink-0 min-h-[36px]">
          <span 
            className="font-mono text-xs text-white/80 hover:text-white transition-colors duration-200 cursor-default select-none relative group hidden sm:inline"
          >
            <span className="relative z-10">data engineer</span>
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </span>

          {/* Cute Database SVG Icon (Only active/visible on Landing Page) */}
          <AnimatePresence>
            {isOnLandingPage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
              >
                {/* Tooltip showing "click me!" on hover or "it does nothing" on mobile click */}
                <AnimatePresence>
                  {((!isMobile && dbHovered) || (isMobile && mobileDbMessage)) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.85 }}
                      className="absolute bottom-[130%] right-0 bg-yellow-400 text-black border-2 border-black font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow-[2px_2px_0_#000] whitespace-nowrap z-50 pointer-events-none"
                    >
                      {isMobile ? "it does nothing" : "click me!"}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  onMouseEnter={() => !isMobile && setDbHovered(true)}
                  onMouseLeave={() => !isMobile && setDbHovered(false)}
                  onClick={() => {
                    if (isMobile) {
                      if (dbCooldown) return;
                      setDbCooldown(true);
                      setTimeout(() => setDbCooldown(false), 1500);

                      setMobileDbMessage(true);
                      setTimeout(() => setMobileDbMessage(false), 1000);

                      setShowMobileToast(true);
                      setTimeout(() => setShowMobileToast(false), 1000);
                    } else {
                      if (setMarioTriggered) {
                        setMarioTriggered(true);
                      }
                    }
                  }}
                  animate={(!isMobile && dbHovered) || (isMobile && mobileDbMessage) ? {
                    y: [-3, 3, -3],
                    scale: 1.12
                  } : {
                    y: 0,
                    scale: 1
                  }}
                  transition={(!isMobile && dbHovered) || (isMobile && mobileDbMessage) ? {
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut"
                  } : {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  className="cursor-pointer"
                >
                  <DatabaseSVG className="w-6 h-6 md:w-7 md:h-7" isBlinking={(!isMobile && dbHovered) || (isMobile && mobileDbMessage)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-full bg-[#191919] text-white z-[999] p-6 flex flex-col justify-between pointer-events-auto md:hidden"
          >
            {/* Header of mobile menu */}
            <div className="flex justify-between items-center w-full border-b border-white/10 pb-4">
              <span className="font-mono text-xs font-bold text-white/50 uppercase tracking-wider">navigation menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all font-mono font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Menu Links */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.08 } }
              }}
              className="flex flex-col space-y-5 my-auto select-none px-4"
            >
              {['skills', 'projects', 'bio', 'experience'].map((link) => (
                <motion.div
                  key={link}
                  variants={{
                    hidden: { opacity: 0, x: -30, rotate: -2 },
                    show: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 15 } }
                  }}
                >
                  <a 
                    href={`#${link.replace(' ', '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bubble text-4xl xs:text-5xl uppercase font-black tracking-tighter text-white hover:text-[#7C3AED] hover:scale-105 transition-all inline-block duration-150"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {link}
                  </a>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30, rotate: -2 },
                  show: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 15 } }
                }}
              >
                <a 
                  href="/resume.pdf"
                  download="Dhruv_Saini_Resume.pdf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bubble text-4xl xs:text-5xl uppercase font-black tracking-tighter text-[#A5CF4E] hover:text-[#7C3AED] hover:scale-105 transition-all inline-block duration-150"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  resume
                </a>
              </motion.div>
            </motion.div>

            {/* Footer of mobile menu */}
            <div className="flex flex-col space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-white/40">dhruv saini — portfolio 2026</span>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#A5CF4E] text-black border-2 border-black font-mono font-bold text-xs px-4 py-2 rounded-full hover:bg-[#b5df5e] transition-colors"
                >
                  Let's talk ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Toast Alert */}
      <AnimatePresence>
        {showMobileToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 30, x: "-50%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-8 left-1/2 bg-[#FF5C5C] text-black border-3 border-black px-5 py-3 rounded-2xl shadow-[5px_5px_0_#000] font-mono font-black text-xs text-center z-[1000] pointer-events-none whitespace-nowrap select-none uppercase"
          >
            use desktop for better experience
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

