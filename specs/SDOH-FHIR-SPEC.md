# Gravity Project FHIR SDOH Specification

## Overview
LifeContext conforms to the **HL7 FHIR R4 Gravity Project SDOH Clinical Care Implementation Guide (SDOH-CC)**.

## Key Resources and Coding Standards

### 1. Screening Assessment (`Observation`)
- **LOINC 93025-5**: Protocol for Responding to and Assessing Patients' Assets, Risks, and Experiences [PRAPARE].
- **LOINC 96777-8**: Accountable Health Communities (AHC) Health-Related Social Needs (HRSN) Screening Tool.

### 2. Social Needs Conditions (`Condition`)
- **Z59.41**: Food insecurity (SNOMED-CT: 733423003)
- **Z59.01**: Sheltered homelessness (SNOMED-CT: 32911000)
- **Z59.02**: Unsheltered homelessness (SNOMED-CT: 764350000)
- **Z59.82**: Transportation insecurity (SNOMED-CT: 713458007)
- **Z60.2**: Problems related to living alone / Social isolation (SNOMED-CT: 105529008)

### 3. Social Referrals (`ServiceRequest` & `Task`)
- `ServiceRequest.category`: `social-service`
- `ServiceRequest.code`: US Core / SNOMED-CT social intervention codes (e.g., `413294000` Community food pantry referral).
- `Task.intent`: `order`
- `Task.status`: mapped to LifeContext referral state machine (`requested`, `accepted`, `in-progress`, `completed`, `rejected`).
