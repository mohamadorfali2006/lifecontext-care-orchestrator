/**
 * HIPAA & 42 CFR Part 2 Privacy Filter
 * Sanitizes outbound data payloads to external CBO partners
 * Scoped to Role 5: Clinical Logic & Regulatory CDS Compliance Lead
 */

import { Condition, Patient } from '../fhir/types';

// Sensitive ICD-10 prefixes governed under 42 CFR Part 2 (Substance Use Disorder) & behavioral health
const PART_2_RESTRICTED_PREFIXES = ['F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F18', 'F19'];

export class PrivacyFilter {
  /**
   * Sanitizes patient clinical record for outbound CBO referral
   */
  public static sanitizeForCbo(
    patient: Patient,
    conditions: Condition[],
    hasPart2ExplicitConsent: boolean = false
  ): {
    sanitizedPatient: Partial<Patient>;
    sanitizedConditions: Condition[];
    redactedItemsCount: number;
  } {
    let redactedCount = 0;

    const sanitizedConditions = conditions.filter(c => {
      const isRestricted = c.code.coding.some(cd => 
        PART_2_RESTRICTED_PREFIXES.some(prefix => cd.code.startsWith(prefix))
      );

      if (isRestricted && !hasPart2ExplicitConsent) {
        redactedCount++;
        return false; // Filter out sensitive Part 2 diagnosis
      }
      return true;
    });

    // Minimal necessary disclosure for CBO: Name, age, contact, address. Exclude raw MRN and SSN.
    const sanitizedPatient: Partial<Patient> = {
      resourceType: 'Patient',
      id: patient.id,
      name: patient.name,
      telecom: patient.telecom,
      address: patient.address,
      communication: patient.communication
    };

    return {
      sanitizedPatient,
      sanitizedConditions,
      redactedItemsCount: redactedCount
    };
  }
}
