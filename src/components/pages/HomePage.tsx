// HomePage.tsx - Updated with DecryptMundi Section
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import { ArrowRight, Users, Target, Award, Globe, Landmark, Handshake, Users2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import PixelCard from '../PixelCard';
import Hyperspeed from '../Hyperspeed';
import ScrollReveal from '../ScrollReveal';
import { VerticalTimeline } from '../VerticalTimeline';
import { HomepageNewsFeed } from '../HomepageNewsFeed';
import { DecryptMundiHomepage } from '../DecryptMundiHomepage';
import './HomePage.css';
import { timelineImages } from '../images';

// Import hero image - using one from images folder
import heroImage from '../images/menara.jpg';


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
      image: timelineImages['3.webp']
    },
    {
      year: "2025",
      title: "officially NGO",
      description: "Building on this foundation, the organization evolved into United Moroccan Youth, officially established as a non-governmental organization. This transition marked an expansion of its mission toward structured dialogue, civic engagement, and the development of initiatives with practical impact at both national and international levels.",
      image: timelineImages['2.webp']
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <ImageWithFallback
            src={heroImage}
            alt="United Moroccan Youth"
            className="hero-image"
            fetchPriority="high"
            loading="eager"
          />
        </div>
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="hero-badge"></div>
            <h1 className="hero-title">United Moroccan Youth</h1>
            <p className="hero-subtitle">
              Building bridges, fostering excellence, and celebrating Moroccan heritage through community engagement and professional development.
            </p>
            <div className="hero-actions">
              <Link to="/commissions" className="btn btn-primary">
                Explore Our Commissions
                <ArrowRight className="btn-icon" />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get Involved
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

      {/* News Feed Section - Second Section */}
      <HomepageNewsFeed />

      {/* Commissions Section */}
      <section className="commissions-section">
        <div className="container">
          <div className="commissions-header">
            <div className="section-label">Our Commissions</div>
            <h2 className="section-title-center">Three Pillars of Impact</h2>
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

      {/* DecryptMundi Section - NEW */}
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