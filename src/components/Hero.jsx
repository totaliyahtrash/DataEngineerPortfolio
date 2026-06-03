import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';

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

// Classic 8-bit style Mario SVG
const MarioSVG = ({ state, isSuper, isStar, isInvulnerable }) => {
  return (
    <div 
      className={`transition-all duration-300 ${isSuper ? 'scale-[1.8] origin-bottom' : 'scale-[1.0]'}`}
      style={{
        filter: isStar 
          ? 'hue-rotate(180deg) drop-shadow(0 0 10px rgba(255,255,255,1)) brightness(1.2)' 
          : isInvulnerable
            ? 'opacity-60 grayscale(50%)'
            : 'none'
      }}
    >
      <svg viewBox="0 0 32 32" className="w-14 h-14 drop-shadow-[2.5px_2.5px_0_rgba(0,0,0,1)] select-none">
        {/* Cap */}
        <path d="M6 8h18v4H6z" fill="#E52521" stroke="black" strokeWidth="1.5" />
        <path d="M10 6h10v2H10z" fill="#E52521" />
        {/* Face & Hair */}
        <path d="M8 12h14v8H8z" fill="#F5C396" stroke="black" strokeWidth="1.5" />
        <path d="M4 12h4v6H4z" fill="#6A3810" stroke="black" strokeWidth="1.5" />
        <path d="M16 14h6v2h-6z" fill="#6A3810" />
        {/* Overalls / Shirt */}
        <path d="M8 20h14v8H8z" fill="#E52521" stroke="black" strokeWidth="1.5" />
        <path d="M10 20h2v8h-2zm8 0h2v8h-2z" fill="#002FBE" />
        <path d="M10 22v6h10v-6H10z" fill="#002FBE" stroke="black" strokeWidth="1.5" />
        {/* Buttons */}
        <circle cx="11" cy="24" r="1.5" fill="#F5E82C" />
        <circle cx="19" cy="24" r="1.5" fill="#F5E82C" />
        {state === 'jump' ? (
          <>
            <path d="M2 14h6v6H2z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="5" cy="12" r="3.5" fill="white" stroke="black" strokeWidth="1.5" />
            <path d="M22 14h6v6h-6z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="25" cy="12" r="3.5" fill="white" stroke="black" strokeWidth="1.5" />
          </>
        ) : state === 'walk' ? (
          <>
            <path d="M4 22h4v4H4z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="6" cy="27" r="2.5" fill="white" stroke="black" strokeWidth="1.5" />
            <path d="M22 22h4v4h-6z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="24" cy="29" r="2.5" fill="white" stroke="black" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path d="M4 22h4v4H4z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="6" cy="28" r="3" fill="white" stroke="black" strokeWidth="1.5" />
            <path d="M22 22h4v4h-6z" fill="#E52521" stroke="black" strokeWidth="1.5" />
            <circle cx="24" cy="28" r="3" fill="white" stroke="black" strokeWidth="1.5" />
          </>
        )}
        {/* Shoes */}
        <path d="M8 28h5v3H8zm9 0h5v3h-5z" fill="#6A3810" stroke="black" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

// Retro Mushroom SVG
const MushroomSVG = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 drop-shadow-[2.5px_2.5px_0_#000]">
    {/* Cap */}
    <path d="M2 12A10 10 0 0112 2a10 10 0 0110 10H2z" fill="#E52521" stroke="black" strokeWidth="2.5" />
    <circle cx="8" cy="7" r="2.5" fill="white" />
    <circle cx="16" cy="7" r="2.5" fill="white" />
    {/* Base */}
    <path d="M6 12h12v7a3 3 0 01-3 3H9a3 3 0 01-3-3v-7z" fill="#F5C396" stroke="black" strokeWidth="2.5" />
    <circle cx="9.5" cy="15" r="1" fill="black" />
    <circle cx="14.5" cy="15" r="1" fill="black" />
  </svg>
);

// Retro Star SVG
const StarSVG = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 drop-shadow-[2.5px_2.5px_0_#000] fill-yellow-400">
    <polygon 
      points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" 
      stroke="black" 
      strokeWidth="2.5" 
    />
    <circle cx="9.5" cy="11.5" r="1" fill="black" />
    <circle cx="14.5" cy="11.5" r="1" fill="black" />
  </svg>
);

// Mystery Block SVG
const MysteryBlockSVG = ({ isHit }) => {
  if (isHit) {
    return (
      <svg viewBox="0 0 24 24" className="w-11 h-11 drop-shadow-[2px_2px_0_#000]">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#8B5A2B" stroke="black" strokeWidth="2.5" />
        {/* Rivets */}
        <circle cx="5" cy="5" r="1.2" fill="black" />
        <circle cx="19" cy="5" r="1.2" fill="black" />
        <circle cx="5" cy="19" r="1.2" fill="black" />
        <circle cx="19" cy="19" r="1.2" fill="black" />
      </svg>
    );
  }
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      className="w-11 h-11 drop-shadow-[2px_2px_0_#000]"
      animate={{
        fill: ["#FFB000", "#FFD860", "#FFB000"],
      }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }}
    >
      <rect x="2" y="2" width="20" height="20" rx="3" fill="inherit" stroke="black" strokeWidth="2.5" />
      {/* Question Mark */}
      <path d="M9 9c0-2 1.5-3 3-3s3 1 3 2.5c0 1.5-1.5 2-2.5 3v1.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="17.5" r="1.5" fill="black" />
    </motion.svg>
  );
};

// Pipeline Column SVG Component
const PipelineSVG = ({ height, label }) => {
  return (
    <div className="relative flex flex-col justify-end items-center pointer-events-none select-none" style={{ height }}>
      {/* Pipe Flange (Top Lip) */}
      <div className="w-16 h-7 bg-[#38b000] border-3 border-black rounded shadow-[0_3px_0_rgba(0,0,0,0.3)] relative shrink-0 z-10 flex items-center justify-center">
        {label && <span className="font-mono text-[7px] text-white/40 font-bold tracking-tighter uppercase">{label}</span>}
        <div className="absolute inset-y-0 left-2.5 w-3.5 bg-[#70e000]/40" />
      </div>
      {/* Pipe Neck */}
      <div className="mx-auto w-12 bg-[#007200] border-x-3 border-black relative" style={{ height: height - 28 }}>
        <div className="absolute inset-y-0 left-2 w-2.5 bg-[#38b000]/40" />
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 rounded-full bg-black/40" />
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 rounded-full bg-black/40" />
        <div className="absolute bottom-4 left-1.5 w-1.5 h-1.5 rounded-full bg-black/40" />
        <div className="absolute bottom-4 right-1.5 w-1.5 h-1.5 rounded-full bg-black/40" />
      </div>
    </div>
  );
};

// Goomba Component
const GoombaSVG = ({ isSquished }) => {
  if (isSquished) {
    return (
      <svg viewBox="0 0 32 8" className="w-12 h-3 drop-shadow-[1.5px_1.5px_0_#000] select-none">
        <path d="M2 4h28v4H2z" fill="#6A3810" stroke="black" strokeWidth="1.5" />
        <path d="M8 0h16v4H8z" fill="#F5C396" stroke="black" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className="w-12 h-12 drop-shadow-[2px_2px_0_#000] select-none">
      <path d="M6 14C6 8 26 8 26 14v4H6v-4z" fill="#C84C0C" stroke="black" strokeWidth="1.5" />
      <path d="M11 12h2v4h-2zm8 0h2v4h-2z" fill="white" />
      <path d="M12 13h1v2h-1zm8 0h1v2h-1z" fill="black" />
      <path d="M9 10l4 2m10-2l-4 2" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 18h12v8H10z" fill="#F5C396" stroke="black" strokeWidth="1.5" />
      <circle cx="9" cy="28" r="3.5" fill="black" />
      <circle cx="23" cy="28" r="3.5" fill="black" />
    </svg>
  );
};

export default function Hero({ marioTriggered, setMarioTriggered }) {
  const containerRef = useRef(null);

  // Responsive device bypass check
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

  // Card mouse tilt states
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const springX = useSpring(50, { stiffness: 60, damping: 20 });
  const springY = useSpring(50, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    springX.set(x);
    springY.set(y);
  };

  const rotateX = useTransform(springY, [0, 100], [10, -10]);
  const rotateY = useTransform(springX, [0, 100], [-10, 10]);

  // Motion values for smooth 60fps animations bypassing React render pipeline
  const marioXMVal = useMotionValue(-220);
  const marioYMVal = useMotionValue(0);

  const goombaXMVal = useMotionValue(0);
  const goombaYMVal = useMotionValue(0);

  const shroomXMVal = useMotionValue(160);
  const shroomYMVal = useMotionValue(-180);

  const starXMVal = useMotionValue(-160);
  const starYMVal = useMotionValue(-180);

  // React State triggers (only for visual rendering, not loop logic checks)
  const [marioDir, setMarioDir] = useState(1);
  const [marioAnimState, setMarioAnimState] = useState('idle');
  const [isSuper, setIsSuper] = useState(false);
  const [isStar, setIsStar] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [marioLives, setMarioLives] = useState(3);
  const [reviveCountdown, setReviveCountdown] = useState(null);
  const [isMarioDead, setIsMarioDead] = useState(false);

  // React state caches for loops to avoid infinite renders
  const currentDirRef = useRef(1);
  const currentAnimStateRef = useRef('idle');

  // Entities state
  const [coins, setCoins] = useState([]);
  const [scorePopups, setScorePopups] = useState([]);
  const [steamParticles, setSteamParticles] = useState([]);
  const [cardSquish, setCardSquish] = useState({});
  const [isWarping, setIsWarping] = useState(false);

  // Mystery block state
  const [mysteryHit, setMysteryHit] = useState(false);
  const [mysteryBouncing, setMysteryBouncing] = useState(false);

  // Item active states for visual mounting
  const [shroomActive, setShroomActive] = useState(false);
  const [starActive, setStarActive] = useState(false);

  // Goomba active state
  const [goombaSquished, setGoombaSquished] = useState(false);
  const [goombaDead, setGoombaDead] = useState(false);

  // Keyboard active tracking
  const keysPressed = useRef({
    left: false,
    right: false,
    jump: false,
    down: false
  });

  // Keep a mutable physics copy of ALL changing variables. 
  // The requestAnimationFrame loops reads/writes through this Ref, preventing loop restarts.
  const physicsRef = useRef({
    marioX: -220,
    marioY: 0,
    marioVy: 0,
    isJumping: false,
    isSuper: false,
    isStar: false,
    isInvulnerable: false,
    isWarping: false,
    invulnCooldown: 0,
    goombaX: 0,
    goombaDir: 1,
    goombaSquished: false,
    goombaDead: false,
    shroomX: 160,
    shroomY: -180,
    shroomVy: 0,
    shroomVx: 1.5,
    shroomActive: false,
    starX: -160,
    starY: -180,
    starVy: 0,
    starVx: -1.5,
    starActive: false,
    marioLives: 3,
    isMarioDead: false,
    isReviving: false,
    deathTimer: 0,
    reviveEndTime: 0,
    currentPlatformId: null
  });

  // Spawns float indicators
  const addScorePopup = (text, x, y) => {
    const id = Date.now() + Math.random();
    setScorePopups((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const spawnCoin = (x, yOffset = -220) => {
    const id = Date.now() + Math.random();
    setCoins((prev) => [...prev, { id, spawnX: x, spawnY: yOffset, x: (Math.random() - 0.5) * 45 }]);
    setTimeout(() => {
      setCoins((prev) => prev.filter((c) => c.id !== id));
    }, 850);
  };

  // Warp pipe positions for warp actions (calculated dynamically based on viewport width)
  const getWarpPositions = () => {
    if (typeof window === 'undefined') return { left: -260, right: 260 };
    const halfWidth = window.innerWidth / 2;
    // The WARP pipe center is at 116px from each screen edge (12px padding + 64px width of 1st pipe + 8px space + 32px half of 2nd pipe)
    return {
      left: -halfWidth + 116,
      right: halfWidth - 116
    };
  };

  // Pipe platforms to stand on (calculated dynamically)
  const getPlatforms = () => {
    if (typeof window === 'undefined') return [];
    const halfWidth = window.innerWidth / 2;
    return [
      { id: 'left-data', xMin: -halfWidth + 12, xMax: -halfWidth + 76, yLevel: -40 },
      { id: 'left-warp', xMin: -halfWidth + 84, xMax: -halfWidth + 148, yLevel: -70 },
      { id: 'left-ingest', xMin: -halfWidth + 156, xMax: -halfWidth + 220, yLevel: -100 },
      { id: 'right-sys', xMin: halfWidth - 76, xMax: halfWidth - 12, yLevel: -40 },
      { id: 'right-warp', xMin: halfWidth - 148, xMax: halfWidth - 84, yLevel: -70 },
      { id: 'right-stream', xMin: halfWidth - 220, xMax: halfWidth - 156, yLevel: -100 }
    ];
  };

  // Warp trigger animation sequence
  const executeWarp = async (fromLeft) => {
    const phys = physicsRef.current;
    if (phys.isWarping) return;
    
    phys.isWarping = true;
    setIsWarping(true);
    
    keysPressed.current.left = false;
    keysPressed.current.right = false;
    keysPressed.current.jump = false;
    phys.marioVy = 0;

    const warpPos = getWarpPositions();

    // Phase 1: Slide down into pipe
    let targetX = fromLeft ? warpPos.left : warpPos.right;
    phys.marioX = targetX;
    marioXMVal.set(targetX);
    
    if (currentAnimStateRef.current !== 'idle') {
      currentAnimStateRef.current = 'idle';
      setMarioAnimState('idle');
    }

    addScorePopup("WARPING...", targetX, -80);

    const slideDuration = 400;
    const startY = phys.marioY;
    const endY = 80;
    const startTime = performance.now();

    const animateDown = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / slideDuration, 1);
      const currentY = startY + (endY - startY) * progress;
      marioYMVal.set(currentY);
      phys.marioY = currentY;

      if (progress < 1) {
        requestAnimationFrame(animateDown);
      } else {
        // Phase 2: Teleport Mario to the other pipe, still submerged
        const nextX = fromLeft ? warpPos.right : warpPos.left;
        phys.marioX = nextX;
        marioXMVal.set(nextX);
        
        const nextDir = fromLeft ? -1 : 1;
        if (currentDirRef.current !== nextDir) {
          currentDirRef.current = nextDir;
          setMarioDir(nextDir);
        }

        // Phase 3: Slide up out of new pipe
        const upStartTime = performance.now();
        const animateUp = (upTime) => {
          const upElapsed = upTime - upStartTime;
          const upProgress = Math.min(upElapsed / slideDuration, 1);
          const currentUpY = endY + (startY - endY) * upProgress;
          marioYMVal.set(currentUpY);
          phys.marioY = currentUpY;

          if (upProgress < 1) {
            requestAnimationFrame(animateUp);
          } else {
            phys.isWarping = false;
            setIsWarping(false);
            if (startY < -30) {
              phys.currentPlatformId = fromLeft ? 'right-warp' : 'left-warp';
            } else {
              phys.currentPlatformId = null;
            }
          }
        };
        requestAnimationFrame(animateUp);
      }
    };
    requestAnimationFrame(animateDown);
  };

  // Central block bounds check (jumps under the cards)
  const checkCollisions = (x, y, vy) => {
    // Only collide moving UP
    if (vy >= 0) return;

    const phys = physicsRef.current;

    // DHRUV SAINI Card hit boundary check
    if (x >= -195 && x <= 195 && y <= -185 && y >= -235) {
      phys.marioVy = 2.5; // bounce down
      
      spawnCoin(x, -220);
      addScorePopup("+100 PTS", x, -240);

      // Squish card
      setCardSquish({
        scaleY: [1, 0.75, 1.15, 0.95, 1],
        scaleX: [1, 1.2, 0.9, 1.05, 1],
        y: [0, -15, 5, -2, 0],
      });
    }

    // Mystery Question mark block hit check
    if (x >= 135 && x <= 185 && y <= -110 && y >= -150) {
      phys.marioVy = 2.5; // bounce down
      
      if (!mysteryHit && !mysteryBouncing) {
        setMysteryBouncing(true);
        setMysteryHit(true);
        addScorePopup("ITEM SPAWNED!", 160, -190);

        const spawnStar = Math.random() > 0.55;
        if (spawnStar) {
          phys.starActive = true;
          setStarActive(true);
          phys.starX = 160;
          phys.starY = -160;
          phys.starVy = -5; // eject speed
          phys.starGround = false;
          starXMVal.set(160);
          starYMVal.set(-160);
        } else {
          phys.shroomActive = true;
          setShroomActive(true);
          phys.shroomX = 160;
          phys.shroomY = -160;
          phys.shroomVy = -5; // eject speed
          phys.shroomGround = false;
          shroomXMVal.set(160);
          shroomYMVal.set(-160);
        }

        setTimeout(() => {
          setMysteryBouncing(false);
        }, 300);
      } else {
        // Just pop a standard coin
        spawnCoin(160, -145);
        addScorePopup("+50 PTS", 160, -185);
      }
    }
  };

  // Keyboard Event Listeners for WASD / Arrow Keys
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      const phys = physicsRef.current;
      if (window.scrollY > 550 || phys.isWarping || phys.isMarioDead || phys.isReviving) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        keysPressed.current.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        keysPressed.current.right = true;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        keysPressed.current.jump = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        keysPressed.current.down = true;
        
        // Trigger warp sequence (either standing on ground in front of it or on top of it)
        const warpPos = getWarpPositions();
        const isNearLeftWarp = Math.abs(phys.marioX - warpPos.left) < 45;
        const isNearRightWarp = Math.abs(phys.marioX - warpPos.right) < 45;
        const isOnWarpSurface = Math.abs(phys.marioY) < 1 || Math.abs(phys.marioY - (-70)) < 2;
        
        if (isOnWarpSurface) {
          if (isNearLeftWarp) {
            executeWarp(true);
          } else if (isNearRightWarp) {
            executeWarp(false);
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = false;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        keysPressed.current.jump = false;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        keysPressed.current.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMobile]);

  // RequestAnimationFrame high-speed game physics loop
  // LOCKED to mount-only (empty dependency array) to prevent multiple loops running concurrently
  useEffect(() => {
    if (isMobile) return;

    let active = true;
    const gravity = 0.55;
    const walkSpeed = 5.2;
    let particleSpawnCounter = 0;

    const gameLoop = () => {
      if (!active) return;

      const keys = keysPressed.current;
      const phys = physicsRef.current;
      const limit = window.innerWidth / 2 - 40;

      // Handle Death Sequence
      if (phys.isMarioDead) {
        phys.marioY += phys.marioVy;
        phys.marioVy += 0.35; // fall offscreen
        marioYMVal.set(phys.marioY);

        phys.deathTimer -= 1;
        if (phys.deathTimer <= 0) {
          // Revive state start
          phys.isReviving = true;
          phys.reviveEndTime = Date.now() + 10000; // 10s from now
          setReviveCountdown(10);
          phys.marioX = -220;
          phys.marioY = 0;
          phys.currentPlatformId = null;
          marioXMVal.set(-220);
          marioYMVal.set(0);
        }
      }
      // Handle Revive state countdown
      else if (phys.isReviving) {
        const msLeft = phys.reviveEndTime - Date.now();
        const secs = Math.ceil(msLeft / 1000);
        setReviveCountdown(secs >= 0 ? secs : 0);

        if (msLeft <= 0) {
          phys.isReviving = false;
          setReviveCountdown(null);
          phys.marioLives = 3;
          setMarioLives(3);
          phys.isMarioDead = false;
          setIsMarioDead(false);
          phys.isSuper = false;
          setIsSuper(false);
          phys.isStar = false;
          setIsStar(false);
          phys.marioX = -220;
          phys.marioY = 0;
          phys.marioVy = 0;
          phys.isJumping = false;
          phys.currentPlatformId = null;
          phys.isInvulnerable = true;
          setIsInvulnerable(true);
          phys.invulnCooldown = 120;
          marioXMVal.set(-220);
          marioYMVal.set(0);

          // Reset Goomba
          phys.goombaX = 0;
          phys.goombaDead = false;
          phys.goombaSquished = false;
          setGoombaDead(false);
          setGoombaSquished(false);
          goombaXMVal.set(0);
        }
      }

      // Main physics logic run ONLY when alive and not reviving
      if (!phys.isMarioDead && !phys.isReviving) {
        // 1. Mario Horizontal updates (only if not warping)
        if (!phys.isWarping) {
          let isMoving = false;
          if (keys.left) {
            phys.marioX -= walkSpeed;
            
            if (currentDirRef.current !== -1) {
              currentDirRef.current = -1;
              setMarioDir(-1);
            }
            isMoving = true;
          }
          if (keys.right) {
            phys.marioX += walkSpeed;
            
            if (currentDirRef.current !== 1) {
              currentDirRef.current = 1;
              setMarioDir(1);
            }
            isMoving = true;
          }

          // Bound checkers
          if (phys.marioX < -limit) phys.marioX = -limit;
          if (phys.marioX > limit) phys.marioX = limit;

          // 2. Mario Jumping Physics
          if (phys.isJumping) {
            const prevY = phys.marioY;
            phys.marioY += phys.marioVy;
            phys.marioVy += gravity;

            checkCollisions(phys.marioX, phys.marioY, phys.marioVy);

            // Platform collision detection (only when moving down)
            let landed = false;
            if (phys.marioVy > 0) {
              const platforms = getPlatforms();
              for (const plat of platforms) {
                if (phys.marioX >= plat.xMin && phys.marioX <= plat.xMax) {
                  // Check if feet crossed the platform top
                  if (prevY <= plat.yLevel && phys.marioY >= plat.yLevel) {
                    phys.marioY = plat.yLevel;
                    phys.marioVy = 0;
                    phys.isJumping = false;
                    phys.currentPlatformId = plat.id;
                    landed = true;
                    if (currentAnimStateRef.current !== 'idle') {
                      currentAnimStateRef.current = 'idle';
                      setMarioAnimState('idle');
                    }
                    break;
                  }
                }
              }
            }

            if (!landed) {
              // Ground boundaries check
              if (phys.marioY >= 0) {
                phys.marioY = 0;
                phys.marioVy = 0;
                phys.isJumping = false;
                phys.currentPlatformId = null;
                
                if (currentAnimStateRef.current !== 'idle') {
                  currentAnimStateRef.current = 'idle';
                  setMarioAnimState('idle');
                }
              } else {
                if (currentAnimStateRef.current !== 'jump') {
                  currentAnimStateRef.current = 'jump';
                  setMarioAnimState('jump');
                }
              }
            }
          } else {
            // Check if walking off platform
            if (phys.currentPlatformId) {
              const platforms = getPlatforms();
              const plat = platforms.find(p => p.id === phys.currentPlatformId);
              if (!plat || phys.marioX < plat.xMin || phys.marioX > plat.xMax) {
                phys.currentPlatformId = null;
                phys.isJumping = true;
                phys.marioVy = 0; // fall down
              }
            }

            if (keys.jump) {
              phys.isJumping = true;
              phys.marioVy = phys.isSuper ? -14.5 : -11.5;
              
              if (currentAnimStateRef.current !== 'jump') {
                currentAnimStateRef.current = 'jump';
                setMarioAnimState('jump');
              }
            } else if (isMoving) {
              if (currentAnimStateRef.current !== 'walk') {
                currentAnimStateRef.current = 'walk';
                setMarioAnimState('walk');
              }
            } else {
              if (currentAnimStateRef.current !== 'idle') {
                currentAnimStateRef.current = 'idle';
                setMarioAnimState('idle');
              }
            }
          }

          // Apply visual coordinates
          marioXMVal.set(phys.marioX);
          marioYMVal.set(phys.marioY);
        }

        // 3. Invuln Blinking counter
        if (phys.invulnCooldown > 0) {
          phys.invulnCooldown--;
          if (phys.invulnCooldown === 0) {
            phys.isInvulnerable = false;
            setIsInvulnerable(false);
          }
        }

        // 4. Goomba Enemy Behavior
        if (!phys.goombaDead && !phys.goombaSquished) {
          phys.goombaX += 1.2 * phys.goombaDir;
          if (phys.goombaX > 140) {
            phys.goombaDir = -1;
          } else if (phys.goombaX < -140) {
            phys.goombaDir = 1;
          }
          goombaXMVal.set(phys.goombaX);

          // Stomp detection check
          const distance = Math.abs(phys.marioX - phys.goombaX);
          if (distance < 28) {
            if (phys.isJumping && phys.marioVy > 0 && phys.marioY > -24) {
              phys.goombaSquished = true;
              setGoombaSquished(true);
              phys.marioVy = -8; // Bounce Mario up
              addScorePopup("SQUISH! +100", phys.goombaX, -20);
              
              setTimeout(() => {
                phys.goombaDead = true;
                setGoombaDead(true);
              }, 1000);
            } else if (phys.marioY > -20) {
              // Collision with Mario on the side
              if (phys.isStar) {
                phys.goombaDead = true;
                setGoombaDead(true);
                addScorePopup("STAR POWER! +200", phys.goombaX, -25);
              } else if (!phys.isInvulnerable) {
                if (phys.isSuper) {
                  phys.isSuper = false;
                  setIsSuper(false);
                  
                  phys.isInvulnerable = true;
                  setIsInvulnerable(true);
                  phys.invulnCooldown = 120; // 2 seconds of frames
                  addScorePopup("SHRINK!", phys.marioX, -45);
                } else {
                  if (phys.marioLives > 1) {
                    phys.marioLives -= 1;
                    setMarioLives(phys.marioLives);
                    phys.isInvulnerable = true;
                    setIsInvulnerable(true);
                    phys.invulnCooldown = 120; // 2s blinking
                    addScorePopup("OOF! -1 LIFE", phys.marioX, -45);
                  } else {
                    phys.marioLives = 0;
                    setMarioLives(0);
                    phys.isMarioDead = true;
                    setIsMarioDead(true);
                    phys.marioVy = -8.5; // jump up
                    phys.deathTimer = 120; // 2 seconds of death animation
                    
                    if (currentAnimStateRef.current !== 'jump') {
                      currentAnimStateRef.current = 'jump';
                      setMarioAnimState('jump');
                    }
                    addScorePopup("GAME OVER!", phys.marioX, -40);
                  }
                }
              }
            }
          }
        }

        // 5. Mushroom Power-up physics
        if (phys.shroomActive) {
          phys.shroomVy += 0.4;
          phys.shroomY += phys.shroomVy;
          phys.shroomX += phys.shroomVx;

          if (phys.shroomY >= 0) {
            phys.shroomY = 0;
            phys.shroomVy = 0;
          }
          if (phys.shroomX > limit || phys.shroomX < -limit) {
            phys.shroomVx = -phys.shroomVx;
          }

          shroomXMVal.set(phys.shroomX);
          shroomYMVal.set(phys.shroomY);

          // Collect Mushroom check
          if (Math.abs(phys.marioX - phys.shroomX) < 32 && Math.abs(phys.marioY - phys.shroomY) < 35) {
            phys.shroomActive = false;
            setShroomActive(false);
            phys.isSuper = true;
            setIsSuper(true);
            addScorePopup("SUPER SIZE! 🍄", phys.marioX, -50);
            
            setTimeout(() => {
              phys.isSuper = false;
              setIsSuper(false);
            }, 5000);
          }
        }

        // 6. Star Power-up physics
        if (phys.starActive) {
          phys.starVy += 0.45;
          phys.starY += phys.starVy;
          phys.starX += phys.starVx;

          if (phys.starY >= 0) {
            phys.starY = 0;
            phys.starVy = -6.5; // bounce up
          }
          if (phys.starX > limit || phys.starX < -limit) {
            phys.starVx = -phys.starVx;
          }

          starXMVal.set(phys.starX);
          starYMVal.set(phys.starY);

          // Collect Star check
          if (Math.abs(phys.marioX - phys.starX) < 32 && Math.abs(phys.marioY - phys.starY) < 35) {
            phys.starActive = false;
            setStarActive(false);
            phys.isStar = true;
            setIsStar(true);
            phys.isInvulnerable = true;
            setIsInvulnerable(true);
            phys.invulnCooldown = 360; // Star lasts 6 seconds
            addScorePopup("STARMAN INVULNERABILITY! ⭐", phys.marioX, -60);
            
            setTimeout(() => {
              phys.isStar = false;
              setIsStar(false);
            }, 6000);
          }
        }
      }

      // 7. Pipeline Steam particles loop
      particleSpawnCounter++;
      const slowCon = isSlowNetworkOrDevice();
      const particleLimit = slowCon ? 120 : 30;
      if (particleSpawnCounter >= particleLimit) {
        particleSpawnCounter = 0;
        const spawnLeft = Math.random() > 0.5;
        const warpPos = getWarpPositions();
        const spawnX = spawnLeft ? warpPos.left : warpPos.right;
        const spawnY = -70; // pipe mouth

        const pId = Date.now() + Math.random();
        setSteamParticles((prev) => [
          ...prev,
          { id: pId, x: spawnX, y: spawnY, scale: 0.4, opacity: 0.8 }
        ]);
      }

      setSteamParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            y: p.y - 1.2,
            x: p.x + (Math.random() - 0.5) * 1.0,
            scale: p.scale + 0.015,
            opacity: p.opacity - 0.012
          }))
          .filter((p) => p.opacity > 0)
      );

      if (active) {
        requestAnimationFrame(gameLoop);
      }
    };

    const frameId = requestAnimationFrame(gameLoop);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [isMobile]);

  // Database click animation trigger
  useEffect(() => {
    if (!marioTriggered) return;

    setMysteryBouncing(true);
    setMysteryHit(true);
    addScorePopup("DATABASE UNLOCKED!", 160, -190);

    const phys = physicsRef.current;
    phys.shroomActive = true;
    setShroomActive(true);
    
    phys.shroomX = 160;
    phys.shroomY = -160;
    phys.shroomVy = -6.5;
    shroomXMVal.set(160);
    shroomYMVal.set(-160);

    setTimeout(() => {
      setMysteryBouncing(false);
    }, 300);

    setMarioTriggered(false);
  }, [marioTriggered]);

  // Goomba / Creeper auto-respawn effect every 6 seconds
  useEffect(() => {
    if (isMobile) return;
    const interval = setInterval(() => {
      const phys = physicsRef.current;
      if (phys.goombaDead || phys.goombaSquished) {
        phys.goombaX = 0;
        phys.goombaDead = false;
        phys.goombaSquished = false;
        setGoombaDead(false);
        setGoombaSquished(false);
        goombaXMVal.set(0);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        springX.set(50);
        springY.set(50);
      }}
      className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden graph-paper-dark-bg cursor-default"
      style={{ perspective: "1200px" }}
    >
      
      {/* 1. Neobrutalist Block Shatter Reveal */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-40 pointer-events-none overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const staggerCoef = isMobile ? 0.04 : 0.08;
          const baseDelay = isMobile ? 0.05 : 0.1;
          const delay = baseDelay + (row + col) * staggerCoef;
          return (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ 
                scale: 0, 
                opacity: 0,
                rotate: (row + col) % 2 === 0 ? 10 : -10
              }}
              transition={{ 
                duration: isMobile ? 0.35 : 0.5,
                delay: delay,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="bg-[#7C3AED] border-[3px] border-black w-full h-full"
            />
          );
        })}
      </div>

      {/* 2. Scrapbook Sticky Notes */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ delay: isMobile ? 0.4 : 0.8, type: "spring", stiffness: 120 }}
        drag
        dragConstraints={containerRef}
        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 50 }}
        className="absolute top-[18%] right-[8%] w-28 h-28 bg-[#FFD860] border-3 border-black p-3 shadow-[5px_5px_0_rgba(0,0,0,1)] text-black font-mono rotate-[-8deg] z-20 pointer-events-auto select-none cursor-grab active:cursor-grabbing hidden sm:block"
      >
        <div className="absolute top-[-8px] left-[25px] w-12 h-4 paper-tape rotate-[3deg] border-x border-black/10" />
        <span className="font-bold block text-[10px] uppercase border-b border-black/10 pb-0.5 mb-1 text-black/50">scrapbook.md</span>
        <p className="leading-tight text-[9px] font-semibold">raw code, custom pipelines, clean data design.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 6 }}
        transition={{ delay: isMobile ? 0.5 : 0.9, type: "spring", stiffness: 120 }}
        drag
        dragConstraints={containerRef}
        whileDrag={{ scale: 1.1, rotate: 0, zIndex: 50 }}
        className="absolute bottom-[20%] left-[6%] w-32 bg-[#A5CF4E] border-3 border-black px-3 py-2 shadow-[5px_5px_0_rgba(0,0,0,1)] text-black font-mono rotate-[6deg] z-20 pointer-events-auto select-none cursor-grab active:cursor-grabbing hidden sm:block"
      >
        <div className="absolute bottom-[-8px] right-[30px] w-12 h-4 paper-tape rotate-[-4deg] border-x border-black/10" />
        <span className="font-bold block text-[9px] uppercase border-b border-black/10 pb-0.5 mb-1 text-black/50">status</span>
        <span className="block font-bold text-[9px] leading-tight">open to remote / relocation globally</span>
      </motion.div>

      {/* 3. Dashed Data Pipelines */}
      {!isSlow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: isMobile ? 0.4 : 0.8 }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          <svg className="absolute inset-0 w-full h-full opacity-25">
            <path 
              d="M-50,150 L200,150 L280,220 L600,220 L680,150 L1200,150 M400,220 L400,450 L550,550 L1100,550" 
              stroke="black" 
              strokeWidth="3" 
              strokeDasharray="4 6" 
              fill="none" 
            />
            <path 
              d="M100,-50 L100,300 L220,400 L800,400 L880,800" 
              stroke="black" 
              strokeWidth="2.5" 
              strokeDasharray="6 8" 
              fill="none" 
            />
          </svg>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[22%] left-[28%] w-3 h-3 rounded-full bg-black border border-white" />
            <div className="absolute top-[55%] left-[55%] w-3 h-3 rounded-full bg-black border border-white" />
            <div className="absolute top-[40%] left-[80%] w-3 h-3 rounded-full bg-black border border-white" />
          </div>
        </motion.div>
      )}

      {/* 4. Center DHRUV SAINI Card Block */}
      <motion.div 
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 flex flex-col items-center justify-center select-none z-20 w-full px-4 space-y-6"
      >
        {/* Desktop: Above Card */}
        {!isMobile && (
          <motion.a
            href="/resume.pdf"
            download="Dhruv_Saini_Data_Engineer_Resume.pdf"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-[#A5CF4E] border-3 border-black px-5 py-2.5 rounded font-mono font-black text-xs sm:text-sm text-black shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#000] transition-all cursor-pointer pointer-events-auto z-30"
            style={{ transform: "translateZ(100px)" }}
          >
            <span>DOWNLOAD RESUME</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </motion.a>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ 
            opacity: 1, 
            rotate: -1.5,
            ...cardSquish
          }}
          transition={{ 
            type: "tween", 
            duration: 0.5,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.2 } }}
          className="p-8 sm:p-12 bg-white border-4 border-black text-black rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] relative cursor-default flex flex-col items-center justify-center"
          style={{ 
            transform: "translateZ(80px)",
          }}
        >
          {/* Paper Tapes */}
          <div className="absolute top-[-10px] left-[15%] w-16 h-5 paper-tape rotate-[-8deg] border-x border-black/10 z-30" />
          <div className="absolute bottom-[-10px] right-[15%] w-16 h-5 paper-tape rotate-[12deg] border-x border-black/10 z-30" />

          <h1 className="font-bubble text-5xl sm:text-6xl md:text-7xl font-black uppercase text-black tracking-tight text-center relative z-10">
            DHRUV SAINI
          </h1>
        </motion.div>

        {/* Mobile: Below Card */}
        {isMobile && (
          <motion.a
            href="/resume.pdf"
            download="Dhruv_Saini_Data_Engineer_Resume.pdf"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-[#A5CF4E] border-3 border-black px-5 py-2.5 rounded font-mono font-black text-xs sm:text-sm text-black shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#000] transition-all cursor-pointer pointer-events-auto z-30"
          >
            <span>DOWNLOAD RESUME</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </motion.a>
        )}
      </motion.div>

      {/* RENDER MARIO MECHANICS ONLY IF ON DESKTOP */}
      {!isMobile && (
        <>
          {/* Floating Mystery Item Block (❓) */}
          <motion.div
            style={{ x: 160, y: -140 }}
            animate={mysteryBouncing ? { y: [-140, -152, -136, -140] } : { y: -140 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 bottom-16 -translate-x-1/2 z-25 pointer-events-none select-none"
          >
            <MysteryBlockSVG isHit={mysteryHit} />
          </motion.div>

          {/* Power Up Mushrooms */}
          <AnimatePresence>
            {shroomActive && (
              <motion.div
                style={{ x: shroomXMVal, y: shroomYMVal }}
                className="absolute left-1/2 bottom-16 -translate-x-1/2 z-25 pointer-events-none select-none"
              >
                <MushroomSVG />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Power Up Stars */}
          <AnimatePresence>
            {starActive && (
              <motion.div
                style={{ x: starXMVal, y: starYMVal }}
                className="absolute left-1/2 bottom-16 -translate-x-1/2 z-25 pointer-events-none select-none"
              >
                <StarSVG />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goomba Enemy character */}
          {!goombaDead && (
            <motion.div
              style={{ x: goombaXMVal, y: goombaYMVal }}
              className="absolute left-1/2 bottom-16 -translate-x-1/2 z-25 pointer-events-none select-none"
            >
              <GoombaSVG isSquished={goombaSquished} />
            </motion.div>
          )}

          {/* Side Pipeline Clusters (Industrial Theme) */}
          {/* LEFT SIDE PIPES */}
          <div className="absolute left-0 bottom-16 flex items-end space-x-2 z-15 px-3">
            <PipelineSVG height={40} label="DATA" />
            <PipelineSVG height={70} label="WARP" />
            <PipelineSVG height={100} label="INGEST" />
          </div>

          {/* RIGHT SIDE PIPES */}
          <div className="absolute right-0 bottom-16 flex items-end space-x-2 z-15 px-3 flex-row-reverse space-x-reverse">
            <PipelineSVG height={40} label="SYS" />
            <PipelineSVG height={70} label="WARP" />
            <PipelineSVG height={100} label="STREAM" />
          </div>

          {/* Steam / Bubble Particles Rising from Warp Pipes */}
          {steamParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute left-1/2 bottom-16 w-3 h-3 rounded-full bg-white/25 border border-white/10 pointer-events-none select-none z-15"
              style={{
                transform: `translateX(-50%) translate3d(${particle.x}px, ${particle.y}px, 0px) scale(${particle.scale})`,
                opacity: particle.opacity
              }}
            />
          ))}

          {/* Render popped coins relative to floor container */}
          <AnimatePresence>
            {coins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ y: coin.spawnY, x: coin.spawnX, opacity: 0, scale: 0.5 }}
                animate={{
                  y: [coin.spawnY, coin.spawnY - 90, coin.spawnY - 30],
                  x: [coin.spawnX, coin.spawnX + coin.x, coin.spawnX + coin.x * 1.5],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.25, 1.25, 0.2],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-400 border-3 border-black flex items-center justify-center shadow-[2px_2px_0_#000] z-50 pointer-events-none select-none font-sans font-bold text-black text-sm"
              >
                🪙
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Float score / visual feedback popups */}
          {scorePopups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, y: popup.y, x: popup.x }}
              animate={{ opacity: [0, 1, 1, 0], y: [popup.y, popup.y - 45] }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute left-1/2 bottom-16 -translate-x-1/2 z-50 text-white font-mono font-black text-[10px] bg-black/85 border border-white/20 px-2 py-0.5 rounded shadow-[1.5px_1.5px_0_#000] pointer-events-none select-none whitespace-nowrap"
            >
              {popup.text}
            </motion.div>
          ))}

          {/* Ground ledge for Mario walking */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-[#A5CF4E] border-t-4 border-black z-20 flex flex-col justify-between">
            {/* Bricks */}
            <div className="w-full h-4 bg-[#7C3AED] border-b-2 border-black flex">
              {Array.from({ length: 45 }).map((_, idx) => (
                <div key={idx} className="flex-1 border-r border-black/30 h-full" />
              ))}
            </div>
            <div className="p-2 px-4 flex justify-between items-center text-black/60 font-mono text-[9px] sm:text-[10px] font-bold">
              <span>WORLD 1-1</span>
              <span className="hidden lg:inline text-black/40">
                A / D (LEFT/RIGHT) • SPACE / W (JUMP) • STAND ON WARP PIPE & PRESS S (WARP TRAVEL)
              </span>
              <span className="flex items-center">LIVES: <span className="text-[#FF5C5C] ml-1">{marioLives > 0 ? "❤️".repeat(marioLives) : "💀"}</span></span>
            </div>
          </div>

          {/* Mario character */}
          <motion.div
            style={{ 
              x: marioXMVal, 
              y: marioYMVal, 
              scaleX: marioDir,
              rotate: isMarioDead || reviveCountdown !== null ? 180 : 0
            }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <MarioSVG 
              state={marioAnimState} 
              isSuper={isSuper} 
              isStar={isStar}
              isInvulnerable={isInvulnerable} 
            />

            {/* Speech/Conversation Bubble */}
            <AnimatePresence>
              {(isMarioDead || reviveCountdown !== null) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 15, rotate: 180 }}
                  animate={{ opacity: 1, scale: 1, y: -15, rotate: 180 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15, rotate: 180 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 bg-white border-3 border-black px-3 py-2 rounded-xl shadow-[3px_3px_0_#000] text-black font-mono font-black text-[10px] uppercase whitespace-nowrap z-50 flex flex-col items-center select-none"
                >
                  <span>{isMarioDead ? "OOF!" : `reviving in ${reviveCountdown}s`}</span>
                  {/* Speech bubble down arrow (adjusted for 180 rotation) */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-b-[6px] border-b-black w-0 h-0" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-[4px] border-x-transparent border-b-[4px] border-b-white w-0 h-0 mb-[-2px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* Mobile Ground Cover (no game, high performance) */}
      {isMobile && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-[#7C3AED] border-t-4 border-black z-20 flex items-center justify-center text-white/55 font-mono text-[10px] font-black tracking-widest uppercase">
          DATA INFRASTRUCTURE PORTFOLIO
        </div>
      )}

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0" />
    </section>
  );
}
