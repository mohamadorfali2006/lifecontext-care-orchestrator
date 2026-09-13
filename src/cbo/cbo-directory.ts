/**
 * Community-Based Organization (CBO) Directory
 * Conforms to Open Referral HSDS v3.0 standard
 * Scoped to Role 4: CBO Orchestration & Closed-Loop Network Engineer
 */

import { HsdsService } from '../standards/hsds';

export const CBO_SERVICE_DIRECTORY: HsdsService[] = [
  {
    id: 'cbo-food-01',
    organizationId: 'org-metro-food',
    name: 'Metropolitan Food Bank & Medically Tailored Pantry',
    alternateName: 'Metro Food Care',
    description: 'Provides bi-weekly medically tailored food boxes, fresh produce, and diabetes-safe groceries with doorstep delivery for Medicaid members.',
    url: 'https://metrofoodbank.org/medically-tailored',
    email: 'intake@metrofoodbank.org',
    status: 'active',
    interpretationServices: ['English', 'Spanish', 'Vietnamese', 'Cantonese'],
    applicationProcess: 'Direct electronic referral from clinician or social worker. Automatic intake verification within 24h.',
    waitTime: 'Same-day to 48 hours',
    contactPhone: '(555) 321-4567',
    taxonomy: [
      {
        id: 'tax-food-1',
        code: 'BD-1800.2000',
        name: 'Food Pantries',
        vocabulary: 'AIRS_211'
      },
      {
        id: 'tax-food-2',
        code: 'BD-5000.5300',
        name: 'Medically Tailored Meals',
        vocabulary: 'AIRS_211'
      }
    ],
    eligibility: {
      id: 'elig-food-01',
      serviceId: 'cbo-food-01',
      description: 'Residents within county limits experiencing food insecurity or living with chronic illness (Diabetes, CHF, Hypertension).',
      incomeThresholdPercentFPL: 200,
      qualifyingConditions: ['Diabetes Type 2', 'Hypertension', 'Congestive Heart Failure']
    },
    locations: [
      {
        id: 'loc-food-01',
        name: 'Central Distribution Warehouse',
        address: '450 Community Way',
        city: 'Metropolis',
        state: 'IL',
        postalCode: '60601',
        latitude: 41.8781,
        longitude: -87.6298,
        accessibility: ['Wheelchair accessible', 'Ramp access', 'Bilingual reception']
      }
    ],
    currentCapacity: {
      availableSlots: 45,
      maximumSlots: 150,
      acceptanceRateLast30Days: 0.94,
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'cbo-transit-01',
    organizationId: 'org-city-mobility',
    name: 'City Mobility Non-Emergency Medical Transit (NEMT)',
    alternateName: 'CareRide Transit Co-Op',
    description: 'Scheduled point-to-point wheelchair-accessible rides to dialysis, primary care appointments, and pharmacy visits.',
    url: 'https://careride.org',
    email: 'dispatch@careride.org',
    status: 'active',
    interpretationServices: ['English', 'Spanish'],
    applicationProcess: 'Electronic ride request scheduled at least 24 hours prior to clinical visit.',
    waitTime: '24 hours notice required',
    contactPhone: '(555) 789-0123',
    taxonomy: [
      {
        id: 'tax-transit-1',
        code: 'BT-8400.4500',
        name: 'Medical Appointment Transportation / NEMT',
        vocabulary: 'AIRS_211'
      }
    ],
    eligibility: {
      id: 'elig-transit-01',
      serviceId: 'cbo-transit-01',
      description: 'Active Medicaid / Medicare Dual-Eligible patients lacking independent private transit.',
      incomeThresholdPercentFPL: 250
    },
    locations: [
      {
        id: 'loc-transit-01',
        name: 'Metro Dispatch Terminal',
        address: '1200 Transit Plaza',
        city: 'Metropolis',
        state: 'IL',
        postalCode: '60607',
        latitude: 41.8756,
        longitude: -87.6499,
        accessibility: ['Full ADA fleet', 'Hydraulic lift vehicles']
      }
    ],
    currentCapacity: {
      availableSlots: 18,
      maximumSlots: 60,
      acceptanceRateLast30Days: 0.89,
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'cbo-housing-01',
    organizationId: 'org-stablesteps',
    name: 'StableSteps Family Housing Alliance & Eviction Defense',
    description: 'Emergency rental vouchers, legal eviction defense, and transitional supportive housing placement.',
    url: 'https://stablesteps.org',
    email: 'intake@stablesteps.org',
    status: 'active',
    interpretationServices: ['English', 'Spanish', 'Vietnamese'],
    applicationProcess: 'Rapid intake via coordinated entry with immediate 72-hour housing stabilizer support.',
    waitTime: '24-72 hours',
    contactPhone: '(555) 456-7890',
    taxonomy: [
      {
        id: 'tax-housing-1',
        code: 'BH-1800.8500',
        name: 'Emergency Shelter / Eviction Defense',
        vocabulary: 'AIRS_211'
      }
    ],
    eligibility: {
      id: 'elig-housing-01',
      serviceId: 'cbo-housing-01',
      description: 'Families or individuals with court eviction notice or currently unhoused.',
      incomeThresholdPercentFPL: 150
    },
    locations: [
      {
        id: 'loc-housing-01',
        name: 'Southside Resource Center',
        address: '890 Hope Boulevard',
        city: 'Metropolis',
        state: 'IL',
        postalCode: '60616',
        latitude: 41.8385,
        longitude: -87.6272,
        accessibility: ['Wheelchair accessible']
      }
    ],
    currentCapacity: {
      availableSlots: 6,
      maximumSlots: 25,
      acceptanceRateLast30Days: 0.82,
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'cbo-social-01',
    organizationId: 'org-carebridge',
    name: 'CareBridge Community Health Worker Peer Network',
    description: 'Culturally congruent Community Health Workers (CHWs) providing weekly home visits, chronic care navigation, and social isolation reduction.',
    url: 'https://carebridgepeers.org',
    email: 'chw@carebridgepeers.org',
    status: 'active',
    interpretationServices: ['English', 'Spanish', 'Vietnamese'],
    applicationProcess: 'Warm handoff referral from clinical team.',
    waitTime: 'Within 5 business days',
    contactPhone: '(555) 901-2345',
    taxonomy: [
      {
        id: 'tax-social-1',
        code: 'PS-8200.7000',
        name: 'Senior Companion Program',
        vocabulary: 'AIRS_211'
      },
      {
        id: 'tax-social-2',
        code: 'PN-8100.0500',
        name: 'Community Health Worker Support',
        vocabulary: 'AIRS_211'
      }
    ],
    eligibility: {
      id: 'elig-social-01',
      serviceId: 'cbo-social-01',
      description: 'Adults 55+ or patients living alone with multiple chronic conditions.'
    },
    locations: [
      {
        id: 'loc-social-01',
        name: 'East Community Hub',
        address: '320 Harmony Lane',
        city: 'Metropolis',
        state: 'IL',
        postalCode: '60611',
        latitude: 41.8953,
        longitude: -87.6189,
        accessibility: ['Full ADA accessibility']
      }
    ],
    currentCapacity: {
      availableSlots: 12,
      maximumSlots: 40,
      acceptanceRateLast30Days: 0.96,
      lastUpdated: new Date().toISOString()
    }
  }
];
