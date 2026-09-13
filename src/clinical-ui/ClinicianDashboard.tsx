import React, { useState } from 'react';
import { Patient, Condition } from '../fhir/types';
import { CDSCard } from '../cds-hooks/types';
import { SmartFhirHeader } from './SmartFhirHeader';
import { ReferralTicket } from '../referrals/types';
import { HsdsService } from '../standards/hsds';
import { SdohDomain, GRAVITY_SDOH_REGISTRY } from '../standards/gravity-sdoh';
import { RiskEvaluationResult } from '../rules/risk-engine';
import { 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  HeartHandshake, 
  Info, 
  ChevronRight, 
  FileText,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ClinicianDashboardProps {
  patient: Patient;
  insurancePlan: string;
  activeConditions: Condition[];
  cdsCards: CDSCard[];
  riskResult: RiskEvaluationResult;
  availableServices: HsdsService[];
  activeReferrals: ReferralTicket[];
  onOrderReferral: (domain: SdohDomain, targetService: HsdsService) => void;
  onOpenCboPortal: () => void;
  onOpenPatientPortal: () => void;
  fhirServerName?: string;
  isLiveFhir?: boolean;
  onSyncLiveFhir?: () => void;
  isLoadingLiveFhir?: boolean;
}

export const ClinicianDashboard: React.FC<ClinicianDashboardProps> = ({
  patient,
  insurancePlan,
  activeConditions,
  cdsCards,
  riskResult,
  availableServices,
  activeReferrals,
  onOrderReferral,
  onOpenCboPortal,
  onOpenPatientPortal,
  fhirServerName,
  isLiveFhir,
  onSyncLiveFhir,
  isLoadingLiveFhir
}) => {
  const [selectedDomain, setSelectedDomain] = useState<SdohDomain>('food-insecurity');
  const [showAttributionModal, setShowAttributionModal] = useState(false);

  const matchedServices = availableServices.filter(s => {
    const domainMapping = GRAVITY_SDOH_REGISTRY[selectedDomain];
    return s.taxonomy.some(t => t.code.includes(domainMapping.icd10.code.replace('Z59.', '')) || s.name.toLowerCase().includes(selectedDomain.split('-')[0]));
  });

  return (
    <div className="clinician-dashboard">
      {/* SMART on FHIR Context Banner */}
      <SmartFhirHeader
        patient={patient}
        insurancePlan={insurancePlan}
        riskScore={riskResult.totalScore}
        riskTier={riskResult.riskTier}
        fhirServerName={fhirServerName}
        isLiveFhir={isLiveFhir}
        onSyncLiveFhir={onSyncLiveFhir}
        isLoadingLiveFhir={isLoadingLiveFhir}
      />

      {/* CDS Hooks Non-Disruptive Alert Cards */}
      {cdsCards.length > 0 && (
        <section className="cds-alerts-container">
          <div className="section-label">
            <Sparkles size={16} color="#d97706" />
            <span>Active CDS Hook Recommendations (21st Century Cures Act Non-Device Compliant)</span>
          </div>
          <div className="cds-cards-grid">
            {cdsCards.map(card => (
              <div 
                key={card.uuid} 
                className={`cds-card ${card.indicator === 'critical' ? 'card-critical' : 'card-warning'}`}
              >
                <div className="card-top">
                  <div className="card-badge">
                    <AlertCircle size={16} />
                    <span>{card.indicator.toUpperCase()} PRIORITY</span>
                  </div>
                  <button 
                    className="btn-link"
                    onClick={() => setShowAttributionModal(true)}
                  >
                    <Info size={14} /> Explain Attribution
                  </button>
                </div>
                <h4 className="card-summary">{card.summary}</h4>
                <p className="card-detail">{card.detail}</p>
                <div className="card-footer">
                  <span className="card-source">{card.source.label}</span>
                  {card.suggestions?.[0] && (
                    <button 
                      className="btn-cds-action"
                      onClick={() => {
                        const targetCbo = availableServices[0];
                        if (targetCbo) {
                          onOrderReferral('food-insecurity', targetCbo);
                        }
                      }}
                    >
                      <Send size={14} /> {card.suggestions[0].label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Workspace Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column: Active SDOH Needs & Clinical Context */}
        <div className="col-left">
          <div className="content-box">
            <div className="box-header">
              <h4>Identified SDOH Conditions (Gravity IG)</h4>
              <span className="count-pill">{activeConditions.filter(c => c.code.coding.some(cd => cd.code.startsWith('Z'))).length} Active</span>
            </div>
            <div className="sdoh-condition-list">
              {activeConditions
                .filter(c => c.code.coding.some(cd => cd.code.startsWith('Z')))
                .map(cond => {
                  const zCode = cond.code.coding.find(cd => cd.code.startsWith('Z'))?.code || '';
                  const domainKey = Object.keys(GRAVITY_SDOH_REGISTRY).find(
                    k => GRAVITY_SDOH_REGISTRY[k as SdohDomain].icd10.code === zCode
                  ) as SdohDomain || 'food-insecurity';

                  const hasReferral = activeReferrals.some(r => r.domain === domainKey);

                  return (
                    <div 
                      key={cond.id}
                      className={`sdoh-item ${selectedDomain === domainKey ? 'selected' : ''}`}
                      onClick={() => setSelectedDomain(domainKey)}
                    >
                      <div className="sdoh-item-meta">
                        <span className="z-badge">{zCode}</span>
                        <strong className="sdoh-title">{cond.code.text}</strong>
                      </div>
                      <div className="sdoh-item-status">
                        {hasReferral ? (
                          <span className="referral-tag green"><CheckCircle2 size={12} /> Closed-Loop Referral Active</span>
                        ) : (
                          <span className="referral-tag amber"><Clock size={12} /> Needs Community Linkage</span>
                        )}
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Chronic Diagnoses Panel */}
          <div className="content-box">
            <div className="box-header">
              <h4>Active Clinical Problem List</h4>
              <span className="text-muted text-sm">FHIR R4 US Core</span>
            </div>
            <ul className="clinical-problem-list">
              {activeConditions
                .filter(c => !c.code.coding.some(cd => cd.code.startsWith('Z')))
                .map(cond => (
                  <li key={cond.id} className="problem-row">
                    <span className="dx-dot" />
                    <span className="dx-name">{cond.code.text}</span>
                    <span className="dx-code">{cond.code.coding[0]?.code}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Quick Cross-Portal Switchers */}
          <div className="content-box quick-links-box">
            <h4>Multi-Stakeholder Portals</h4>
            <div className="portal-buttons">
              <button className="btn-portal cbo" onClick={onOpenCboPortal}>
                <Building2 size={16} /> Open CBO Partner Node
              </button>
              <button className="btn-portal patient" onClick={onOpenPatientPortal}>
                <HeartHandshake size={16} /> View Patient & Caregiver PWA
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: HSDS CBO Directory & Referral State Tracker */}
        <div className="col-right">
          {/* Matched Community Services */}
          <div className="content-box">
            <div className="box-header">
              <div>
                <h4>Open Referral HSDS 3.0 Service Directory</h4>
                <p className="text-muted text-sm">Targeting: <strong>{GRAVITY_SDOH_REGISTRY[selectedDomain]?.domainDisplay}</strong></p>
              </div>
              <span className="count-pill">{matchedServices.length > 0 ? matchedServices.length : availableServices.length} Verified CBOs</span>
            </div>

            <div className="cbo-cards-stream">
              {(matchedServices.length > 0 ? matchedServices : availableServices).map(svc => (
                <div key={svc.id} className="cbo-service-card">
                  <div className="svc-header">
                    <div>
                      <h5 className="svc-name">{svc.name}</h5>
                      <p className="svc-desc">{svc.description}</p>
                    </div>
                    <div className="svc-capacity">
                      <span className="capacity-num">{svc.currentCapacity.availableSlots}</span>
                      <span className="capacity-label">Slots Open</span>
                    </div>
                  </div>

                  <div className="svc-meta-chips">
                    <span className="chip"><Clock size={12} /> {svc.waitTime}</span>
                    <span className="chip"><ShieldCheck size={12} /> {(svc.currentCapacity.acceptanceRateLast30Days * 100).toFixed(0)}% Acceptance</span>
                    <span className="chip">Taxonomy: {svc.taxonomy[0]?.code}</span>
                  </div>

                  <div className="svc-action-row">
                    <span className="phone-text">{svc.contactPhone}</span>
                    <button
                      className="btn-dispatch-referral"
                      onClick={() => onOrderReferral(selectedDomain, svc)}
                    >
                      <Send size={14} /> Dispatch Closed-Loop Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Closed-Loop Referral Tracking */}
          <div className="content-box">
            <div className="box-header">
              <h4>Active Closed-Loop Referrals</h4>
              <span className="count-pill">{activeReferrals.length} In-Flight</span>
            </div>

            {activeReferrals.length === 0 ? (
              <div className="empty-state">
                <HeartHandshake size={32} color="#94a3b8" />
                <p>No active social care referrals dispatched yet. Select a service above to initiate closed-loop coordination.</p>
              </div>
            ) : (
              <div className="active-referrals-list">
                {activeReferrals.map(ticket => (
                  <div key={ticket.id} className="referral-summary-card">
                    <div className="ref-top">
                      <div>
                        <span className="ref-code">{ticket.id}</span>
                        <strong className="ref-service">{ticket.targetService.name}</strong>
                      </div>
                      <span className={`ref-badge status-${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="ref-progress-bar">
                      <div className={`bar-step ${['INITIATED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'filled' : ''}`}>1. Dispatched</div>
                      <div className={`bar-step ${['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'filled' : ''}`}>2. Intake Accepted</div>
                      <div className={`bar-step ${['SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'filled' : ''}`}>3. Scheduled</div>
                      <div className={`bar-step ${ticket.status === 'FULFILLED' ? 'filled' : ''}`}>4. Closed Loop</div>
                    </div>

                    <div className="ref-bottom">
                      <span className="ref-notes">Latest: {ticket.timeline[ticket.timeline.length - 1]?.notes}</span>
                      <span className="ref-time">{new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attribution & Cures Act Transparency Modal */}
      {showAttributionModal && (
        <div className="modal-backdrop" onClick={() => setShowAttributionModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-title">
                <FileText size={20} color="#0284c7" />
                <h3>Clinical Decision Support: Independent Attribution Trail</h3>
              </div>
              <button className="btn-close" onClick={() => setShowAttributionModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="cures-act-badge">
                <ShieldCheck size={18} color="#059669" />
                <div>
                  <strong>21st Century Cures Act § 3060(a) Non-Device Certified</strong>
                  <p className="text-sm">The clinician has independent visibility and override capability for all scoring features below.</p>
                </div>
              </div>

              <h5 className="section-title">Contributing Risk Weights (Compound Score: {riskResult.totalScore}/100)</h5>
              <div className="attribution-table">
                {riskResult.attributions.map((attr, idx) => (
                  <div key={idx} className="attr-row">
                    <div className="attr-info">
                      <strong>{attr.featureName}</strong>
                      <p className="text-muted text-sm">{attr.clinicalRationale}</p>
                    </div>
                    <span className="attr-weight">+{attr.weight} pts</span>
                  </div>
                ))}
              </div>

              <h5 className="section-title">Clinical Guideline Sources</h5>
              <ul className="guideline-list">
                {riskResult.guidelineCitations.map((cite, idx) => (
                  <li key={idx} className="cite-item">
                    <ExternalLink size={13} /> {cite}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowAttributionModal(false)}>Acknowledge & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
