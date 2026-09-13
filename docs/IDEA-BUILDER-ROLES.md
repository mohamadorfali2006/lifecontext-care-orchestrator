# LifeContext Care Orchestrator: IdeaBuilder Multi-Agent Role Assignments

In accordance with the **IdeaBuilder methodology**, the 7 AI Agent roles are derived directly from the project's critical risk areas rather than from a static template. Each agent has an explicit file-scope lock to prevent parallel collision and ensure strict accountability.

---

## The 7 Specialized Agent Roles

| Role # | Role Title & Risk Addressed | Mandate & Responsibilities | Strict File-Scope Lock | Source Code Permissions |
|---|---|---|---|---|
| **Role 1** | **Lead Orchestrator & Governance Coordinator (CEO)**<br>*Risk: Scope creep, coordination collapse, agent collision* | Single point of contact, orchestrates handoffs, tracks milestone gates, and verifies the IdeaBuilder DONE bar. | `docs/*`, `specs/*`, `HANDOFF.md`, `README.md` | **READ ONLY** (No source code edits) |
| **Role 2** | **Health Informatics & Interoperability Architect**<br>*Risk: Healthcare standards mismatch, brittle integrations* | Canonical FHIR R4 ingestion (US Core), Gravity Project SDOH Implementation Guide profiles, Open Referral HSDS v3.0, and 211 taxonomy normalization. | `src/interop/*`, `src/fhir/*`, `src/standards/*` | Locked to Interop & Standards |
| **Role 3** | **EHR Clinical Workflow & SMART-on-FHIR Engineer**<br>*Risk: Clinician workflow friction, portal abandonment* | Zero-click embedding inside EHR charts (Epic, Cerner, athenahealth) via SMART on FHIR R4 and CDS Hooks 1.0 (`patient-view`, `order-select`). | `src/clinical-ui/*`, `src/cds-hooks/*` | Locked to Clinical UI & Hooks |
| **Role 4** | **CBO Orchestration & Closed-Loop Network Engineer**<br>*Risk: Referral black hole, CBO update latency* | Bidirectional referral state machine (`Initiated` → `Accepted` → `Scheduled` → `Fulfilled`), webhook dispatchers, and SLA escalation tracking. | `src/cbo/*`, `src/orchestration/*`, `src/referrals/*` | Locked to CBO & Referrals |
| **Role 5** | **Clinical Logic & Regulatory CDS Compliance Lead**<br>*Risk: FDA SaMD reclassification, HIPAA/Part 2 data leaks* | Deterministic clinical risk rule engine with full feature attribution, 21st Century Cures Act non-SaMD CDS exemption compliance, and 42 CFR Part 2 privacy filters. | `src/rules/*`, `src/compliance/*`, `src/audit/*`, `src/security/*` | Locked to Rules & Compliance |
| **Role 6** | **Health Equity, Consent & Patient Experience Engineer**<br>*Risk: Digital divide, non-English exclusion, consent erosion* | Multilingual patient/caregiver progressive web app, plain-language granular consent ledger with instant revocation, SMS fallback simulator, and equity parity dashboard. | `src/patient-ui/*`, `src/equity/*`, `src/consent/*` | Locked to Patient UI & Equity |
| **Role 7** | **Verification & Health Equity QA Engineer**<br>*Risk: False-green claims, untested regressions, demographic bias* | Synthetic patient test cohorts (Synthea + Gravity SDOH), mock EHR & CBO integration tests, end-to-end referral closure suites, and equity fairness audits. | `tests/*`, `test-fixtures/*`, `scripts/verify.ts` | **TESTS ONLY** (Forbidden from app code) |

---

## Collaboration & Handshake Rules
1. **No Overlapping Edits:** An agent must never modify a file outside its file-scope lock.
2. **Deterministic Interfaces:** Roles communicate via strongly-typed TypeScript interfaces defined in their respective directories.
3. **QA is Tests-Only:** Role 7 tests the system strictly through public APIs, exported functions, and UI contracts.
4. **The DONE Bar:** No phase is considered complete without passing:
   - `npm run typecheck` (strict TypeScript, 0 errors)
   - `npm run lint` (oxlint, 0 errors)
   - `npm test` (vitest, 100% passing)
   - Live simulated closed-loop referral run verified end to end.
