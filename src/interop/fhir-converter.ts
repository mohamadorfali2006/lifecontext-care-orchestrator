/**
 * FHIR R4 Interoperability Converter
 * Maps screening instruments (PRAPARE, AHC-HRSN) into Gravity SDOH FHIR Resources
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

import { Patient, Condition, Observation, ServiceRequest } from '../fhir/types';
import { GRAVITY_SDOH_REGISTRY, SdohDomain } from '../standards/gravity-sdoh';

export interface ScreeningAnswer {
  domain: SdohDomain;
  identifiedRisk: boolean;
  notes?: string;
  screeningDate: string;
}

export class FhirConverter {
  /**
   * Generates a FHIR Condition conforming to SDOHCC_Condition profile
   */
  public static createSdohCondition(
    patient: Patient,
    domain: SdohDomain,
    onsetDate: string = new Date().toISOString()
  ): Condition {
    const mapping = GRAVITY_SDOH_REGISTRY[domain];

    return {
      resourceType: 'Condition',
      id: `sdoh-cond-${domain}-${patient.id}`,
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: 'active',
            display: 'Active'
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            code: 'confirmed',
            display: 'Confirmed'
          }
        ]
      },
      category: [
        {
          coding: [
            {
              system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category',
              code: 'health-concern',
              display: 'Health Concern'
            },
            {
              system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes',
              code: 'sdoh-category-unspecified',
              display: 'Social Determinants of Health Category'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://hl7.org/fhir/sid/icd-10-cm',
            code: mapping.icd10.code,
            display: mapping.icd10.display
          },
          {
            system: 'http://snomed.info/sct',
            code: mapping.snomed.code,
            display: mapping.snomed.display
          }
        ],
        text: mapping.domainDisplay
      },
      subject: {
        reference: `Patient/${patient.id}`,
        display: `${patient.name[0]?.given?.join(' ') || ''} ${patient.name[0]?.family || ''}`.trim()
      },
      recordedDate: onsetDate
    };
  }

  /**
   * Generates a FHIR Observation for screening survey response
   */
  public static createSdohObservation(
    patient: Patient,
    answer: ScreeningAnswer
  ): Observation {
    const mapping = GRAVITY_SDOH_REGISTRY[answer.domain];

    return {
      resourceType: 'Observation',
      id: `sdoh-obs-${answer.domain}-${patient.id}`,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'survey',
              display: 'Survey'
            },
            {
              system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes',
              code: 'social-history',
              display: 'Social History'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: mapping.loincScreeningCode,
            display: mapping.screeningQuestion
          }
        ],
        text: mapping.screeningQuestion
      },
      subject: {
        reference: `Patient/${patient.id}`,
        display: `${patient.name[0]?.given?.join(' ') || ''} ${patient.name[0]?.family || ''}`.trim()
      },
      effectiveDateTime: answer.screeningDate,
      valueBoolean: answer.identifiedRisk,
      valueCodeableConcept: answer.identifiedRisk
        ? {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: mapping.snomed.code,
                display: mapping.snomed.display
              }
            ],
            text: mapping.domainDisplay
          }
        : undefined
    };
  }

  /**
   * Generates a FHIR ServiceRequest for a CBO Social Care Referral
   */
  public static createSdohServiceRequest(
    patient: Patient,
    domain: SdohDomain,
    practitionerName: string = 'Dr. Sarah Jenkins, MD',
    priority: 'urgent' | 'routine' = 'urgent'
  ): ServiceRequest {
    const mapping = GRAVITY_SDOH_REGISTRY[domain];

    return {
      resourceType: 'ServiceRequest',
      id: `sdoh-req-${domain}-${Date.now()}`,
      status: 'active',
      intent: 'order',
      priority,
      category: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '410606002',
              display: 'Social service procedure'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: mapping.recommendedIntervention.code,
            display: mapping.recommendedIntervention.display
          }
        ],
        text: mapping.recommendedIntervention.display
      },
      subject: {
        reference: `Patient/${patient.id}`,
        display: `${patient.name[0]?.given?.join(' ') || ''} ${patient.name[0]?.family || ''}`.trim()
      },
      authoredOn: new Date().toISOString(),
      requester: {
        reference: 'Practitioner/pract-7821',
        display: practitionerName
      },
      reasonCode: [
        {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/icd-10-cm',
              code: mapping.icd10.code,
              display: mapping.icd10.display
            }
          ]
        }
      ]
    };
  }
}
