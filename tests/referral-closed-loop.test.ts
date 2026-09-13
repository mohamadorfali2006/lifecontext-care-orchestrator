import { describe, it, expect } from 'vitest';
import { ReferralStateMachine } from '../src/orchestration/referral-state-machine';
import { CBO_SERVICE_DIRECTORY } from '../src/cbo/cbo-directory';
import { SYNTHETIC_PATIENTS } from '../test-fixtures/synthetic-patients';

describe('Role 4 & 7: Closed-Loop Referral Lifecycle Suites', () => {
  const maria = SYNTHETIC_PATIENTS[0].patient;
  const foodCbo = CBO_SERVICE_DIRECTORY[0];

  it('should initialize an INITIATED referral ticket with a 24-hour acceptance SLA', () => {
    const ticket = ReferralStateMachine.createTicket(
      maria,
      'food-insecurity',
      foodCbo,
      'Dr. Sarah Jenkins, MD',
      'CONSENT-TEST-01'
    );

    expect(ticket.id).toContain('REF-FOOD');
    expect(ticket.status).toBe('INITIATED');
    expect(ticket.patientId).toBe('PT-MARIA-01');
    expect(ticket.isSlaBreached).toBe(false);
    expect(ticket.timeline.length).toBe(1);
    expect(ticket.timeline[0].actor).toBe('Dr. Sarah Jenkins, MD');

    const createdTime = new Date(ticket.createdAt).getTime();
    const slaDeadlineTime = new Date(ticket.slaDeadline).getTime();
    const diffHours = (slaDeadlineTime - createdTime) / (1000 * 60 * 60);
    expect(diffHours).toBeCloseTo(24, 0);
  });

  it('should progress smoothly through the full closed-loop lifecycle to FULFILLED', () => {
    let ticket = ReferralStateMachine.createTicket(
      maria,
      'food-insecurity',
      foodCbo,
      'Dr. Sarah Jenkins, MD',
      'CONSENT-TEST-01'
    );

    // 1. CBO Accepts
    ticket = ReferralStateMachine.transition(ticket, 'ACCEPTED', 'CBO Intake Coordinator', 'Verified Medicaid eligibility');
    expect(ticket.status).toBe('ACCEPTED');
    expect(ticket.timeline.length).toBe(2);

    // 2. CBO Schedules
    ticket = ReferralStateMachine.transition(ticket, 'SCHEDULED', 'CBO Logistics', 'Delivery route scheduled for Thursday');
    expect(ticket.status).toBe('SCHEDULED');
    expect(ticket.timeline.length).toBe(3);

    // 3. Driver In Progress
    ticket = ReferralStateMachine.transition(ticket, 'IN_PROGRESS', 'Route Driver #4', 'Out for delivery');
    expect(ticket.status).toBe('IN_PROGRESS');

    // 4. Fulfillment / Closed Loop Complete
    ticket = ReferralStateMachine.transition(ticket, 'FULFILLED', 'Patient & Driver Signoff', 'Food box hand-delivered to patient');
    expect(ticket.status).toBe('FULFILLED');
    expect(ticket.deliveryConfirmationNotes).toContain('hand-delivered');
    expect(ticket.timeline.length).toBe(5);
  });

  it('should reject invalid illegal state transitions', () => {
    const ticket = ReferralStateMachine.createTicket(
      maria,
      'food-insecurity',
      foodCbo,
      'Dr. Sarah Jenkins, MD',
      'CONSENT-TEST-01'
    );

    // Cannot jump from INITIATED directly to FULFILLED without intake acceptance
    expect(() => {
      ReferralStateMachine.transition(ticket, 'FULFILLED', 'Rogue Actor', 'Premature closure');
    }).toThrow(/Invalid referral state transition/);
  });
});
