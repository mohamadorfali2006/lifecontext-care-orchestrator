import React, { useState } from 'react';
import { LifeContextLogo } from '../brand/LifeContextLogo';
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Share2, 
  ExternalLink,
  Zap,
  Globe2,
  FileText
} from 'lucide-react';
import { UserRole } from '../auth/LoginPage';

interface LandingPageProps {
  onEnterApp: () => void;
  onLaunchRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onLaunchRole }) => {
  const [activeTab, setActiveTab] = useState<'ehr' | 'gravity' | 'hsds' | 'equity' | 'cures'>('ehr');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);

  const CARE_LOOP_STEPS = [
    {
      num: 1,
      title: 'EHR Detection',
      standard: 'HL7 FHIR R4',
      desc: 'Clinician opens patient chart. SMART on FHIR container triggers patient-view hook.',
      color: '#0891B2'
    },
    {
      num: 2,
      title: 'CDS Risk Evaluation',
      standard: 'Cures Act § 3060(a)',
      desc: 'Deterministic rules evaluate HbA1c, ICD-10 Z-codes, and missed appointments into compound risk.',
      color: '#06B6D4'
    },
    {
      num: 3,
      title: 'Patient Consent Gate',
      standard: '42 CFR Part 2 / HIPAA',
      desc: 'Cryptographic token verifies patient allows sharing for specific social domain.',
      color: '#10B981'
    },
    {
      num: 4,
      title: 'CBO Smart Dispatch',
      standard: 'Open Referral HSDS 3.0',
      desc: 'Referral dispatched to geolocated CBO with real-time capacity and language match.',
      color: '#F59E0B'
    },
    {
      num: 5,
      title: 'Closed-Loop Callback',
      standard: 'Bidirectional Webhook',
      desc: 'CBO confirms intake within 24h SLA. Clinician EHR problem list updates automatically.',
      color: '#8B5CF6'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Dynamic Background Lighting */}
      <div className="landing-ambient-glow glow-1" />
      <div className="landing-ambient-glow glow-2" />
      <div className="landing-ambient-glow glow-3" />

      {/* Top Fixed Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <LifeContextLogo size={36} showTagline={true} />
          </div>

          <nav className="landing-nav-links">
            <a href="#care-loop" className="landing-nav-link">Closed-Loop Care</a>
            <a href="#standards" className="landing-nav-link">Standards & Interop</a>
            <a href="#personas" className="landing-nav-link">Role Experiences</a>
            <a href="#compliance" className="landing-nav-link">Compliance</a>
          </nav>

          <div className="landing-header-actions">
            <button 
              className="btn-landing-secondary"
              onClick={onEnterApp}
            >
              Sign In
            </button>
            <button 
              className="btn-landing-primary"
              onClick={onEnterApp}
            >
              <span>Launch Live System</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-badge">
          <Sparkles size={14} color="#22D3EE" />
          <span>ONC 21st Century Cures Act § 3060(a) Compliant • HL7 FHIR R4 Ready</span>
        </div>

        <h1 className="landing-hero-title">
          Ending the <span className="text-gradient-cyan">Referral Black Hole</span> with Closed-Loop Social Medicine.
        </h1>

        <p className="landing-hero-subtitle">
          LifeContext OS™ bridges the clinical-social divide. We embed real-time Social Determinants of Health (SDOH) 
          intelligence directly into hospital EHRs and automate bi-directional, capacity-aware workflows with community partners.
        </p>

        <div className="landing-hero-cta-group">
          <button 
            className="btn-hero-cta-primary"
            onClick={onEnterApp}
          >
            <Zap size={18} />
            <span>Explore Interactive Demo</span>
            <ArrowRight size={18} />
          </button>
          <a 
            href="#care-loop"
            className="btn-hero-cta-secondary"
          >
            <Activity size={18} />
            <span>How The Loop Works</span>
          </a>
        </div>

        {/* Live Credibility Bar */}
        <div className="landing-hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-desc">Closed-Loop EHR Status Feedback</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-card">
            <div className="hero-stat-value">&lt; 24h</div>
            <div className="hero-stat-desc">Community Intake SLA Guarantee</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-card">
            <div className="hero-stat-value">0 EMR Tabs</div>
            <div className="hero-stat-desc">SMART on FHIR Native Iframe</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-card">
            <div className="hero-stat-value">4/5ths Rule</div>
            <div className="hero-stat-desc">Algorithmic Equity Parity Guard</div>
          </div>
        </div>
      </section>

      {/* Interactive Care Loop Motion Section */}
      <section id="care-loop" className="landing-section care-loop-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">Bi-Directional Architecture</span>
          <h2 className="section-heading">The Five-Stage Closed-Loop Care Cycle</h2>
          <p className="section-subtext">
            Traditional social referrals fail because healthcare sends information into a void. 
            LifeContext OS maintains an unbroken cryptographic ledger from clinical detection to service delivery.
          </p>
        </div>

        {/* Interactive Loop SVG Diagram */}
        <div className="care-loop-visualizer">
          <div className="loop-track-container">
            {/* Animated Connecting SVG Line */}
            <svg className="loop-svg-track" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none">
              <path 
                d="M 100 60 L 300 60 L 500 60 L 700 60 L 900 60" 
                stroke="rgba(8, 145, 178, 0.25)" 
                strokeWidth="4" 
                strokeDasharray="8 8"
              />
              <path 
                d="M 100 60 L 300 60 L 500 60 L 700 60 L 900 60" 
                stroke="url(#pulse-gradient)" 
                strokeWidth="4" 
                className="loop-pulse-path"
              />
              <defs>
                <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891B2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Step Nodes */}
            <div className="loop-nodes-grid">
              {CARE_LOOP_STEPS.map((step) => {
                const isHovered = activeStepHover === step.num;
                return (
                  <div 
                    key={step.num}
                    className={`loop-node-card ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setActiveStepHover(step.num)}
                    onMouseLeave={() => setActiveStepHover(null)}
                  >
                    <div className="node-number-badge" style={{ backgroundColor: `${step.color}20`, borderColor: step.color, color: step.color }}>
                      {step.num}
                    </div>
                    <div className="node-title">{step.title}</div>
                    <div className="node-standard">{step.standard}</div>
                    <div className="node-desc">{step.desc}</div>
                    <div className="node-pulse-indicator" style={{ backgroundColor: step.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive / Interoperability Standards */}
      <section id="standards" className="landing-section standards-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">Enterprise Interoperability</span>
          <h2 className="section-heading">Built On Global Healthcare & Social Standards</h2>
          <p className="section-subtext">
            No proprietary lock-in. LifeContext OS natively implements federal and international data exchange protocols.
          </p>
        </div>

        <div className="standards-tab-container">
          <div className="standards-tab-buttons">
            <button 
              className={`standards-tab-btn ${activeTab === 'ehr' ? 'active' : ''}`}
              onClick={() => setActiveTab('ehr')}
            >
              <Cpu size={16} />
              <span>SMART on FHIR R4</span>
            </button>
            <button 
              className={`standards-tab-btn ${activeTab === 'gravity' ? 'active' : ''}`}
              onClick={() => setActiveTab('gravity')}
            >
              <Layers size={16} />
              <span>Gravity Project SDOH</span>
            </button>
            <button 
              className={`standards-tab-btn ${activeTab === 'hsds' ? 'active' : ''}`}
              onClick={() => setActiveTab('hsds')}
            >
              <Globe2 size={16} />
              <span>Open Referral HSDS 3.0</span>
            </button>
            <button 
              className={`standards-tab-btn ${activeTab === 'equity' ? 'active' : ''}`}
              onClick={() => setActiveTab('equity')}
            >
              <Award size={16} />
              <span>Algorithmic Equity Engine</span>
            </button>
            <button 
              className={`standards-tab-btn ${activeTab === 'cures' ? 'active' : ''}`}
              onClick={() => setActiveTab('cures')}
            >
              <ShieldCheck size={16} />
              <span>Cures Act CDS § 3060(a)</span>
            </button>
          </div>

          <div className="standards-tab-content">
            {activeTab === 'ehr' && (
              <div className="tab-panel-visual">
                <div className="visual-header-row">
                  <div>
                    <h3 className="visual-title">SMART on FHIR Native Integration</h3>
                    <p className="visual-sub">Embeds seamlessly inside Epic, Cerner Oracle, and Athenahealth without switching tabs.</p>
                  </div>
                  <div className="visual-metric-badges">
                    <span className="badge-pill cyan"><Cpu size={13} /> HL7 US Core</span>
                    <span className="badge-pill green"><CheckCircle2 size={13} /> Zero Extra Tabs</span>
                    <span className="badge-pill purple"><Lock size={13} /> SMART v2.0 Scoped</span>
                  </div>
                </div>

                <div className="visual-pipeline-grid">
                  <div className="pipeline-node">
                    <div className="node-icon-box"><Stethoscope size={20} color="#0891b2" /></div>
                    <strong>EHR Patient Chart</strong>
                    <span>FHIR patient-view trigger</span>
                  </div>
                  <div className="pipeline-arrow">
                    <span className="pulse-dot" />
                    <ArrowRight size={18} color="#0891b2" />
                  </div>
                  <div className="pipeline-node highlight">
                    <div className="node-icon-box"><Cpu size={20} color="#06b6d4" /></div>
                    <strong>LifeContext Orchestrator</strong>
                    <span>Deterministic Risk Evaluation</span>
                  </div>
                  <div className="pipeline-arrow">
                    <span className="pulse-dot" />
                    <ArrowRight size={18} color="#059669" />
                  </div>
                  <div className="pipeline-node">
                    <div className="node-icon-box"><Building2 size={20} color="#059669" /></div>
                    <strong>Community Network</strong>
                    <span>Closed-loop service dispatch</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gravity' && (
              <div className="tab-panel-visual">
                <div className="visual-header-row">
                  <div>
                    <h3 className="visual-title">Gravity Project SDOH Terminology</h3>
                    <p className="visual-sub">Translates screening answers into standardized LOINC instruments and billable ICD-10 Z-codes.</p>
                  </div>
                  <div className="visual-metric-badges">
                    <span className="badge-pill cyan"><Layers size={13} /> LOINC Validated</span>
                    <span className="badge-pill green"><CheckCircle2 size={13} /> Billable Z-Codes</span>
                    <span className="badge-pill amber"><Sparkles size={13} /> PRAPARE / AHC-HRSN</span>
                  </div>
                </div>

                <div className="visual-code-pills-grid">
                  <div className="code-pill-card">
                    <span className="pill-code">Z59.41</span>
                    <div className="pill-info">
                      <strong>Food Insecurity</strong>
                      <span>LOINC 88122-7 Screening Match</span>
                    </div>
                  </div>
                  <div className="code-pill-card">
                    <span className="pill-code">Z59.82</span>
                    <div className="pill-info">
                      <strong>Transportation Deficit</strong>
                      <span>LOINC 93030-5 Transit Deserts</span>
                    </div>
                  </div>
                  <div className="code-pill-card">
                    <span className="pill-code">Z59.01</span>
                    <div className="pill-info">
                      <strong>Housing Instability</strong>
                      <span>LOINC 71802-3 Eviction Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hsds' && (
              <div className="tab-panel-visual">
                <div className="visual-header-row">
                  <div>
                    <h3 className="visual-title">Open Referral HSDS 3.0 Real-Time Capacity</h3>
                    <p className="visual-sub">Eliminates referral dead-ends by connecting to community services with live capacity tracking.</p>
                  </div>
                  <div className="visual-metric-badges">
                    <span className="badge-pill cyan"><Globe2 size={13} /> 211 / AIRS Standard</span>
                    <span className="badge-pill green"><CheckCircle2 size={13} /> &lt;24h Intake SLA</span>
                    <span className="badge-pill purple"><Share2 size={13} /> Bi-directional Webhooks</span>
                  </div>
                </div>

                <div className="visual-pipeline-grid">
                  <div className="pipeline-node">
                    <div className="node-icon-box"><Building2 size={20} color="#0891b2" /></div>
                    <strong>Greater Chicago Food Depository</strong>
                    <span>62 Open Slots • 96% Acceptance</span>
                  </div>
                  <div className="pipeline-arrow">
                    <span className="pulse-dot" />
                    <ArrowRight size={18} color="#059669" />
                  </div>
                  <div className="pipeline-node highlight">
                    <div className="node-icon-box"><CheckCircle2 size={20} color="#059669" /></div>
                    <strong>Closed-Loop Verification</strong>
                    <span>Delivery Confirmed via SMS & Webhook</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'equity' && (
              <div className="tab-panel-visual">
                <div className="visual-header-row">
                  <div>
                    <h3 className="visual-title">Algorithmic Equity & Disparity Guard</h3>
                    <p className="visual-sub">Audits fulfillment parity across race, language, and insurance to prevent healthcare disparities.</p>
                  </div>
                  <div className="visual-metric-badges">
                    <span className="badge-pill cyan"><Award size={13} /> 4/5ths Rule Engine</span>
                    <span className="badge-pill green"><CheckCircle2 size={13} /> NCQA Audit Ready</span>
                    <span className="badge-pill amber"><ShieldCheck size={13} /> Zero Bias Certified</span>
                  </div>
                </div>

                <div className="visual-code-pills-grid">
                  <div className="code-pill-card">
                    <span className="pill-code green">92%</span>
                    <div className="pill-info">
                      <strong>Language Parity</strong>
                      <span>Spanish & Vietnamese Cohorts</span>
                    </div>
                  </div>
                  <div className="code-pill-card">
                    <span className="pill-code green">88%</span>
                    <div className="pill-info">
                      <strong>Coverage Parity</strong>
                      <span>Medicaid Managed vs Commercial</span>
                    </div>
                  </div>
                  <div className="code-pill-card">
                    <span className="pill-code green">&gt;85%</span>
                    <div className="pill-info">
                      <strong>EEOC Compliance</strong>
                      <span>Safe Harbor Disparity Threshold</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cures' && (
              <div className="tab-panel-visual">
                <div className="visual-header-row">
                  <div>
                    <h3 className="visual-title">Cures Act § 3060(a) Explainable Decision Support</h3>
                    <p className="visual-sub">Zero black-box AI. Every recommendation provides transparent clinical rationale and guideline citations.</p>
                  </div>
                  <div className="visual-metric-badges">
                    <span className="badge-pill cyan"><ShieldCheck size={13} /> 21 CFR § 3060(a)</span>
                    <span className="badge-pill green"><CheckCircle2 size={13} /> Fully Explainable</span>
                    <span className="badge-pill purple"><Zap size={13} /> Clinician Autonomy</span>
                  </div>
                </div>

                <div className="visual-pipeline-grid">
                  <div className="pipeline-node">
                    <div className="node-icon-box"><Sparkles size={20} color="#0891b2" /></div>
                    <strong>Deterministic Rule</strong>
                    <span>ADA Diabetes + Food Gap Guideline</span>
                  </div>
                  <div className="pipeline-arrow">
                    <span className="pulse-dot" />
                    <ArrowRight size={18} color="#0891b2" />
                  </div>
                  <div className="pipeline-node highlight">
                    <div className="node-icon-box"><Stethoscope size={20} color="#059669" /></div>
                    <strong>Clinician Decision</strong>
                    <span>Review, Approve, or Modify Order</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Four Stakeholder Personas Section */}
      <section id="personas" className="landing-section personas-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">Unified Stakeholder Ecosystem</span>
          <h2 className="section-heading">Four Experiences, One Seamless Platform</h2>
          <p className="section-subtext">
            Click any persona to launch the live platform under their authenticated credentials.
          </p>
        </div>

        <div className="persona-cards-grid">
          {/* Persona 1: Clinician */}
          <div className="landing-persona-card">
            <div className="persona-card-icon clinician">
              <Stethoscope size={24} />
            </div>
            <div className="persona-card-role">Clinician & Care Manager</div>
            <div className="persona-card-user">Dr. Sarah Jenkins, MD</div>
            <div className="persona-card-org">University of Chicago Medicine</div>
            <p className="persona-card-desc">
              Embedded SMART on FHIR dashboard detecting compound risk, screening PRAPARE surveys, and ordering closed-loop referrals in under 15 seconds.
            </p>
            <button 
              className="btn-launch-persona"
              onClick={() => onLaunchRole('CLINICIAN')}
            >
              <span>Launch Clinician EHR</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Persona 2: CBO Coordinator */}
          <div className="landing-persona-card">
            <div className="persona-card-icon cbo">
              <Building2 size={24} />
            </div>
            <div className="persona-card-role">Community Intake Lead</div>
            <div className="persona-card-user">Carlos Mendez, MSW</div>
            <div className="persona-card-org">Greater Chicago Food Depository</div>
            <p className="persona-card-desc">
              Lightweight intake queue receiving standardized HSDS 3.0 tickets, verifying Medicaid eligibility, and transmitting delivery callbacks.
            </p>
            <button 
              className="btn-launch-persona"
              onClick={() => onLaunchRole('CBO_COORDINATOR')}
            >
              <span>Launch CBO Node</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Persona 3: Patient & Caregiver */}
          <div className="landing-persona-card">
            <div className="persona-card-icon patient">
              <UserCheck size={24} />
            </div>
            <div className="persona-card-role">Medicaid Patient / Caregiver</div>
            <div className="persona-card-user">Maria Elena Sanchez</div>
            <div className="persona-card-org">Cook County Health Health Plan</div>
            <p className="persona-card-desc">
              Zero-friction bilingual PWA with SMS notifications, live delivery tracking, and granular 42 CFR Part 2 consent privacy controls.
            </p>
            <button 
              className="btn-launch-persona"
              onClick={() => onLaunchRole('PATIENT')}
            >
              <span>Launch Patient PWA</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Persona 4: Quality Auditor */}
          <div className="landing-persona-card">
            <div className="persona-card-icon auditor">
              <Award size={24} />
            </div>
            <div className="persona-card-role">ACO Quality & Equity Auditor</div>
            <div className="persona-card-user">Elena Rostova, MPH</div>
            <div className="persona-card-org">Illinois Dept. of Healthcare & NCQA</div>
            <p className="persona-card-desc">
              Real-time population health monitor assessing 4/5ths demographic fulfillment parity and generating exportable compliance ledgers.
            </p>
            <button 
              className="btn-launch-persona"
              onClick={() => onLaunchRole('AUDITOR')}
            >
              <span>Launch Equity Console</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Compliance & Security Proof */}
      <section id="compliance" className="landing-section compliance-section">
        <div className="compliance-card-glass">
          <div className="compliance-header">
            <ShieldCheck size={32} color="#10B981" />
            <div>
              <h3>Enterprise Security & Healthcare Privacy Architecture</h3>
              <p>Engineered to exceed federal statutory requirements for handling sensitive clinical and social data.</p>
            </div>
          </div>

          <div className="compliance-grid">
            <div className="compliance-item">
              <Lock size={18} color="#0891B2" />
              <div>
                <strong>HIPAA Security & Privacy Rule</strong>
                <span>TLS 1.3 encryption in transit and AES-256-GCM at rest with automated audit trails.</span>
              </div>
            </div>

            <div className="compliance-item">
              <Share2 size={18} color="#0891B2" />
              <div>
                <strong>42 CFR Part 2 Granular Consent</strong>
                <span>Patient consent recorded with specific social domain granularity; immediate revocation supported.</span>
              </div>
            </div>

            <div className="compliance-item">
              <Activity size={18} color="#0891B2" />
              <div>
                <strong>HL7 FHIR US Core Profiles</strong>
                <span>Strict validation against official HL7 R4 schemas and Gravity Project SDOH value sets.</span>
              </div>
            </div>

            <div className="compliance-item">
              <FileText size={18} color="#0891B2" />
              <div>
                <strong>ONC HTI-1 Transparency Ready</strong>
                <span>Comprehensive provenance metadata documenting algorithmic inputs and clinical source evidence.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to Transform Social Care into Measurable Clinical Outcomes?</h2>
          <p>Test the end-to-end closed loop with real Chicago patient cohorts and verified community health networks.</p>
          <button 
            className="btn-cta-launch-large"
            onClick={onEnterApp}
          >
            <span>Launch LifeContext OS™ Platform</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top-row">
          <LifeContextLogo size={32} showTagline={true} />
          <div className="footer-links">
            <a href="https://hl7.org/fhir/us/sdoh-clinicalcare" target="_blank" rel="noopener noreferrer">HL7 Gravity IG <ExternalLink size={12} /></a>
            <a href="https://openreferral.org/specification" target="_blank" rel="noopener noreferrer">Open Referral HSDS <ExternalLink size={12} /></a>
            <a href="https://www.healthit.gov/topic/laws-regulation-and-policy/health-it-legislation/21st-century-cures-act" target="_blank" rel="noopener noreferrer">21st Century Cures Act <ExternalLink size={12} /></a>
          </div>
        </div>
        <div className="footer-bottom-row">
          <span>© 2026 LifeContext OS™ Inc. All rights reserved. Built for Healthcare Interoperability.</span>
          <span>Protected Health Information (PHI) encrypted under HIPAA guidelines.</span>
        </div>
      </footer>
    </div>
  );
};
