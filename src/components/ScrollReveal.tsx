import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  baseOpacity = 100,
  baseRotation = 10,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}: {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  baseOpacity?: number;
  baseRotation?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 5%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');

    // Set initial opacity inline to ensure visibility
    wordElements.forEach((word: Element) => {
      (word as HTMLElement).style.opacity = baseOpacity.toString();
    });

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=10%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`} style={{ color: 'var(--color-text-beige, #f5e6d3)' }}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`} style={{ color: 'var(--color-text-beige, #f5e6d3)' }}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;

