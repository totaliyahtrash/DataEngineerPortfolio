import React, { useEffect, useState, useRef } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BelowFold from './components/BelowFold';
import SkillsMeet from './components/SkillsMeet';
import ProjectsDesktop from './components/ProjectsDesktop';
import Bio from './components/Bio';
import Calendar from './components/Calendar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [marioTriggered, setMarioTriggered] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger background color transition when the skills meet section is 15% in view
        if (entry.isIntersecting) {
          setIsDark(true);
        } else {
          // If we scroll back up past the skills section, revert to hotpink
          if (entry.boundingClientRect.top > 0) {
            setIsDark(false);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative min-h-screen transition-colors duration-700 ease-out select-none overflow-x-clip ${
        isDark ? 'bg-[#191919] text-white' : 'bg-[#7C3AED] text-white'
      }`}
    >
      {/* Dynamic Physics-based Custom Cursor */}
      <CustomCursor />

      {/* Sticky Top Navigation */}
      <Navigation setMarioTriggered={setMarioTriggered} />

      {/* Main Page Layout Flow */}
      <main>
        {/* Hero Landing Section */}
        <Hero marioTriggered={marioTriggered} setMarioTriggered={setMarioTriggered} />

        {/* Below-the-fold content ("DATA ENGINEER") */}
        <BelowFold />

        {/* Google Meet Skills Section */}
        <div ref={skillsRef}>
          <SkillsMeet />
        </div>

        {/* Horizontal Scrolling Projects Carousel */}
        <ProjectsDesktop />

        {/* Bio Section */}
        <Bio />

        {/* Replicated Weekly Calendar (Experience Section) */}
        <Calendar />
      </main>

      {/* Replicated Footer */}
      <Footer />
    </div>
  );
}

export default App;
