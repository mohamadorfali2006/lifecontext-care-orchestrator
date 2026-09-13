/**
 * Bidirectional Referral Lifecycle State Machine
 * Guarantees closed-loop accountability with SLA enforcement
 * Scoped to Role 4: CBO Orchestration & Closed-Loop Network Engineer
 */

import { ReferralTicket, ReferralStatus, ReferralTimelineEvent } from '../referrals/types';
import { SdohDomain, GRAVITY_SDOH_REGISTRY } from '../standards/gravity-sdoh';
import { HsdsService } from '../standards/hsds';
import { Patient } from '../fhir/types';

export class ReferralStateMachine {
  // SLA thresholds in hours
  private static readonly SLA_HOURS_ACCEPTANCE = 24;
  private static readonly SLA_HOURS_FULFILLMENT_URGENT = 72;
  private static readonly SLA_HOURS_FULFILLMENT_ROUTINE = 120;

  /**
   * Initializes a new closed-loop referral ticket
   */
  public static createTicket(
    patient: Patient,
    domain: SdohDomain,
    targetService: HsdsService,
    orderingPractitioner: string,
    consentTokenId: string
  ): ReferralTicket {
    const mapping = GRAVITY_SDOH_REGISTRY[domain];
    const priority = mapping.recommendedIntervention.defaultPriority;
    const now = new Date();
    
    // First SLA: CBO acknowledgment within 24 hours
    const slaDeadline = new Date(now.getTime() + this.SLA_HOURS_ACCEPTANCE * 60 * 60 * 1000);

    const initialEvent: ReferralTimelineEvent = {
      timestamp: now.toISOString(),
      status: 'INITIATED',
      actor: orderingPractitioner,
      notes: `Referral initiated for ${mapping.domainDisplay} (${mapping.icd10.code}) to ${targetService.name}. Consent verified: ${consentTokenId}.`
    };

    const patientName = `${patient.name[0]?.given?.join(' ') || ''} ${patient.name[0]?.family || ''}`.trim();

    return {
      id: `REF-${domain.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      patientId: patient.id,
      patientName,
      domain,
      sdohZCode: mapping.icd10.code,
      targetService,
      status: 'INITIATED',
      priority,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaDeadline: slaDeadline.toISOString(),
      isSlaBreached: false,
      timeline: [initialEvent],
      consentTokenId
    };
  }

  /**
   * Transition state with strict business logic validation
   */
  public static transition(
    ticket: ReferralTicket,
    nextStatus: ReferralStatus,
    actor: string,
    notes: string,
    metadata?: Record<string, any>
  ): ReferralTicket {
    const validTransitions: Record<ReferralStatus, ReferralStatus[]> = {
      INITIATED: ['ACCEPTED', 'DECLINED', 'EXPIRED'],
      ACCEPTED: ['SCHEDULED', 'IN_PROGRESS', 'DECLINED', 'EXPIRED'],
      SCHEDULED: ['IN_PROGRESS', 'FULFILLED', 'DECLINED', 'EXPIRED'],
      IN_PROGRESS: ['FULFILLED', 'DECLINED'],
      FULFILLED: [], // Terminal closed-loop state
      DECLINED: [],  // Terminal failure state
      EXPIRED: ['INITIATED']   // Can be re-dispatched
    };

    if (!validTransitions[ticket.status].includes(nextStatus)) {
      throw new Error(`Invalid referral state transition from ${ticket.status} to ${nextStatus}`);
    }

    const now = new Date();
    let newSlaDeadline = ticket.slaDeadline;

    // Reset SLA deadline when transitioning to ACCEPTED
    if (nextStatus === 'ACCEPTED') {
      const fulfillmentHours = ticket.priority === 'urgent' 
        ? this.SLA_HOURS_FULFILLMENT_URGENT 
        : this.SLA_HOURS_FULFILLMENT_ROUTINE;
      newSlaDeadline = new Date(now.getTime() + fulfillmentHours * 60 * 60 * 1000).toISOString();
    }

    const newEvent: ReferralTimelineEvent = {
      timestamp: now.toISOString(),
      status: nextStatus,
      actor,
      notes,
      metadata
    };

    return {
      ...ticket,
      status: nextStatus,
      updatedAt: now.toISOString(),
      slaDeadline: newSlaDeadline,
      timeline: [...ticket.timeline, newEvent],
      deliveryConfirmationNotes: nextStatus === 'FULFILLED' ? notes : ticket.deliveryConfirmationNotes
    };
  }

  /**
   * Check for SLA breaches
   */
  public static evaluateSla(ticket: ReferralTicket): ReferralTicket {
    if (ticket.status === 'FULFILLED' || ticket.status === 'DECLINED') {
      return { ...ticket, isSlaBreached: false };
    }

    const now = new Date();
    const deadline = new Date(ticket.slaDeadline);
    const breached = now > deadline;

    return {
      ...ticket,
      isSlaBreached: breached
    };
  }
}
