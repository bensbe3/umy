import { SEOHead } from '../SEOHead';
import { Download, FileText } from 'lucide-react';
import './SponsorPage.css';

export function SponsorPage() {
  return (
    <>
      <SEOHead
        title="Sponsorship | United Moroccan Youth"
        description="Partner with United Moroccan Youth."
      />
      <div className="sponsor-page">
        {/* Static decorative lines */}
        <div className="static-lines">
          <div className="line line-top"></div>
          <div className="line line-right"></div>
          <div className="line line-bottom"></div>
          <div className="line line-left"></div>
          <div className="line line-diagonal-1"></div>
          <div className="line line-diagonal-2"></div>
        </div>

        <div className="container">
          <section className="sponsor-header-section">
            <h1>Sponsorship</h1>
            <p>Discover our Sponsorship PDF</p>
          </section>

          <section className="sponsor-content-section">
            <div className="pdf-container">
              <div className="pdf-header">
                <h2>Sponsorship Package</h2>
                <a 
                  href="/sponsor.pdf" 
                  download="UMY-Sponsorship-Package.pdf"
                  className="download-btn"
                >
                  <Download />
                  Download PDF
                </a>
              </div>
              
              <div className="pdf-viewer">
                <div className="pdf-preview">
                  <FileText size={80} strokeWidth={1} />
                  <h3>Sponsorship PDF</h3>
                  <p>Click below to view or download the full pdf</p>
                  <a 
                    href="/sponsor.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-pdf-btn"
                  >
                    View PDF
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}