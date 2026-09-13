import React, { useState } from 'react';
import { LifeContextLogo } from '../brand/LifeContextLogo';
import { DnaHelixAnimation } from './DnaHelixAnimation';
import { 
  Stethoscope, 
  Building2, 
  UserCheck, 
  Award, 
  ArrowRight, 
  Lock
} from 'lucide-react';

export type UserRole = 'CLINICIAN' | 'CBO_COORDINATOR' | 'PATIENT' | 'AUDITOR';

export interface AuthSession {
  userRole: UserRole;
  userName: string;
  userTitle: string;
  organizationName: string;
  tokenExpiry: string;
  mfaVerified: boolean;
  avatarUrl?: string;
}

interface LoginPageProps {
  onLoginSuccess: (session: AuthSession) => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  initialRole = 'CLINICIAN' 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [emailInput, setEmailInput] = useState('sjenkins@chicagomed.org');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const ROLE_PROFILES: Record<UserRole, AuthSession> = {
    CLINICIAN: {
      userRole: 'CLINICIAN',
      userName: 'Dr. Sarah Jenkins, MD',
      userTitle: 'Lead Care Management Physician',
      organizationName: 'University of Chicago Medicine & UI Health',
      tokenExpiry: '8 hours',
      mfaVerified: true
    },
    CBO_COORDINATOR: {
      userRole: 'CBO_COORDINATOR',
      userName: 'Carlos Mendez, MSW',
      userTitle: 'Community Intake Director',
      organizationName: 'Greater Chicago Food Depository Network',
      tokenExpiry: '12 hours',
      mfaVerified: true
    },
    PATIENT: {
      userRole: 'PATIENT',
      userName: 'Maria Elena Sanchez',
      userTitle: 'Patient & Caregiver Portal Access',
      organizationName: 'Cook County Health Medicaid Managed Care',
      tokenExpiry: '30 days',
      mfaVerified: true
    },
    AUDITOR: {
      userRole: 'AUDITOR',
      userName: 'Elena Rostova, MPH',
      userTitle: 'ACO Quality & Health Equity Auditor',
      organizationName: 'Illinois Department of Healthcare & NCQA Council',
      tokenExpiry: '4 hours',
      mfaVerified: true
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    switch (role) {
      case 'CLINICIAN':
        setEmailInput('sjenkins@chicagomed.org');
        break;
      case 'CBO_COORDINATOR':
        setEmailInput('cmendez@chicagofoodbank.org');
        break;
      case 'PATIENT':
        setEmailInput('(555) 234-8901');
        break;
      case 'AUDITOR':
        setEmailInput('erostova@illinois.gov');
        break;
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(ROLE_PROFILES[selectedRole]);
    }, 400);
  };

  return (
    <div className="minimal-login-viewport">
      {/* Dynamic 3D DNA Helix Background Animation */}
      <DnaHelixAnimation />

      {/* Subtle Ambient Lighting Orbs */}
      <div className="login-ambient-orb orb-1" />
      <div className="login-ambient-orb orb-2" />

      {/* Minimalist Modern Glassmorphism Card */}
      <div className="minimal-glass-card">
        {/* Header with Centered Brand Mark */}
        <div className="minimal-login-header">
          <LifeContextLogo size={42} showTagline={false} />
          <h1 className="minimal-login-title">Sign In</h1>
          <p className="minimal-login-subtitle">
            Choose your role to access the care orchestrator
          </p>
        </div>

        {/* Minimalist 4-Role Segment Switcher */}
        <div className="minimal-role-segments">
          <button
            type="button"
            className={`role-segment-btn ${selectedRole === 'CLINICIAN' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('CLINICIAN')}
            title="Clinician / MD"
          >
            <Stethoscope size={16} />
            <span>Clinician</span>
          </button>

          <button
            type="button"
            className={`role-segment-btn ${selectedRole === 'CBO_COORDINATOR' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('CBO_COORDINATOR')}
            title="CBO Intake Coordinator"
          >
            <Building2 size={16} />
            <span>CBO Lead</span>
          </button>

          <button
            type="button"
            className={`role-segment-btn ${selectedRole === 'PATIENT' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('PATIENT')}
            title="Patient & Caregiver"
          >
            <UserCheck size={16} />
            <span>Patient</span>
          </button>

          <button
            type="button"
            className={`role-segment-btn ${selectedRole === 'AUDITOR' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('AUDITOR')}
            title="ACO Quality Auditor"
          >
            <Award size={16} />
            <span>Auditor</span>
          </button>
        </div>

        {/* Selected Persona Summary Pill */}
        <div className="minimal-persona-summary">
          <span className="summary-name">{ROLE_PROFILES[selectedRole].userName}</span>
          <span className="summary-org">{ROLE_PROFILES[selectedRole].organizationName}</span>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSignIn} className="minimal-login-form">
          <div className="minimal-input-field">
            <label className="field-label">Email or Healthcare Identifier</label>
            <input
              type="text"
              className="field-input"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="minimal-input-field">
            <label className="field-label">Password or Security PIN</label>
            <input
              type="password"
              className="field-input"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="minimal-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Clean, Non-Intrusive Footer */}
        <div className="minimal-login-footer">
          <Lock size={12} color="#0891b2" />
          <span>Protected Health Information • HIPAA & FHIR R4 Ready</span>
        </div>
      </div>
    </div>
  );
};
