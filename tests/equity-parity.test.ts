import { describe, it, expect } from 'vitest';
import { DisparityMonitor } from '../src/equity/disparity-monitor';
import { ReferralTicket } from '../src/referrals/types';
import { CBO_SERVICE_DIRECTORY } from '../src/cbo/cbo-directory';

describe('Role 6 & 7: Health Equity Parity & Disparity Suites', () => {
  it('should calculate demographic completion rates and parity indices accurately', () => {
    const mockReferrals: ReferralTicket[] = [
      {
        id: 'REF-1',
        patientId: 'PT-1',
        patientName: 'Patient 1',
        domain: 'food-insecurity',
        sdohZCode: 'Z59.41',
        targetService: CBO_SERVICE_DIRECTORY[0],
        status: 'FULFILLED',
        priority: 'urgent',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-02T10:00:00Z',
        slaDeadline: '2026-09-04T10:00:00Z',
        isSlaBreached: false,
        timeline: [],
        consentTokenId: 'C1'
      },
      {
        id: 'REF-2',
        patientId: 'PT-2',
        patientName: 'Patient 2',
        domain: 'food-insecurity',
        sdohZCode: 'Z59.41',
        targetService: CBO_SERVICE_DIRECTORY[0],
        status: 'FULFILLED',
        priority: 'urgent',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-02T10:00:00Z',
        slaDeadline: '2026-09-04T10:00:00Z',
        isSlaBreached: false,
        timeline: [],
        consentTokenId: 'C2'
      }
    ];

    const cohortMap = {
      'PT-1': { race: 'Hispanic / Latino', language: 'Spanish', insurance: 'Medicaid Managed Care' },
      'PT-2': { race: 'Black / African American', language: 'English', insurance: 'Medicare Dual-Eligible' }
    };

    const report = DisparityMonitor.generateEquityReport(mockReferrals, cohortMap);

    expect(report.overallFulfillmentRate).toBe(1.0);
    expect(report.unacceptableDisparitiesDetected).toBe(false);

    const hispanicMetric = report.raceMetrics.find(r => r.cohortName === 'Hispanic / Latino');
    expect(hispanicMetric?.completionRate).toBe(1.0);
    expect(hispanicMetric?.parityDisparityIndex).toBe(1.0);
  });
});
