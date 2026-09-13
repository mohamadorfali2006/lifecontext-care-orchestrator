# LifeContext Care Orchestrator: System Architecture

## Architectural Vision
LifeContext Care Orchestrator is a zero-friction, closed-loop clinical and social care coordination platform designed to bridge clinical EHR systems (Epic, Cerner, athenahealth) and Community-Based Organizations (CBOs).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLINICAL ENVIRONMENT                          │
│                                                                        │
│   EHR System (Epic / Cerner)                                           │
│   ┌───────────────────────────┐         ┌──────────────────────────┐   │
│   │ SMART on FHIR Embedded App│◄───────►│ CDS Hooks 1.0 Provider   │   │
│   │ (Clinician Dashboard)     │         │ (patient-view evaluator) │   │
│   └─────────────┬─────────────┘         └─────────────┬────────────┘   │
└─────────────────┼─────────────────────────────────────┼────────────────┘
                  │                                     │
                  ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   LIFECONTEXT ORCHESTRATION ENGINE                     │
│                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ Interoperability Hub  │   │ Deterministic Clinical & SDOH Engine │  │
│  │ - FHIR R4 (US Core)   │──►│ - 21st Century Cures Act CDS exempt  │  │
│  │ - Gravity SDOH IG     │   │ - Chronicity x Social Risk Matrix    │  │
│  │ - HSDS 3.0 Resolver   │   │ - 100% Auditable Feature Attribution │  │
│  └──────────┬────────────┘   └──────────────────┬───────────────────┘  │
│             │                                   │                      │
│             ▼                                   ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Bidirectional Closed-Loop Referral State Machine                 │  │
│  │ (Draft -> Initiated -> Accepted -> Scheduled -> Fulfilled)       │  │
│  │ - SLA Escalation Watchdog    - Granular Consent Provenance       │  │
│  │ - 42 CFR Part 2 Sanitize     - Tamper-Evident Audit Ledger       │  │
│  └──────────────────┬───────────────────────────┬───────────────────┘  │
└─────────────────────┼───────────────────────────┼──────────────────────┘
                      │                           │
                      ▼                           ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│      COMMUNITY CBO PORTAL       │   │     PATIENT & CAREGIVER PWA      │
│ - HSDS 3.0 Resource Directory   │   │ - Low-literacy / Plain-Language  │
│ - Capacity & Eligibility Matrix │   │ - Multilingual (EN / ES / VI)    │
│ - Direct Callback Status Update │   │ - Granular Consent Revocation    │
│ - Referral Fulfillment Tracking │   │ - Simulated SMS Fallback Channel │
└─────────────────────────────────┘   └──────────────────────────────────┘
```

## Core Architectural Layers
1. **Clinical Integration Layer (SMART on FHIR + CDS Hooks):**
   - Launches natively inside EHR patient charts without switching browser tabs.
   - Employs `patient-view` hooks to present actionable care-gap intervention cards in real time.
2. **Interoperability & Standards Normalization Layer:**
   - **Gravity Project FHIR SDOH IG:** Maps PRAPARE and AHC-HRSN screenings to standard `Observation`, `Condition`, and `ServiceRequest` resources with ICD-10 Z-codes (Z59.41 Food insecurity, Z59.01 Homelessness, Z59.82 Transportation insecurity).
   - **Open Referral HSDS 3.0:** Normalizes CBO resource directories to standard taxonomy terms (AIRS/211).
3. **Closed-Loop Referral State Machine:**
   - Moves referral tickets through strict lifecycle states, tracking SLA timestamps, delivering webhook status callbacks, and escalating stale referrals.
4. **Governance, Security & Equity Dashboard:**
   - Enforces 42 CFR Part 2 privacy restrictions on substance use and behavioral health data.
   - Maintains continuous outcome parity analytics across race, ethnicity, language, and insurance status.
