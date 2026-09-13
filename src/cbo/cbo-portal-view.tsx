import React, { useState } from 'react';
import { ReferralTicket, ReferralStatus } from '../referrals/types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Calendar,
  Phone,
  Lock,
  Sparkles
} from 'lucide-react';

interface CboPortalViewProps {
  referrals: ReferralTicket[];
  onUpdateStatus: (ticketId: string, nextStatus: ReferralStatus, notes: string) => void;
}

export const CboPortalView: React.FC<CboPortalViewProps> = ({
  referrals,
  onUpdateStatus
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    referrals.length > 0 ? referrals[0].id : null
  );
  const [statusNote, setStatusNote] = useState('');

  const selectedTicket = referrals.find(r => r.id === selectedTicketId) || referrals[0];

  const handleAction = (nextStatus: ReferralStatus) => {
    if (!selectedTicket) return;
    const note = statusNote.trim() || `Status progressed to ${nextStatus} via CBO coordination hub.`;
    onUpdateStatus(selectedTicket.id, nextStatus, note);
    setStatusNote('');
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'INITIATED':
        return <span className="status-badge badge-blue"><Clock size={12} /> Pending Intake</span>;
      case 'ACCEPTED':
        return <span className="status-badge badge-amber"><UserCheck size={12} /> Accepted</span>;
      case 'SCHEDULED':
        return <span className="status-badge badge-purple"><Calendar size={12} /> Scheduled</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge badge-indigo"><ArrowRight size={12} /> In Progress</span>;
      case 'FULFILLED':
        return <span className="status-badge badge-green"><CheckCircle2 size={12} /> Fulfilled</span>;
      case 'DECLINED':
        return <span className="status-badge badge-red"><XCircle size={12} /> Declined</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const isStepPassed = (step: 'INITIATED' | 'ACCEPTED' | 'SCHEDULED' | 'FULFILLED', current: ReferralStatus) => {
    const order = ['INITIATED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'];
    const stepIdx = step === 'FULFILLED' ? 4 : order.indexOf(step);
    const currIdx = order.indexOf(current);
    return currIdx >= stepIdx;
  };

  return (
    <div className="cbo-portal-container">
      {/* Sleek Minimal Header */}
      <div className="portal-header">
        <div className="portal-title">
          <div className="portal-icon-box">
            <Building2 size={22} color="#0891b2" />
          </div>
          <div>
            <h3>CBO Network Partner Portal</h3>
            <p>Open Referral HSDS 3.0 • Bi-Directional Exchange</p>
          </div>
        </div>
        <div className="portal-badge">
          <ShieldCheck size={15} color="#059669" />
          <span>Verified Node</span>
        </div>
      </div>

      <div className="cbo-grid">
        {/* Referral Inbox List */}
        <div className="referral-inbox">
          <div className="inbox-header">
            <h4>Incoming Referrals</h4>
            <span className="count-pill">{referrals.length} Queue</span>
          </div>
          <div className="ticket-list">
            {referrals.map(ticket => (
              <div
                key={ticket.id}
                className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <div className="ticket-item-header">
                  <span className="ticket-code">{ticket.id}</span>
                  {ticket.isSlaBreached ? (
                    <span className="sla-alert"><AlertTriangle size={11} /> SLA</span>
                  ) : (
                    <span className={`priority-tag ${ticket.priority}`}>
                      {ticket.priority}
                    </span>
                  )}
                </div>
                <div className="ticket-patient">{ticket.patientName}</div>
                <div className="ticket-service">{ticket.targetService.name}</div>
                <div className="ticket-footer">
                  {getStatusBadge(ticket.status)}
                  <span className="ticket-time">
                    {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Referral Workspace */}
        {selectedTicket ? (
          <div className="ticket-detail-pane">
            {/* Header with Title & Status */}
            <div className="pane-header">
              <div>
                <div className="pane-meta-row">
                  <span className="pill-urgent">{selectedTicket.priority.toUpperCase()}</span>
                  <span className="domain-chip">{selectedTicket.domain}</span>
                  <span className="zcode-chip">{selectedTicket.sdohZCode}</span>
                </div>
                <h3>{selectedTicket.patientName}</h3>
              </div>
              <div className="pane-status">
                {getStatusBadge(selectedTicket.status)}
              </div>
            </div>

            {/* Interactive Visual Lifecycle Stepper */}
            <div className="cbo-lifecycle-stepper">
              <div className={`cbo-step-node ${isStepPassed('INITIATED', selectedTicket.status) ? 'active' : ''}`}>
                <div className="step-circle"><Clock size={13} /></div>
                <span>Dispatched</span>
              </div>
              <div className={`cbo-step-line ${isStepPassed('ACCEPTED', selectedTicket.status) ? 'active' : ''}`} />
              
              <div className={`cbo-step-node ${isStepPassed('ACCEPTED', selectedTicket.status) ? 'active' : ''}`}>
                <div className="step-circle"><UserCheck size={13} /></div>
                <span>Accepted</span>
              </div>
              <div className={`cbo-step-line ${isStepPassed('SCHEDULED', selectedTicket.status) ? 'active' : ''}`} />

              <div className={`cbo-step-node ${isStepPassed('SCHEDULED', selectedTicket.status) ? 'active' : ''}`}>
                <div className="step-circle"><Calendar size={13} /></div>
                <span>Scheduled</span>
              </div>
              <div className={`cbo-step-line ${isStepPassed('FULFILLED', selectedTicket.status) ? 'active' : ''}`} />

              <div className={`cbo-step-node ${isStepPassed('FULFILLED', selectedTicket.status) ? 'active' : ''}`}>
                <div className="step-circle"><CheckCircle2 size={13} /></div>
                <span>Fulfilled</span>
              </div>
            </div>

            {/* Compact 2-Column Info Cards */}
            <div className="cbo-cards-duo">
              {/* Service Details Card */}
              <div className="cbo-mini-card">
                <div className="card-mini-title">
                  <Building2 size={15} color="#0891b2" />
                  <span>Target Service</span>
                </div>
                <div className="card-mini-content">
                  <strong>{selectedTicket.targetService.name}</strong>
                  <div className="cbo-capacity-bar-wrap">
                    <div className="capacity-label-row">
                      <span>Available Slots</span>
                      <strong>{selectedTicket.targetService.currentCapacity.availableSlots} Open</strong>
                    </div>
                    <div className="capacity-track">
                      <div 
                        className="capacity-fill" 
                        style={{ width: `${Math.min(100, selectedTicket.targetService.currentCapacity.availableSlots * 12)}%` }} 
                      />
                    </div>
                  </div>
                  <div className="mini-meta-row">
                    <span><Clock size={12} /> {selectedTicket.targetService.waitTime}</span>
                    <span><Phone size={12} /> {selectedTicket.targetService.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Consent & Compliance Card */}
              <div className="cbo-mini-card">
                <div className="card-mini-title">
                  <Lock size={15} color="#059669" />
                  <span>Consent & Security</span>
                </div>
                <div className="card-mini-content">
                  <div className="security-chip-box">
                    <ShieldCheck size={16} color="#059669" />
                    <div>
                      <strong>Patient Consent Verified</strong>
                      <p className="text-xs">Token: <code>{selectedTicket.consentTokenId.slice(0, 16)}...</code></p>
                    </div>
                  </div>
                  <div className="compliance-pills">
                    <span className="pill-small">HIPAA Validated</span>
                    <span className="pill-small">42 CFR Part 2 Cleared</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streamlined Action Bar */}
            <div className="cbo-actions">
              <div className="actions-header">
                <h5>Status Transition & EHR Feedback</h5>
                <span className="text-xs text-muted">Updates sync bi-directionally</span>
              </div>
              
              <input
                type="text"
                className="cbo-input"
                placeholder="Optional progress note (e.g., appointment confirmed for Thursday 10am)..."
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
              />

              <div className="action-buttons">
                {selectedTicket.status === 'INITIATED' && (
                  <>
                    <button
                      className="btn-action btn-accept"
                      onClick={() => handleAction('ACCEPTED')}
                    >
                      <UserCheck size={15} /> Accept Intake (&lt; 24h SLA)
                    </button>
                    <button
                      className="btn-action btn-decline"
                      onClick={() => handleAction('DECLINED')}
                    >
                      <XCircle size={15} /> Decline
                    </button>
                  </>
                )}

                {selectedTicket.status === 'ACCEPTED' && (
                  <button
                    className="btn-action btn-schedule"
                    onClick={() => handleAction('SCHEDULED')}
                  >
                    <Calendar size={15} /> Schedule Appointment / Delivery
                  </button>
                )}

                {selectedTicket.status === 'SCHEDULED' && (
                  <>
                    <button
                      className="btn-action btn-progress"
                      onClick={() => handleAction('IN_PROGRESS')}
                    >
                      <ArrowRight size={15} /> Mark In-Progress
                    </button>
                    <button
                      className="btn-action btn-fulfill"
                      onClick={() => handleAction('FULFILLED')}
                    >
                      <CheckCircle2 size={15} /> Confirm Delivery & Close Loop
                    </button>
                  </>
                )}

                {selectedTicket.status === 'IN_PROGRESS' && (
                  <button
                    className="btn-action btn-fulfill"
                    onClick={() => handleAction('FULFILLED')}
                  >
                    <CheckCircle2 size={15} /> Confirm Delivery & Close Loop
                  </button>
                )}

                {selectedTicket.status === 'FULFILLED' && (
                  <div className="fulfilled-notice">
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Closed-loop fulfillment completed. Clinician EHR updated via FHIR ServiceRequest callback.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Lifecycle Audit Feed */}
            <div className="timeline-block">
              <h5>Audit & Coordination History</h5>
              <div className="timeline-items">
                {selectedTicket.timeline.map((evt, idx) => (
                  <div key={idx} className="timeline-node">
                    <div className="node-dot" />
                    <div className="node-content">
                      <div className="node-meta">
                        <span className="node-status-tag">{evt.status}</span>
                        <span className="node-actor">{evt.actor}</span>
                        <span className="node-time">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="node-notes">{evt.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ticket-detail-pane empty-pane">
            <Sparkles size={28} color="#94a3b8" />
            <p>Select a referral from the queue to review and manage coordination.</p>
          </div>
        )}
      </div>
    </div>
  );
};
