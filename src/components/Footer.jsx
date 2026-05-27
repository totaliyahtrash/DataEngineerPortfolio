import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';

// Social SVGs for Card Illustrations
const GitHubLogo = () => (
  <svg viewBox="0 0 16 16" fill="white" className="w-16 h-16 drop-shadow-[0_0_10px_rgba(165,207,78,0.65)]">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-14 h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-14 h-14 drop-shadow-[0_0_10px_rgba(0,167,254,0.65)]">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GmailLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 drop-shadow-[0_0_10px_rgba(255,216,96,0.65)]">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 drop-shadow-[0_0_10px_rgba(255,115,181,0.65)]">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const InteractiveSocialCard = ({ card, index, isDeckHovered, isDesktop, isWelcoming, isSlow }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 100, damping: 15 });
  const springY = useSpring(y, { stiffness: 100, damping: 15 });

  // Transforms for 3D tilt (only on desktop hover, disabled if isSlow is true)
  const transformX = useTransform(springY, [0, 1], [15, -15]);
  const transformY = useTransform(springX, [0, 1], [-15, 15]);

  const rotateX = isSlow ? 0 : transformX;
  const rotateY = isSlow ? 0 : transformY;

  // Shifting holographic position
  const hoverHoloPos = useTransform(
    [springX, springY],
    ([sx, sy]) => `${sx * 100}% ${sy * 100}%`
  );

  // Welcome holo sweep animation
  const sweepHoloMVal = useMotionValue("-50% -50%");
  const activeHoloBgPos = isWelcoming ? sweepHoloMVal : hoverHoloPos;

  // Trigger welcome holo sweep once on mount
  useEffect(() => {
    if (isWelcoming && !isSlow) {
      sweepHoloMVal.set("-50% -50%");
      animate(sweepHoloMVal, "150% 150%", {
        duration: 1.5,
        ease: "easeInOut"
      });
    }
  }, [isWelcoming, isSlow]);

  const handleMouseMove = (e) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsCardHovered(false);
  };

  // Border & Glow mappings per social brand colors
  const glowStyles = {
    'bg-[#A5CF4E]': 'hover:shadow-[0_0_20px_rgba(165,207,78,0.65)] hover:border-[#A5CF4E]/70',
    'bg-zinc-800 text-white border-zinc-700': 'hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:border-zinc-400',
    'bg-[#00A7FE]': 'hover:shadow-[0_0_20px_rgba(0,167,254,0.65)] hover:border-[#00A7FE]/70',
    'bg-[#FFD860]': 'hover:shadow-[0_0_20px_rgba(255,216,96,0.65)] hover:border-[#FFD860]/70',
    'bg-[#FF73B5]': 'hover:shadow-[0_0_20px_rgba(255,115,181,0.65)] hover:border-[#FF73B5]/70'
  };

  const activeGlow = glowStyles[card.color] || 'hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]';

  const offset = index - 2;
  const showFanned = isDeckHovered || isWelcoming;

  // Layout states for fanning cards
  const desktopStyle = isDesktop ? {
    x: isCardHovered ? offset * 230 : (showFanned ? offset * 230 : offset * 35),
    y: isCardHovered ? -40 : (showFanned ? 0 : Math.abs(offset) * 10),
    rotate: isCardHovered ? 0 : (showFanned ? 0 : offset * 8),
    scale: isCardHovered ? 1.08 : 1,
    zIndex: isCardHovered ? 50 : index,
    opacity: 1, // Explicitly force visibility
    position: 'absolute'
  } : {
    x: 0,
    y: 0,
    rotate: index % 2 === 0 ? -3 : 3, // Alternating tilts to make vertical mobile stack lively!
    scale: 1,
    zIndex: index,
    opacity: 1, // Explicitly force visibility
    position: 'relative'
  };

  // Mobile spring reveal animation values
  const mobileMotionProps = !isDesktop ? {
    initial: { opacity: 0, y: 55, scale: 0.9, rotate: index % 2 === 0 ? -8 : 8 },
    whileInView: { opacity: 1, y: 0, scale: 1, rotate: index % 2 === 0 ? -3 : 3 },
    viewport: { once: true, margin: "-40px" },
    transition: { type: "spring", stiffness: 100, damping: 14, delay: index * 0.05 }
  } : {};

  return (
    <motion.a
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (isDesktop) setIsCardHovered(true);
      }}
      onMouseLeave={handleMouseLeave}
      animate={desktopStyle}
      {...mobileMotionProps}
      transition={isDesktop ? { type: "spring", stiffness: 200, damping: 18 } : mobileMotionProps.transition}
      className={`bg-white border-4 border-black rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,1)] flex flex-col p-2.5 z-20 text-black select-none cursor-pointer w-[215px] h-[300px] shrink-0 ${isDesktop ? `transition-shadow duration-200 ${activeGlow}` : 'hover:shadow-[8px_8px_0_rgba(0,0,0,1)] active:scale-95'}`}
      style={{
        rotateX: isDesktop && isCardHovered ? rotateX : 0,
        rotateY: isDesktop && isCardHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Card Face Inner Frame */}
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="flex-1 flex flex-col border-2 border-black/25 rounded-xl p-3 bg-[#faf9f5] relative overflow-hidden"
      >
        {/* Holographic foil shine layer overlay (welcome or hover, bypassed on slow networks) */}
        {(isCardHovered || isWelcoming) && !isSlow && (
          <motion.div 
            style={{ 
              backgroundPosition: activeHoloBgPos,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (isCardHovered || isWelcoming) ? 0.55 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 holo-shimmer-bg z-30 pointer-events-none"
          />
        )}
        
        {/* Holographic light glare overlay (welcome or hover, bypassed on slow networks) */}
        {(isCardHovered || isWelcoming) && !isSlow && (
          <motion.div 
            style={{ 
              backgroundPosition: activeHoloBgPos,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (isCardHovered || isWelcoming) ? 0.65 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 holo-glare z-30 pointer-events-none"
          />
        )}

        {/* Platform Badge & Handle */}
        <div className="flex flex-col border-b border-black/10 pb-1 mb-1.5 z-10 text-left">
          <span className="font-bubble text-xs font-black tracking-wide text-[#7C3AED] leading-none">{card.badge}</span>
          <span className="font-mono text-[8.5px] font-black text-black/40 mt-0.5 leading-none">{card.handle}</span>
        </div>

        {/* Illustration Window */}
        <div className={`border-2 border-black h-24 relative rounded overflow-hidden flex items-center justify-center shadow-[inset_0_3px_5px_rgba(0,0,0,0.5)] my-1.5 z-10 ${card.color}`}>
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-40 animate-pulse" />
          <div style={{ transform: "translateZ(20px)" }}>
            {card.logo}
          </div>
        </div>

        {/* Neobrutalist Stats Badge */}
        <div className="bg-zinc-950 text-white py-1 px-1.5 text-[7px] font-mono font-black text-center tracking-wider rounded border border-black uppercase mt-1 mb-1.5 z-10 truncate">
          {card.stats}
        </div>

        {/* Professional Bio Detail */}
        <div className="flex-grow flex flex-col justify-between pt-1 z-10 text-left">
          <p className="font-mono text-[8px] leading-relaxed text-black/85 select-text font-semibold">
            {card.abilityDetail}
          </p>
          
          {/* Platform link hint */}
          <div className="border-t border-black/10 pt-1 text-[6.5px] text-center font-bold text-black/35 truncate uppercase tracking-widest mt-1.5">
            click to visit ↗
          </div>
        </div>
      </div>
    </motion.a>
  );
};

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

export default function Footer() {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [isWelcoming, setIsWelcoming] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    setIsSlow(isSlowNetworkOrDevice());
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // One-time welcome fanning animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcoming(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const socialCards = [
    {
      handle: '@totaliyahtrash',
      badge: 'GITHUB',
      stats: 'REPOS & PROJECTS',
      logo: <GitHubLogo />,
      color: 'bg-[#A5CF4E]',
      abilityDetail: 'source code for multiple repos and projects built in different tech stacks.',
      link: 'https://github.com/totaliyahtrash'
    },
    {
      handle: '@dhruvxdsaini',
      badge: 'X (TWITTER)',
      stats: 'REAL-TIME LOGS',
      logo: <XLogo />,
      color: 'bg-zinc-800 text-white border-zinc-700',
      abilityDetail: 'real-time logs, proof of work, and quick development updates.',
      link: 'https://x.com/dhruvxdsaini'
    },
    {
      handle: 'dhruvxdsaini',
      badge: 'LINKEDIN',
      stats: 'PROOF OF WORK',
      logo: <LinkedInLogo />,
      color: 'bg-[#00A7FE]',
      abilityDetail: 'professional milestones, proof of work, and data engineering logs.',
      link: 'https://linkedin.com/in/dhruvxdsaini/'
    },
    {
      handle: 'dhruvsainiatwork@gmail.com',
      badge: 'GMAIL',
      stats: 'FAST RESPONSE • INQUIRIES',
      logo: <GmailLogo />,
      color: 'bg-[#FFD860]',
      abilityDetail: 'Available for contract roles, enterprise data scaling, and collaborative projects.',
      link: isDesktop ? 'https://mail.google.com/mail/?view=cm&fs=1&to=dhruvsainiatwork@gmail.com' : 'mailto:dhruvsainiatwork@gmail.com'
    },
    {
      handle: '@dhruvdsaini',
      badge: 'INSTAGRAM',
      stats: 'PERSONAL DIARY',
      logo: <InstagramLogo />,
      color: 'bg-[#FF73B5]',
      abilityDetail: 'personal updates, travel snaps, and life behind the code.',
      link: 'https://www.instagram.com/dhruvdsaini/'
    }
  ];

  return (
    <section
      id="contact"
      className="relative min-h-[90vh] w-full bg-gradient-to-br from-[#0a0b12] via-[#101222] to-[#1a1c32] border-t-4 border-black flex flex-col justify-between overflow-hidden text-black select-none font-mono py-16 pb-0 animate-fade-in section-contain"
    >
      {/* Hide Scrollbar Style Block */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

      {/* Header Banner */}
      <div className="w-full max-w-6xl mx-auto px-6 mb-8 text-center lg:text-left z-10">
        <span className="font-bubble text-white text-3xl sm:text-4xl font-black block tracking-tight uppercase drop-shadow-[2px_2px_0_#000]">
          Connect Deck
        </span>
        <span className="text-[10px] sm:text-xs text-white/40 font-semibold uppercase tracking-wider block mt-1">
          {isDesktop ? "hover deck to fan out • click any card to visit profile" : "scroll vertically to view cards • click to visit"}
        </span>
      </div>

      {/* C. The TCG Cards Showcase */}
      <div 
        onMouseEnter={() => {
          if (isDesktop) {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            setIsDeckHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (isDesktop) {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            // Delay closing by 5 seconds (5000ms)
            hoverTimeoutRef.current = setTimeout(() => {
              setIsDeckHovered(false);
            }, 5000);
          }
        }}
        className={isDesktop 
          ? "relative flex-1 flex items-center justify-center w-full min-h-[420px] mx-auto z-20"
          : "flex flex-col items-center justify-center w-full max-w-sm mx-auto px-6 mt-12 z-20"
        }
      >
        {isDesktop ? (
          socialCards.map((card, index) => (
            <InteractiveSocialCard 
              key={card.badge} 
              card={card} 
              index={index} 
              isDeckHovered={isDeckHovered}
              isDesktop={isDesktop}
              isWelcoming={isWelcoming}
              isSlow={isSlow}
            />
          ))
        ) : (
          /* Mobile Unified Social Board Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-full max-w-sm bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0_rgba(0,0,0,1)] text-black font-mono relative z-25"
          >
            {/* Neobrutalist tape sticker */}
            <div className="absolute top-[-10px] left-8 w-24 h-5.5 paper-tape rotate-[-4deg] border-x border-black/10 z-30" />
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
              <span className="font-bubble text-lg font-black uppercase text-black">CONTACT INDEX</span>
              <span className="text-[8px] bg-yellow-300 border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_#000] font-black">5 ACTIVE NODES</span>
            </div>

            <div className="flex flex-col space-y-4">
              {socialCards.map((card) => (
                <a 
                  key={card.badge}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border-2 border-black rounded-xl bg-[#faf9f5] hover:bg-black/5 active:scale-95 transition-all shadow-[3px_3px_0_#000] active:shadow-[1px_1px_0_#000] active:translate-x-[2px] active:translate-y-[2px]"
                >
                  {/* Left Side: Avatar/Icon */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000] shrink-0 ${card.color}`}>
                      <div className="flex items-center justify-center select-none pointer-events-none [&_svg]:!w-6 [&_svg]:!h-6 [&_svg]:!drop-shadow-none">
                        {card.logo}
                      </div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bubble text-[11px] font-black text-[#7C3AED] leading-none">{card.badge}</span>
                      <span className="font-mono text-[9px] text-black/50 mt-1 font-semibold leading-none">{card.handle}</span>
                    </div>
                  </div>

                  {/* Right Side: Visit Link badge */}
                  <div className="bg-black text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded border border-black flex items-center shrink-0">
                    VISIT ↗
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* F. Minimal Inspiration and Credits footer */}
      <div className="w-full border-t border-white/5 py-8 mt-12 flex flex-col sm:flex-row items-center justify-between px-6 max-w-6xl mx-auto text-white/30 text-[10px] sm:text-xs z-10">
        <span>© 2026 Dhruv Saini. All Rights Reserved.</span>
        <span>
          inspired by{' '}
          <a
            href="https://remote-rituals.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white hover:underline transition-colors"
          >
            Remote Rituals
          </a>
        </span>
      </div>

    </section>
  );
}
