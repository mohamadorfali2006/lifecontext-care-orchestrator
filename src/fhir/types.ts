/**
 * HL7 FHIR R4 Core Interfaces for SDOH Clinical Care
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface CodeableConcept {
  coding: Coding[];
  text?: string;
}

export interface Reference {
  reference: string;
  display?: string;
  type?: string;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Identifier {
  system?: string;
  value: string;
  use?: 'usual' | 'official' | 'temp' | 'secondary';
}

export interface HumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
}

export interface ContactPoint {
  system: 'phone' | 'email' | 'sms' | 'other';
  value: string;
  use?: 'home' | 'work' | 'mobile';
}

export interface Address {
  use?: 'home' | 'work' | 'temp';
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Patient {
  resourceType: 'Patient';
  id: string;
  identifier?: Identifier[];
  active?: boolean;
  name: HumanName[];
  telecom?: ContactPoint[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  address?: Address[];
  communication?: Array<{
    language: CodeableConcept;
    preferred?: boolean;
  }>;
}

export interface Condition {
  resourceType: 'Condition';
  id: string;
  clinicalStatus: {
    coding: Coding[];
  };
  verificationStatus?: {
    coding: Coding[];
  };
  category: CodeableConcept[];
  code: CodeableConcept;
  subject: Reference;
  onsetDateTime?: string;
  recordedDate?: string;
}

export interface Observation {
  resourceType: 'Observation';
  id: string;
  status: 'registered' | 'preliminary' | 'final' | 'amended';
  category: CodeableConcept[];
  code: CodeableConcept;
  subject: Reference;
  effectiveDateTime: string;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  component?: Array<{
    code: CodeableConcept;
    valueCodeableConcept?: CodeableConcept;
    valueString?: string;
    valueBoolean?: boolean;
  }>;
}

export interface ServiceRequest {
  resourceType: 'ServiceRequest';
  id: string;
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed';
  intent: 'order' | 'proposal' | 'plan';
  category: CodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  code: CodeableConcept;
  subject: Reference;
  authoredOn: string;
  requester?: Reference;
  performer?: Reference[];
  reasonCode?: CodeableConcept[];
  supportingInfo?: Reference[];
}

export interface Task {
  resourceType: 'Task';
  id: string;
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'cancelled';
  intent: 'order' | 'proposal' | 'plan';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  focus: Reference;
  for: Reference;
  authoredOn: string;
  lastModified?: string;
  owner?: Reference;
  executionPeriod?: Period;
  statusReason?: CodeableConcept;
}

export interface Consent {
  resourceType: 'Consent';
  id: string;
  status: 'draft' | 'proposed' | 'active' | 'rejected' | 'inactive' | 'entered-in-error';
  scope: CodeableConcept;
  category: CodeableConcept[];
  patient: Reference;
  dateTime: string;
  provision: {
    type: 'deny' | 'permit';
    period?: Period;
    actor?: Array<{
      role: CodeableConcept;
      reference: Reference;
    }>;
    action?: CodeableConcept[];
    class?: Coding[];
    data?: Array<{
      meaning: 'instance' | 'related' | 'dependents' | 'authoredby';
      reference: Reference;
    }>;
  };
}

export interface Provenance {
  resourceType: 'Provenance';
  id: string;
  target: Reference[];
  recorded: string;
  agent: Array<{
    type?: CodeableConcept;
    who: Reference;
  }>;
}
