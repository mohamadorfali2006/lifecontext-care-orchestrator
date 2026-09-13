/**
 * Authentic Clinical & Social Patient Cohorts for LifeContext OS
 * Conforms to HL7 FHIR R4 US Core and Gravity SDOH CC profiles
 * Scoped to Role 7: Verification & Health Equity QA Engineer
 * All clinical terminology, ICD-10-CM codes, and LOINC surveys reflect genuine clinical standards.
 */

import { Patient, Condition } from '../src/fhir/types';

export interface SyntheticPatientRecord {
  patient: Patient;
  insurancePlan: string;
  race: string;
  language: string;
  activeConditions: Condition[];
  missedAppointments: number;
}

export const SYNTHETIC_PATIENTS: SyntheticPatientRecord[] = [
  {
    patient: {
      resourceType: 'Patient',
      id: 'PT-MARIA-01',
      identifier: [
        {
          system: 'http://hospital.uic.edu/mrn',
          value: 'UIC-8821049',
          use: 'official'
        }
      ],
      name: [{ family: 'Sanchez', given: ['Maria', 'Elena'], use: 'official' }],
      birthDate: '1968-04-12',
      gender: 'female',
      telecom: [{ system: 'sms', value: '(312) 555-8901', use: 'mobile' }],
      address: [{ line: ['1422 W Cermak Rd, Apt 2B'], city: 'Chicago', state: 'IL', postalCode: '60608' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'es', display: 'Spanish' }], text: 'Spanish' }, preferred: true }]
    },
    insurancePlan: 'Cook County Health Medicaid Managed Care (Plan ID: IL-CCH-9921)',
    race: 'Hispanic / Latino',
    language: 'Spanish',
    missedAppointments: 2,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-t2d-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' }], text: 'Type 2 Diabetes Mellitus (HbA1c 9.4%)' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Elena Sanchez' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-food-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.41', display: 'Food insecurity' }], text: 'Severe Food Insecurity (PRAPARE LOINC: 88122-7 Positive)' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Elena Sanchez' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-transit-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.82', display: 'Transportation insecurity' }], text: 'Transportation Deficit: Inability to attend dialysis/primary care (AHC-HRSN 93030-5)' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Elena Sanchez' }
      }
    ]
  },
  {
    patient: {
      resourceType: 'Patient',
      id: 'PT-JAMES-02',
      identifier: [
        {
          system: 'http://hospital.uchicago.edu/mrn',
          value: 'UCH-4419208',
          use: 'official'
        }
      ],
      name: [{ family: 'Wilson', given: ['James', 'Robert'], use: 'official' }],
      birthDate: '1959-11-23',
      gender: 'male',
      telecom: [{ system: 'sms', value: '(312) 555-1234', use: 'mobile' }],
      address: [{ line: ['812 S Halsted St'], city: 'Chicago', state: 'IL', postalCode: '60607' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'en', display: 'English' }], text: 'English' }, preferred: true }]
    },
    insurancePlan: 'Humana Gold Plus Medicare-Medicaid Dual Advantage (Plan ID: IL-HMD-8812)',
    race: 'Black / African American',
    language: 'English',
    missedAppointments: 1,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-chf-james',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I50.9', display: 'Heart failure, unspecified' }], text: 'Congestive Heart Failure (NYHA Class II)' },
        subject: { reference: 'Patient/PT-JAMES-02', display: 'James Robert Wilson' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-housing-james',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.01', display: 'Sheltered homelessness' }], text: 'Imminent Eviction & Sheltered Homelessness (PRAPARE 71802-3)' },
        subject: { reference: 'Patient/PT-JAMES-02', display: 'James Robert Wilson' }
      }
    ]
  },
  {
    patient: {
      resourceType: 'Patient',
      id: 'PT-LINH-03',
      identifier: [
        {
          system: 'http://hospital.northwestern.edu/mrn',
          value: 'NMH-9102831',
          use: 'official'
        }
      ],
      name: [{ family: 'Nguyen', given: ['Linh', 'Thi'], use: 'official' }],
      birthDate: '1952-08-19',
      gender: 'female',
      telecom: [{ system: 'sms', value: '(773) 555-9876', use: 'mobile' }],
      address: [{ line: ['5020 N Broadway, Apt 4C'], city: 'Chicago', state: 'IL', postalCode: '60640' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'vi', display: 'Vietnamese' }], text: 'Vietnamese' }, preferred: true }]
    },
    insurancePlan: 'Aetna Better Health Medicaid (Plan ID: IL-ABH-3391)',
    race: 'Asian / Pacific Islander',
    language: 'Vietnamese',
    missedAppointments: 0,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-htn-linh',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I10', display: 'Essential (primary) hypertension' }], text: 'Essential Hypertension (Stage 2)' },
        subject: { reference: 'Patient/PT-LINH-03', display: 'Linh Thi Nguyen' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-social-linh',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z60.2', display: 'Problems related to living alone' }], text: 'Severe Social Isolation & Living Alone (PRAPARE 93025-5)' },
        subject: { reference: 'Patient/PT-LINH-03', display: 'Linh Thi Nguyen' }
      }
    ]
  }
];
