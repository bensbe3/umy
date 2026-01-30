import { SEOHead } from '../SEOHead';
import './PrivacyPage.css';

export function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | United Moroccan Youth"
        description="Privacy Policy and data protection information for United Moroccan Youth website, compliant with Moroccan law."
        path="/privacy"
      />
      <div className="privacy-page">
        <div className="privacy-container">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-updated">Last updated: January 30, 2026</p>

          <section className="privacy-section">
            <h2 className="privacy-section-title">1. Legal Framework</h2>
            <p className="privacy-text">
              United Moroccan Youth places particular importance on the protection of personal data.
            </p>
            <p className="privacy-text">
              Data processing is carried out in accordance with Moroccan Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">2. Data Collected</h2>
            <p className="privacy-text">
              Depending on the services offered, the association may collect the following categories of data:
            </p>
            <ul className="privacy-list">
              <li>Identification data (name, first name, contact details)</li>
              <li>Information relating to registrations for activities or events</li>
              <li>Information provided in contact, application, or participation forms</li>
              <li>Navigation data necessary for the operation of the site</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">3. Processing Purposes</h2>
            <p className="privacy-text">
              Personal data is collected exclusively for:
            </p>
            <ul className="privacy-list">
              <li>Managing requests and registrations</li>
              <li>Organizing association activities</li>
              <li>Institutional communication related to projects</li>
              <li>Improving the services offered</li>
              <li>Compliance with legal and regulatory obligations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">4. Legal Basis for Processing</h2>
            <p className="privacy-text">
              Processing is based on:
            </p>
            <ul className="privacy-list">
              <li>The consent of the data subject</li>
              <li>The legitimate interest of the association in the context of its associative missions</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">5. Data Recipients</h2>
            <p className="privacy-text">
              Data is intended exclusively for authorized managers and members of the association.
            </p>
            <p className="privacy-text">
              It is neither sold, rented, nor transferred to third parties for commercial purposes.
            </p>
            <p className="privacy-text">
              However, it may be communicated to competent authorities when required by law.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">6. Data Retention Period</h2>
            <p className="privacy-text">
              Personal data is retained for a period strictly necessary for the purposes for which it was collected, in accordance with Moroccan regulations.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">7. Data Security</h2>
            <p className="privacy-text">
              The association implements appropriate organizational and technical measures to ensure the security, confidentiality, and integrity of personal data.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">8. Rights of Data Subjects</h2>
            <p className="privacy-text">
              In accordance with Law No. 09-08, any person has the following rights:
            </p>
            <ul className="privacy-list">
              <li>Right of access to their data</li>
              <li>Right to rectification</li>
              <li>Right to object for legitimate reasons</li>
              <li>Right to deletion within the limits provided by law</li>
            </ul>
            <p className="privacy-text">
              The exercise of these rights is carried out according to internal procedures established by the association.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">9. Data Transfer</h2>
            <p className="privacy-text">
              When data may be processed outside Moroccan territory, the association ensures that appropriate guarantees are put in place, in accordance with applicable legislation.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">10. Minors' Data</h2>
            <p className="privacy-text">
              The association's activities are primarily aimed at young people.
            </p>
            <p className="privacy-text">
              When data from minors is collected, it is done in strict compliance with applicable rules and within an associative and educational framework.
            </p>
          </section>

          <section className="privacy-section">
            <h2 className="privacy-section-title">11. Policy Modification</h2>
            <p className="privacy-text">
              This policy may be modified to remain compliant with legislative or organizational developments.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
