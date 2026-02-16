import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { sanitizeText, validateInput, checkRateLimit } from '../../utils/sanitize';
import './ContactPage.css';

const SKILL_OPTIONS = [
  { id: 'photography', label: 'Photography' },
  { id: 'video_editing', label: 'Video Editing' },
  { id: 'web_development', label: 'Web development' },
  { id: 'social_media', label: 'Social Media Management' },
  { id: 'content_writing', label: 'Content Writing' },
];

const REFERRAL_OPTIONS = [
  { value: 'friend', label: 'Friend' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'ken', label: 'KEN' },
  { value: 'other', label: 'Autre / Other' },
];

interface FormData {
  name: string;
  age: string;
  email: string;
  phone: string;
  cin_number: string;
  current_occupation: string;
  city: string;
  other_organization: string;
  political_party: string;
  commission_interest: string;
  commission_motivation: string;
  position_applying: string;
  active_membership_acknowledged: boolean;
  previous_experiences: string;
  skills: string[];
  additional_info: string;
  referral_source: string;
}

const STEPS = [
  { id: 1, title: 'Personal Info', required: true },
  { id: 2, title: 'Current Situation', required: true },
  { id: 3, title: 'Commission & Position', required: true },
  { id: 4, title: 'Commitment', required: true },
  { id: 5, title: 'Experience & Skills', required: false },
  { id: 6, title: 'Additional', required: false },
];

export function ContactPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    phone: '',
    cin_number: '',
    current_occupation: '',
    city: '',
    other_organization: '',
    political_party: '',
    commission_interest: '',
    commission_motivation: '',
    position_applying: 'membership',
    active_membership_acknowledged: false,
    previous_experiences: '',
    skills: [],
    additional_info: '',
    referral_source: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clientId = localStorage.getItem('clientId') || `client_${Date.now()}`;
    localStorage.setItem('clientId', clientId);

    if (!checkRateLimit(clientId, 5, 60000)) {
      toast.error('Too many submissions. Please wait a minute before trying again.');
      return;
    }

    const nameValidation = validateInput(formData.name, 'text');
    const emailValidation = validateInput(formData.email, 'email');

    if (!nameValidation.valid || !emailValidation.valid) {
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

      const sanitizedData = {
        name: nameValidation.sanitized,
        email: emailValidation.sanitized,
        phone: sanitizeText(formData.phone),
        subject: 'UMY Membership Application',
        message: formData.commission_motivation || 'No motivation provided',
        age: formData.age ? parseInt(formData.age, 10) : null,
        cin_number: formData.cin_number ? sanitizeText(formData.cin_number) : null,
        current_occupation: formData.current_occupation ? sanitizeText(formData.current_occupation) : null,
        city: formData.city ? sanitizeText(formData.city) : null,
        other_organization: formData.other_organization ? sanitizeText(formData.other_organization) : null,
        political_party: formData.political_party ? sanitizeText(formData.political_party) : null,
        commission_interest: formData.commission_interest ? sanitizeText(formData.commission_interest) : null,
        commission_motivation: formData.commission_motivation ? sanitizeText(formData.commission_motivation) : null,
        position_applying: formData.position_applying ? sanitizeText(formData.position_applying) : null,
        active_membership_acknowledged: formData.active_membership_acknowledged,
        previous_experiences: formData.previous_experiences ? sanitizeText(formData.previous_experiences) : null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        additional_info: formData.additional_info ? sanitizeText(formData.additional_info) : null,
        referral_source: formData.referral_source ? sanitizeText(formData.referral_source) : null,
        status: 'new' as const,
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Application submitted successfully! We\'ll get back to you soon.');
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          age: '',
          email: '',
          phone: '',
          cin_number: '',
          current_occupation: '',
          city: '',
          other_organization: '',
          political_party: '',
          commission_interest: '',
          commission_motivation: '',
          position_applying: 'membership',
          active_membership_acknowledged: false,
          previous_experiences: '',
          skills: [],
          additional_info: '',
          referral_source: '',
        });
        setCurrentStep(1);
        setCompletedSteps([]);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skillId)
        ? formData.skills.filter((s) => s !== skillId)
        : [...formData.skills, skillId],
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.phone && formData.age && formData.cin_number);
      case 2:
        return !!(formData.current_occupation && formData.city);
      case 3:
        return !!(formData.commission_interest && formData.commission_motivation && formData.position_applying);
      case 4:
        return formData.active_membership_acknowledged;
      case 5:
        return true;
      case 6:
        return !!formData.referral_source;
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
    const currentStepInfo = STEPS.find((s) => s.id === currentStep);
    if (currentStepInfo && !currentStepInfo.required && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canProceed = validateStep(currentStep);
  const isLastStep = currentStep === STEPS.length;
  const currentStepInfo = STEPS.find((s) => s.id === currentStep);

  return (
    <div className="contact-page">
      <section className="contact-header-section">
        <div className="container">
          <h1>UMY Membership Application</h1>
          <p>
            This is the official application form to join the United Moroccan Youth (UMY). Applications are open to young people aged 16 to 30.
          </p>
        </div>
      </section>

      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                <ul className="contact-info-list">
                  <li className="contact-info-item">
                    <div className="contact-info-icon"><Mail /></div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Email</div>
                      <a href="mailto:contact@unitedmoroccanyouth.org" className="contact-info-value">contact@unitedmoroccanyouth.org</a>
                    </div>
                  </li>
                  <li className="contact-info-item">
                    <div className="contact-info-icon"><Phone /></div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Phone</div>
                    </div>
                  </li>
                  <li className="contact-info-item">
                    <div className="contact-info-icon"><MapPin /></div>
                    <div className="contact-info-content">
                      <div className="contact-info-label">Location</div>
                      <p className="contact-info-value">Rabat</p>
                    </div>
                  </li>
                </ul>
                <div className="office-hours-box">
                  Office Hours : 
                  8am - 6pm 
                </div>
              </div>
            </div>

            <div>
              <div className="contact-form-card">
                <h3>UMY Application Form</h3>

                {submitted ? (
                  <div className="form-success">
                    <div className="success-icon-wrapper"><Send /></div>
                    <h4>Application Submitted!</h4>
                    <p>Thank you for applying. We'll review your application and get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <div className="step-indicator">
                      {STEPS.map((step, index) => (
                        <div key={step.id} className="step-indicator-wrapper">
                          <div
                            className={`step-indicator-item ${currentStep === step.id ? 'active' : ''} ${completedSteps.includes(step.id) ? 'completed' : ''} ${currentStep > step.id ? 'passed' : ''}`}
                            onClick={() => {
                              if (completedSteps.includes(step.id) || currentStep > step.id) {
                                setCurrentStep(step.id);
                              }
                            }}
                          >
                            <div className="step-number">
                              {completedSteps.includes(step.id) ? <Check size={14} /> : step.id}
                            </div>
                            <div className="step-title">{step.title}</div>
                            {!step.required && <div className="step-optional">Optional</div>}
                          </div>
                          {index < STEPS.length - 1 && (
                            <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form">
                      {/* Step 1: Personal Info */}
                      <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="age">Age  *</label>
                            <input type="number" id="age" name="age" required min={16} max={30} value={formData.age} onChange={handleChange} placeholder="16-30" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your.email@example.com" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="phone">Phone *</label>
                            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+212 6XX-XXXXXX" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="cin_number">CIN *</label>
                            <input type="text" id="cin_number" name="cin_number" required value={formData.cin_number} onChange={handleChange} placeholder="National ID number" />
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Current Situation */}
                      <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="current_occupation">Current Occupation / الوضع الحالي *</label>
                            <input type="text" id="current_occupation" name="current_occupation" required value={formData.current_occupation} onChange={handleChange} placeholder="School year / work..." />
                          </div>
                          <div className="form-group">
                            <label htmlFor="city">City of residence / مدينة الإقامة *</label>
                            <input type="text" id="city" name="city" required value={formData.city} onChange={handleChange} placeholder="Your city" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="other_organization">Other organization? / منظمة أخرى؟</label>
                            <input type="text" id="other_organization" name="other_organization" value={formData.other_organization} onChange={handleChange} placeholder="If yes, which one?" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="political_party">Political party member? / عضو حزب سياسي؟</label>
                            <input type="text" id="political_party" name="political_party" value={formData.political_party} onChange={handleChange} placeholder="If yes, which one?" />
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Commission & Position */}
                      <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="commission_interest">Commission interest *</label>
                            <select id="commission_interest" name="commission_interest" required value={formData.commission_interest} onChange={handleChange}>
                              <option value="">Select...</option>
                              <option value="mp">Moroccan Politics Commission </option>
                              <option value="ir">International Relations Commission </option>
                              <option value="sd">Social Development Commission </option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="commission_motivation">Commission motivation *</label>
                            <textarea id="commission_motivation" name="commission_motivation" required value={formData.commission_motivation} onChange={handleChange} rows={4} placeholder="Choose one commission and write a short motivation" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="position_applying">Position *</label>
                            <select id="position_applying" name="position_applying" required value={formData.position_applying} onChange={handleChange}>
                              <option value="membership">Membership </option>
                              <option value="leadership">Leadership </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Commitment */}
                      <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group form-group-checkbox">
                            <label>
                              <input
                                type="checkbox"
                                name="active_membership_acknowledged"
                                checked={formData.active_membership_acknowledged}
                                onChange={handleChange}
                              />
                              I recognize that active membership within UMY requires serious work, participation, and help organizing events. *
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Step 5: Experience & Skills */}
                      <div className={`form-step ${currentStep === 5 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="previous_experiences">Previous experiences </label>
                            <textarea id="previous_experiences" name="previous_experiences" value={formData.previous_experiences} onChange={handleChange} rows={4} placeholder="Share any previous experiences" />
                          </div>
                          <div className="form-group">
                            <label>Skills </label>
                            <div className="skills-checkboxes">
                              {SKILL_OPTIONS.map((skill) => (
                                <label key={skill.id} className="skill-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={formData.skills.includes(skill.id)}
                                    onChange={() => handleSkillToggle(skill.id)}
                                  />
                                  {skill.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 6: Additional */}
                      <div className={`form-step ${currentStep === 6 ? 'active' : ''}`}>
                        <div className="form-step-content">
                          <div className="form-group">
                            <label htmlFor="additional_info">Anything else? </label>
                            <textarea id="additional_info" name="additional_info" value={formData.additional_info} onChange={handleChange} rows={3} placeholder="Anything else you want us to know" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="referral_source">Where did you hear about this? *</label>
                            <select id="referral_source" name="referral_source" required value={formData.referral_source} onChange={handleChange}>
                              <option value="">Select...</option>
                              {REFERRAL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-navigation">
                        {currentStep > 1 && (
                          <button type="button" onClick={handlePrevious} className="form-nav-button prev">
                            <ChevronLeft /> Previous
                          </button>
                        )}
                        <div className="form-nav-right">
                          {currentStepInfo && !currentStepInfo.required && !isLastStep && (
                            <button type="button" onClick={handleSkip} className="form-skip-button">Skip</button>
                          )}
                          {!isLastStep ? (
                            <button type="button" onClick={handleNext} className="form-nav-button next" disabled={!canProceed}>
                              Next <ChevronRight />
                            </button>
                          ) : (
                            <button type="submit" className="form-submit-button" disabled={!canProceed || isSubmitting}>
                              {isSubmitting ? <>Sending...</> : <><Send /> Submit Application</>}
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

      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <ul className="faq-list">
            <li className="faq-item">
              <h4>What are the three commissions?</h4>
              <p>Moroccan Politics, International Relations, and Social Development. You can apply as a Member or for a Leadership position within one commission.</p>
            </li>
            <li className="faq-item">
              <h4>What is the age requirement?</h4>
              <p>Applications are open to young people aged 16 to 30.</p>
            </li>
            
          </ul>
        </div>
      </section>
    </div>
  );
}
