# LifeContext Care Orchestrator

> **Zero-Friction, Closed-Loop Clinical & Social Determinants of Health (SDOH) Orchestration Platform**

Built following the **IdeaBuilder Multi-Agent Methodology**, LifeContext Care Orchestrator coordinates clinical care teams inside EHRs (via SMART on FHIR and CDS Hooks) with Community-Based Organizations (via Open Referral HSDS v3.0 and the Gravity Project FHIR SDOH IG).

---

## Key Capabilities
- **SMART on FHIR Clinical Embedding:** Zero-click clinical dashboard and CDS Hook cards integrated directly into provider charts.
- **Gravity Project FHIR SDOH Compliance:** Native ingestion of PRAPARE and AHC-HRSN screenings with ICD-10 Z-codes (Z59.41, Z59.01, Z59.82).
- **Open Referral HSDS 3.0 & 211 Taxonomy:** Standard CBO service discovery with real-time capacity and eligibility verification.
- **Bidirectional Closed-Loop Referral State Machine:** Eliminates the "referral black hole" with automated SLA escalation and webhook status updates.
- **21st Century Cures Act Non-Device CDS Engine:** 100% deterministic, auditable risk rules with full feature attribution.
- **Equity-First Multilingual Patient & Caregiver PWA:** Plain-language consent ledger with granular revocation and simulated SMS fallback.
- **Continuous Algorithmic Parity Dashboard:** Tracks referral completion metrics across demographic cohorts.

---

## Multi-Agent Architecture (IdeaBuilder)
This repository was built by 7 dynamically derived AI agents with non-overlapping file-scope locks:
- **Role 1 (CEO):** Governance, architecture specifications, handoffs (`docs/*`, `specs/*`, `README.md`).
- **Role 2 (Interoperability):** FHIR R4, Gravity SDOH IG, HSDS 3.0 (`src/interop/*`, `src/fhir/*`, `src/standards/*`).
- **Role 3 (Clinical UI):** SMART on FHIR header, CDS Hook cards (`src/clinical-ui/*`, `src/cds-hooks/*`).
- **Role 4 (CBO Network):** Referral state machine, CBO portal (`src/cbo/*`, `src/orchestration/*`, `src/referrals/*`).
- **Role 5 (CDS & Compliance):** Deterministic risk engine, Cures Act compliance, HIPAA/Part 2 filter (`src/rules/*`, `src/compliance/*`, `src/security/*`, `src/audit/*`).
- **Role 6 (Patient Equity):** Multilingual patient UX, consent ledger, equity metrics (`src/patient-ui/*`, `src/equity/*`, `src/consent/*`).
- **Role 7 (Equity QA):** Synthetic cohorts, closed-loop integration tests (`tests/*`, `test-fixtures/*`, `scripts/verify.ts`).

---

## Verification & Commands
```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Run all automated tests
npm test

# Run end-to-end verification script
npx tsx scripts/verify.ts

# Launch dev server
npm run dev
```
