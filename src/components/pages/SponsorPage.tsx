import { Link } from 'react-router-dom';
import './SponsorPage.css';

export function SponsorPage() {
  return (
    <div className="sponsor-page">
      {/* CTA Section - Only Content */}
      <section className="sponsor-cta-section">
        <div className="container">
          <div className="sponsor-cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>
              Contact us to discuss a sponsorship package that aligns with your organization's values and goals.
            </p>
            <Link to="/contact" className="sponsor-cta-button">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
