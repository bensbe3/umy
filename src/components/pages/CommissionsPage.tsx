import { useState, useEffect } from 'react';
import { Building2, Globe, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActualitesSection } from '../ActualitesSection';
import './CommissionsPage.css';

export function CommissionsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle hash navigation (e.g., /commissions#ir)
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove #
    if (hash) {
      const commissionIndex = commissions.findIndex(c => c.id === hash);
      if (commissionIndex !== -1) {
        setActiveIndex(commissionIndex);
        // Scroll to commission section after a brief delay
        setTimeout(() => {
          const element = document.getElementById(`commission-${hash}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, []);

  const commissions = [
    {
      id: 'ir',
      name: 'International Relations',
      shortName: 'IR',
      icon: Globe,
      color: '#0ea5e9',
      description: 'Fostering global partnerships and diplomatic engagement between Morocco and the international community.',
      mission:
        'To strengthen Morocco\'s position on the global stage through strategic partnerships, cultural exchange, and international cooperation.',
      programs: [
        {
          title: 'Simulations Historiques',
          description: 'Historical reenactments and simulations to understand diplomatic history and international relations.',
        },
        {
          title: 'Model United Nations (MUN)',
          description: 'Diplomatic simulations fostering debate, negotiation, and global awareness skills.',
        },
        {
          title: 'Concours d\'Éloquence',
          description: 'Public speaking competitions developing rhetoric and persuasive communication skills.',
        },
        {
          title: 'Visites Diplomatiques',
          description: 'Educational visits to embassies and international organizations for practical exposure.',
        },
      ],
    },
    {
      id: 'mp',
      name: 'Moroccan Politics',
      shortName: 'MP',
      icon: Building2,
      color: '#8B0000',
      description: 'Engaging with political developments, policy analysis, and civic participation initiatives within Morocco.',
      mission:
        'To empower Moroccan youth with the tools and knowledge needed to actively participate in shaping the political landscape and advancing democratic values.',
      programs: [
        {
          title: 'Inside Moroccan Politics',
          description: 'Deep-dive analysis and discussion of current political developments and policy decisions.',
        },
        {
          title: 'Civic & Political Education',
          description: 'Educational programs promoting democratic participation and political awareness among youth.',
        },
        {
          title: 'Moroccan Governance Simulation',
          description: 'Interactive simulations providing hands-on experience with governance processes.',
        },
        {
          title: 'Politicon',
          description: 'Annual political conference bringing together students, experts, and policymakers.',
        },
      ],
    },
    {
      id: 'sd',
      name: 'Social Development',
      shortName: 'SD',
      icon: TrendingUp,
      color: '#d4af37',
      description: 'Advancing education, healthcare, and community welfare programs across Moroccan communities.',
      mission:
        'To promote sustainable development and social progress that benefits all members of Moroccan society, focusing on education, health, and community empowerment.',
      programs: [
        {
          title: 'VOICES of Hope',
          description: 'Empowering communities through storytelling and shared experiences that inspire positive change.',
        },
        {
          title: 'Let Women SPEAK',
          description: 'Providing platforms for women\'s voices to be heard and their perspectives to shape society.',
        },
        {
          title: 'La Série de Visites',
          description: 'Organizing field visits to connect communities and facilitate knowledge exchange.',
        },
        {
          title: 'Youth Fair',
          description: 'Annual gathering celebrating youth innovation, creativity, and social entrepreneurship.',
        },
      ],
    },
  ];

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % commissions.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + commissions.length) % commissions.length);
  };

  const currentCommission = commissions[activeIndex];
  const Icon = currentCommission.icon;

  return (
    <div className="commissions-page">
      {/* Header */}
      <section className="commissions-header-section">
        <div className="commissions-container">
          <div className="commissions-header-accent" />
          <h1 className="commissions-title">Our Commissions</h1>
          <p className="commissions-subtitle">
            Three specialized pillars driving our mission forward through focused initiatives and collaborative efforts.
          </p>
        </div>
      </section>

      {/* Commission Selector Pills */}
      <section className="commission-selector-section">
        <div className="commissions-container">
          <div className="commission-pills">
            {commissions.map((commission, index) => {
              const CommIcon = commission.icon;
              const isActive = activeIndex === index;
              
              return (
                <button
                  key={commission.id}
                  className={`commission-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    borderColor: isActive ? commission.color : 'rgba(245, 230, 211, 0.2)',
                    backgroundColor: isActive ? commission.color : 'transparent',
                  }}
                >
                  <CommIcon 
                    className="pill-icon"
                    style={{ color: isActive ? '#ffffff' : 'rgba(245, 230, 211, 0.6)' }}
                  />
                  <span className="pill-label" style={{ color: isActive ? '#ffffff' : '#f5e6d3' }}>
                    {commission.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission Content */}
      <section 
        id={`commission-${currentCommission.id}`}
        className="commission-content-section"
      >
        <div className="commissions-container">
          {/* Navigation Arrows - Desktop */}
          <button
            className="nav-arrow nav-arrow-left"
            onClick={goToPrevious}
            aria-label="Previous commission"
            style={{ borderColor: currentCommission.color }}
          >
            <ChevronLeft />
          </button>
          <button
            className="nav-arrow nav-arrow-right"
            onClick={goToNext}
            aria-label="Next commission"
            style={{ borderColor: currentCommission.color }}
          >
            <ChevronRight />
          </button>

          {/* Commission Card */}
          <div className="commission-main-card">
            <div 
              className="commission-accent-bar"
              style={{ backgroundColor: currentCommission.color }}
            />
            
            <div className="commission-header">
              <div 
                className="commission-icon-box"
                style={{ borderColor: currentCommission.color }}
              >
                <Icon 
                  className="commission-main-icon"
                  style={{ color: currentCommission.color }}
                />
              </div>
              <div className="commission-header-text">
                <h2 className="commission-main-title">{currentCommission.name}</h2>
                <p className="commission-main-description">{currentCommission.description}</p>
              </div>
            </div>

            {/* Mission */}
            <div 
              className="commission-mission"
              style={{ borderLeftColor: currentCommission.color }}
            >
              <h3 className="mission-heading">Mission Statement</h3>
              <p className="mission-content">{currentCommission.mission}</p>
            </div>

            {/* Actualités Section - Under Mission */}
            <ActualitesSection
              commissionId={currentCommission.id as 'ir' | 'mp' | 'sd'}
              commissionColor={currentCommission.color}
              commissionName={currentCommission.name}
            />

            {/* Programs Grid */}
            <div className="programs-section">
              <h3 className="programs-heading">Our Programs</h3>
              <div className="programs-grid">
                {currentCommission.programs.map((program, idx) => (
                  <div 
                    key={idx} 
                    className="program-card"
                  >
                    <div 
                      className="program-number"
                      style={{ 
                        backgroundColor: currentCommission.color,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <h4 className="program-title">{program.title}</h4>
                    <p className="program-description">{program.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Get Involved CTA */}
            <div 
              className="commission-cta"
              style={{ 
                backgroundColor: currentCommission.color,
                borderColor: currentCommission.color,
              }}
            >
              <h3 className="cta-title">Get Involved</h3>
              <p className="cta-description">
                Interested in contributing to the {currentCommission.name} commission? We welcome members who are passionate about making a difference.
              </p>
              <a 
                href="/contact" 
                className="cta-button"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="commission-dots">
            {commissions.map((commission, idx) => (
              <button
                key={idx}
                className={`dot ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`View ${commission.name}`}
                style={{
                  backgroundColor: activeIndex === idx ? commission.color : 'rgba(245, 230, 211, 0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}