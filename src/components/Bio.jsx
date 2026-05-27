import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Logos for Skills
const KafkaLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className={`w-5.5 h-5.5 ${white ? 'fill-white stroke-white' : 'fill-black stroke-black'} shrink-0`} strokeWidth="0.5">
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="5" cy="5" r="3" />
    <circle cx="19" cy="5" r="3" />
    <circle cx="12" cy="19" r="3" />
    <line x1="5" y1="5" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" />
    <line x1="19" y1="5" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" />
    <line x1="12" y1="19" x2="12" y2="12" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const PythonLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.75 2 9.55 2.11 8.56 2.32c-.99.21-1.85.55-2.52 1.22s-1 1.53-1.21 2.52C4.6 7 4.5 8.2 4.5 9.45v1.2H8.1V10c0-.52.22-1 .61-1.39.39-.39.87-.61 1.39-.61h2.4V5.6H10.1c.14-.3.44-.5.78-.5.34 0 .64.2.78.5h.84c.14-.3.44-.5.78-.5.34 0 .64.2.78.5h.84c.14-.3.44-.5.78-.5.34 0 .64.2.78.5h.2v2.4h2.4v-1.2c0-1.25-.1-2.45-.32-3.44-.21-.99-.55-1.85-1.22-2.52s-1.53-1-2.52-1.21C14.45 2.1 13.25 2 12 2z" fill={white ? "#FFF" : "#3776AB"} />
    <path d="M12 22c1.25 0 2.45-.11 3.44-.32.99-.21 1.85-.55 2.52-1.22s1-1.53 1.21-2.52c.21-.99.32-2.19.32-3.44v-1.2H15.9v.65c0 .52-.22 1-.61 1.39-.39.39-.87.61-1.39.61h-2.4v2.4h2.4c-.14.3-.44.5-.78.5s-.64-.2-.78-.5h-.84c-.14.3-.44.5-.78.5s-.64-.2-.78-.5h-.84c-.14.3-.44.5-.78.5s-.64-.2-.78-.5h-.2v-2.4H8.1v1.2c0 1.25.1 2.45.32 3.44.21.99.55 1.85 1.22 2.52s1.53 1 2.52 1.21c.99.21 2.19.32 3.44.32z" fill={white ? "#FFF" : "#FFD860"} />
    <circle cx="9.25" cy="5.75" r="0.75" fill={white ? "#3776AB" : "#FFF"} />
    <circle cx="14.75" cy="18.25" r="0.75" fill={white ? "#FFD860" : "#FFF"} />
  </svg>
);

const DockerLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className={`w-5.5 h-5.5 shrink-0 ${white ? 'fill-white' : 'fill-[#2496ED]'}`}>
    <path d="M13.9 8.2h-2.1v2.1h2.1V8.2zm-2.7 0H9.1v2.1h2.1V8.2zm5.4 0h-2.1v2.1h2.1V8.2zm-8.1 0H6.4v2.1h2.1V8.2zm8.1-2.7h-2.1v2.1h2.1V5.5zm-2.7 0h-2.1v2.1h2.1V5.5zm-2.7 0H9.1v2.1h2.1V5.5zm5.4 2.7h-2.1v2.1h2.1V8.2zM2 13.9c0 4.1 3.3 7.4 7.4 7.4h6c3.2 0 5.8-2.6 5.8-5.8 0-3.3-2.1-5-3.3-5.8-.3-.2-.7-.4-1.2-.6v.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9V9.1c0-.5-.4-.9-.9-.9h-1.5c.2.4.3.9.3 1.4v2.1c0 .5-.4.9-.9.9s-.9-.4-.9-.9V9.1c0-.5-.4-.9-.9-.9H9.4v3.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9V9.1H5.5V13.9z" />
  </svg>
);

const SQLLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className={`w-5.5 h-5.5 shrink-0 ${white ? 'fill-white stroke-zinc-950' : 'fill-[#0064a5] stroke-black'}`} strokeWidth="1.5">
    <ellipse cx="12" cy="6" rx="6" ry="2.5" />
    <path d="M6 6v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" />
    <path d="M6 10.5V15c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" />
    <path d="M6 15v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
  </svg>
);

const DbtLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className={`w-5.5 h-5.5 shrink-0 fill-none ${white ? 'stroke-white' : 'stroke-[#FF6B4A]'}`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 22,12 12,22 2,12" />
    <polygon points="12,6 18,12 12,18 6,12" />
  </svg>
);

const SparkLogo = ({ white }) => (
  <svg viewBox="0 0 24 24" className={`w-5.5 h-5.5 shrink-0 ${white ? 'fill-white' : 'fill-[#E25A2C]'}`}>
    <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
    <circle cx="12" cy="12" r="2" fill={white ? "#E25A2C" : "white"} />
  </svg>
);

export default function Bio() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null); // null or 0..5

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const skillLogos = [
    { name: 'Kafka', logo: (w) => <KafkaLogo white={w} />, bg: '#1c1c1e', symbol: 'K', glow: 'rgba(28,28,30,0.5)' },
    { name: 'Python', logo: (w) => <PythonLogo white={w} />, bg: '#3776AB', symbol: 'Py', glow: 'rgba(55,118,171,0.5)' },
    { name: 'Docker', logo: (w) => <DockerLogo white={w} />, bg: '#2496ED', symbol: '🐋', glow: 'rgba(36,150,237,0.5)' },
    { name: 'SQL', logo: (w) => <SQLLogo white={w} />, bg: '#0064a5', symbol: 'db', glow: 'rgba(0,100,165,0.5)' },
    { name: 'dbt', logo: (w) => <DbtLogo white={w} />, bg: '#FF6B4A', symbol: 'dbt', glow: 'rgba(255,107,74,0.5)' },
    { name: 'Spark', logo: (w) => <SparkLogo white={w} />, bg: '#E25A2C', symbol: 'S', glow: 'rgba(226,90,44,0.5)' }
  ];

  const getTechDescription = (index) => {
    switch (index) {
      case 0:
        return {
          title: 'APACHE KAFKA',
          subtitle: 'High-Throughput Ingestion',
          desc: 'Used as a distributed message broker to ingest high-frequency log telemetry. Handles partitions, replication, and schema validation before buffering data for database writes.'
        };
      case 1:
        return {
          title: 'PYTHON',
          subtitle: 'ETL & Data Engineering',
          desc: 'Core language for writing data processors, web API comment scrapers, and VADER sentiment analysis engines. Focuses on modular structures and raw data cleaning.'
        };
      case 2:
        return {
          title: 'DOCKER',
          subtitle: 'Container Infrastructure',
          desc: 'Containerizes ETL workers, ClickHouse, and Postgres servers for reliable, isolated runtimes. Optimized Compose mounts and multi-stage builds speed up local tests.'
        };
      case 3:
        return {
          title: 'SQL & DATABASES',
          subtitle: 'OLAP & OLTP Database Querying',
          desc: 'Designs optimized index structures in Postgres and columnar partitions in ClickHouse. Handles analytics queries and aggregates across 14.8M records in under 4ms.'
        };
      case 4:
        return {
          title: 'DBT',
          subtitle: 'Analytics Engineering Transformations',
          desc: 'Transforms raw database tables into clean, structured models. Wrote schema locks, validity check tests, and mapped dependency DAG graphs for lineage auditing.'
        };
      case 5:
        return {
          title: 'APACHE SPARK',
          subtitle: 'Distributed Computations',
          desc: 'Processes high-throughput analytics logs in parallel. Configures executors, maps data partitions, and builds streaming aggregations for telemetry pipelines.'
        };
      default:
        return {
          title: 'TECH WORKSPACE',
          subtitle: 'Dhruv Saini Capabilities',
          desc: 'Hover or tap any of the technology nodes on the sides to view a clear explanation of how I apply each framework and database system to build production-grade data architectures.'
        };
    }
  };

  return (
    <section 
      id="bio" 
      className="relative min-h-[100vh] w-full bg-[#faf9f5] border-t-4 border-black py-24 px-6 sm:px-12 flex flex-col items-center justify-center overflow-hidden text-black z-20 select-none section-contain"
    >
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-5 pointer-events-none z-0" />

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-[#A5CF4E] border-3 border-black px-8 py-3 rounded shadow-[5px_5px_0_#000] rotate-[-2deg] mb-16 relative z-20"
      >
        <div className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-16 h-4.5 paper-tape rotate-[3deg] border-x border-black/10" />
        <h2 className="font-bubble text-3xl sm:text-4xl font-black uppercase text-black">WHO IS DHRUV?</h2>
      </motion.div>

      {/* Main 3-Column Asymmetric Grid Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* COLUMN 1: LEFT SIDE (Interactive Skill Dashboard with Laptop & SVG Lines) */}
        <div className="lg:col-span-6 flex items-center justify-center min-h-[380px] relative w-full py-4 order-3 lg:order-none">
          
          {!isMobile ? (
            /* Desktop View: Symmetric layout with laptop center and connecting wires */
            <div className="relative w-[500px] h-[360px] flex items-center justify-center select-none">
              
              {/* SVG wire connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {/* Kafka connector */}
                <motion.path
                  d="M 50 60 C 100 60, 100 130, 130 130"
                  stroke={hoveredSkill === 0 ? "#7C3AED" : "#000"}
                  strokeWidth={hoveredSkill === 0 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 0 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
                {/* Python connector */}
                <motion.path
                  d="M 35 180 C 90 180, 90 180, 130 180"
                  stroke={hoveredSkill === 1 ? "#3776AB" : "#000"}
                  strokeWidth={hoveredSkill === 1 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 1 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
                {/* Docker connector */}
                <motion.path
                  d="M 50 300 C 100 300, 100 230, 130 230"
                  stroke={hoveredSkill === 2 ? "#2496ED" : "#000"}
                  strokeWidth={hoveredSkill === 2 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 2 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
                {/* SQL connector */}
                <motion.path
                  d="M 450 60 C 400 60, 400 130, 370 130"
                  stroke={hoveredSkill === 3 ? "#0064a5" : "#000"}
                  strokeWidth={hoveredSkill === 3 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 3 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
                {/* dbt connector */}
                <motion.path
                  d="M 465 180 C 410 180, 410 180, 370 180"
                  stroke={hoveredSkill === 4 ? "#FF6B4A" : "#000"}
                  strokeWidth={hoveredSkill === 4 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 4 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
                {/* Spark connector */}
                <motion.path
                  d="M 450 300 C 400 300, 400 230, 370 230"
                  stroke={hoveredSkill === 5 ? "#E25A2C" : "#000"}
                  strokeWidth={hoveredSkill === 5 ? 3.5 : 2}
                  strokeDasharray="6 4"
                  animate={hoveredSkill === 5 ? { strokeDashoffset: [-20, 0] } : { strokeDashoffset: 0 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
                  fill="none"
                />
              </svg>

              {/* Symmetrical Skills Badges */}
              {skillLogos.map((skill, idx) => {
                const positions = [
                  { left: '50px', top: '60px' },   // Left Top (Kafka)
                  { left: '35px', top: '180px' },  // Left Mid (Python)
                  { left: '50px', top: '300px' },  // Left Bottom (Docker)
                  { left: '450px', top: '60px' },  // Right Top (SQL)
                  { left: '465px', top: '180px' }, // Right Mid (dbt)
                  { left: '450px', top: '300px' }  // Right Bottom (Spark)
                ];
                const pos = positions[idx];
                const isHovered = hoveredSkill === idx;
                
                return (
                  <motion.div
                    key={skill.name}
                    onMouseEnter={() => setHoveredSkill(idx)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    style={{
                      left: pos.left,
                      top: pos.top,
                      x: '-50%',
                      y: '-50%',
                      backgroundColor: skill.bg,
                      boxShadow: isHovered 
                        ? `0 0 20px ${skill.glow}, 5px 5px 0 #000` 
                        : `3px 3px 0 #000`
                    }}
                    className="absolute w-14 h-14 rounded-full border-3 border-black flex items-center justify-center cursor-pointer transition-shadow duration-150 select-none z-30 pointer-events-auto"
                    whileHover={{ scale: 1.15 }}
                  >
                    {skill.logo(true)}

                    {/* Skill Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.85 }}
                          className="absolute bottom-full mb-2 bg-yellow-400 text-black border-2 border-black font-mono font-black text-[9px] px-2 py-0.5 rounded shadow-[2.5px_2.5px_0_#000] whitespace-nowrap z-50 pointer-events-none"
                        >
                          {skill.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Center Terminal Laptop Mockup */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {/* Screen Bezel (Centered exactly at left-1/2 top-1/2) */}
                <div 
                  className="w-[240px] h-[150px] bg-zinc-300 border-4 border-black rounded-t-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-2 shadow-[0_-4px_0_rgba(0,0,0,0.1)_inset] pointer-events-auto"
                >
                  {/* Camera dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-black absolute top-1.5 left-1/2 -translate-x-1/2" />
                  
                  {/* Screen Frame */}
                  <div className="flex-1 bg-zinc-950 rounded border border-zinc-800 p-2 font-mono text-[9px] text-zinc-300 relative overflow-hidden flex flex-col justify-between">
                    {/* Screen content */}
                    {(() => {
                      const tech = getTechDescription(hoveredSkill);
                      return (
                        <div className="flex-1 flex flex-col justify-start z-10 text-left select-text">
                          <div className="flex items-center justify-between text-[7px] text-[#A5CF4E] border-b border-zinc-900 pb-1 mb-1.5 uppercase tracking-wider font-mono font-bold">
                            <span>{tech.title}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                          <div className="text-[#FFD860] font-bold text-[8.5px] uppercase tracking-wide mb-1">
                            {tech.subtitle}
                          </div>
                          <p className="text-zinc-300 font-mono text-[8px] leading-relaxed whitespace-normal font-medium">
                            {tech.desc}
                          </p>
                        </div>
                      );
                    })()}
                    <div className="text-[6px] text-zinc-600 border-t border-zinc-900 pt-1 mt-1.5 text-right font-mono uppercase">
                      capabilities_reader
                    </div>
                  </div>
                </div>

                {/* Hinge (placed right under bezel bottom) */}
                <div className="w-[100px] h-[5px] bg-zinc-400 border-x-3 border-black absolute left-1/2 top-[calc(50%+75px)] -translate-x-1/2 -translate-y-full shrink-0" />

                {/* Keyboard Base (placed right under bezel bottom) */}
                <div className="w-[280px] h-[14px] bg-zinc-300 border-4 border-black rounded-b-xl absolute left-1/2 top-[calc(50%+75px)] -translate-x-1/2 shadow-[0_5px_0_rgba(0,0,0,1)] shrink-0 flex justify-center pointer-events-auto">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-white/40" />
                  <div className="w-12 h-1.5 bg-zinc-400 border-x-2 border-t-2 border-black rounded-t mt-0.5" />
                </div>
              </div>

            </div>
          ) : (
            /* Mobile View: Vertical dashboard with top laptop and bottom selectable badges */
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.85 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.35 }}
              className="flex flex-col items-center justify-center w-full relative z-20 max-w-sm mx-auto"
            >
              
              {/* Screen/Laptop */}
              <div className="flex flex-col items-center justify-center mb-6 shrink-0 scale-95 sm:scale-100">
                <div 
                  className="w-[240px] h-[150px] bg-zinc-300 border-4 border-black rounded-t-xl relative flex flex-col p-2 shadow-[0_-4px_0_rgba(0,0,0,0.1)_inset]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black absolute top-1.5 left-1/2 -translate-x-1/2" />
                  {/* Screen Frame */}
                  <div className="flex-1 bg-zinc-950 rounded border border-zinc-800 p-2 font-mono text-[9px] text-zinc-300 relative overflow-hidden flex flex-col justify-between">
                    {/* Screen content */}
                    {(() => {
                      const tech = getTechDescription(hoveredSkill);
                      return (
                        <div className="flex-1 flex flex-col justify-start z-10 text-left select-text">
                          <div className="flex items-center justify-between text-[7px] text-[#A5CF4E] border-b border-zinc-900 pb-1 mb-1.5 uppercase tracking-wider font-mono font-bold">
                            <span>{tech.title}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                          <div className="text-[#FFD860] font-bold text-[8.5px] uppercase tracking-wide mb-1">
                            {tech.subtitle}
                          </div>
                          <p className="text-zinc-300 font-mono text-[8px] leading-relaxed whitespace-normal font-medium">
                            {tech.desc}
                          </p>
                        </div>
                      );
                    })()}
                    <div className="text-[6px] text-zinc-600 border-t border-zinc-900 pt-1 mt-1.5 text-right font-mono uppercase">
                      capabilities_reader
                    </div>
                  </div>
                </div>
                <div className="w-[100px] h-[5px] bg-zinc-400 border-x-3 border-black relative shrink-0" />
                <div className="w-[280px] h-[14px] bg-zinc-300 border-4 border-black rounded-b-xl relative shadow-[0_5px_0_rgba(0,0,0,1)] shrink-0 flex justify-center">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-white/40" />
                  <div className="w-12 h-1.5 bg-zinc-400 border-x-2 border-t-2 border-black rounded-t mt-0.5" />
                </div>
              </div>

              {/* Skill nodes grid */}
              <div className="grid grid-cols-2 gap-3 w-full px-2">
                {skillLogos.map((skill, idx) => {
                  const isSelected = hoveredSkill === idx;
                  return (
                    <button
                      key={skill.name}
                      onClick={() => setHoveredSkill(isSelected ? null : idx)}
                      style={{
                        backgroundColor: skill.bg,
                        boxShadow: isSelected 
                          ? `0 0 15px ${skill.glow}, 4px 4px 0 #000` 
                          : `4px 4px 0 #000`
                      }}
                      className="border-3 border-black px-4 py-2.5 rounded-2xl flex items-center justify-center space-x-2 text-white font-mono font-bold text-xs active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#000] transition-shadow shrink-0 duration-150 select-none outline-none"
                    >
                      {skill.logo(true)}
                      <span>{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>

        {/* COLUMN 2: CENTER (Polaroid photo placeholder frame) */}
        <div className="lg:col-span-3 flex justify-center items-center order-1 lg:order-none">
          <motion.div 
            initial={isMobile ? { y: -80, opacity: 0, rotate: -15 } : { scale: 0.9, opacity: 0, rotate: -12 }}
            whileInView={isMobile ? { y: 0, opacity: 1, rotate: 3 } : { scale: 1, opacity: 1, rotate: 3 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: isMobile ? 100 : 70, damping: isMobile ? 12 : 15, delay: 0.15 }}
            className="bg-white border-4 border-black p-4 pb-8 shadow-[8px_8px_0_rgba(0,0,0,1)] rounded relative w-60 sm:w-64 flex flex-col items-center justify-between"
          >
            {/* Polaroid Masking Tape header */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-5 paper-tape rotate-[-4deg] border-x border-black/10 z-30" />
            
            {/* Polaroid Picture Frame Area */}
            <div className="w-full aspect-square border-3 border-black bg-zinc-100 flex items-center justify-center relative overflow-hidden rounded">
              
              <img 
                src="/dhruv.jpg" 
                alt="Dhruv Saini" 
                loading="lazy"
                className="w-full h-full object-cover select-none filter contrast-[1.05] brightness-[1.02]"
                style={{ objectPosition: 'center' }}
              />

              {/* Taped label */}
              <div className="absolute bottom-2 left-2 bg-[#A5CF4E] border-2 border-black px-2 py-0.5 rounded text-[8px] font-mono font-bold shadow-[2px_2px_0_#000]">
                ACTIVE_DEV
              </div>
            </div>

            {/* Caption */}
            <span className="font-mono text-center font-black text-xs mt-4 uppercase tracking-wider text-black border-b-2 border-black/20 pb-0.5">
              dhruv saini
            </span>
          </motion.div>
        </div>

        {/* COLUMN 3: RIGHT SIDE (Scrapbook Card with detailed text bio) */}
        <div className="lg:col-span-3 flex justify-center items-center order-2 lg:order-none">
          <motion.div 
            initial={isMobile ? { x: 80, opacity: 0, rotate: 10 } : { x: 100, opacity: 0, rotate: 10 }}
            whileInView={isMobile ? { x: 0, opacity: 1, rotate: -2 } : { x: 0, opacity: 1, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: isMobile ? 90 : 60, damping: isMobile ? 14 : 15, delay: 0.25 }}
            className="w-full max-w-sm p-6 bg-white border-3 border-black text-black shadow-[6px_6px_0_rgba(0,0,0,1)] rounded-2xl rotate-[-2deg] relative"
          >
            {/* Taped Corner */}
            <div className="absolute top-[-9px] right-[25px] w-14 h-4.5 paper-tape rotate-[-8deg] border-x border-black/10 z-30" />
            
            <h3 className="font-bubble text-lg font-black uppercase text-black border-b-2 border-black pb-2 mb-4 tracking-tight">
              CORE OBJECTIVE
            </h3>
            
            <p className="font-mono text-xs leading-relaxed text-left font-semibold text-black/85 mb-4">
              architecting high-throughput ingestion pipelines and schema-locked storage systems. actively exploring integrations with Model Context Protocol (MCP) and Multi-Agent Systems (MAG).
            </p>

            <div className="border-t-2 border-dashed border-black/20 pt-4 space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-[#7C3AED] font-bold text-xs">✶</span>
                <span className="font-mono text-[10px] font-bold text-black/70">custom MCP server development</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7C3AED] font-bold text-xs">✶</span>
                <span className="font-mono text-[10px] font-bold text-black/70">multi-agent orchestrations (MAG)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7C3AED] font-bold text-xs">✶</span>
                <span className="font-mono text-[10px] font-bold text-black/70">15k events/sec log streams</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7C3AED] font-bold text-xs">✶</span>
                <span className="font-mono text-[10px] font-bold text-black/70">schema validator mapping & pipelines</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
