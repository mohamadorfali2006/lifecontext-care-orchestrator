import { describe, it, expect, beforeEach } from 'vitest';
import { PrivacyFilter } from '../src/security/hipaa-part2-filter';
import { ConsentManager } from '../src/consent/consent-manager';
import { AuditLogger } from '../src/audit/audit-logger';
import { SYNTHETIC_PATIENTS } from '../test-fixtures/synthetic-patients';
import { Condition } from '../src/fhir/types';

describe('Role 5 & 7: Privacy, Consent & Audit Suites', () => {
  const maria = SYNTHETIC_PATIENTS[0].patient;

  beforeEach(() => {
    AuditLogger.clear();
  });

  it('should redact sensitive 42 CFR Part 2 behavioral health diagnoses from outbound CBO payloads unless explicitly consented', () => {
    const sensitiveConditions: Condition[] = [
      ...SYNTHETIC_PATIENTS[0].activeConditions,
      {
        resourceType: 'Condition',
        id: 'cond-sud-part2',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'F10.10', display: 'Alcohol use disorder, mild' }], text: 'Alcohol Use Disorder' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Sanchez' }
      }
    ];

    // Outbound without explicit Part 2 consent
    const filtered = PrivacyFilter.sanitizeForCbo(maria, sensitiveConditions, false);
    expect(filtered.redactedItemsCount).toBe(1);
    expect(filtered.sanitizedConditions.some(c => c.code.coding[0].code.startsWith('F10'))).toBe(false);

    // Outbound with explicit Part 2 consent
    const unredacted = PrivacyFilter.sanitizeForCbo(maria, sensitiveConditions, true);
    expect(unredacted.redactedItemsCount).toBe(0);
    expect(unredacted.sanitizedConditions.some(c => c.code.coding[0].code.startsWith('F10'))).toBe(true);
  });

  it('should respect granular patient consent revocation', () => {
    let consent = ConsentManager.createDefaultConsent('PT-MARIA-01');
    expect(ConsentManager.isDomainPermitted(consent, 'food-insecurity')).toBe(true);

    // Patient turns off food sharing
    consent = ConsentManager.toggleScope(consent, 'food-insecurity', false);
    expect(ConsentManager.isDomainPermitted(consent, 'food-insecurity')).toBe(false);
    expect(ConsentManager.isDomainPermitted(consent, 'transportation-insecurity')).toBe(true);
  });

  it('should maintain an append-only audit trail conforming to HIPAA § 164.312(b)', () => {
    AuditLogger.log({
      action: 'CDS_TRIGGER',
      actorId: 'system-rule-engine',
      actorRole: 'SYSTEM_DAEMON',
      patientId: 'PT-MARIA-01',
      resourceAffected: 'Condition/Z59.41',
      status: 'SUCCESS',
      details: 'Evaluated patient-view hook; triggered food insecurity card'
    });

    AuditLogger.log({
      action: 'REFERRAL_DISPATCH',
      actorId: 'dr-jenkins',
      actorRole: 'CLINICIAN',
      patientId: 'PT-MARIA-01',
      resourceAffected: 'ServiceRequest/sdoh-req-01',
      status: 'SUCCESS',
      details: 'Dispatched referral to Metropolitan Food Bank'
    });

    const logs = AuditLogger.getLogsForPatient('PT-MARIA-01');
    expect(logs.length).toBe(2);
    expect(logs[0].action).toBe('CDS_TRIGGER');
    expect(logs[1].action).toBe('REFERRAL_DISPATCH');
  });
});
