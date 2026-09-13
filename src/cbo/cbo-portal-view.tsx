import React, { useState } from 'react';
import { ReferralTicket, ReferralStatus } from '../referrals/types';
import { Building2, CheckCircle2, Clock, AlertTriangle, UserCheck, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

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
    const note = statusNote.trim() || `Status updated to ${nextStatus} by CBO intake coordinator.`;
    onUpdateStatus(selectedTicket.id, nextStatus, note);
    setStatusNote('');
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'INITIATED':
        return <span className="status-badge badge-blue"><Clock size={13} /> Action Required</span>;
      case 'ACCEPTED':
        return <span className="status-badge badge-amber"><UserCheck size={13} /> Intake Accepted</span>;
      case 'SCHEDULED':
        return <span className="status-badge badge-purple"><Clock size={13} /> Delivery Scheduled</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge badge-indigo"><ArrowRight size={13} /> In Progress</span>;
      case 'FULFILLED':
        return <span className="status-badge badge-green"><CheckCircle2 size={13} /> Closed Loop Fulfilled</span>;
      case 'DECLINED':
        return <span className="status-badge badge-red"><XCircle size={13} /> Declined</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="cbo-portal-container">
      <div className="portal-header">
        <div className="portal-title">
          <Building2 size={24} color="#2563eb" />
          <div>
            <h3>CBO Network Partner Portal</h3>
            <p>Open Referral HSDS 3.0 Bidirectional Integration</p>
          </div>
        </div>
        <div className="portal-badge">
          <ShieldCheck size={16} color="#059669" />
          <span>Verified CBO Secure Node</span>
        </div>
      </div>

      <div className="cbo-grid">
        {/* Referral Inbox List */}
        <div className="referral-inbox">
          <h4>Incoming Referral Queue ({referrals.length})</h4>
          <div className="ticket-list">
            {referrals.map(ticket => (
              <div
                key={ticket.id}
                className={`ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <div className="ticket-item-header">
                  <span className="ticket-code">{ticket.id}</span>
                  {ticket.isSlaBreached && (
                    <span className="sla-alert"><AlertTriangle size={12} /> SLA Breach</span>
                  )}
                </div>
                <div className="ticket-patient">{ticket.patientName}</div>
                <div className="ticket-service">{ticket.targetService.name}</div>
                <div className="ticket-footer">
                  {getStatusBadge(ticket.status)}
                  <span className="ticket-time">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Referral Workspace */}
        {selectedTicket ? (
          <div className="ticket-detail-pane">
            <div className="pane-header">
              <div>
                <span className="pill-urgent">{selectedTicket.priority.toUpperCase()} PRIORITY</span>
                <h3>{selectedTicket.patientName}</h3>
                <p className="detail-sub">Domain: {selectedTicket.domain} ({selectedTicket.sdohZCode})</p>
              </div>
              <div className="pane-status">
                {getStatusBadge(selectedTicket.status)}
              </div>
            </div>

            <div className="info-block">
              <h5>Service Target</h5>
              <p><strong>{selectedTicket.targetService.name}</strong></p>
              <p className="text-muted">{selectedTicket.targetService.description}</p>
              <p className="text-sm">Wait Time: {selectedTicket.targetService.waitTime} | Capacity Slots: {selectedTicket.targetService.currentCapacity.availableSlots}</p>
            </div>

            <div className="info-block">
              <h5>Consent & Verification</h5>
              <p className="text-sm">
                Patient consent verified under token: <code>{selectedTicket.consentTokenId}</code>
              </p>
            </div>

            {/* Action Bar */}
            <div className="cbo-actions">
              <h5>Update Status & Close the Loop</h5>
              <input
                type="text"
                className="cbo-input"
                placeholder="Add intake verification notes or delivery confirmation..."
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
                      <UserCheck size={16} /> Accept Intake (SLA &lt; 24h)
                    </button>
                    <button
                      className="btn-action btn-decline"
                      onClick={() => handleAction('DECLINED')}
                    >
                      <XCircle size={16} /> Decline (Capacity / Out of Area)
                    </button>
                  </>
                )}

                {selectedTicket.status === 'ACCEPTED' && (
                  <button
                    className="btn-action btn-schedule"
                    onClick={() => handleAction('SCHEDULED')}
                  >
                    <Clock size={16} /> Schedule Delivery / Appointment
                  </button>
                )}

                {selectedTicket.status === 'SCHEDULED' && (
                  <button
                    className="btn-action btn-progress"
                    onClick={() => handleAction('IN_PROGRESS')}
                  >
                    <ArrowRight size={16} /> Mark In-Progress
                  </button>
                )}

                {(selectedTicket.status === 'SCHEDULED' || selectedTicket.status === 'IN_PROGRESS') && (
                  <button
                    className="btn-action btn-fulfill"
                    onClick={() => handleAction('FULFILLED')}
                  >
                    <CheckCircle2 size={16} /> Confirm Service Delivery (Close Loop)
                  </button>
                )}

                {selectedTicket.status === 'FULFILLED' && (
                  <div className="fulfilled-notice">
                    <CheckCircle2 size={20} color="#059669" />
                    <span>Closed-loop complete! Clinician EHR notified of fulfillment.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="timeline-block">
              <h5>Lifecycle Audit Trail</h5>
              <div className="timeline-items">
                {selectedTicket.timeline.map((evt, idx) => (
                  <div key={idx} className="timeline-node">
                    <div className="node-dot" />
                    <div className="node-content">
                      <div className="node-meta">
                        <strong>{evt.status}</strong> by {evt.actor} — {new Date(evt.timestamp).toLocaleString()}
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
            <p>Select a referral to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
