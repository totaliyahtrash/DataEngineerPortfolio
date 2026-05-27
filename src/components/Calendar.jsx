import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Calendar() {
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  // Parallax / Scroll Reveal for header
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Columns: Education & Future Categories
  const categories = ['EDUCATION', 'YOUR COMPANY', 'AI & AGENTS', 'PROJECTS', 'FREELANCE'];
  
  // Rows: Chronological Years
  const years = [
    { label: '2022', row: 2 },
    { label: '2023', row: 4 },
    { label: '2024', row: 6 },
    { label: '2025', row: 8 },
    { label: '2026', row: 10 },
    { label: '2027', row: 12 },
    { label: 'PRESENT / FUTURE', row: 14, alignEnd: true }
  ];

  const events = [
    { 
      id: 'cu-education', 
      title: '🎓 CHANDIGARH UNIVERSITY', 
      detail: 'Bachelor of Engineering (B.E.) in Computer Science & Engineering (Aug 2023 - Jul 2027). Graduating with a cumulative 8.2 CGPA. Specialized in Big Data ingestion structures and high-performance databases.', 
      col: 2, 
      rowStart: 4, // Starts in 2023
      rowSpan: 8,  // Spans up to 2027 (row 12)
      color: 'bg-[#00A7FE]' 
    },
    { 
      id: 'future-role', 
      title: '💼 YOUR COMPANY / ROLE', 
      detail: 'Ready to join your engineering team starting July 2027. Prepared to architect ingestion systems, deploy custom Model Context Protocol (MCP) servers, and scale workflows.', 
      col: 3, 
      rowStart: 12, // Starts at 2027
      rowSpan: 2,  // Extends past 2027 to PRESENT/FUTURE
      color: 'bg-[#A5CF4E]' 
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="relative min-h-[100vh] w-full bg-[#FFD23F] py-20 px-4 sm:px-8 flex flex-col items-center justify-center overflow-hidden text-black z-20 select-none section-contain"
    >
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0" />

      {/* A. Bubbly inline SVG Header ("EXPERIENCE") */}
      <motion.div 
        style={{ y: headerY, opacity: headerOpacity }}
        className="w-full max-w-3xl mb-10 px-4 flex items-center justify-center z-10"
      >
        <svg 
          viewBox="0 0 950 130" 
          className="w-full text-white fill-white stroke-black stroke-[4.5px] stroke-linejoin-round select-none drop-shadow-[5px_5px_0_#000]"
        >
          <text x="50" y="100" rotate="-6" className="font-bubble text-8xl font-black">E</text>
          <text x="135" y="95" rotate="8" className="font-bubble text-8xl font-black">X</text>
          <text x="220" y="105" rotate="-4" className="font-bubble text-8xl font-black">P</text>
          <text x="305" y="93" rotate="10" className="font-bubble text-8xl font-black">E</text>
          <text x="390" y="107" rotate="-5" className="font-bubble text-8xl font-black">R</text>
          <text x="475" y="98" rotate="7" className="font-bubble text-8xl font-black">I</text>
          <text x="560" y="103" rotate="-8" className="font-bubble text-8xl font-black">E</text>
          <text x="645" y="95" rotate="12" className="font-bubble text-8xl font-black">N</text>
          <text x="730" y="105" rotate="-6" className="font-bubble text-8xl font-black">C</text>
          <text x="815" y="100" rotate="8" className="font-bubble text-8xl font-black">E</text>
        </svg>
      </motion.div>

      {/* B. Responsive layout conditional check */}
      {!isMobile ? (
        /* DESKTOP CSS GRID VIEW */
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          className="w-full max-w-5xl bg-[#FFA6C9] border-4 border-black rounded-[2rem] p-6 sm:p-10 shadow-[8px_8px_0_rgba(0,0,0,1)] relative z-10"
        >
          <div className="grid grid-cols-[60px_repeat(5,1fr)] grid-rows-[40px_repeat(13,60px)] gap-2.5 relative">
            
            {/* Column Line Accents */}
            <div className="absolute inset-0 grid grid-cols-[60px_repeat(5,1fr)] pointer-events-none">
              <div className="border-r-2 border-black/10 h-full" />
              <div className="border-r-2 border-black/10 h-full" />
              <div className="border-r-2 border-black/10 h-full" />
              <div className="border-r-2 border-black/10 h-full" />
              <div className="border-r-2 border-black/10 h-full" />
              <div className="h-full" />
            </div>

            {/* Time Labels (Left Column) */}
            {years.map((time) => (
              <span
                key={time.label}
                style={{
                  gridColumn: 1,
                  gridRow: time.row,
                  alignSelf: time.alignEnd ? 'end' : 'start',
                  transform: time.alignEnd ? 'translateY(50%)' : 'translateY(-50%)'
                }}
                className="font-mono text-[9px] sm:text-xs font-black text-black/60 pr-2.5 text-right select-none z-20 bg-[#FFA6C9] py-0.5"
              >
                {time.label}
              </span>
            ))}

            {/* Day Headers (Top Row) */}
            {categories.map((cat, idx) => (
              <div
                key={cat}
                style={{
                  gridColumn: idx + 2,
                  gridRow: 1
                }}
                className="flex items-center justify-center border-b-3 border-black pb-2 px-1 text-center"
              >
                <span className="font-bubble text-[9px] sm:text-[11px] md:text-[13px] font-black text-black tracking-tight uppercase leading-tight">{cat}</span>
              </div>
            ))}

            {/* Event Blocks */}
            {events.map((event) => {
              const isHovered = hoveredId === event.id;
              const isDimmed = hoveredId !== null && hoveredId !== event.id;

              return (
                <motion.div
                  key={event.id}
                  style={{
                    gridColumn: event.colSpan ? `${event.col} / span ${event.colSpan}` : event.col,
                    gridRowStart: event.rowStart,
                    gridRowEnd: event.rowStart + event.rowSpan,
                    transformOrigin: "center"
                  }}
                  onMouseEnter={() => setHoveredId(event.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  animate={{
                    scale: isHovered ? 1.02 : isDimmed ? 0.98 : 1,
                    opacity: isDimmed ? 0.6 : 1,
                    zIndex: isHovered ? 30 : 10
                  }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-3 border-black shadow-[3px_3px_0_#000] hover:shadow-[6px_6px_0_#000] cursor-default transition-shadow duration-150 overflow-hidden ${event.color}`}
                >
                  <div className="flex flex-col text-left space-y-3 h-full justify-between select-text text-white">
                    <div className="space-y-1">
                      <span className="font-bubble text-xs sm:text-sm md:text-base leading-none text-white block drop-shadow-[1.5px_1.5px_0_#000]">
                        {event.title}
                      </span>
                      {event.id === 'cu-education' && (
                        <span className="font-mono text-[9px] sm:text-[10px] font-black text-black bg-white border border-black px-2 py-0.5 rounded-full shadow-[1px_1px_0_#000] inline-block">
                          8.2 CGPA ⭐️
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[9px] sm:text-[10px] md:text-xs leading-normal text-white/90 font-semibold line-clamp-4">
                      {event.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Footer Text */}
          <div className="text-center mt-8 border-t border-black/15 pt-5">
            <p className="font-mono text-[10px] sm:text-xs font-semibold text-black/60 leading-relaxed max-w-lg mx-auto">
              "we map out every milestone: code, architecture, AI protocols, and databases — to build systems that last"
            </p>
          </div>
        </motion.div>
      ) : (
        /* MOBILE VERTICAL CHRONOLOGICAL TIMELINE VIEW */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-md bg-[#FFA6C9] border-4 border-black rounded-[2rem] p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] relative z-10 flex flex-col space-y-6"
        >
          <div className="relative pl-7 border-l-4 border-black border-dashed space-y-8 py-2">
            {/* Chandigarh University Node */}
            <div className="relative">
              {/* Timeline dot connector */}
              <div className="absolute left-[-37px] top-1.5 w-6 h-6 rounded-full bg-[#00A7FE] border-3 border-black shadow-[2px_2px_0_#000] z-20 flex items-center justify-center text-[10px]">
                🎓
              </div>
              <div className="font-mono text-[10px] font-black text-black/60 mb-1">2023 AUG - 2027 JUL</div>
              <div className="bg-[#00A7FE] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0_#000] text-white">
                <span className="font-bubble text-xs sm:text-sm font-black block leading-tight drop-shadow-[1.5px_1.5px_0_#000] mb-1">
                  CHANDIGARH UNIVERSITY
                </span>
                <span className="font-mono text-[8px] font-black text-black bg-white border border-black px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0_#000] inline-block mb-2">
                  8.2 CGPA ⭐️
                </span>
                <p className="font-mono text-[9.5px] sm:text-[10px] leading-relaxed text-white/95 font-semibold">
                  Bachelor of Engineering (B.E.) in Computer Science & Engineering. Specialized in Big Data ingestion structures and high-performance databases.
                </p>
              </div>
            </div>

            {/* Future Company / Role Node */}
            <div className="relative">
              {/* Timeline dot connector */}
              <div className="absolute left-[-37px] top-1.5 w-6 h-6 rounded-full bg-[#A5CF4E] border-3 border-black shadow-[2px_2px_0_#000] z-20 flex items-center justify-center text-[10px]">
                💼
              </div>
              <div className="font-mono text-[10px] font-black text-black/60 mb-1">2027 JUL - FUTURE</div>
              <div className="bg-[#A5CF4E] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0_#000] text-white">
                <span className="font-bubble text-xs sm:text-sm font-black block leading-tight drop-shadow-[1.5px_1.5px_0_#000] mb-2">
                  YOUR COMPANY / ROLE
                </span>
                <p className="font-mono text-[9.5px] sm:text-[10px] leading-relaxed text-white/95 font-semibold">
                  Ready to join your engineering team. Prepared to architect ingestion systems, deploy custom Model Context Protocol (MCP) servers, and scale workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-black/15 pt-4">
            <p className="font-mono text-[10px] font-semibold text-black/60 leading-relaxed">
              "we map out every milestone: code, architecture, AI protocols, and databases — to build systems that last"
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
