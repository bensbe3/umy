import React from "react";
import "./Orientation.css";
import { timelineImages } from "../images";

const IMAGES = {
  hero:         timelineImages["6.webp"],   // hero split
  scholarships: timelineImages["28.webp"],   // section 02 accent
  testPrep:     timelineImages["28.webp"],   // (no longer used — test prep is inside section 03)
  harvard:      timelineImages["7.webp"],   // exposure full-bleed + CTA background
};

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* ═══════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════ */}
      <section className="about-hero">
        <div className="hero-text-block">
          <div className="hero-eyebrow">United Moroccan Youth</div>

          <h1 className="hero-title">
            Your<br />
            Gateway<br />
            to <span className="accent">Global</span><br />
            Opportunities.
          </h1>

          <p className="hero-description">
            United Moroccan Youth was created with one simple belief:{" "}
            <strong>access changes everything.</strong>
          </p>
          <p className="hero-description">
            Too many talented students miss life-changing opportunities not
            because they lack potential, but because they lack information,
            guidance, or direction. We exist to bridge that gap.
          </p>

          <div className="hero-caption-line">
            We don't just post content — We open doors.
          </div>
        </div>

        <div className="hero-image-block">
          <img src={IMAGES.hero} alt="Students collaborating" />
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          MANIFESTO
          ═══════════════════════════════════════════════════ */}
      <section className="section-manifesto">
        <div className="manifesto-overline">Our belief</div>

        <p className="manifesto-quote">
          Too many talented students miss life-changing opportunities not
          because they lack potential, but because they lack{" "}
          <em>information, guidance, or direction.</em>
        </p>

        <p className="manifesto-sub">
          We don't just post content. We open doors — from scholarship alerts
          to international travel, from test prep to strategic application
          planning.
        </p>
      </section>


      {/* ═══════════════════════════════════════════════════
          01 — INTERNATIONAL EXPOSURE & EDUCATIONAL TRIPS
          ═══════════════════════════════════════════════════ */}
      <section className="section-exposure">
        <div className="exposure-banner pad">
          <div className="exposure-banner-num">01</div>
          <div className="exposure-banner-title">
            <h2>
              International Exposure<br />
              <span className="line-red">&amp; Educational Trips.</span>
            </h2>
          </div>
        </div>

        <div className="exposure-hero-img">
          <img src={IMAGES.harvard} alt="Harvard Model United Nations trip" />
          <div className="exposure-img-caption">
            <div className="exposure-img-caption-tag">
              Harvard Model United Nations
            </div>
            <div className="exposure-img-caption-line">
              New York · Boston · Washington D.C.<br />
              2023 &amp; 2024
            </div>
          </div>
        </div>

        <div className="exposure-content">
          <div className="exposure-left">
            <p className="exposure-intro-body">
              We believe <strong>exposure builds ambition.</strong> United
              Moroccan Youth organizes and facilitates international educational
              trips that allow students to step into the world's most important
              institutions.
            </p>

            <div className="exposure-feature-list">
              {[
                "Visit universities, embassies & organizations abroad",
                "Attend international conferences",
                "Participate in simulations & leadership programs",
                "Connect with global communities",
              ].map((item, i) => (
                <div key={i} className="exposure-feature">
                  <span className="feature-marker" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="trip-stats">
              <div className="trip-stat">
                <span className="trip-stat-num">2</span>
                <span className="trip-stat-label">Intl. Trips</span>
              </div>
              <div className="trip-stat">
                <span className="trip-stat-num">2023</span>
                <span className="trip-stat-label">First Trip</span>
              </div>
              <div className="trip-stat">
                <span className="trip-stat-num">2024</span>
                <span className="trip-stat-label">Second Trip</span>
              </div>
            </div>
          </div>

          <div className="exposure-right">
            <div className="exposure-story-head">
              Harvard MUN —<br />
              Inside the World's<br />
              <span className="line-red">Institutions.</span>
            </div>

            <div className="exposure-story-body">
              <p>
                We are proud to have successfully organized{" "}
                <strong>two international trips</strong> to the Harvard Model
                United Nations in the United States — one in 2023 and one in
                2024.
              </p>
              <p>During these experiences, our students:</p>
              <ul>
                <li>Visited the United Nations Headquarters</li>
                <li>Explored the International Monetary Fund</li>
                <li>
                  Discovered key institutions and campuses across New York,
                  Boston, and Washington, D.C.
                </li>
              </ul>
              <p>
                These trips went far beyond tourism. They allowed students to
                immerse themselves in global decision-making environments,
                understand international institutions from the inside, and
                expand their academic and professional horizons.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          02 — SHARING OPPORTUNITIES THAT MATTER
          ═══════════════════════════════════════════════════ */}
      <section className="num-section num-section--light">
        <div className="num-section-inner">
          <div className="ns-num">02</div>

          <div className="ns-head">
            <span className="section-tag">Opportunities</span>
            <h2 className="section-heading">
              Sharing Opportunities<br />
              <span className="line-red">That Matter.</span>
            </h2>
          </div>

          <div className="ns-body">
            <div className="ns-img-accent">
              <img src={IMAGES.scholarships} alt="Scholarship opportunities" />
            </div>

            <p className="section-body">
              From scholarships and exchange programs to conferences,
              internships, bootcamps, and competitions, we actively share
              curated opportunities that can truly impact a student's academic
              and professional journey.
            </p>

            <div className="focus-list">
              <h3 className="focus-heading">We focus on</h3>
              <ul>
                <li>International scholarships</li>
                <li>Summer programs</li>
                <li>Youth conferences &amp; leadership programs</li>
                <li>Academic competitions</li>
                <li>Study abroad calls</li>
                <li>Application deadlines &amp; alerts</li>
              </ul>
            </div>

            <div className="section-callout" style={{ clear: "both" }}>
              <p>
                Our goal is simple:{" "}
                <strong>Make opportunities visible. Make access easier.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          03 — ACADEMIC ORIENTATION & POST-BAC GUIDANCE
          ═══════════════════════════════════════════════════ */}
      <section className="num-section num-section--dark">
        <div className="num-section-inner">
          <div className="ns-num">03</div>

          <div className="ns-head">
            <span className="section-tag">Academic Orientation</span>
            <h2 className="section-heading">
              Academic Orientation<br />
              <span className="line-red">&amp; Post-Bac Guidance.</span>
            </h2>
          </div>

          <div className="ns-body">
            <p className="section-body">
              Choosing what comes after high school is one of the most
              important decisions a student makes — and often one of the most
              confusing.
            </p>

            <div className="dual-lists">
              <div className="focus-list">
                <h3 className="focus-heading">Orientation support for</h3>
                <ul>
                  <li>Post-bac studies in Morocco</li>
                  <li>International universities</li>
                  <li>Private &amp; public institutions</li>
                  <li>Strategic application planning</li>
                </ul>
              </div>
              <div className="focus-list">
                <h3 className="focus-heading">We help students</h3>
                <ul>
                  <li>Clarify their goals</li>
                  <li>Understand admission requirements</li>
                  <li>Structure their academic path</li>
                  <li>Avoid common mistakes</li>
                </ul>
              </div>
            </div>

            {/* ── Test Prep sub-section ── */}
            <div className="sub-block">
              <h3 className="sub-block-heading">
                Test Preparation &amp; Application Strategy
              </h3>

              <p className="section-body">
                Standardized tests can feel intimidating. We work with students
                to prepare for:
              </p>

              <div className="test-tags">
                {["SAT", "TOEFL", "IELTS", "TCF", "Entrance Exams", "Interviews"].map((t) => (
                  <span key={t} className="test-tag">{t}</span>
                ))}
              </div>

              <div className="dual-lists">
                <div className="focus-list">
                  <h3 className="focus-heading">We also guide students through</h3>
                  <ul>
                    <li>Personal statement structure</li>
                    <li>Motivation letters</li>
                    <li>Portfolio preparation</li>
                    <li>Interview readiness</li>
                  </ul>
                </div>
              </div>

              <div className="section-callout">
                <p>
                  We focus on{" "}
                  <strong>strategy, clarity, and confidence.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════ */}
      <section className="about-cta">
        <div className="cta-bg">
          <img src={IMAGES.harvard} alt="" aria-hidden="true" />
        </div>

        <div className="cta-inner">
          <div className="cta-text-side">
            <div className="cta-label">And this is only the beginning.</div>
            <h3 className="cta-title">
              More Destinations.<br />
              <em>More Futures.</em>
            </h3>
          </div>

          <div className="cta-button-side">
            <a href="/contact" className="cta-button">
              Get Involved
              <svg
                width="16" height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}