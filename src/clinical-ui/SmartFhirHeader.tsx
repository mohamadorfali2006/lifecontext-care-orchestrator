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
            <User size={22} color="#0284c7" />
          </div>
          <div className="name-mrn">
            <h2 className="patient-name">{patientName}</h2>
            <div className="meta-row">
              <span className="meta-pill">MRN: #{patient.id}</span>
              <span className="meta-pill"><Calendar size={13} /> {patient.birthDate} ({patient.gender.toUpperCase()})</span>
              <span className="meta-pill"><MapPin size={13} /> {address ? `${address.city}, ${address.state}` : 'N/A'}</span>
              <span className="meta-pill"><Globe size={13} /> {lang}</span>
            </div>
          </div>
        </div>

        <div className="clinical-stats">
          <div className="stat-card">
            <span className="stat-label">Coverage</span>
            <span className="stat-val">{insurancePlan}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Social-Clinical Risk</span>
            <div className="stat-score" style={{ color: getTierColor(riskTier) }}>
              <Activity size={16} />
              <span>{riskScore}/100 ({riskTier})</span>
            </div>
          </div>
          <div className="stat-card secure-badge">
            <ShieldCheck size={16} color="#059669" />
            <span className="secure-text">{isLiveFhir ? `Connected: ${fhirServerName}` : 'SMART v2.0 OAuth Session Active'}</span>
          </div>
          {onSyncLiveFhir && (
            <button 
              className="btn-sync-fhir" 
              onClick={onSyncLiveFhir}
              disabled={isLoadingLiveFhir}
            >
              {isLoadingLiveFhir ? 'Connecting...' : '⚡ Test Live SMART Sandbox'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
