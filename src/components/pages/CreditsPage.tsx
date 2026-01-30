import { SEOHead } from '../SEOHead';
import './CreditsPage.css';

export function CreditsPage() {
  return (
    <>
      <SEOHead
        title="Credits | United Moroccan Youth"
        description="Credits and acknowledgments for the United Moroccan Youth website."
        path="/credits"
      />
      <div className="credits-page">
        <div className="credits-container">
          <h1 className="credits-title">Credits</h1>

          <section className="credits-section">
            <h2 className="credits-section-title">Website Design and Development</h2>
            <p className="credits-text">
              The official United Moroccan Youth website was designed and developed by:
            </p>
            <p className="credits-name">Mohamed Bensbaa</p>
          </section>

          <section className="credits-section">
            <h2 className="credits-section-title">Intellectual Property Rights</h2>
            <p className="credits-text">
              The graphic design, site structure, and all specific visual elements were created as part of a project for the United Moroccan Youth association.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
