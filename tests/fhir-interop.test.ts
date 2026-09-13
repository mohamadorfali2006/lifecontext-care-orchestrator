import { describe, it, expect } from 'vitest';
import { FhirConverter } from '../src/interop/fhir-converter';
import { HsdsResolver } from '../src/interop/hsds-resolver';
import { CBO_SERVICE_DIRECTORY } from '../src/cbo/cbo-directory';
import { SYNTHETIC_PATIENTS } from '../test-fixtures/synthetic-patients';
import { GRAVITY_SDOH_REGISTRY } from '../src/standards/gravity-sdoh';

describe('Role 2: Health Informatics & Interoperability Architect Suites', () => {
  const maria = SYNTHETIC_PATIENTS[0].patient;

  it('should generate valid Gravity SDOH Condition with ICD-10 Z-code and SNOMED-CT', () => {
    const condition = FhirConverter.createSdohCondition(maria, 'food-insecurity');

    expect(condition.resourceType).toBe('Condition');
    expect(condition.clinicalStatus.coding[0].code).toBe('active');
    expect(condition.subject.reference).toBe('Patient/PT-MARIA-01');

    const icdCode = condition.code.coding.find(c => c.system.includes('icd-10-cm'));
    expect(icdCode?.code).toBe('Z59.41');
    expect(icdCode?.display).toBe('Food insecurity');

    const snomedCode = condition.code.coding.find(c => c.system.includes('snomed.info'));
    expect(snomedCode?.code).toBe('733423003');
  });

  it('should generate valid screening Observation conforming to LOINC PRAPARE', () => {
    const observation = FhirConverter.createSdohObservation(maria, {
      domain: 'food-insecurity',
      identifiedRisk: true,
      screeningDate: '2026-09-10T12:00:00Z'
    });

    expect(observation.resourceType).toBe('Observation');
    expect(observation.status).toBe('final');
    expect(observation.code.coding[0].code).toBe(GRAVITY_SDOH_REGISTRY['food-insecurity'].loincScreeningCode);
    expect(observation.valueBoolean).toBe(true);
  });

  it('should generate valid ServiceRequest referral order', () => {
    const serviceRequest = FhirConverter.createSdohServiceRequest(maria, 'transportation-insecurity');

    expect(serviceRequest.resourceType).toBe('ServiceRequest');
    expect(serviceRequest.status).toBe('active');
    expect(serviceRequest.intent).toBe('order');
    expect(serviceRequest.reasonCode?.[0].coding[0].code).toBe('Z59.82');
  });

  it('should resolve matching HSDS 3.0 CBO services based on SDOH domain and language', () => {
    const matched = HsdsResolver.matchServices(CBO_SERVICE_DIRECTORY, 'food-insecurity', 'Spanish', '60608');

    expect(matched.length).toBeGreaterThan(0);
    expect(matched[0].name).toContain('Food');
    expect(matched[0].interpretationServices).toContain('Spanish');
    expect(matched[0].currentCapacity.availableSlots).toBeGreaterThan(0);
  });
});
