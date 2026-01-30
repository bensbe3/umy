import { SEOHead } from '../SEOHead';
import './TermsPage.css';

export function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service | United Moroccan Youth"
        description="Terms of Service and General Conditions of Use for United Moroccan Youth website."
        path="/terms"
      />
      <div className="terms-page">
        <div className="terms-container">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-updated">Last updated: January 30, 2026</p>

          <section className="terms-section">
            <h2 className="terms-section-title">1. Purpose</h2>
            <p className="terms-text">
              These General Terms of Use define the rules for accessing and using the United Moroccan Youth (UMY) website.
            </p>
            <p className="terms-text">
              Access to the site implies full and complete acceptance of these conditions.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">2. Association Overview</h2>
            <p className="terms-text">
              United Moroccan Youth is a Moroccan non-profit association working in the fields of civic engagement, youth participation, civic awareness, and social development.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">3. Site Access</h2>
            <p className="terms-text">
              The site is accessible to anyone wishing to learn about the association's activities, projects, and programs.
            </p>
            <p className="terms-text">
              The user agrees to use the site in accordance with:
            </p>
            <ul className="terms-list">
              <li>Laws and regulations in force in the Kingdom of Morocco</li>
              <li>Public order and good morals</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">4. Content Use</h2>
            <p className="terms-text">
              The user agrees not to:
            </p>
            <ul className="terms-list">
              <li>Use the site for illegal purposes</li>
              <li>Harm the image, reputation, or interests of the association</li>
              <li>Disrupt the proper functioning of the site</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">5. Intellectual Property</h2>
            <p className="terms-text">
              All content on the site (texts, visuals, logos, documents, publications, and graphic identity) is protected by Moroccan legislation on intellectual property.
            </p>
            <p className="terms-text">
              Any reproduction, representation, distribution, or exploitation, in whole or in part, without prior authorization from the association is prohibited.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">6. User-Transmitted Content</h2>
            <p className="terms-text">
              When the user transmits content (messages, forms, applications, contributions, publications), they guarantee that they have the necessary rights to these elements.
            </p>
            <p className="terms-text">
              The association reserves the right to refuse, delete, or moderate any content contrary to:
            </p>
            <ul className="terms-list">
              <li>Moroccan laws</li>
              <li>Public order</li>
              <li>Or the values of the association</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">7. Liability</h2>
            <p className="terms-text">
              The site is provided for informational purposes.
            </p>
            <p className="terms-text">
              The association strives to ensure the accuracy of published information, without however guaranteeing its completeness or permanent updating.
            </p>
            <p className="terms-text">
              The association's liability cannot be engaged in case of:
            </p>
            <ul className="terms-list">
              <li>Temporary unavailability of the site</li>
              <li>Material errors</li>
              <li>Or indirect damages related to the use of the site</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">8. Links to Third-Party Sites</h2>
            <p className="terms-text">
              The site may contain links to external sites. The association exercises no control over these sites and disclaims any responsibility for their content.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">9. Modification of Conditions</h2>
            <p className="terms-text">
              The association reserves the right to modify these conditions at any time.
            </p>
            <p className="terms-text">
              The applicable version is the one published on the site at the time of consultation.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">10. Applicable Law and Competent Jurisdiction</h2>
            <p className="terms-text">
              These conditions are subject to Moroccan law.
            </p>
            <p className="terms-text">
              Any dispute relating to their interpretation or execution falls under the jurisdiction of Moroccan courts.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
