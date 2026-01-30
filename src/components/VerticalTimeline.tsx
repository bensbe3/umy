// VerticalTimeline.tsx - Minimalist vertical timeline
import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import './VerticalTimeline.css';

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  image: string;
}

interface VerticalTimelineProps {
  slides: TimelineEntry[];
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ slides }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className="vertical-timeline-section" ref={containerRef}>
      <div className="vertical-timeline-header">
        <motion.h2 
          className="vertical-timeline-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          Our Journey
        </motion.h2>
        <motion.p 
          className="vertical-timeline-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          From our founding to becoming a leading voice for Moroccan youth worldwide
        </motion.p>
      </div>

      <div className="vertical-timeline-content">
        {/* Progress Line */}
        <div className="timeline-line-container">
          <div className="timeline-line-background" />
          <motion.div 
            className="timeline-line-progress"
            style={{
              scaleY: scrollYProgress
            }}
          />
        </div>

        {/* Timeline Entries */}
        <div className="timeline-entries">
          {slides.map((entry, index) => (
            <TimelineEntry key={index} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineEntry: React.FC<{ entry: TimelineEntry; index: number }> = ({ entry, index }) => {
  const entryRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={entryRef}
      className="timeline-entry"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Sticky Year Label */}
      <div className="timeline-year-sticky">
        <motion.div
          className="timeline-year-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          {entry.year}
        </motion.div>
      </div>

      {/* Dot */}
      <div className="timeline-dot" />

      {/* Content */}
      <div className="timeline-entry-content">
        <div className="timeline-entry-text">
          <h3 className="timeline-entry-title">{entry.title}</h3>
          <p className="timeline-entry-description">{entry.description}</p>
        </div>

        <div className="timeline-entry-image">
          <div className="timeline-image-wrapper">
            <img src={entry.image} alt={entry.title} className="timeline-image" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};