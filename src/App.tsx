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
import { 
  HeartHandshake, 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Award, 
  User 
} from 'lucide-react';

type ActiveView = 'clinician' | 'cbo' | 'patient' | 'equity';

export const App: React.FC = () => {
  // Current patient context
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const currentRecord: SyntheticPatientRecord = SYNTHETIC_PATIENTS[selectedPatientIndex];

  // Active view navigation
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

  // Handler: Clinician dispatches a referral
  const handleOrderReferral = (domain: SdohDomain, targetService: HsdsService) => {
    const consent = consentRecords[currentRecord.patient.id] || ConsentManager.createDefaultConsent(currentRecord.patient.id);
    
    // Check consent scope
    if (!ConsentManager.isDomainPermitted(consent, domain)) {
      alert(`Patient consent for ${domain} has been revoked by patient. Referral blocked under HIPAA privacy rule.`);
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

  return (
    <div className="app-shell">
      {/* Top Universal Navbar */}
      <nav className="app-navbar">
        <div className="nav-brand">
          <div className="brand-badge">
            <HeartHandshake size={24} />
          </div>
          <div>
            <h1 className="brand-title">LifeContext Care Orchestrator</h1>
            <p className="brand-tagline">Zero-Friction Clinical & Social Care Coordination</p>
          </div>
        </div>

        <div className="nav-controls">
          {/* Patient Selector */}
          <div className="patient-switch-box">
            <User size={15} color="#64748b" />
            <span className="text-muted text-xs">Simulated Patient:</span>
            <select
              className="patient-select"
              value={selectedPatientIndex}
              onChange={e => setSelectedPatientIndex(Number(e.target.value))}
            >
              {SYNTHETIC_PATIENTS.map((p, idx) => (
                <option key={p.patient.id} value={idx}>
                  {p.patient.name[0]?.given?.[0]} {p.patient.name[0]?.family} ({p.patient.id})
                </option>
              ))}
            </select>
          </div>

          {/* Persona View Switcher Tabs */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeView === 'clinician' ? 'active' : ''}`}
              onClick={() => setActiveView('clinician')}
            >
              <Stethoscope size={16} /> Clinician EHR
            </button>
            <button
              className={`nav-tab ${activeView === 'cbo' ? 'active' : ''}`}
              onClick={() => setActiveView('cbo')}
            >
              <Building2 size={16} /> CBO Partner Node
            </button>
            <button
              className={`nav-tab ${activeView === 'patient' ? 'active' : ''}`}
              onClick={() => setActiveView('patient')}
            >
              <UserCheck size={16} /> Patient & Caregiver PWA
            </button>
            <button
              className={`nav-tab ${activeView === 'equity' ? 'active' : ''}`}
              onClick={() => setActiveView('equity')}
            >
              <Award size={16} /> Equity Monitor
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
            onOpenCboPortal={() => setActiveView('cbo')}
            onOpenPatientPortal={() => setActiveView('patient')}
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
