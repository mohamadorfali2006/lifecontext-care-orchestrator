/**
 * HSDS 3.0 Resolver & Taxonomy Matcher
 * Resolves Gravity SDOH clinical domains to 211 / AIRS taxonomy terms and CBO resources
 * Scoped to Role 2: Health Informatics & Interoperability Architect
 */

import { SdohDomain } from '../standards/gravity-sdoh';
import { HsdsService, HsdsTaxonomy } from '../standards/hsds';

export const TAXONOMY_SDOH_MAP: Record<SdohDomain, HsdsTaxonomy[]> = {
  'food-insecurity': [
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
  'housing-instability': [
    {
      id: 'tax-housing-1',
      code: 'BH-1800.8500',
      name: 'Emergency Shelter / Eviction Defense',
      vocabulary: 'AIRS_211'
    },
    {
      id: 'tax-housing-2',
      code: 'BH-3800.8000',
      name: 'Transitional Housing',
      vocabulary: 'AIRS_211'
    }
  ],
  'transportation-insecurity': [
    {
      id: 'tax-transit-1',
      code: 'BT-8400.4500',
      name: 'Medical Appointment Transportation / NEMT',
      vocabulary: 'AIRS_211'
    },
    {
      id: 'tax-transit-2',
      code: 'BT-8500.1500',
      name: 'Discount Transit Passes',
      vocabulary: 'AIRS_211'
    }
  ],
  'social-isolation': [
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
  'financial-insecurity': [
    {
      id: 'tax-finance-1',
      code: 'NT-1800',
      name: 'Prescription Expense Assistance',
      vocabulary: 'AIRS_211'
    }
  ],
  'utility-insecurity': [
    {
      id: 'tax-utility-1',
      code: 'BV-8900.9300',
      name: 'Utility Bill Payment Assistance',
      vocabulary: 'AIRS_211'
    }
  ]
};

export class HsdsResolver {
  /**
   * Filters and ranks CBO services matching a patient's SDOH domain and requirements
   */
  public static matchServices(
    services: HsdsService[],
    domain: SdohDomain,
    patientLanguage?: string,
    postalCode?: string
  ): HsdsService[] {
    const targetTaxonomies = TAXONOMY_SDOH_MAP[domain].map(t => t.code);

    return services
      .filter(service => {
        // Must match taxonomy
        const hasTaxonomyMatch = service.taxonomy.some(t => 
          targetTaxonomies.includes(t.code) || t.vocabulary === 'OPEN_REFERRAL'
        );
        if (!hasTaxonomyMatch) return false;

        // Must be active and have capacity or open waitlist
        if (service.status === 'inactive') return false;

        // Language matching check
        if (patientLanguage && patientLanguage !== 'English') {
          const supportsLanguage = service.interpretationServices?.includes(patientLanguage);
          if (!supportsLanguage && service.status === 'waitlist-only') {
            return false;
          }
        }

        // Optional zip code match (if locations are defined)
        if (postalCode && service.locations.length > 0) {
          const inArea = service.locations.some(loc => loc.postalCode.substring(0, 3) === postalCode.substring(0, 3));
          if (!inArea) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by real-time available capacity and acceptance rate
        const aScore = a.currentCapacity.availableSlots * a.currentCapacity.acceptanceRateLast30Days;
        const bScore = b.currentCapacity.availableSlots * b.currentCapacity.acceptanceRateLast30Days;
        return bScore - aScore;
      });
  }
}
