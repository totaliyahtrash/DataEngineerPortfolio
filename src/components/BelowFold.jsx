import React from 'react';
import { motion } from 'framer-motion';

export default function BelowFold() {
  const titleWords = "DATA ENGINEER".split(" ");
  const word1 = titleWords[0].split("");
  const word2 = titleWords[1].split("");

  // Specific hand-crafted rotations for "DATA ENGINEER" letters
  const rotations1 = [2, -3, 3, -2];
  const rotations2 = [-3, 2, -4, 1, -2, 3, -1, 4];

  return (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#7C3AED] pt-16 pb-24 px-4 sm:px-6 overflow-hidden section-contain">
      
      {/* Title: DATA ENGINEER */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center text-white leading-[0.75] text-[11vw] xs:text-[10vw] sm:text-[9vw] md:text-[8vw] tracking-[-0.05em] font-black uppercase text-center w-full select-none mb-10 z-10"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        {/* Word 1: DATA (Locked inline, never wraps internally) */}
        <span className="whitespace-nowrap flex justify-center mb-1">
          {word1.map((char, index) => (
            <span
              key={`data-${index}`}
              style={{ 
                display: 'inline-block',
                transform: `rotate(${rotations1[index % rotations1.length]}deg) translateY(${index % 2 === 0 ? '-3px' : '3px'})`,
                marginRight: '-0.04em',
              }}
              className="hover:scale-110 transition-transform duration-200 cursor-default drop-shadow-[0_8px_0_rgba(0,0,0,0.12)]"
            >
              {char}
            </span>
          ))}
        </span>

        {/* Word 2: ENGINEER (Locked inline, never wraps internally) */}
        <span className="whitespace-nowrap flex justify-center mt-[-0.5vw]">
          {word2.map((char, index) => (
            <span
              key={`eng-${index}`}
              style={{ 
                display: 'inline-block',
                transform: `rotate(${rotations2[index % rotations2.length]}deg) translateY(${index % 2 !== 0 ? '-3px' : '3px'})`,
                marginRight: '-0.04em',
              }}
              className="hover:scale-110 transition-transform duration-200 cursor-default drop-shadow-[0_8px_0_rgba(0,0,0,0.12)]"
            >
              {char}
            </span>
          ))}
        </span>
      </motion.div>

      {/* Humanized Subtext Paragraph (Scrapbook Paper Card) */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className="relative w-full max-w-lg mx-auto p-6 md:p-8 bg-white border-3 border-black text-black shadow-[6px_6px_0px_0px_#000000] rounded rotate-[1.5deg] z-10 my-4"
      >
        <div className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-24 h-5 paper-tape rotate-[-2deg] border-x border-black/10" />
        <p className="font-mono text-xs sm:text-sm md:text-[13px] leading-relaxed text-left font-semibold">
          i build data infrastructure, pipelines, and systems from my desk. 
          i work with teams worldwide from anywhere, or on-site where the engineering happens. 
          it's about making data flow smoothly, wherever we are.
        </p>
      </motion.div>

      {/* Accent path (subtle background SVG) */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[40%] h-auto opacity-5 pointer-events-none select-none z-0">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-white w-full h-full">
          <path d="M50 15a35 35 0 00-35 35c0 25 35 50 35 50s35-25 35-50a35 35 0 00-35-35zm0 50a15 15 0 1115-15 15 15 0 01-15 15z" />
        </svg>
      </div>

    </section>
  );
}
