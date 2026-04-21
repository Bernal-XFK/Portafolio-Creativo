import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const skills = [
  { name: 'React / Next.js', level: 90, color: '#61dafb' },
  { name: 'TypeScript', level: 85, color: '#3178c6' },
  { name: 'Tailwind CSS', level: 95, color: '#38bdf8' },
  { name: 'Framer Motion', level: 80, color: '#f27d26' },
  { name: 'Python / Big Data', level: 75, color: '#ffde57' },
  { name: 'UI/UX Design', level: 85, color: '#ff00ff' },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-32 relative overflow-hidden bg-background" ref={ref}>
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-spin-slow-reverse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <div className="w-8 h-[1px] bg-primary" />
            <span className="font-mono text-primary text-sm uppercase tracking-widest">Habilidades</span>
            <div className="w-8 h-[1px] bg-primary" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-display font-bold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Arsenal <span className="text-gradient">Tecnológico</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <div key={skill.name} className="relative">
              <div className="flex justify-between mb-2 font-mono text-sm">
                <span className="text-white/80">{skill.name}</span>
                <span className="text-white/40">{skill.level}%</span>
              </div>
              
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ backgroundColor: skill.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                />
                
                {/* Glow Effect */}
                <motion.div
                  className="absolute top-0 left-0 h-full blur-sm opacity-50"
                  style={{ backgroundColor: skill.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Orbital Visualization (Abstract) */}
        <div className="mt-32 relative h-64 flex items-center justify-center hidden md:flex">
          <motion.div 
            className="w-32 h-32 rounded-full bg-primary/20 blur-xl absolute"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="w-16 h-16 rounded-full bg-primary z-10 flex items-center justify-center font-bold text-black font-display">
            CORE
          </div>
          
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${(i + 2) * 100}px`,
                height: `${(i + 2) * 100}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
            >
              <div 
                className="w-3 h-3 rounded-full bg-white absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ backgroundColor: i === 0 ? '#00ffcc' : i === 1 ? '#f27d26' : '#4a00e0' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
