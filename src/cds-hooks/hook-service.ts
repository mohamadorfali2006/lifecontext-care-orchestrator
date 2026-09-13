/**
 * CDS Hooks 1.0 Provider Service
 * Evaluates patient context during EHR chart opening and generates non-disruptive cards
 * Scoped to Role 3: EHR Clinical Workflow & SMART-on-FHIR Engineer
 */

import { CDSHookRequest, CDSHookResponse, CDSCard } from './types';
import { Patient, Condition } from '../fhir/types';
import { SdohDomain, GRAVITY_SDOH_REGISTRY } from '../standards/gravity-sdoh';

export class CdsHookService {
  /**
   * Evaluates patient-view hook
   */
  public static evaluatePatientView(
    request: CDSHookRequest,
    patient: Patient,
    activeSdohConditions: Condition[],
    hasActiveReferral: (domain: SdohDomain) => boolean
  ): CDSHookResponse {
    const cards: CDSCard[] = [];

    // Evaluate unaddressed SDOH needs
    activeSdohConditions.forEach(cond => {
      // Find matching domain from ICD-10
      const icdCode = cond.code.coding.find(c => c.system.includes('icd-10'))?.code;
      const domainEntry = Object.values(GRAVITY_SDOH_REGISTRY).find(g => g.icd10.code === icdCode);

      if (domainEntry && !hasActiveReferral(domainEntry.domain)) {
        const isUrgent = domainEntry.recommendedIntervention.defaultPriority === 'urgent';

        cards.push({
          uuid: `cds-card-${domainEntry.domain}-${patient.id}`,
          summary: `Unaddressed Social Need: ${domainEntry.domainDisplay} (${domainEntry.icd10.code})`,
          detail: `Patient screened positive for **${domainEntry.domainDisplay}**. No active closed-loop CBO referral is on file. Initiating early community navigation reduces 30-day readmission risk by up to 22% in value-based cohorts.\n\n*Basis: AAFP EveryONE Project & Gravity SDOH Clinical Guidelines.*`,
          indicator: isUrgent ? 'critical' : 'warning',
          source: {
            label: 'LifeContext Care Orchestrator',
            url: 'https://lifecontext.health/sdoh-evidence'
          },
          suggestions: [
            {
              label: `Dispatch ${domainEntry.domainDisplay} CBO Referral`,
              isRecommended: true,
              actions: [
                {
                  type: 'create',
                  description: domainEntry.recommendedIntervention.display
                }
              ]
            }
          ],
          links: [
            {
              label: 'Launch Embedded Care Orchestrator',
              url: `https://lifecontext.app/smart-launch?patient=${patient.id}&domain=${domainEntry.domain}`,
              type: 'smart'
            }
          ]
        });
      }
    });

    return { cards };
  }
}
