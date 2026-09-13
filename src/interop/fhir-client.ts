/**
 * Live FHIR R4 Sandbox Client
 * Connects to public synthetic sandboxes (SMART Health IT & HAPI FHIR R4)
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

import { Patient, Condition, Observation } from '../fhir/types';

export interface FhirServerConfig {
  id: string;
  name: string;
  baseUrl: string;
  supportsSmartAuth: boolean;
}

export const PUBLIC_FHIR_SERVERS: FhirServerConfig[] = [
  {
    id: 'smart-health-it',
    name: 'SMART Health IT R4 Sandbox',
    baseUrl: 'https://launch.smarthealthit.org/v/r4/fhir',
    supportsSmartAuth: true
  },
  {
    id: 'hapi-fhir',
    name: 'HAPI FHIR Public Test Server',
    baseUrl: 'https://hapi.fhir.org/baseR4',
    supportsSmartAuth: false
  }
];

export class FhirClient {
  private baseUrl: string;

  constructor(server: FhirServerConfig = PUBLIC_FHIR_SERVERS[0]) {
    this.baseUrl = server.baseUrl;
  }

  public setServer(server: FhirServerConfig) {
    this.baseUrl = server.baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Fetches a Patient by ID from the FHIR server
   */
  public async getPatient(patientId: string): Promise<Patient> {
    const url = `${this.baseUrl}/Patient/${patientId}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`FHIR server error ${res.status}: Unable to fetch Patient/${patientId}`);
    }

    return (await res.json()) as Patient;
  }

  /**
   * Queries active Conditions for a patient
   */
  public async getPatientConditions(patientId: string): Promise<Condition[]> {
    const url = `${this.baseUrl}/Condition?patient=${patientId}&clinical-status=active`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`FHIR server error ${res.status}: Unable to query Conditions for Patient/${patientId}`);
    }

    const bundle = (await res.json()) as any;
    if (!bundle.entry) return [];

    return bundle.entry
      .filter((e: any) => e.resource?.resourceType === 'Condition')
      .map((e: any) => e.resource as Condition);
  }

  /**
   * Queries social history / SDOH Observations for a patient
   */
  public async getSdohObservations(patientId: string): Promise<Observation[]> {
    const url = `${this.baseUrl}/Observation?patient=${patientId}&category=social-history`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`FHIR server error ${res.status}: Unable to query Observations for Patient/${patientId}`);
    }

    const bundle = (await res.json()) as any;
    if (!bundle.entry) return [];

    return bundle.entry
      .filter((e: any) => e.resource?.resourceType === 'Observation')
      .map((e: any) => e.resource as Observation);
  }

  /**
   * Searches patients matching a name prefix
   */
  public async searchPatients(name: string): Promise<Patient[]> {
    const url = `${this.baseUrl}/Patient?name=${encodeURIComponent(name)}&_count=5`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/fhir+json, application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`FHIR server error ${res.status}: Patient search failed`);
    }

    const bundle = (await res.json()) as any;
    if (!bundle.entry) return [];

    return bundle.entry
      .filter((e: any) => e.resource?.resourceType === 'Patient')
      .map((e: any) => e.resource as Patient);
  }
}
