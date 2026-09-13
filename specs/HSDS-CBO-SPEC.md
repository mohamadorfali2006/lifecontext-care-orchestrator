# Open Referral HSDS 3.0 & CBO Specification

## Overview
LifeContext integrates with Community-Based Organizations through the **Open Referral Human Services Data Specification (HSDS v3.0)** standard.

## Core Schema Entities
- `Organization`: The legal entity providing services (e.g., Regional Food Bank).
- `Service`: The specific program offered (e.g., Medically Tailored Grocery Delivery).
- `Location`: Physical and virtual sites with geo-coordinates and accessibility features.
- `Eligibility`: Concrete eligibility rules (income thresholds, age, zip codes, chronic disease diagnosis).
- `Taxonomy`: Standard 211 / AIRS taxonomy terms categorizing human service domains.

## Bidirectional Closed-Loop Referral Protocol
1. **Referral Dispatch:** Sends payload containing patient contact, authorized SDOH domain, and consent verification token.
2. **CBO Status Webhook / Callback:** CBO updates status:
   - `ACCEPTED` (SLA: <= 24 hours)
   - `SCHEDULED` (SLA: <= 72 hours)
   - `FULFILLED` (Service delivered, loop closed)
   - `DECLINED` (Reason code: Capacity, Out of Area, Ineligible)
3. **Escalation Trigger:** If a referral remains unacknowledged past SLA thresholds, an automatic high-priority task is queued for the clinical social worker.
