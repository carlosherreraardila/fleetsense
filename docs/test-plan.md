# FleetSense — QA Test Plan

**Project:** FleetSense — IoT Telemetry Dashboard
**Author:** Carlos Herrera Ardila
**Status:** Living document
**Last updated:** 2026-06

---

## 1. Purpose

This document defines the quality assurance strategy for the FleetSense web application and its supporting APIs. It establishes what we test, how we test it, the environments involved, and the criteria used to consider a release acceptable.

FleetSense is a single-page application (SPA) that surfaces real-time IoT telemetry from connected devices. It serves data over REST and WebSocket channels, backed by a time-series datastore. Quality risk is concentrated in three areas: authentication and role-based access, correctness of large data surfaces (paginated tables, exports), and reliability of real-time data delivery.

## 2. Scope

### In scope

- Authentication flows and JWT-based session handling.
- Role-based access control (admin vs. viewer).
- Route protection and navigation in the React SPA.
- Telemetry data table: server-side pagination, sorting, filtering.
- CSV export correctness against the underlying data source.
- REST API contract and authorization behavior.
- Real-time telemetry delivery over WebSocket.
- Cross-environment regression (dev, staging, production-like).

### Out of scope

- Load and performance testing (tracked separately).
- Penetration / security testing beyond authorization checks.
- Firmware and hardware-level validation (owned by the embedded team).

## 3. Test strategy

| Layer | Tooling | What it covers |
| --- | --- | --- |
| End-to-end (E2E) | Playwright + TypeScript | User-facing flows: login, RBAC, navigation, table interaction, export, real-time updates |
| API | Playwright API testing | REST endpoints, status codes, payload shape, JWT authorization |
| Component | Vitest + React Testing Library | Isolated rendering and state behavior of key components |
| Manual / exploratory | Documented test cases | Edge cases, usability, and scenarios not yet automated |

The automation suite follows the **Page Object Model (POM)** to keep selectors and interactions isolated from assertions, improving maintainability. Stable `data-testid` attributes are used as the primary selector strategy to decouple tests from copy and styling changes.

## 4. Environments

| Environment | Purpose | Notes |
| --- | --- | --- |
| Local (dev) | Day-to-day development and authoring | App served by Vite on `localhost` |
| Staging | Pre-release regression | Production-like data and configuration |
| Production | Smoke and observability checks | Read-only validation; no destructive tests |

## 5. Entry and exit criteria

**Entry criteria (before a regression run):**

- The target build is deployed and reachable in the environment.
- Test data and credentials are provisioned.
- The automated suite is green on the previous build.

**Exit criteria (to consider a build acceptable):**

- 100% of critical-path E2E tests pass.
- No open defects of severity Critical or High.
- All new acceptance criteria have corresponding test coverage.
- The suite passes in CI (GitHub Actions) without flakiness on retry.

## 6. Risk-based prioritization

| Risk area | Severity if it fails | Coverage priority |
| --- | --- | --- |
| A user accesses data outside their role | Critical | Highest |
| Exported CSV does not match displayed data | High | High |
| Real-time telemetry stalls silently | High | High |
| Pagination returns duplicate or missing rows | Medium | Medium |
| Cosmetic / layout issues | Low | Low |

## 7. Defect management

Defects are reported with: a clear title, environment, preconditions, reproduction steps, expected vs. actual result, severity, and supporting evidence (screenshot, trace, or console log). Playwright traces are attached for failing automated tests to speed up triage.

## 8. Traceability

Each documented test case maps to one or more automated tests where automation exists. This traceability ensures that manual design intent and automated coverage stay aligned, and makes coverage gaps visible.