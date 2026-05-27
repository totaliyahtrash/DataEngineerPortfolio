import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Coordinate motion values (bypasses React render loop)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Soft spring physics for the neobrutalist follower box
  const boxX = useSpring(cursorX, { stiffness: 140, damping: 18 });
  const boxY = useSpring(cursorY, { stiffness: 140, damping: 18 });

  useEffect(() => {
    setIsSlow(isSlowNetworkOrDevice());
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile || isSlow) return;

    // Enable custom cursor styles (hides browser pointer)
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      if (target && target.closest('a, button, [role="button"], .cursor-pointer, input, select, textarea')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, isSlow, isVisible, cursorX, cursorY]);

  if (isMobile || isSlow || !isVisible) {
    return null;
  }

  return (
    <>
      {/* 1. Core Pointer: Premium Neobrutalist Sticker Arrow (Strict Follow) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 0, // Tip at 0,0
          translateY: 0,
        }}
        animate={{
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)]">
          {/* Shadow */}
          <path d="M0 0 L14 14 H8 L12 22 H9 L5 14 H0 Z" fill="black" transform="translate(2, 2)"/>
          {/* Main Sticker */}
          <path d="M0 0 L14 14 H8 L12 22 H9 L5 14 H0 Z" fill="white" stroke="black" strokeWidth="2.5" strokeLinejoin="miter"/>
        </svg>
      </motion.div>

      {/* 2. Spring Follower Box: Rotates 45deg and grows on hover, compacts on click */}
      <motion.div
        style={{
          x: boxX,
          y: boxY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.45 : isHovered ? 1.6 : 1,
          rotate: isClicking ? 90 : isHovered ? 45 : 0,
          borderColor: isClicking ? '#7C3AED' : isHovered ? '#7C3AED' : '#000000',
          borderRadius: isHovered ? '8px' : '4px',
          backgroundColor: isHovered ? 'rgba(124, 58, 237, 0.12)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-black pointer-events-none z-[9998] shadow-[3px_3px_0_rgba(0,0,0,0.15)]"
      />
    </>
  );
}
