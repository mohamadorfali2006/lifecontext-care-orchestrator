/**
 * Open Referral Human Services Data Specification (HSDS v3.0) Types
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

export interface HsdsOrganization {
  id: string;
  name: string;
  description: string;
  url?: string;
  email?: string;
  taxStatus?: string;
  yearIncorporated?: number;
}

export interface HsdsEligibility {
  id: string;
  serviceId: string;
  description: string;
  minimumAge?: number;
  maximumAge?: number;
  incomeThresholdPercentFPL?: number; // Federal Poverty Level %
  qualifyingConditions?: string[];
}

export interface HsdsLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  accessibility: string[];
}

export interface HsdsTaxonomy {
  id: string;
  code: string; // 211 / AIRS taxonomy code e.g. BD-1800.2000 (Food Pantries)
  name: string;
  vocabulary: 'AIRS_211' | 'OPEN_REFERRAL' | 'LOCAL';
}

export interface HsdsService {
  id: string;
  organizationId: string;
  name: string;
  alternateName?: string;
  description: string;
  url?: string;
  email?: string;
  status: 'active' | 'inactive' | 'full-capacity' | 'waitlist-only';
  interpretationServices?: string[]; // e.g. ['Spanish', 'Vietnamese', 'ASL']
  applicationProcess: string;
  waitTime: string; // e.g. "Same-day", "24-48 hours", "1 week"
  taxonomy: HsdsTaxonomy[];
  eligibility: HsdsEligibility;
  locations: HsdsLocation[];
  contactPhone: string;
  currentCapacity: {
    availableSlots: number;
    maximumSlots: number;
    acceptanceRateLast30Days: number; // e.g. 0.92
    lastUpdated: string;
  };
}
