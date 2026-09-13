import React from 'react';
import { Patient } from '../fhir/types';
import { ShieldCheck, User, Calendar, MapPin, Globe, Activity } from 'lucide-react';

interface SmartFhirHeaderProps {
  patient: Patient;
  insurancePlan: string;
  riskScore: number;
  riskTier: 'Low' | 'Moderate' | 'High' | 'Critical';
  fhirServerName?: string;
  isLiveFhir?: boolean;
  onSyncLiveFhir?: () => void;
  isLoadingLiveFhir?: boolean;
}

export const SmartFhirHeader: React.FC<SmartFhirHeaderProps> = ({
  patient,
  insurancePlan,
  riskScore,
  riskTier,
  fhirServerName = 'SMART Health IT R4 Sandbox',
  isLiveFhir = false,
  onSyncLiveFhir,
  isLoadingLiveFhir = false
}) => {
  const patientName = `${patient.name[0]?.given?.join(' ') || ''} ${patient.name[0]?.family || ''}`.trim();
  const address = patient.address?.[0];
  const lang = patient.communication?.[0]?.language?.text || 'English';

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Moderate': return '#d97706';
      default: return '#16a34a';
    }
  };

  return (
    <header className="smart-fhir-banner">
      <div className="banner-top">
        <div className="patient-identity">
          <div className="avatar-badge">
            <User size={20} color="#0891b2" />
          </div>
          <div className="name-mrn">
            <div className="patient-title-row">
              <h2 className="patient-name">{patientName}</h2>
              <span className="meta-pill-primary">MRN #{patient.id}</span>
            </div>
            <div className="meta-row">
              <span className="meta-pill"><Calendar size={12} /> {patient.birthDate} ({patient.gender.toUpperCase()})</span>
              <span className="meta-pill"><MapPin size={12} /> {address ? `${address.city}, ${address.state}` : 'Chicago, IL'}</span>
              <span className="meta-pill"><Globe size={12} /> {lang}</span>
            </div>
          </div>
        </div>

        <div className="clinical-stats">
          {/* Plan Badge */}
          <div className="stat-card compact-stat">
            <span className="stat-label">Coverage</span>
            <span className="stat-val-compact" title={insurancePlan}>{insurancePlan.split('(')[0].trim()}</span>
          </div>

          {/* Social-Clinical Risk Badge */}
          <div className="stat-card compact-stat risk-stat" style={{ borderColor: `${getTierColor(riskTier)}40` }}>
            <span className="stat-label">SDOH Compound Risk</span>
            <div className="stat-score" style={{ color: getTierColor(riskTier) }}>
              <Activity size={14} />
              <span>{riskScore}/100 • {riskTier}</span>
            </div>
          </div>

          {/* Single Compact Live Sync Action */}
          {onSyncLiveFhir && (
            <button 
              className="btn-sync-fhir-compact" 
              onClick={onSyncLiveFhir}
              disabled={isLoadingLiveFhir}
              title={isLiveFhir ? `Connected to ${fhirServerName}` : 'Sync with live SMART Sandbox'}
            >
              <ShieldCheck size={14} color={isLiveFhir ? '#059669' : '#a855f7'} />
              <span>{isLoadingLiveFhir ? 'Connecting...' : isLiveFhir ? 'SMART Live' : 'Test Live FHIR'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
