import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Heart, ArrowRight } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      

      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-about">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <span>UM</span>
                </div>
                <div className="footer-logo-text">
                  <div className="footer-logo-title">United Moroccan</div>
                  <div className="footer-logo-subtitle">Association</div>
                </div>
              </div>
              <p className="footer-description">
                Dedicated to fostering community, cultural exchange, and professional development among Moroccan communities worldwide.
              </p>
              <div className="footer-tagline">
                <Heart className="footer-tagline-icon" />
                <span>Building bridges across borders</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/commissions" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Commissions
                  </Link>
                </li>
                <li>
                  <Link to="/sponsor" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Sponsor Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/about" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/members" className="footer-link">
                    <ArrowRight className="footer-link-icon" />
                    Membership
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-heading">Get In Touch</h3>
              <ul className="footer-contact">
                <li className="footer-contact-item">
                  <Mail className="footer-contact-icon" />
                  <div>
                    <div className="footer-contact-label">Email</div>
                    <a href="mailto:info@unitedmoroccan.org" className="footer-contact-link">
                      info@unitedmoroccan.org
                    </a>
                  </div>
                </li>
                <li className="footer-contact-item">
                  <Phone className="footer-contact-icon" />
                  <div>
                    <div className="footer-contact-label">Phone</div>
                    <a href="tel:+2125XXXXXXXX" className="footer-contact-link">
                      +212 5XX-XXXXXX
                    </a>
                  </div>
                </li>
                <li className="footer-contact-item">
                  <MapPin className="footer-contact-icon" />
                  <div>
                    <div className="footer-contact-label">Location</div>
                    <span className="footer-contact-text">Morocco</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} United Moroccan Association. All rights reserved.
              </p>
              <div className="footer-bottom-links">
                <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                <span className="footer-divider">•</span>
                <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}