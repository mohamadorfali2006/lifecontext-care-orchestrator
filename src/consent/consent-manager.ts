/**
 * Granular Patient & Caregiver Consent Manager
 * Conforms to FHIR R4 Consent resource specification
 * Scoped to Role 6: Health Equity, Consent & Patient Experience Engineer
 */

import { Consent } from '../fhir/types';
import { SdohDomain } from '../standards/gravity-sdoh';

export interface ConsentScopeState {
  'food-insecurity': boolean;
  'housing-instability': boolean;
  'transportation-insecurity': boolean;
  'social-isolation': boolean;
  'financial-insecurity': boolean;
  'utility-insecurity': boolean;
  'behavioral-health-part2': boolean; // 42 CFR Part 2 explicit toggle
}

export interface PatientConsentRecord {
  patientId: string;
  tokenId: string;
  lastUpdated: string;
  scopes: ConsentScopeState;
  proxyCaregiverAuthorized: boolean;
  proxyName?: string;
  preferredCommunicationChannel: 'SMS' | 'PHONE' | 'PORTAL';
  fhirConsentResource: Consent;
}

export class ConsentManager {
  /**
   * Initializes default consent state for a new patient
   */
  public static createDefaultConsent(
    patientId: string,
    proxyName?: string
  ): PatientConsentRecord {
    const tokenId = `CONSENT-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const scopes: ConsentScopeState = {
      'food-insecurity': true,
      'housing-instability': true,
      'transportation-insecurity': true,
      'social-isolation': true,
      'financial-insecurity': true,
      'utility-insecurity': true,
      'behavioral-health-part2': false // Default restricted under 42 CFR Part 2
    };

    const fhirConsent: Consent = {
      resourceType: 'Consent',
      id: tokenId,
      status: 'active',
      scope: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/consentscope',
            code: 'patient-privacy',
            display: 'Privacy Consent'
          }
        ]
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
              code: 'sdoh-coordination',
              display: 'SDOH Care Coordination Sharing'
            }
          ]
        }
      ],
      patient: {
        reference: `Patient/${patientId}`
      },
      dateTime: now,
      provision: {
        type: 'permit',
        action: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/consentaction',
                code: 'disclose',
                display: 'Disclose to CBO Partners'
              }
            ]
          }
        ]
      }
    };

    return {
      patientId,
      tokenId,
      lastUpdated: now,
      scopes,
      proxyCaregiverAuthorized: !!proxyName,
      proxyName,
      preferredCommunicationChannel: 'SMS',
      fhirConsentResource: fhirConsent
    };
  }

  /**
   * Toggles consent for a specific domain with instant revocation
   */
  public static toggleScope(
    record: PatientConsentRecord,
    domain: keyof ConsentScopeState,
    enabled: boolean
  ): PatientConsentRecord {
    const updatedScopes = {
      ...record.scopes,
      [domain]: enabled
    };

    return {
      ...record,
      scopes: updatedScopes,
      lastUpdated: new Date().toISOString(),
      fhirConsentResource: {
        ...record.fhirConsentResource,
        status: Object.values(updatedScopes).some(v => v) ? 'active' : 'rejected',
        dateTime: new Date().toISOString()
      }
    };
  }

  /**
   * Checks if outbound referral to a specific domain is permitted by patient
   */
  public static isDomainPermitted(
    record: PatientConsentRecord,
    domain: SdohDomain
  ): boolean {
    return record.scopes[domain] === true;
  }
}
