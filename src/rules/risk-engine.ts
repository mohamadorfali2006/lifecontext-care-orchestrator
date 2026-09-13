/**
 * Deterministic Clinical & Social Risk Engine
 * Implements transparent, explainable scoring conforming to 21st Century Cures Act non-SaMD CDS criteria
 * Scoped to Role 5: Clinical Logic & Regulatory CDS Compliance Lead
 */

import { Patient, Condition } from '../fhir/types';
import { SdohDomain } from '../standards/gravity-sdoh';

export interface FeatureAttribution {
  featureName: string;
  observedValue: string;
  weight: number; // Contribution to total score
  clinicalRationale: string;
}

export interface RiskEvaluationResult {
  patientId: string;
  totalScore: number; // 0 - 100
  riskTier: 'Low' | 'Moderate' | 'High' | 'Critical';
  identifiedDomains: SdohDomain[];
  attributions: FeatureAttribution[];
  guidelineCitations: string[];
  curesActExempt: boolean;
  exemptionBasis: string;
}

export class RiskEngine {
  /**
   * Deterministically calculates clinical-social compound risk
   */
  public static evaluateRisk(
    patient: Patient,
    activeConditions: Condition[],
    missedAppointmentsCount: number = 0
  ): RiskEvaluationResult {
    let score = 15; // Baseline population risk
    const attributions: FeatureAttribution[] = [];
    const identifiedDomains: SdohDomain[] = [];
    const citations: string[] = [
      'AAFP EveryONE Project SDOH Screening Protocol',
      'American Diabetes Association (ADA) Standards of Medical Care: SDOH Guidelines',
      'CMS Accountable Health Communities Model Evaluation'
    ];

    // Check chronic conditions
    const hasDiabetes = activeConditions.some(c => 
      c.code.coding.some(cd => cd.code.startsWith('E11') || cd.display?.toLowerCase().includes('diabetes'))
    );
    const hasHeartFailure = activeConditions.some(c => 
      c.code.coding.some(cd => cd.code.startsWith('I50') || cd.display?.toLowerCase().includes('heart failure'))
    );

    if (hasDiabetes) {
      score += 15;
      attributions.push({
        featureName: 'Type 2 Diabetes Mellitus (E11)',
        observedValue: 'Active',
        weight: 15,
        clinicalRationale: 'Metabolic disease requiring strict glycemic control, consistent meal access, and refrigerated medication.'
      });
    }

    if (hasHeartFailure) {
      score += 20;
      attributions.push({
        featureName: 'Congestive Heart Failure (I50)',
        observedValue: 'Active',
        weight: 20,
        clinicalRationale: 'High sensitivity to sodium intake and urgent requirement for regular outpatient monitoring to prevent readmission.'
      });
    }

    // Check SDOH Z-Codes
    activeConditions.forEach(cond => {
      const zCode = cond.code.coding.find(c => c.code.startsWith('Z'))?.code;

      if (zCode === 'Z59.41') {
        identifiedDomains.push('food-insecurity');
        const weight = hasDiabetes ? 30 : 20;
        score += weight;
        attributions.push({
          featureName: 'Food Insecurity (Z59.41)',
          observedValue: 'Positive screening (PRAPARE)',
          weight,
          clinicalRationale: hasDiabetes
            ? 'Compounded Risk: Skipping meals while on hypoglycemic agents creates life-threatening hypoglycemia hazards.'
            : 'Nutritional deficit directly impairs immune function and medication compliance.'
        });
      }

      if (zCode === 'Z59.82') {
        identifiedDomains.push('transportation-insecurity');
        const weight = missedAppointmentsCount > 1 ? 25 : 15;
        score += weight;
        attributions.push({
          featureName: 'Transportation Insecurity (Z59.82)',
          observedValue: `Lack of transit (${missedAppointmentsCount} missed clinical visits)`,
          weight,
          clinicalRationale: 'Barrier to pharmacy access and timely outpatient follow-up, causing avoidable ED utilization.'
        });
      }

      if (zCode === 'Z59.01' || zCode === 'Z59.02') {
        identifiedDomains.push('housing-instability');
        score += 30;
        attributions.push({
          featureName: 'Housing Instability / Homelessness (Z59.01)',
          observedValue: 'Sheltered homelessness',
          weight: 30,
          clinicalRationale: 'Extreme vulnerability to environmental stress, lack of safe medication storage, and care plan disruption.'
        });
      }

      if (zCode === 'Z60.2') {
        identifiedDomains.push('social-isolation');
        score += 15;
        attributions.push({
          featureName: 'Social Isolation (Z60.2)',
          observedValue: 'Living alone / limited caregiver proxy',
          weight: 15,
          clinicalRationale: 'Absence of informal caregiver safety net increases risk of unobserved decompensation.'
        });
      }
    });

    const totalScore = Math.min(100, score);
    let riskTier: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (totalScore >= 80) riskTier = 'Critical';
    else if (totalScore >= 60) riskTier = 'High';
    else if (totalScore >= 40) riskTier = 'Moderate';

    return {
      patientId: patient.id,
      totalScore,
      riskTier,
      identifiedDomains,
      attributions,
      guidelineCitations: citations,
      curesActExempt: true,
      exemptionBasis: 'Section 3060(a) Non-Device CDS: Rule scoring is fully auditable, deterministic, and transparently displays exact clinical reasoning and guideline citations for independent clinician review.'
    };
  }
}
