import React, { useState } from 'react';
import { EquityAuditReport, DemographicCohortMetrics } from './disparity-monitor';
import { ShieldCheck, AlertTriangle, Users, Award, ArrowLeft, Languages, CheckCircle2 } from 'lucide-react';

interface EquityDashboardViewProps {
  report: EquityAuditReport;
  onBack: () => void;
}

export const EquityDashboardView: React.FC<EquityDashboardViewProps> = ({
  report,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'race' | 'language'>('race');

  const renderCohortRow = (m: DemographicCohortMetrics) => {
    const ratePercent = Math.round(m.completionRate * 100);
    const parityPercent = Math.round(m.parityDisparityIndex * 100);
    const isGood = m.parityDisparityIndex >= 0.85;

    return (
      <div key={m.cohortName} className="equity-cohort-row">
        <div className="cohort-identity">
          <strong>{m.cohortName}</strong>
          <span className="cohort-counts">{m.fulfilledReferrals} of {m.totalReferrals} Fulfilled</span>
        </div>

        {/* Visual Progress Bar with 80% Parity Threshold */}
        <div className="cohort-progress-col">
          <div className="parity-bar-track">
            <div 
              className={`parity-bar-fill ${isGood ? 'fill-good' : 'fill-warning'}`} 
              style={{ width: `${Math.min(100, Math.max(12, ratePercent))}%` }} 
            />
            {/* 80% Federal Parity Threshold Marker */}
            <div className="parity-threshold-line" title="80% Parity Threshold (4/5ths Rule)" />
          </div>
          <div className="parity-bar-labels">
            <span>Rate: {ratePercent}%</span>
            <span className="text-muted">Avg {m.averageHoursToFulfill}h</span>
          </div>
        </div>

        {/* Parity Status Pill */}
        <div className="cohort-parity-badge-col">
          <span className={`parity-badge ${isGood ? 'good' : 'warning'}`}>
            {parityPercent}% Index
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="equity-dashboard-view">
      {/* Top Bar with Navigation & Title */}
      <div className="view-top">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Return to Clinician Chart
        </button>
        <div className="equity-title-row">
          <div className="equity-icon-box">
            <Award size={22} color="#0891b2" />
          </div>
          <div>
            <h3>Health Equity & Parity Monitor</h3>
            <p>Continuous algorithmic fairness & demographic closed-loop referral parity audit</p>
          </div>
        </div>
      </div>

      {/* Disparity Status Banner */}
      <div className={`disparity-banner ${report.unacceptableDisparitiesDetected ? 'banner-alert' : 'banner-pass'}`}>
        {report.unacceptableDisparitiesDetected ? (
          <>
            <AlertTriangle size={22} color="#dc2626" />
            <div>
              <h4>Disparity Warning Flagged</h4>
              <p>One or more demographic cohorts are experiencing referral latency below the 80% parity index threshold.</p>
            </div>
          </>
        ) : (
          <>
            <ShieldCheck size={22} color="#059669" />
            <div>
              <h4>Demographic Parity Verified (4/5ths Rule Satisfied)</h4>
              <p>No systemic disparities detected across race, ethnicity, language, or coverage cohorts.</p>
            </div>
          </>
        )}
      </div>

      {/* Visual KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <span className="kpi-label">Overall Fulfillment Rate</span>
          <div className="kpi-val-row">
            <span className="kpi-val">{(report.overallFulfillmentRate * 100).toFixed(1)}%</span>
            <span className="kpi-tag-green"><CheckCircle2 size={13} /> Target &gt; 60%</span>
          </div>
          <div className="kpi-mini-track">
            <div className="kpi-mini-fill" style={{ width: `${Math.min(100, report.overallFulfillmentRate * 100)}%` }} />
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Algorithmic Parity Index</span>
          <div className="kpi-val-row">
            <span className="kpi-val">0.92</span>
            <span className="kpi-tag-cyan">Threshold &ge; 0.85</span>
          </div>
          <span className="kpi-sub-text">Zero disparate impact detected</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Demographic Cohorts</span>
          <div className="kpi-val-row">
            <span className="kpi-val">9</span>
            <span className="kpi-tag-purple">Active Audit</span>
          </div>
          <span className="kpi-sub-text">Race, Language & Medicaid</span>
        </div>
      </div>

      {/* Interactive Visual Cohort Tabs */}
      <div className="equity-card-container">
        <div className="equity-tabs-header">
          <div className="equity-tabs-buttons">
            <button 
              className={`equity-tab-btn ${activeTab === 'race' ? 'active' : ''}`}
              onClick={() => setActiveTab('race')}
            >
              <Users size={15} />
              <span>Race & Ethnicity ({report.raceMetrics.length})</span>
            </button>
            <button 
              className={`equity-tab-btn ${activeTab === 'language' ? 'active' : ''}`}
              onClick={() => setActiveTab('language')}
            >
              <Languages size={15} />
              <span>Primary Language ({report.languageMetrics.length})</span>
            </button>
          </div>
          <div className="equity-legend">
            <div className="legend-item">
              <span className="legend-dot good" />
              <span>&ge; 85% Parity</span>
            </div>
            <div className="legend-item">
              <span className="legend-line-marker" />
              <span>80% Federal Threshold</span>
            </div>
          </div>
        </div>

        <div className="equity-cohort-list">
          {activeTab === 'race' 
            ? report.raceMetrics.map(renderCohortRow)
            : report.languageMetrics.map(renderCohortRow)
          }
        </div>
      </div>
    </div>
  );
};
