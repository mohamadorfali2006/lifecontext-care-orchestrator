/**
 * Synthetic Patient Fixtures for Clinical & Social Care Orchestration
 * Scoped to Role 7: Verification & Health Equity QA Engineer
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
      name: [{ family: 'Sanchez', given: ['Maria', 'Elena'] }],
      birthDate: '1968-04-12',
      gender: 'female',
      telecom: [{ system: 'sms', value: '(555) 234-8901', use: 'mobile' }],
      address: [{ line: ['1422 West Cermak Rd'], city: 'Metropolis', state: 'IL', postalCode: '60608' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'es', display: 'Spanish' }], text: 'Spanish' }, preferred: true }]
    },
    insurancePlan: 'Cook County Health Medicaid MCO',
    race: 'Hispanic / Latino',
    language: 'Spanish',
    missedAppointments: 2,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-t2d-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' }], text: 'Type 2 Diabetes Mellitus' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Sanchez' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-food-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.41', display: 'Food insecurity' }], text: 'Food Insecurity (PRAPARE positive)' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Sanchez' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-transit-maria',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.82', display: 'Transportation insecurity' }], text: 'Transportation Insecurity' },
        subject: { reference: 'Patient/PT-MARIA-01', display: 'Maria Sanchez' }
      }
    ]
  },
  {
    patient: {
      resourceType: 'Patient',
      id: 'PT-JAMES-02',
      name: [{ family: 'Wilson', given: ['James', 'Robert'] }],
      birthDate: '1959-11-23',
      gender: 'male',
      telecom: [{ system: 'sms', value: '(555) 876-1234', use: 'mobile' }],
      address: [{ line: ['812 South Halsted St'], city: 'Metropolis', state: 'IL', postalCode: '60607' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'en', display: 'English' }], text: 'English' }, preferred: true }]
    },
    insurancePlan: 'Humana Gold Plus Medicare-Medicaid Dual',
    race: 'Black / African American',
    language: 'English',
    missedAppointments: 1,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-chf-james',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I50.9', display: 'Heart failure, unspecified' }], text: 'Congestive Heart Failure' },
        subject: { reference: 'Patient/PT-JAMES-02', display: 'James Wilson' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-housing-james',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z59.01', display: 'Sheltered homelessness' }], text: 'Housing Instability / Sheltered Homelessness' },
        subject: { reference: 'Patient/PT-JAMES-02', display: 'James Wilson' }
      }
    ]
  },
  {
    patient: {
      resourceType: 'Patient',
      id: 'PT-LINH-03',
      name: [{ family: 'Nguyen', given: ['Linh', 'Thi'] }],
      birthDate: '1952-08-19',
      gender: 'female',
      telecom: [{ system: 'sms', value: '(555) 432-9876', use: 'mobile' }],
      address: [{ line: ['5020 North Broadway'], city: 'Metropolis', state: 'IL', postalCode: '60640' }],
      communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'vi', display: 'Vietnamese' }], text: 'Vietnamese' }, preferred: true }]
    },
    insurancePlan: 'Aetna Better Health Medicaid',
    race: 'Asian / Pacific Islander',
    language: 'Vietnamese',
    missedAppointments: 0,
    activeConditions: [
      {
        resourceType: 'Condition',
        id: 'cond-htn-linh',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/core/CodeSystem/condition-category', code: 'problem-list-item', display: 'Problem List' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'I10', display: 'Essential (primary) hypertension' }], text: 'Essential Hypertension' },
        subject: { reference: 'Patient/PT-LINH-03', display: 'Linh Nguyen' }
      },
      {
        resourceType: 'Condition',
        id: 'cond-sdoh-social-linh',
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
        category: [{ coding: [{ system: 'http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes', code: 'sdoh-category-unspecified', display: 'Social Determinant' }] }],
        code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: 'Z60.2', display: 'Problems related to living alone' }], text: 'Severe Social Isolation / Living Alone' },
        subject: { reference: 'Patient/PT-LINH-03', display: 'Linh Nguyen' }
      }
    ]
  }
];
