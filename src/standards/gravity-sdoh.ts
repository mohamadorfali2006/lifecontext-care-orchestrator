/**
 * Gravity Project SDOH Clinical Care Definitions
 * Conforms to HL7 FHIR SDOH Clinical Care Implementation Guide (SDOH-CC)
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

export type SdohDomain = 
  | 'food-insecurity' 
  | 'housing-instability' 
  | 'transportation-insecurity' 
  | 'social-isolation' 
  | 'financial-insecurity'
  | 'utility-insecurity';

export interface SdohCodeMapping {
  domain: SdohDomain;
  domainDisplay: string;
  icd10: {
    code: string;
    display: string;
  };
  snomed: {
    code: string;
    display: string;
  };
  loincScreeningCode: string;
  screeningQuestion: string;
  recommendedIntervention: {
    code: string;
    display: string;
    defaultPriority: 'urgent' | 'routine';
  };
}

export const GRAVITY_SDOH_REGISTRY: Record<SdohDomain, SdohCodeMapping> = {
  'food-insecurity': {
    domain: 'food-insecurity',
    domainDisplay: 'Food Insecurity',
    icd10: {
      code: 'Z59.41',
      display: 'Food insecurity'
    },
    snomed: {
      code: '733423003',
      display: 'Food insecurity (finding)'
    },
    loincScreeningCode: '88122-7',
    screeningQuestion: 'Within the past 12 months, you worried whether your food would run out before you got money to buy more?',
    recommendedIntervention: {
      code: '413294000',
      display: 'Referral to community food bank or medically tailored meal program',
      defaultPriority: 'urgent'
    }
  },
  'housing-instability': {
    domain: 'housing-instability',
    domainDisplay: 'Housing Instability / Homelessness',
    icd10: {
      code: 'Z59.01',
      display: 'Sheltered homelessness'
    },
    snomed: {
      code: '32911000',
      display: 'Homeless (finding)'
    },
    loincScreeningCode: '71802-3',
    screeningQuestion: 'What is your housing situation today? (Lack of stable housing, couch surfing, or imminent eviction)',
    recommendedIntervention: {
      code: '710911006',
      display: 'Referral to emergency housing assistance and legal eviction diversion',
      defaultPriority: 'urgent'
    }
  },
  'transportation-insecurity': {
    domain: 'transportation-insecurity',
    domainDisplay: 'Transportation Insecurity',
    icd10: {
      code: 'Z59.82',
      display: 'Transportation insecurity'
    },
    snomed: {
      code: '713458007',
      display: 'Lack of access to transportation (finding)'
    },
    loincScreeningCode: '93030-5',
    screeningQuestion: 'Has lack of transportation kept you from medical appointments, meetings, work, or getting things needed for daily living?',
    recommendedIntervention: {
      code: '413294004',
      display: 'Referral to non-emergency medical transportation (NEMT) transit co-op',
      defaultPriority: 'routine'
    }
  },
  'social-isolation': {
    domain: 'social-isolation',
    domainDisplay: 'Social Isolation',
    icd10: {
      code: 'Z60.2',
      display: 'Problems related to living alone'
    },
    snomed: {
      code: '105529008',
      display: 'Feeling isolated (finding)'
    },
    loincScreeningCode: '93025-5',
    screeningQuestion: 'How often do you feel that you lack companionship or feel left out?',
    recommendedIntervention: {
      code: '394802001',
      display: 'Referral to community health worker peer support and senior center outreach',
      defaultPriority: 'routine'
    }
  },
  'financial-insecurity': {
    domain: 'financial-insecurity',
    domainDisplay: 'Financial Strain',
    icd10: {
      code: 'Z59.86',
      display: 'Financial insecurity'
    },
    snomed: {
      code: '713444001',
      display: 'Financial difficulty (finding)'
    },
    loincScreeningCode: '76513-1',
    screeningQuestion: 'Do you ever have difficulty paying for essential prescriptions or utilities?',
    recommendedIntervention: {
      code: '710912004',
      display: 'Referral to prescription co-pay relief and Medicaid benefits advocacy',
      defaultPriority: 'routine'
    }
  },
  'utility-insecurity': {
    domain: 'utility-insecurity',
    domainDisplay: 'Utility Insecurity',
    icd10: {
      code: 'Z59.87',
      display: 'Material hardship: utility shut-off threat'
    },
    snomed: {
      code: '713452003',
      display: 'Inability to afford utilities (finding)'
    },
    loincScreeningCode: '93031-3',
    screeningQuestion: 'Has the electric, gas, oil, or water company threatened to shut off services in your home?',
    recommendedIntervention: {
      code: '710913009',
      display: 'Referral to Low-Income Home Energy Assistance Program (LIHEAP)',
      defaultPriority: 'urgent'
    }
  }
};
