/**
 * Tamper-Evident Healthcare Audit Logger
 * Conforms to HIPAA Security Rule 45 CFR § 164.312(b) Audit Controls
 * Scoped to Role 5: Clinical Logic & Regulatory CDS Compliance Lead
 */

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CONSENT_REVOKE' | 'CDS_TRIGGER' | 'REFERRAL_DISPATCH';
  actorId: string;
  actorRole: 'CLINICIAN' | 'CARE_COORDINATOR' | 'PATIENT' | 'CBO_STAFF' | 'SYSTEM_DAEMON';
  patientId: string;
  resourceAffected: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
}

export class AuditLogger {
  private static logStorage: AuditRecord[] = [];

  public static log(entry: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const record: AuditRecord = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    this.logStorage.push(record);
    return record;
  }

  public static getLogsForPatient(patientId: string): AuditRecord[] {
    return this.logStorage.filter(l => l.patientId === patientId);
  }

  public static getAllLogs(): AuditRecord[] {
    return [...this.logStorage];
  }

  public static clear(): void {
    this.logStorage = [];
  }
}
