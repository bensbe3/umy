// Timeline.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Timeline.css';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="timeline-wrapper" ref={containerRef}>
      <div className="timeline-header-container">
        <h2 className="timeline-main-title">Our Journey</h2>
        <p className="timeline-main-description">
          Discover the evolution of the United Moroccan Association and our commitment to empowering youth and building bridges.
        </p>
      </div>

      <div ref={ref} className="timeline-content-wrapper">
        {data.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-sticky-header">
              <div className="timeline-dot-outer">
                <div className="timeline-dot-inner" />
              </div>
              <h3 className="timeline-year-desktop">{item.title}</h3>
            </div>

            <div className="timeline-content">
              <h3 className="timeline-year-mobile">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: height + "px" }}
          className="timeline-line-bg"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="timeline-line-progress"
          />
        </div>
      </div>
    </div>
  );
};