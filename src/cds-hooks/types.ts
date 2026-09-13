/**
 * HL7 CDS Hooks 1.0 Types
 * Scoped to Role 3: EHR Clinical Workflow & SMART-on-FHIR Engineer
 */

export interface CDSHookRequest {
  hook: 'patient-view' | 'order-select' | 'order-sign';
  hookInstance: string;
  fhirServer?: string;
  fhirAuthorization?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };
  user: string; // e.g. "Practitioner/123"
  context: {
    userId: string;
    patientId: string;
    encounterId?: string;
    selections?: string[];
  };
  prefetch?: Record<string, any>;
}

export interface CDSSuggestion {
  label: string;
  uuid?: string;
  isRecommended?: boolean;
  actions?: Array<{
    type: 'create' | 'update' | 'delete';
    description: string;
    resource?: any;
  }>;
}

export interface CDSLink {
  label: string;
  url: string;
  type: 'absolute' | 'smart';
  appContext?: string;
}

export interface CDSCard {
  uuid: string;
  summary: string;
  detail?: string;
  indicator: 'info' | 'warning' | 'critical';
  source: {
    label: string;
    url?: string;
    icon?: string;
  };
  suggestions?: CDSSuggestion[];
  selectionBehavior?: 'at-most-one' | 'any';
  overrideReasons?: Array<{
    code: string;
    system: string;
    display: string;
  }>;
  links?: CDSLink[];
}

export interface CDSHookResponse {
  cards: CDSCard[];
}
