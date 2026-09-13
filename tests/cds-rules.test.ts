import { describe, it, expect } from 'vitest';
import { RiskEngine } from '../src/rules/risk-engine';
import { CuresActCdsValidator } from '../src/compliance/cures-act-cds';
import { SYNTHETIC_PATIENTS } from '../test-fixtures/synthetic-patients';

describe('Role 5 & 7: Deterministic CDS & Regulatory Exemption Suites', () => {
  const mariaRecord = SYNTHETIC_PATIENTS[0];

  it('should compute compounded clinical-social risk deterministically with feature attributions', () => {
    const result = RiskEngine.evaluateRisk(
      mariaRecord.patient,
      mariaRecord.activeConditions,
      mariaRecord.missedAppointments
    );

    expect(result.patientId).toBe('PT-MARIA-01');
    expect(result.totalScore).toBeGreaterThanOrEqual(80); // High/Critical due to T2D + Food + Transit
    expect(result.riskTier).toBe('Critical');
    expect(result.identifiedDomains).toContain('food-insecurity');
    expect(result.identifiedDomains).toContain('transportation-insecurity');

    // Feature attribution checks
    expect(result.attributions.length).toBeGreaterThanOrEqual(3);
    const diabetesAttr = result.attributions.find(a => a.featureName.includes('Diabetes'));
    expect(diabetesAttr).toBeDefined();
    expect(diabetesAttr?.weight).toBe(15);

    const foodAttr = result.attributions.find(a => a.featureName.includes('Food Insecurity'));
    expect(foodAttr).toBeDefined();
    expect(foodAttr?.clinicalRationale).toContain('hypoglycemia');

    // 21st Century Cures Act CDS Exemption Check
    expect(result.curesActExempt).toBe(true);
    expect(result.guidelineCitations.length).toBeGreaterThan(0);
  });

  it('should pass all 4 criteria for 21st Century Cures Act § 3060(a) Non-Device CDS Exemption', () => {
    const checks = CuresActCdsValidator.runCertification();

    expect(checks.length).toBe(4);
    checks.forEach(check => {
      expect(check.isCompliant).toBe(true);
      expect(check.evidence.length).toBeGreaterThan(10);
    });
  });
});
