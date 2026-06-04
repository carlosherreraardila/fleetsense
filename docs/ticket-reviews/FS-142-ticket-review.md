# Ticket Review — FS-142: Telemetry table CSV export

> This document demonstrates the pre-development ticket review process: assessing testability, flagging missing acceptance criteria, and identifying edge cases *before* development begins.

---

## Ticket as received

**FS-142 — Add CSV export to the telemetry table**

> As a user, I want to export the telemetry table to CSV so I can analyze the data in a spreadsheet. Add an "Export CSV" button above the table.

**Type:** Story
**Reporter:** Product
**Components:** Web / Dashboard

---

## QA assessment

### Testability verdict: **Not ready — needs clarification before development starts**

The intent is clear, but the ticket lacks the detail needed to write deterministic acceptance tests. Building against it as-is would likely produce rework. Below are the gaps and proposed acceptance criteria.

### Missing acceptance criteria

The ticket does not specify:

1. **Scope of the export.** Does it export the current page only, all filtered rows, or the entire dataset? This materially changes both implementation and testing.
2. **Effect of active filters and sorting.** Should the CSV reflect the table's current filter/sort state, or always export the raw, unsorted dataset?
3. **Column set and headers.** Which columns are included, in what order, and what are the exact header labels?
4. **Role permissions.** Is export available to all roles, or admin-only? (This intersects with role-based access control.)
5. **Data formatting.** How are timestamps formatted? What is the decimal precision for sensor values? What delimiter and encoding (UTF-8)?
6. **Empty / large datasets.** What is the expected behavior when there are zero rows, or tens of thousands of rows?

### Edge cases to cover

- Export while a filter returns zero results → file with headers only, or a disabled button with a clear message.
- Values containing commas, quotes, or line breaks → must be correctly escaped so the CSV does not break.
- Very large exports → confirm the UI does not freeze and the request does not time out.
- Concurrent state change → user clicks export, then changes the filter before the file is generated.
- Special characters / non-ASCII device names → verify UTF-8 integrity in the downloaded file.

### Cross-layer validation note

Because the displayed table is backed by a time-series datastore with server-side pagination, the exported CSV must be validated **against the source data**, not just against what is visible on screen. A passing visual check is not sufficient; the export contents should reconcile with the API/database output for the same query.

---

## Proposed acceptance criteria (rewritten)

```
GIVEN a user viewing the telemetry table
WHEN they click "Export CSV"
THEN a UTF-8 CSV file is downloaded containing all rows matching the
     currently applied filters and sort order
AND the columns and headers match the table's visible columns
AND timestamps use ISO 8601 format and sensor values keep 2-decimal precision
AND values containing commas, quotes, or newlines are properly escaped

GIVEN a filter that returns zero rows
WHEN the user clicks "Export CSV"
THEN a file containing only the header row is downloaded

GIVEN a viewer-role user (if export is admin-only)
THEN the "Export CSV" button is not visible
```

---

## Recommendation

Return the ticket to refinement with the proposed acceptance criteria attached. Once confirmed, this becomes directly automatable: an E2E test that triggers the download and validates the file contents, plus a cross-check of the exported rows against the API response for the same query.