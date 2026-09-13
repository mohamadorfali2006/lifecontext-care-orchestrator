import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FhirClient, PUBLIC_FHIR_SERVERS } from '../src/interop/fhir-client';

describe('Role 2 & 7: Live FHIR R4 Client Suites', () => {
  let client: FhirClient;

  beforeEach(() => {
    client = new FhirClient(PUBLIC_FHIR_SERVERS[0]);
    vi.restoreAllMocks();
  });

  it('should construct correct endpoint URLs for SMART Health IT sandbox', () => {
    expect(client.getBaseUrl()).toBe('https://launch.smarthealthit.org/v/r4/fhir');

    client.setServer(PUBLIC_FHIR_SERVERS[1]);
    expect(client.getBaseUrl()).toBe('https://hapi.fhir.org/baseR4');
  });

  it('should fetch and unwrap Patient resource correctly', async () => {
    const mockPatient = {
      resourceType: 'Patient',
      id: 'smart-1032702',
      name: [{ family: 'Shaw', given: ['Amy', 'V'] }],
      birthDate: '2007-03-20',
      gender: 'female'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPatient
    } as any);

    const result = await client.getPatient('smart-1032702');
    expect(result.id).toBe('smart-1032702');
    expect(result.name[0].family).toBe('Shaw');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://launch.smarthealthit.org/v/r4/fhir/Patient/smart-1032702',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/fhir+json, application/json'
        })
      })
    );
  });

  it('should query active conditions for a patient from FHIR bundle', async () => {
    const mockBundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [
        {
          resource: {
            resourceType: 'Condition',
            id: 'cond-01',
            clinicalStatus: { coding: [{ code: 'active' }] },
            code: { text: 'Type 2 Diabetes' }
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBundle
    } as any);

    const conditions = await client.getPatientConditions('smart-1032702');
    expect(conditions.length).toBe(1);
    expect(conditions[0].id).toBe('cond-01');
    expect(conditions[0].code.text).toBe('Type 2 Diabetes');
  });
});
