/**
 * Closed-Loop Referral Lifecycle Types
 * Scoped to Role 4: CBO Orchestration & Closed-Loop Network Engineer
 */

import { SdohDomain } from '../standards/gravity-sdoh';
import { HsdsService } from '../standards/hsds';

export type ReferralStatus =
  | 'INITIATED'      // Clinician ordered referral
  | 'ACCEPTED'       // CBO received & verified eligibility
  | 'SCHEDULED'      // Client intake / delivery appointment set
  | 'IN_PROGRESS'    // Service currently being delivered
  | 'FULFILLED'      // Closed-loop complete: service confirmed
  | 'DECLINED'       // CBO cannot fulfill (capacity, out of area)
  | 'EXPIRED';       // Exceeded SLA without acknowledgment

export interface ReferralTimelineEvent {
  timestamp: string;
  status: ReferralStatus;
  actor: string; // e.g. "Dr. Sarah Jenkins", "Metropolitan Food Bank Intake", "Automated Watchdog"
  notes: string;
  metadata?: Record<string, any>;
}

export interface ReferralTicket {
  id: string;
  patientId: string;
  patientName: string;
  domain: SdohDomain;
  sdohZCode: string;
  targetService: HsdsService;
  status: ReferralStatus;
  priority: 'urgent' | 'routine';
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // ISO string when next action must be taken
  isSlaBreached: boolean;
  timeline: ReferralTimelineEvent[];
  consentTokenId: string;
  cboContactPerson?: string;
  deliveryConfirmationNotes?: string;
}
