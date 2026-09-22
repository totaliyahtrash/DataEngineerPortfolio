import { useState } from 'react';
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
  const [marioTriggered, setMarioTriggered] = useState(false);

  return (
    <div 
      className="relative min-h-screen bg-[#191919] text-white select-none overflow-x-clip"
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
        <SkillsMeet />

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
