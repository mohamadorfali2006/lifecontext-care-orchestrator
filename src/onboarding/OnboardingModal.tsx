import React, { useState } from 'react';
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Lock, 
  X,
  FileCheck2,
  HeartPulse
} from 'lucide-react';
import { UserRole } from '../auth/LoginPage';

interface OnboardingStep {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  icon: React.ReactNode;
}

interface OnboardingModalProps {
  userRole: UserRole;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userRole,
  userName,
  isOpen,
  onClose
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const ONBOARDING_CONFIGS: Record<UserRole, { roleLabel: string; roleIcon: React.ReactNode; steps: OnboardingStep[] }> = {
    CLINICIAN: {
      roleLabel: 'Clinician EHR Experience',
      roleIcon: <Stethoscope size={20} color="#0891B2" />,
      steps: [
        {
          title: 'SMART on FHIR Native Chart Integration',
          badge: 'Step 1 of 3: Zero-Tab Interoperability',
          subtitle: 'Integrated directly into Epic, Cerner Oracle, and Athenahealth workflows',
          description: 'LifeContext OS mounts inside your EHR chart. When you open a patient record, a CDS Hooks patient-view trigger queries active conditions and historical appointments without requiring secondary logins.',
          keyPoints: [
            'FHIR R4 Patient and Condition resource synchronization',
            'No browser popups or separate portal credentials',
            'Context-aware patient selector for cohort review'
          ],
          icon: <HeartPulse size={40} color="#0891B2" />
        },
        {
          title: 'Transparent Compound Risk & CDS Guidance',
          badge: 'Step 2 of 3: Cures Act § 3060(a) Compliance',
          subtitle: 'Explainable clinical and social rules engine',
          description: 'Our decision support engine evaluates high-risk clinical diagnoses (e.g. uncontrolled Type 2 Diabetes, CHF) against LOINC PRAPARE social screening findings (Food Insecurity Z59.41, Transit Deficits Z59.82).',
          keyPoints: [
            'Non-device transparent CDS logic with citations to ADA and AHA guidelines',
            'Identifies compound risks traditional single-domain charts miss',
            'Displays real-time capacity of community partners prior to order placement'
          ],
          icon: <Layers size={40} color="#06B6D4" />
        },
        {
          title: '1-Click Closed-Loop Dispatch with Consent Gate',
          badge: 'Step 3 of 3: Bi-Directional Accountability',
          subtitle: 'Ending the referral black hole',
          description: 'Select an eligible CBO from the Open Referral directory and click Order Referral. Cryptographic 42 CFR Part 2 consent tokens verify patient authorization before transmitting the ticket.',
          keyPoints: [
            'CBOs receive structured HSDS 3.0 tickets with intake timelines',
            'Status updates (Accepted, Scheduled, Delivered) flow directly back to your chart',
            'Eliminates unconfirmed paper slips and patient care drop-offs'
          ],
          icon: <FileCheck2 size={40} color="#10B981" />
        }
      ]
    },
    CBO_COORDINATOR: {
      roleLabel: 'Community Partner Node',
      roleIcon: <Building2 size={20} color="#0891B2" />,
      steps: [
        {
          title: 'Standardized Inbound Intake Pipeline',
          badge: 'Step 1 of 3: Open Referral HSDS 3.0',
          subtitle: 'No complex hospital EMR accounts required',
          description: 'Receive verified clinical referrals through a lightweight web interface designed for community service coordinators. All incoming tickets arrive with pre-screened patient demographics and language needs.',
          keyPoints: [
            'Instant notifications for new incoming patient tickets',
            'Demographic and dietary requirements clearly outlined',
            'Preferred communication channel (SMS, Phone, Caregiver)'
          ],
          icon: <Radio size={40} color="#0891B2" />
        },
        {
          title: 'Automated Eligibility & Capacity Matching',
          badge: 'Step 2 of 3: Capacity Protection',
          subtitle: 'Referrals aligned with your organization guidelines',
          description: 'LifeContext matches referrals against your live slot capacity and Federal Poverty Level (FPL) criteria, preventing community burnout and over-scheduling.',
          keyPoints: [
            'Automatic verification against Medicaid / Medicare Advantage coverage',
            'Dynamic slot counter updates to pause incoming orders when full',
            'Multilingual intake support flags for Spanish and Vietnamese'
          ],
          icon: <ShieldCheck size={40} color="#06B6D4" />
        },
        {
          title: '24-Hour SLA Delivery & Feedback Loop',
          badge: 'Step 3 of 3: Hospital Status Callback',
          subtitle: 'Closing the loop in real-time',
          description: 'Update the referral ticket with one click as you process intake, schedule home deliveries, or fulfill services. The hospital medical team receives immediate confirmation in their EHR problem list.',
          keyPoints: [
            'Meets standard 24-48 hour intake SLA benchmarks',
            'Secured notes channel for coordination with hospital social workers',
            'Generates proof of fulfillment for managed care reimbursement'
          ],
          icon: <CheckCircle2 size={40} color="#10B981" />
        }
      ]
    },
    PATIENT: {
      roleLabel: 'Patient & Caregiver Portal',
      roleIcon: <UserCheck size={20} color="#0891B2" />,
      steps: [
        {
          title: 'Connecting Everyday Needs to Doctor Care',
          badge: 'Step 1 of 3: Holistic Health Support',
          subtitle: 'Healthcare designed for your real life',
          description: 'Your doctor can now help you access healthy food, safe rides to the clinic, and stable housing programs as part of your official medical care plan.',
          keyPoints: [
            'Medically tailored groceries delivered to your door',
            'Free transportation rides to scheduled doctor and dialysis visits',
            'Available in both English and Spanish (Español)'
          ],
          icon: <HeartPulse size={40} color="#0891B2" />
        },
        {
          title: 'Simple Updates by Text Message (SMS)',
          badge: 'Step 2 of 3: Zero App Frustration',
          subtitle: 'No passwords or downloads needed',
          description: 'Whenever a community program accepts your referral or schedules a delivery, you receive an instant text message with date, time, and driver contact info.',
          keyPoints: [
            'Low-data SMS updates sent straight to your phone',
            'Real-time status tracking without logging in',
            'Family caregiver access authorized with your permission'
          ],
          icon: <Sparkles size={40} color="#06B6D4" />
        },
        {
          title: 'You Control Your Privacy at All Times',
          badge: 'Step 3 of 3: 42 CFR Part 2 Protection',
          subtitle: 'Complete ownership of your personal data',
          description: 'You decide which social programs can view your health information. You can revoke sharing permission for food or transit at any time with a single tap.',
          keyPoints: [
            'Strict HIPAA and 42 CFR Part 2 privacy protection',
            'Instant toggle to turn data sharing on or off',
            'Transparent ledger showing who has viewed your record'
          ],
          icon: <Lock size={40} color="#10B981" />
        }
      ]
    },
    AUDITOR: {
      roleLabel: 'Health Equity & Quality Console',
      roleIcon: <Award size={20} color="#0891B2" />,
      steps: [
        {
          title: 'Demographic Parity & Population Ledger',
          badge: 'Step 1 of 3: Continuous Monitoring',
          subtitle: 'Real-time equity oversight across all patient cohorts',
          description: 'LifeContext tracks referral dispatch, acceptance, and delivery completion rates segmented by race/ethnicity, primary spoken language, and health insurance tier.',
          keyPoints: [
            'Aggregated cohort metrics updated in real-time',
            'Disparity detection across English, Spanish, and Vietnamese speakers',
            'Medicaid Managed Care vs Medicare Advantage parity comparison'
          ],
          icon: <Layers size={40} color="#0891B2" />
        },
        {
          title: 'The EEOC Four-Fifths (80%) Parity Guard',
          badge: 'Step 2 of 3: Algorithmic Equity Guard',
          subtitle: 'Automated warnings before disparities widen',
          description: 'If the referral fulfillment ratio for any protected demographic cohort drops below 80% of the highest-performing group, the system triggers an immediate disparity flag.',
          keyPoints: [
            'Statistical four-fifths rule calculated dynamically',
            'Automated alerts highlight language barriers or geographic transit deserts',
            'Enables proactive care coordinator intervention before accreditation audits'
          ],
          icon: <ShieldCheck size={40} color="#06B6D4" />
        },
        {
          title: 'NCQA & CMS Audit Compliance Exports',
          badge: 'Step 3 of 3: Regulatory Confidence',
          subtitle: 'Instant ledgers for quality accreditation',
          description: 'Generate comprehensive cryptographic audit reports validating closed-loop fulfillment and non-discriminatory care coordination for NCQA Health Equity Accreditation.',
          keyPoints: [
            'Full provenance logs with timestamped status transitions',
            'Zero manual spreadsheet assembly during state Medicaid audits',
            'Conforms to CMS Universal Foundation and HEDIS social need measures'
          ],
          icon: <CheckCircle2 size={40} color="#10B981" />
        }
      ]
    }
  };

  const currentConfig = ONBOARDING_CONFIGS[userRole];
  const activeStep = currentConfig.steps[currentStepIndex];
  const isFinalStep = currentStepIndex === currentConfig.steps.length - 1;

  const handleNext = () => {
    if (isFinalStep) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="onboarding-overlay-backdrop">
      <div className="onboarding-modal-container">
        {/* Modal Header */}
        <div className="onboarding-modal-header">
          <div className="onboarding-role-pill">
            {currentConfig.roleIcon}
            <span>{currentConfig.roleLabel}</span>
          </div>

          <div className="onboarding-stepper-dots">
            {currentConfig.steps.map((_, idx) => (
              <button
                key={idx}
                className={`stepper-dot ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
                onClick={() => setCurrentStepIndex(idx)}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            className="btn-close-onboarding"
            onClick={onClose}
            title="Dismiss Tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body with Animated Step Transition */}
        <div className="onboarding-modal-body">
          <div className="step-content-grid">
            <div className="step-visual-box">
              <div className="step-icon-wrapper">
                {activeStep.icon}
              </div>
              <div className="step-badge">{activeStep.badge}</div>
            </div>

            <div className="step-details-box">
              <h3 className="step-title">{activeStep.title}</h3>
              <div className="step-subtitle">{activeStep.subtitle}</div>
              <p className="step-description">{activeStep.description}</p>

              <div className="step-key-points">
                {activeStep.keyPoints.map((pt, i) => (
                  <div key={i} className="key-point-item">
                    <CheckCircle2 size={16} color="#10B981" className="shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="onboarding-modal-footer">
          <div className="onboarding-footer-user">
            Logged in as <strong>{userName}</strong>
          </div>

          <div className="onboarding-footer-buttons">
            {currentStepIndex > 0 && (
              <button 
                className="btn-onboarding-prev"
                onClick={handlePrev}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
            )}

            <button 
              className="btn-onboarding-next"
              onClick={handleNext}
            >
              <span>{isFinalStep ? 'Complete Tour & Enter Platform' : 'Next Step'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
