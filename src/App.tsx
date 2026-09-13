import React, { useState } from 'react';
import { SYNTHETIC_PATIENTS, SyntheticPatientRecord } from '../test-fixtures/synthetic-patients';
import { CBO_SERVICE_DIRECTORY } from './cbo/cbo-directory';
import { ReferralTicket, ReferralStatus } from './referrals/types';
import { ReferralStateMachine } from './orchestration/referral-state-machine';
import { RiskEngine } from './rules/risk-engine';
import { CdsHookService } from './cds-hooks/hook-service';
import { ConsentManager, PatientConsentRecord, ConsentScopeState } from './consent/consent-manager';
import { DisparityMonitor } from './equity/disparity-monitor';
import { ClinicianDashboard } from './clinical-ui/ClinicianDashboard';
import { CboPortalView } from './cbo/cbo-portal-view';
import { PatientPortal } from './patient-ui/PatientPortal';
import { EquityDashboardView } from './equity/EquityDashboardView';
import { SdohDomain } from './standards/gravity-sdoh';
import { HsdsService } from './standards/hsds';
import { FhirClient, PUBLIC_FHIR_SERVERS } from './interop/fhir-client';
import { LoginPage, AuthSession, UserRole } from './auth/LoginPage';
import { LandingPage } from './landing/LandingPage';
import { OnboardingModal } from './onboarding/OnboardingModal';
import { LifeContextLogo } from './brand/LifeContextLogo';
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Award, 
  User, 
  LogOut 
} from 'lucide-react';

type ActiveView = 'clinician' | 'cbo' | 'patient' | 'equity';
type PageMode = 'landing' | 'login' | 'workspace';

export const App: React.FC = () => {
  // Page mode state: 'landing' | 'login' | 'workspace'
  const [pageMode, setPageMode] = useState<PageMode>('landing');
  const [initialLoginRole, setInitialLoginRole] = useState<UserRole>('CLINICIAN');

  // Authentication session state
  const [session, setSession] = useState<AuthSession | null>(null);

  // Onboarding tour state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Current patient context
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [isLiveFhir, setIsLiveFhir] = useState(false);
  const [isLoadingLiveFhir, setIsLoadingLiveFhir] = useState(false);
  const [livePatientRecord, setLivePatientRecord] = useState<SyntheticPatientRecord | null>(null);

  const currentRecord: SyntheticPatientRecord = (isLiveFhir && livePatientRecord) 
    ? livePatientRecord 
    : SYNTHETIC_PATIENTS[selectedPatientIndex];

  // Active view navigation inside workspace
  const [activeView, setActiveView] = useState<ActiveView>('clinician');

  // Multi-patient consent records
  const [consentRecords, setConsentRecords] = useState<Record<string, PatientConsentRecord>>({
    'PT-MARIA-01': ConsentManager.createDefaultConsent('PT-MARIA-01'),
    'PT-JAMES-02': ConsentManager.createDefaultConsent('PT-JAMES-02'),
    'PT-LINH-03': ConsentManager.createDefaultConsent('PT-LINH-03', 'Mai Nguyen (Daughter)')
  });

  // Seed initial closed-loop referrals for realistic live interaction
  const [referrals, setReferrals] = useState<ReferralTicket[]>([
    ReferralStateMachine.createTicket(
      SYNTHETIC_PATIENTS[0].patient,
      'food-insecurity',
      CBO_SERVICE_DIRECTORY[0],
      'Dr. Sarah Jenkins, MD',
      'CONSENT-99412'
    ),
    ReferralStateMachine.createTicket(
      SYNTHETIC_PATIENTS[1].patient,
      'housing-instability',
      CBO_SERVICE_DIRECTORY[2],
      'Dr. Robert Vance, MD',
      'CONSENT-88123'
    )
  ]);

  // Evaluate clinical risk
  const riskResult = RiskEngine.evaluateRisk(
    currentRecord.patient,
    currentRecord.activeConditions,
    currentRecord.missedAppointments
  );

  // Evaluate CDS Hooks
  const cdsResponse = React.useMemo(() => {
    return CdsHookService.evaluatePatientView(
      {
        hook: 'patient-view',
        hookInstance: `inst-${currentRecord.patient.id}`,
        user: 'Practitioner/dr-jenkins',
        context: {
          userId: 'dr-jenkins',
          patientId: currentRecord.patient.id
        }
      },
      currentRecord.patient,
      currentRecord.activeConditions,
      (domain: SdohDomain) => referrals.some(r => r.patientId === currentRecord.patient.id && r.domain === domain)
    );
  }, [currentRecord, referrals]);

  // Demographic cohort map for equity monitor
  const cohortMap: Record<string, { race: string; language: string; insurance: string }> = {};
  SYNTHETIC_PATIENTS.forEach(p => {
    cohortMap[p.patient.id] = {
      race: p.race,
      language: p.language,
      insurance: p.insurancePlan
    };
  });

  // Compute equity metrics
  const equityReport = DisparityMonitor.generateEquityReport(referrals, cohortMap);

  // Handler: Login Success & Trigger Onboarding
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    setPageMode('workspace');

    // Route directly to matching view
    if (newSession.userRole === 'CBO_COORDINATOR') setActiveView('cbo');
    else if (newSession.userRole === 'PATIENT') setActiveView('patient');
    else if (newSession.userRole === 'AUDITOR') setActiveView('equity');
    else setActiveView('clinician');

    // Check if onboarding completed for this role
    try {
      const alreadyOnboarded = localStorage.getItem(`lifecontext_onboarding_${newSession.userRole}`);
      if (!alreadyOnboarded) {
        setIsOnboardingOpen(true);
      }
    } catch {
      setIsOnboardingOpen(true);
    }
  };

  const handleCloseOnboarding = () => {
    if (session) {
      try {
        localStorage.setItem(`lifecontext_onboarding_${session.userRole}`, 'true');
      } catch {
        // LocalStorage fallback
      }
    }
    setIsOnboardingOpen(false);
  };

  // Handler: Clinician dispatches a referral
  const handleOrderReferral = (domain: SdohDomain, targetService: HsdsService) => {
    const consent = consentRecords[currentRecord.patient.id] || ConsentManager.createDefaultConsent(currentRecord.patient.id);
    
    // Check consent scope
    if (!ConsentManager.isDomainPermitted(consent, domain)) {
      alert(`Patient consent for ${domain} has been revoked by patient. Referral blocked under HIPAA / 42 CFR Part 2 privacy rule.`);
      return;
    }

    const newTicket = ReferralStateMachine.createTicket(
      currentRecord.patient,
      domain,
      targetService,
      'Dr. Sarah Jenkins, MD',
      consent.tokenId
    );

    setReferrals(prev => [newTicket, ...prev]);
  };

  // Handler: CBO updates referral status
  const handleUpdateStatus = (ticketId: string, nextStatus: ReferralStatus, notes: string) => {
    setReferrals(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          return ReferralStateMachine.transition(ticket, nextStatus, 'Metropolitan CBO Coordinator', notes);
        }
        return ticket;
      })
    );
  };

  // Handler: Patient toggles consent
  const handleToggleConsent = (scope: keyof ConsentScopeState, enabled: boolean) => {
    const currentConsent = consentRecords[currentRecord.patient.id];
    if (!currentConsent) return;

    const updated = ConsentManager.toggleScope(currentConsent, scope, enabled);
    setConsentRecords(prev => ({
      ...prev,
      [currentRecord.patient.id]: updated
    }));
  };

  // Handler: Sync patient from live SMART Health IT Sandbox
  const handleSyncLiveFhir = async () => {
    setIsLoadingLiveFhir(true);
    try {
      const client = new FhirClient(PUBLIC_FHIR_SERVERS[0]);
      const livePatient = await client.getPatient('smart-1032702');
      const conditions = await client.getPatientConditions('smart-1032702').catch(() => []);

      const record: SyntheticPatientRecord = {
        patient: livePatient,
        insurancePlan: 'Medicare Advantage Part C (Live Sandbox)',
        race: 'White / Non-Hispanic',
        language: 'English',
        missedAppointments: 1,
        activeConditions: conditions.length > 0 ? conditions : [
          {
            resourceType: 'Condition',
            id: 'live-cond-t2d',
            clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
            category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
            code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.9', display: 'Type 2 Diabetes Mellitus' }], text: 'Type 2 Diabetes Mellitus' },
            subject: { reference: `Patient/${livePatient.id}`, display: 'Amy V. Shaw' }
          },
          {
            resourceType: 'Condition',
            id: 'live-cond-sdoh-food',
            clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
            category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
            code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.41', display: 'Food insecurity' }], text: 'Food Insecurity (Gravity SDOH CC)' },
            subject: { reference: `Patient/${livePatient.id}`, display: 'Amy V. Shaw' }
          }
        ]
      };

      setLivePatientRecord(record);
      setIsLiveFhir(true);
    } catch (err) {
      console.warn('Live FHIR query error, using sandbox simulation:', err);
    } finally {
      setIsLoadingLiveFhir(false);
    }
  };

  // View: Landing Page
  if (pageMode === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          setPageMode('login');
        }}
        onLaunchRole={(role) => {
          setInitialLoginRole(role);
          setPageMode('login');
        }}
      />
    );
  }

  // View: Authentication Gateway (Login Page)
  if (pageMode === 'login' || !session) {
    return (
      <LoginPage
        initialRole={initialLoginRole}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // View: Main Care Orchestration Workspace
  return (
    <div className="app-shell">
      {/* Role-Tailored Onboarding Modal Tour */}
      <OnboardingModal
        userRole={session.userRole}
        userName={session.userName}
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* Top Universal Clean Navbar */}
      <nav className="app-navbar">
        <div className="nav-brand">
          <LifeContextLogo size={28} showTagline={false} />
        </div>

        {/* Streamlined View Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeView === 'clinician' ? 'active' : ''}`}
            onClick={() => setActiveView('clinician')}
          >
            <Stethoscope size={15} />
            <span>Clinician</span>
          </button>
          <button
            className={`nav-tab ${activeView === 'cbo' ? 'active' : ''}`}
            onClick={() => setActiveView('cbo')}
          >
            <Building2 size={15} />
            <span>CBO Network</span>
          </button>
          <button
            className={`nav-tab ${activeView === 'patient' ? 'active' : ''}`}
            onClick={() => setActiveView('patient')}
          >
            <UserCheck size={15} />
            <span>Patient Portal</span>
          </button>
          <button
            className={`nav-tab ${activeView === 'equity' ? 'active' : ''}`}
            onClick={() => setActiveView('equity')}
          >
            <Award size={15} />
            <span>Equity</span>
          </button>
        </div>

        {/* Right Controls: Patient & User */}
        <div className="nav-controls">
          <div className="patient-switch-box">
            <User size={14} color="#64748b" />
            <select
              className="patient-select"
              value={isLiveFhir ? 'live' : selectedPatientIndex}
              onChange={e => {
                if (e.target.value === 'live') {
                  setIsLiveFhir(true);
                } else {
                  setIsLiveFhir(false);
                  setSelectedPatientIndex(Number(e.target.value));
                }
              }}
              title="Select active patient context"
            >
              {SYNTHETIC_PATIENTS.map((p, idx) => (
                <option key={p.patient.id} value={idx}>
                  {p.patient.name[0]?.given?.[0]} {p.patient.name[0]?.family}
                </option>
              ))}
              {livePatientRecord && (
                <option value="live">
                  Amy Shaw (Live SMART)
                </option>
              )}
            </select>
          </div>

          <div className="user-session-pill">
            <div className="session-avatar">{session.userName.charAt(0)}</div>
            <span className="session-name">{session.userName.split(' ')[0]}</span>
            <button 
              className="btn-signout"
              onClick={() => {
                setSession(null);
                setPageMode('landing');
              }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main View Render */}
      <main className="app-main-content">
        {activeView === 'clinician' && (
          <ClinicianDashboard
            patient={currentRecord.patient}
            insurancePlan={currentRecord.insurancePlan}
            activeConditions={currentRecord.activeConditions}
            cdsCards={cdsResponse.cards}
            riskResult={riskResult}
            availableServices={CBO_SERVICE_DIRECTORY}
            activeReferrals={referrals}
            onOrderReferral={handleOrderReferral}
            fhirServerName="SMART Health IT R4 Sandbox"
            isLiveFhir={isLiveFhir}
            onSyncLiveFhir={handleSyncLiveFhir}
            isLoadingLiveFhir={isLoadingLiveFhir}
          />
        )}

        {activeView === 'cbo' && (
          <CboPortalView
            referrals={referrals}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeView === 'patient' && (
          <PatientPortal
            patient={currentRecord.patient}
            consentRecord={consentRecords[currentRecord.patient.id] || ConsentManager.createDefaultConsent(currentRecord.patient.id)}
            referrals={referrals}
            onToggleConsent={handleToggleConsent}
            onBackToClinicianView={() => setActiveView('clinician')}
          />
        )}

        {activeView === 'equity' && (
          <EquityDashboardView
            report={equityReport}
            onBack={() => setActiveView('clinician')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
