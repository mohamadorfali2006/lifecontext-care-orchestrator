# CDS Hooks 1.0 & SaMD Exemption Specification

## Overview
LifeContext integrates with Electronic Health Record systems using the **HL7 CDS Hooks 1.0** specification.

## Supported Hooks
- `patient-view`: Evaluated upon opening a patient chart in Epic / Cerner. Flags unaddressed high-risk social needs.
- `order-select`: Evaluated when a clinician prescribes medication requiring strict refrigeration or nutrition-dependent dosing.

## Card Schema
- `summary`: One-line actionable synopsis.
- `indicator`: `info` | `warning` | `critical`.
- `source`: LifeContext Care Orchestrator (with clinical guidelines citation).
- `detail`: Markdown-formatted explainability rationale (feature attribution).
- `suggestions`: Instant-order buttons (e.g. "Order Medically Tailored Meals").
- `links`: SMART on FHIR launch URL to open the embedded LifeContext care management app.

## 21st Century Cures Act Non-Device CDS Exemption
Section 3060(a) of the 21st Century Cures Act excludes clinical decision support software from FDA medical device regulation if:
1. It is not intended to acquire, process, or analyze medical images or signals from in vitro diagnostics.
2. It is intended to display, analyze, or recommend clinical/social information.
3. It is intended to support or provide recommendations to a health care professional.
4. **The software enables health care professionals to independently review the basis for the recommendations.**

*LifeContext strictly satisfies condition #4 by exposing deterministic rules, exact scoring thresholds, and source guidelines in every CDS card.*
