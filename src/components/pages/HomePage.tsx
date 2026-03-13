// HomePage.tsx - Updated with Pillars + DecryptMundi + OrientationPillars Sections
import { Link } from 'react-router-dom';
import { Suspense, useState } from 'react';
import {
  ArrowRight, Users, Target, Award, Globe, Landmark, Handshake,
  Users2, Compass, Scale, BookOpen, GraduationCap, ChevronDown,
  Star, MapPin
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import PixelCard from '../PixelCard';
import Hyperspeed from '../Hyperspeed';
import ScrollReveal from '../ScrollReveal';
import { VerticalTimeline } from '../VerticalTimeline';
import { HomepageNewsFeed } from '../HomepageNewsFeed';
import { DecryptMundiHomepage } from '../DecryptMundiHomepage';
import './HomePage.css';
import { timelineImages } from '../images';


// ─────────────────────────────────────────────────────────
//  OrientationPillars — accordion section
// ─────────────────────────────────────────────────────────
const orientationItems = [
  {
    id: 'op1',
    color: 'green' as const,
    num: '01',
    icon: <GraduationCap size={22} />,
    title: 'Academic Orientation & Test Preparation',
    preview: 'We help students navigate one of the most important transitions of their lives: choosing what comes after high school.',
    content: (
      <>
        <p className="op-body-text">
          We help students navigate one of the most important transitions of their lives:
          choosing what comes after high school. Through structured guidance and preparation
          programs, we provide the clarity and tools students need to make informed decisions
          about their academic future.
        </p>
        <p className="op-body-label">Our initiatives include</p>
        <ul className="op-bullets">
          <li>Academic orientation sessions and mentorship with students and professionals</li>
          <li>Preparation support for international standardized tests</li>
          <li>Guidance on university applications and global academic pathways</li>
        </ul>
        <p className="op-body-text">
          By combining orientation, preparation and real insights from experienced mentors,
          we help students approach their post-bac choices with confidence and direction.
        </p>
      </>
    ),
  },
  {
    id: 'op2',
    color: 'red' as const,
    num: '02',
    icon: <Globe size={22} />,
    title: 'International & National Educational Programs',
    preview: 'We design innovative educational programs in Morocco, introducing concepts that have rarely, if ever, been offered before.',
    content: (
      <>
        <p className="op-body-text">
          We design innovative educational programs in Morocco, introducing concepts that
          have rarely, if ever, been offered before. These programs go beyond traditional
          classrooms, combining interactive simulations, hands-on projects and workshops
          that spark creativity and critical thinking. Participants are encouraged to
          collaborate, experiment and explore new fields in a way that builds both
          confidence and ambition. By connecting students with peers and mentors, we
          create a unique environment for personal and academic growth.
        </p>
        <div className="op-divider" />
        <p className="op-body-text">
          We also organize international trips for selected Moroccan delegations, giving
          students the chance to experience global educational environments. Participants
          engage with international peers, attend top ranked conferences and visit
          institutions — they gain exposure to new perspectives and ideas. These trips
          broaden horizons, strengthen intercultural understanding and create lasting
          connections that inspire ambition and global citizenship.
        </p>
      </>
    ),
  },
  {
    id: 'op3',
    color: 'gold' as const,
    num: '03',
    icon: <Star size={22} />,
    title: 'Exclusive Opportunities',
    preview: 'Access to the right opportunity can completely transform a student\'s trajectory.',
    content: (
      <>
        <p className="op-body-text">
          Access to the right opportunity can completely transform a student's trajectory.
          Through our network and partnerships, we highlight and facilitate access to
          selective and high-impact programs that ambitious students should not miss.
        </p>
        <p className="op-body-label">We regularly share and connect students with</p>
        <ul className="op-bullets">
          <li>Selective summer schools and international programs</li>
          <li>Leadership initiatives and personal development competitions</li>
          <li>Unique opportunities designed to challenge, inspire and elevate the next generation of Moroccan youth</li>
        </ul>
      </>
    ),
  },
];

function OrientationPillars() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(prev => prev === id ? null : id);

  return (
    <section className="op-section">
      {/* Risographic ink blobs */}
      <div className="op-riso-blob op-riso-blob--1" aria-hidden="true" />
      <div className="op-riso-blob op-riso-blob--2" aria-hidden="true" />
      <div className="op-riso-blob op-riso-blob--3" aria-hidden="true" />

      <div className="op-container">
        {/* Header */}
        <div className="op-header">
          <span className="op-label">Orientation &amp; Opportunities</span>
          <h2 className="op-title">
            Building Futures,<br />
            <span className="op-title-accent">One Student at a Time</span>
          </h2>
          <p className="op-subtitle">
            Through structured guidance and world-class programs, we prepare Moroccan youth
            for academic and professional excellence — at home and internationally.
          </p>
        </div>

        {/* Accordion cards */}
        <div className="op-accordion">
          {orientationItems.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className={`op-card op-card--${item.color}${isOpen ? ' op-card--open' : ''}`}
              >
                {/* Noise texture overlay */}
                <div className="op-card-noise" aria-hidden="true" />

                <button
                  className="op-card-trigger"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                >
                  {/* Number */}
                  <span className="op-card-num">{item.num}</span>

                  {/* Icon */}
                  <div className={`op-card-icon op-card-icon--${item.color}`}>
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div className="op-card-meta">
                    <span className="op-card-title">{item.title}</span>
                    {!isOpen && (
                      <span className="op-card-preview">{item.preview}</span>
                    )}
                  </div>

                  {/* Chevron */}
                  <div className={`op-card-chevron${isOpen ? ' op-card-chevron--open' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Body */}
                <div className={`op-card-body${isOpen ? ' op-card-body--open' : ''}`}>
                  <div className="op-card-body-inner">
                    {item.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="op-footer">
          <Link to="/orientation" className="op-cta">
            Explore All Programs
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────
//  HomePage
// ─────────────────────────────────────────────────────────
export function HomePage() {
  const commissions = [
    {
      icon: Landmark,
      title: 'Moroccan Politics',
      description: 'Engaging with political developments, policy analysis, and civic participation initiatives within Morocco.',
      variant: 'red' as const,
      color: '#8B0000',
      link: '/commissions#mp'
    },
    {
      icon: Handshake,
      title: 'International Relations',
      description: 'Fostering global partnerships and diplomatic engagement between Morocco and the international community.',
      variant: 'blue' as const,
      color: '#0ea5e9',
      link: '/commissions#ir'
    },
    {
      icon: Users2,
      title: 'Social Development',
      description: 'Advancing education, healthcare, and community welfare programs across Moroccan communities.',
      variant: 'yellow' as const,
      color: '#e0e24dcd',
      link: '/commissions#sd'
    },
  ];

  const highlights = [
    {
      icon: Users,
      title: 'Active Citizenship',
      description: 'Inspiring young Moroccans to believe in their voice and take part, with awareness and responsibility, in shaping public life.',
      color: 'emerald'
    },
    {
      icon: Target,
      title: 'Next-Gen Elite Leadership',
      description: 'Empowering youth to grow with confidence, think critically, and lead with integrity and a sense of service to society.',
      color: 'red'
    },
    {
      icon: Award,
      title: 'Dialogue',
      description: 'Creating spaces where listening, respect, and open dialogue bring youth and institutions closer, in a spirit of trust and unity.',
      color: 'yellow'
    },
  ];

  const timelineSlides = [
    {
      year: "June 2022",
      title: "Foundation & Vision",
      description: "Founded as YMUN, a nationally recognized Model United Nations club, bringing together young Moroccans engaged in diplomacy, debate, and international affairs. YMUN quickly gained national visibility through conferences, training programs, and youth-led initiatives.",
      image: timelineImages['7.webp']
    },
    {
      year: "2025",
      title: "officially NGO",
      description: "Building on this foundation, the organization evolved into United Moroccan Youth, officially established as a non-governmental organization. This transition marked an expansion of its mission toward structured dialogue, civic engagement, and the development of initiatives with practical impact at both national and international levels.",
      image: timelineImages['22.webp']
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <ImageWithFallback
            src={timelineImages['1.webp']}
            alt="United Moroccan Youth - Hero"
            className="hero-image"
            fetchPriority="high"
            loading="eager"
          />
        </div>
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1 className="hero-title"> </h1>
            <p className="hero-subtitle">
              Building bridges, fostering excellence, and celebrating Moroccan heritage through community engagement and professional development.
            </p>
            <div className="hero-actions">
              <Link to="/commissions" className="btn btn-secondary">
                Civic Leadership Commissions
                <ArrowRight className="btn-icon" />
              </Link>
              <Link to="/orientation" className="btn btn-primary">
                Orientation and Opportunities
                <ArrowRight className="btn-icon" />
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-gradient"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <ScrollReveal baseOpacity={0} containerClassName="stats-scroll-reveal">
            United Moroccan Youth works to strengthen youth participation by creating spaces for dialogue, collaboration, and practical initiatives across civic, economic, and international spheres.
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          UMY'S TWO PILLARS OF IMPACT
          ═══════════════════════════════════════════════════ */}
      <section className="pillars-section">
        <div className="pillars-container">

          {/* Header */}
          <div className="pillars-header">
            <div className="pillars-label">Our Structure</div>
            <h2 className="pillars-title">
              UMY's Two Pillars of <span className="pillars-title-red">Impact</span>
            </h2>
            <p className="pillars-subtitle">
              United Moroccan Youth channels its mission through two
              complementary pillars one building futures, the other shaping
              citizens.
            </p>
          </div>

          {/* ── THE TREE ── */}
          <div className="tree">
            <div className="tree-root">
              <div className="tree-root-inner">
                <img
                  src="/images/logoUmy.png"
                  alt="United Moroccan Youth"
                  className="tree-root-logo"
                />
                <span className="tree-root-sub"></span>
              </div>
            </div>
            <div className="tree-trunk-line" />
            <div className="tree-split">
              <div className="tree-split-dot" />
              <div className="tree-split-line tree-split-line--left" />
              <div className="tree-split-line tree-split-line--right" />
            </div>
            <div className="tree-drops">
              <div className="tree-drop tree-drop--left" />
              <div className="tree-drop tree-drop--right" />
            </div>
            <div className="tree-leaves">
              <div className="tree-leaf tree-leaf--green">
                <Compass size={0} />
              </div>
              <div className="tree-leaf tree-leaf--red">
                <Scale size={0} />
              </div>
            </div>
          </div>

          {/* ── PILLAR CARDS ── */}
          <div className="pillars-grid">

            {/* Pillar 1 — Orientation */}
            <Link to="/orientation" className="pillar-card pillar-card--green">
              <div className="pillar-card-accent" />
              <div className="pillar-num">01</div>
              <div className="pillar-icon-box pillar-icon-box--green">
                <Compass size={24} />
              </div>
              <h3 className="pillar-name">
                Orientation
                <span className="pillar-name-amp">&amp; Opportunities</span>
              </h3>
              <p className="pillar-desc">
                Guiding students toward the right academic path, sharing
                life changing opportunities, and preparing them for
                international success.
              </p>
              <div className="pillar-features">
                {[
                  { icon: GraduationCap, text: 'Post-Bac Guidance' },
                  { icon: Globe,          text: 'Scholarships & Programs' },
                  { icon: BookOpen,       text: 'Test Prep & Strategy' },
                ].map((f, i) => (
                  <div key={i} className="pillar-feature">
                    <div className="pillar-feature-dot pillar-feature-dot--green" />
                    <f.icon size={14} className="pillar-feature-icon" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="pillar-cta pillar-cta--green">
                <span>Explore</span>
                <ArrowRight size={15} />
              </div>
            </Link>

            {/* Pillar 2 — Civic Leadership */}
            <Link to="/commissions" className="pillar-card pillar-card--red">
              <div className="pillar-card-accent" />
              <div className="pillar-num">02</div>
              <div className="pillar-icon-box pillar-icon-box--red">
                <Scale size={24} />
              </div>
              <h3 className="pillar-name">
                Civic Leadership
                <span className="pillar-name-amp">Program</span>
              </h3>
              <p className="pillar-desc">
                Structured commissions tackling politics, diplomacy, and social
                development building the next generation of engaged citizens.
              </p>
              <div className="pillar-features">
                {[
                  { icon: Landmark,   text: 'Moroccan Politics' },
                  { icon: Handshake,  text: 'International Relations' },
                  { icon: Users,      text: 'Social Development' },
                ].map((f, i) => (
                  <div key={i} className="pillar-feature">
                    <div className="pillar-feature-dot pillar-feature-dot--red" />
                    <f.icon size={14} className="pillar-feature-icon" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="pillar-cta pillar-cta--red">
                <span>Explore</span>
                <ArrowRight size={15} />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* News Feed Section */}
      <HomepageNewsFeed />

      {/* Commissions Section */}
      <section className="commissions-section">
        <div className="container">
          <div className="commissions-header">
            <div className="section-label">Civic Leadership Commissions</div>
            <p className="section-description">
              Explore our specialized commissions dedicated to advancing political discourse, international cooperation, and social development.
            </p>
          </div>
          <div className="commissions-grid">
            {commissions.map((commission, index) => {
              const Icon = commission.icon;
              return (
                <Link key={index} to={commission.link} className="commission-link">
                  <PixelCard variant={commission.variant} className="commission-pixel-card">
                    <div className="commission-content">
                      <div className="commission-icon-wrapper" style={{ color: commission.color }}>
                        <Icon className="commission-icon" />
                      </div>
                      <h3 className="commission-title">{commission.title}</h3>
                      <p className="commission-description">{commission.description}</p>
                      <div className="commission-arrow">
                        <ArrowRight className="arrow-icon" />
                      </div>
                    </div>
                  </PixelCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ORIENTATION PILLARS ACCORDION
          ═══════════════════════════════════════════════════ */}
      <OrientationPillars />

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="container">
          <div className="highlights-header">
            <div className="section-label">Our Mission</div>
            <h2 className="section-title-center">Core Values & Pillars</h2>
            <p className="section-description">
              United Moroccan Youth structures its action around core civic pillars that reflect a deep commitment to citizenship, responsibility, and public engagement.
            </p>
          </div>
          <div className="highlights-grid">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className={`highlight-card highlight-card-${highlight.color}`}>
                  <div className={`highlight-icon-wrapper highlight-icon-${highlight.color}`}>
                    <Icon className="highlight-icon" />
                  </div>
                  <h3 className="highlight-title">{highlight.title}</h3>
                  <p className="highlight-description">{highlight.description}</p>
                  <div className="highlight-arrow">
                    <ArrowRight className="arrow-icon" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DecryptMundi Section */}
      <DecryptMundiHomepage />

      {/* Vertical Timeline Section */}
      <VerticalTimeline slides={timelineSlides} />

      {/* CTA Section with Moroccan-themed Hyperspeed */}
      <section className="cta-section">
        <div className="grid-scan-wrapper">
          <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
            <Hyperspeed
  effectOptions={{"distortion":"LongRaceDistortion","length":400,"roadWidth":20,"islandWidth":1,"lanesPerRoad":5,"fov":90,"fovSpeedUp":100,"speedUp":2,"carLightsFade":0.1,"totalSideLightSticks":50,"lightPairsPerRoadWay":70,"shoulderLinesWidthPercentage":0.05,"brokenLinesWidthPercentage":0.1,"brokenLinesLengthPercentage":0.5,"lightStickWidth":[0.12,0.5],"lightStickHeight":[1.3,1.7],"movingAwaySpeed":[60,80],"movingCloserSpeed":[-120,-160],"carLightsLength":[20,60],"carLightsRadius":[0.05,0.14],"carWidthPercentage":[0.3,0.5],"carShiftX":[-0.2,0.2],"carFloorSeparation":[0.05,1],"colors":{"roadColor":526344,"islandColor":657930,"background":0,"shoulderLines":1250072,"brokenLines":1250072,"leftCars":[16736115,15158624,16715818],"rightCars":[10806246,8442324,5489350],"sticks":10806246}}}
/>
          </Suspense>
        </div>
        <div className="container-narrow">
          <div className="cta-content">
            <div className="cta-badge">
              <Globe className="cta-badge-icon" />
              <span>Make a Difference</span>
            </div>
            <h2 className="cta-title">Support Our Mission</h2>
            <p className="cta-description">
              Help us continue making a difference in Moroccan communities worldwide. Your support enables us to expand our programs and reach more people.
            </p>
            <Link to="/sponsor" className="btn btn-cta">
              Become a Sponsor
              <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}