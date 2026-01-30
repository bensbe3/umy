import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { sanitizeText, validateInput, checkRateLimit } from '../../utils/sanitize';
import './ContactPage.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: string;
  organization?: string;
  linkedin?: string;
}

const STEPS = [
  { id: 1, title: 'Personal Info', required: true },
  { id: 2, title: 'Interest', required: false },
  { id: 3, title: 'Message', required: true },
  { id: 4, title: 'Additional Info', required: false }
];

export function ContactPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'general',
    organization: '',
    linkedin: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check (5 submissions per minute per IP)
    const clientId = localStorage.getItem('clientId') || `client_${Date.now()}`;
    localStorage.setItem('clientId', clientId);
    
    if (!checkRateLimit(clientId, 5, 60000)) {
      toast.error('Too many submissions. Please wait a minute before trying again.');
      return;
    }

    // Server-side validation and sanitization
    const nameValidation = validateInput(formData.name, 'text');
    const emailValidation = validateInput(formData.email, 'email');
    const subjectValidation = validateInput(formData.subject, 'text');
    const messageValidation = validateInput(formData.message, 'text');

    if (!nameValidation.valid || !emailValidation.valid || !subjectValidation.valid || !messageValidation.valid) {
      toast.error('Please check your input. Some fields contain invalid characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        toast.error('Database not configured. Please set up Supabase.');
        setIsSubmitting(false);
        return;
      }

      // Sanitize all inputs before sending
      const sanitizedData = {
        name: nameValidation.sanitized,
        email: emailValidation.sanitized,
        phone: sanitizeText(formData.phone),
        subject: subjectValidation.sanitized,
        message: messageValidation.sanitized,
        interest: sanitizeText(formData.interest),
        organization: formData.organization ? sanitizeText(formData.organization) : null,
        linkedin: formData.linkedin ? sanitizeText(formData.linkedin) : null,
        status: 'new' as const,
      };

      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          interest: 'general',
          organization: '',
          linkedin: '',
        });
        setCurrentStep(1);
        setCompletedSteps([]);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.phone);
      case 2:
        return true; // Optional step
      case 3:
        return !!(formData.subject && formData.message);
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    const currentStepInfo = STEPS.find(s => s.id === currentStep);
    if (currentStepInfo && !currentStepInfo.required) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const canProceed = validateStep(currentStep);
  const isLastStep = currentStep === STEPS.length;
  const currentStepInfo = STEPS.find(s => s.id === currentStep);

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-header-section">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>
            Have questions or want to get involved? We'd love to hear from you. Complete the form below to reach out to us.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div>
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                
                <ul className="contact-info-list">
                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <Mail />
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Email</div>
                      <a href="mailto:info@unitedmoroccan.org" className="contact-info-value">
                        info@unitedmoroccan.org
                      </a>
                    </div>
                  </li>

                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <Phone />
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Phone</div>
                      <a href="tel:+2125XXXXXXXX" className="contact-info-value">
                        +212 5XX-XXXXXX
                      </a>
                    </div>
                  </li>

                  <li className="contact-info-item">
                    <div className="contact-info-icon">
                      <MapPin />
                    </div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Location</div>
                      <p className="contact-info-value">Morocco</p>
                    </div>
                  </li>
                </ul>

                <div className="office-hours-box">
                  <h4>Office Hours</h4>
                  <p>
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM (GMT)
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form with Steps */}
            <div>
              <div className="contact-form-card">
                <h3>Send Us a Message</h3>

                {submitted ? (
                  <div className="form-success">
                    <div className="success-icon-wrapper">
                      <Send />
                    </div>
                    <h4>Message Sent Successfully!</h4>
                    <p>
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Step Indicator */}
                    <div className="step-indicator">
                      {STEPS.map((step, index) => (
                        <div key={step.id} className="step-indicator-wrapper">
                          <div
                            className={`step-indicator-item ${
                              currentStep === step.id ? 'active' : ''
                            } ${completedSteps.includes(step.id) ? 'completed' : ''} ${
                              currentStep > step.id ? 'passed' : ''
                            }`}
                            onClick={() => {
                              if (completedSteps.includes(step.id) || currentStep > step.id) {
                                setCurrentStep(step.id);
                              }
                            }}
                          >
                            <div className="step-number">
                              {completedSteps.includes(step.id) ? (
                                <Check size={14} />
                              ) : (
                                step.id
                              )}
                            </div>
                            <div className="step-title">{step.title}</div>
                            {!step.required && (
                              <div className="step-optional">Optional</div>
                            )}
                          </div>
                          {index < STEPS.length - 1 && (
                            <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="contact-form">
                      {/* Step 1: Personal Info */}
                      <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+212 6XX-XXXXXX"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Interest */}
                      <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="interest">I'm Interested In</label>
                            <select
                              id="interest"
                              name="interest"
                              value={formData.interest}
                              onChange={handleChange}
                            >
                              <option value="general">General Inquiry</option>
                              <option value="membership">Membership</option>
                              <option value="sponsorship">Sponsorship</option>
                              <option value="sd">SD Commission - Sustainable Development</option>
                              <option value="ir">IR Commission - International Relations</option>
                              <option value="mp">MP Commission - Media & Publications</option>
                              <option value="events">Events & Programs</option>
                              <option value="partnership">Partnership Opportunities</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Message */}
                      <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="subject">Subject *</label>
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="Brief subject line"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="message">Message *</label>
                            <textarea
                              id="message"
                              name="message"
                              required
                              value={formData.message}
                              onChange={handleChange}
                              rows={6}
                              placeholder="Tell us more about your inquiry..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Additional Info */}
                      <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="organization">Organization/Company</label>
                            <input
                              type="text"
                              id="organization"
                              name="organization"
                              value={formData.organization}
                              onChange={handleChange}
                              placeholder="Your organization (if applicable)"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="linkedin">LinkedIn Profile</label>
                            <input
                              type="url"
                              id="linkedin"
                              name="linkedin"
                              value={formData.linkedin}
                              onChange={handleChange}
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="form-navigation">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="form-nav-button prev"
                          >
                            <ChevronLeft />
                            Previous
                          </button>
                        )}

                        <div className="form-nav-right">
                          {currentStepInfo && !currentStepInfo.required && !isLastStep && (
                            <button
                              type="button"
                              onClick={handleSkip}
                              className="form-skip-button"
                            >
                              Skip
                            </button>
                          )}

                          {!isLastStep ? (
                            <button
                              type="button"
                              onClick={handleNext}
                              className="form-nav-button next"
                              disabled={!canProceed}
                            >
                              Next
                              <ChevronRight />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="form-submit-button"
                              disabled={!canProceed || isSubmitting}
                            >
                              {isSubmitting ? (
                                <>Sending...</>
                              ) : (
                                <>
                                  <Send />
                                  Send Message
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          
          <ul className="faq-list">
            <li className="faq-item">
              <h4>How can I become a member?</h4>
              <p>
                Simply fill out the contact form above with "Membership" as your interest, and our team will send you all the necessary information and application materials.
              </p>
            </li>

            <li className="faq-item">
              <h4>What are the benefits of sponsorship?</h4>
              <p>
                Sponsors receive brand visibility, networking opportunities, speaking engagements, and the satisfaction of supporting our mission. Visit our Sponsor Us page for detailed tier information.
              </p>
            </li>

            <li className="faq-item">
              <h4>How can I join a commission?</h4>
              <p>
                Commission membership is open to active members. Contact us expressing your interest in SD, IR, or MP commissions, and we'll guide you through the process.
              </p>
            </li>

            <li className="faq-item">
              <h4>Do you accept volunteers?</h4>
              <p>
                Yes! We welcome volunteers for various programs and events. Reach out through the contact form and let us know your areas of interest and availability.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}