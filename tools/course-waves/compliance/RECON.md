# `compliance` RECON: Compliance, Audit & Quality

Academy module `assurance`, path_order 60, slug `compliance`. Subject: five of
the ten `engines/assurance` modules plus the calendar they share, as vendored
sha-identical from petrolord-engines **6b00f43** (the squash merge of PR #211,
AS15, the commit the Suite pins): `complianceStatus.js`, `documentControl.js`,
`qualityAssurance.js`, `auditManagement.js`, `isoCompliance.js` and
`calendar.js`; their goldens under `test-data/assurance/goldens/`, their
oracles and FINDINGS under `tools/validation/assurance/`; and the live Suite
apps that call them under `src/pages/apps/assurance/` (Suite main 513d94d79).

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`, and every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**Nothing in these five apps is typed as a status: every status, count, age
and verdict is derived from a dated record read against one stated as-of date,
and every gate refuses until the evidence, the date and the named person it
asks for are on the record.**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

Five modules export 119 functions between them, auditManagement's count
including what it re-exports (SECTION 1 of the digest counts them). A 78-lesson course cannot give every
export a lesson, so the three tiers follow the order the apps are learned in and the order the dates get harder:

- **Associate, THE REGISTER AND THE CALENDAR** (complianceStatus,
  documentControl, calendar). A date is a day at local midnight; an obligation's
  status is derived with a fixed precedence; the lead time and the current
  period decide when "Due soon" and "Compliant" apply; the schedule rolls from
  the date that was due; a controlled document earns its review date at issue.
  Everything graded is a whole number of days from the as-of date.
- **Professional, THE PLAN, THE NONCONFORMANCE AND THE CHECKLIST**
  (qualityAssurance, auditManagement). A hold point stops work; progress is
  counted from the points and the answers; a plan, an NCR, an audit and a
  programme each close only through a gate; NCR ageing. Graded: percents and
  ages.
- **Expert, THE MANAGEMENT SYSTEM** (isoCompliance, and through it the finding
  rules auditManagement imports). A conformity claim is evidence, a date and a
  name; ISO 19011 independence for every examiner; coverage over the
  certification cycle from reported internal audits only; findings under ISO
  9001 section 10.2; readiness as a list of blockers. Graded: coverage counts,
  evidence counts and day counts.

**Taught but never graded:** every allowed/refused verdict (the grader takes
numbers only), every status word, the five sorts (`byUrgency`,
`byReviewUrgency`, `ncrByUrgency`, `findingByUrgency`, `findingByAttention`),
`countBy`, `documentPrefix`, `atLeastConfidential`, `nextRevisionNumber`,
the workflow tables. **Left out:** `startOfDay`, and the per-app colour and
token helpers, which stay in the Suite and are not in the engine.

## 1. What the modules compute

| module | functions | lists and constants | exports reading a date against today |
|---|---|---|---|
| calendar | 4 | 1 | 1 (`daysUntil`) |
| complianceStatus | 11 | 8 | 4 (`deriveStatus`, `explainStatus`, `byUrgency`, `summarise`) |
| documentControl | 14 | 7 | 4 (`reviewState`, `isReviewOverdue`, `summarise`, `byReviewUrgency`) |
| qualityAssurance | 28 | 24 | 7 (`isCheckpointOverdue`, `isNcrOverdue`, `ncrAgeDays`, `isCapaOverdue`, `summarise`, `ncrAgeing`, `ncrByUrgency`) |
| isoCompliance | 33 | 24 | 10 (`isReviewOverdue`, `isReviewDueSoon`, `isAuditOverdue`, `isFindingOverdue`, `findingAgeDays`, `clauseCoverage`, `clauseCoverageByStandard`, `certificationReadiness`, `summarise`, `findingByUrgency`) |
| auditManagement | 33 | 20 | 4 of its own (`isAuditOverdue`, `programmeProgress`, `summarise`, `findingByAttention`) plus re-exports |

Import edges: `complianceStatus`, `documentControl`, `qualityAssurance` ->
`calendar`; `isoCompliance` -> `qualityAssurance` (the CAPA rules, imported
rather than restated, and `isActionOverdue` IS `isCapaOverdue`);
`auditManagement` -> `isoCompliance` (`canCloseFinding`, the finding and
action vocabularies, `ROOT_CAUSE_CATEGORIES`, all the same objects). The
digest prints those identities as `true` from the modules themselves.

Return shapes that matter to grading: `explainStatus` -> `{status, reason,
daysUntil, nextActionDate}`; `rollForward`, `periodStart`, `nextReviewDate` ->
a Date or null; `planProgress`, `checklistProgress` -> counts plus `percent`
(null with nothing to count); `programmeProgress` -> counts plus `percent`
(reported over total); QA `summarise` -> counts plus `oldestOpenNcrDays`,
`meanOpenNcrAgeDays`; `ncrAgeDays`, `findingAgeDays` -> an integer;
`clauseCoverage` -> one row per applicable clause with `lastExaminedOn`,
`covered`, `stale`; `certificationReadiness` -> `{ready, blockers[{severity,
count, text}], counts{...18 keys}, coverage}`; every `can*` gate -> `{ok,
reason}`.

## 2. The live surface

| app | route | engine calls it makes (non-test source) |
|---|---|---|
| Regulatory Compliance | `/dashboard/apps/assurance/regulatory-compliance/*` | deriveStatus, explainStatus (detail page and form preview print the reason), summarise, rollForward (on recording a filing, from the due date), nextActionDate, byUrgency |
| Document Control | `/dashboard/apps/assurance/document-control/*` | reviewState, nextRevisionNumber, nextReviewDate (from the issue date), summarise, canAssignReviewer, canDecideReviewTask, byReviewUrgency |
| Quality Assurance Plan & NCR | `/dashboard/apps/assurance/qa-plan/*` | planProgress (register and detail), ncrAgeDays, canRaiseNcr, summarise (dashboard prints oldestOpenNcrDays and meanOpenNcrAgeDays), ncrByUrgency, canRemoveCheckpoint, canCloseNcr, canAdvancePlan, ncrAgeing, canDecideCheckpoint, canClosePlan |
| Audit & Findings Manager | `/dashboard/apps/assurance/audit-manager/*` | isAuditOverdue, checklistProgress, programmeProgress (programmes, dashboard, reports), canAdvanceAudit, unansweredItems, summarise, findingByAttention, findingAgeDays, canCloseFinding, canAdvanceProgramme, auditIndependence, criticalAnswersWithoutFindings, canRaiseFinding |
| ISO Compliance | `/dashboard/apps/assurance/iso-compliance/*` | certificationReadiness (dashboard and standards print counts.applicable, counts.covered, the certificate state), canSetClauseStatus, canAdvanceAudit, summarise, findingByUrgency, findingAgeDays, clauseCoverageByStandard (register prints lastExaminedOn), canCloseFinding, auditIndependence, isReviewOverdue, canExamineClause |

The Suite reads the machine date, for example `explainStatus(obligation, new
Date())` on the obligation detail page, which is right for an app. The course
never does: see 3a.

## 3. Findings

### 3a. The clock. NO CLOCK READ WITHOUT AN OVERRIDE.

Every export of the six modules that reads a date against today takes it as a
parameter defaulting to `new Date()`, and every internal call forwards it. This
was measured three ways rather than read:

- `clockguard.mjs` reads the parameter position of every such export OUT OF
  THE ENGINE SOURCE (30 exports) and wraps each one; the digest generator made
  274 gated calls to 28 of them and every one passed the as-of date by identity.
  `--plant-clock` makes one bare call and the generator refuses it.
- `gate_clock.sh` rebuilds the digest with the machine clock moved 400 days
  back and 900 days forward (a detector preload, never used to build): byte
  identical. The detector is shown to fire first.
- The only unguarded engine calls in the generator are the four that pass an
  unreadable today on purpose, and the gate proves no other exists.

So no clock read needed a fake timer; there is nothing to report under that
heading.

### 3b. R1: programmeProgress and summarise disagree on a cancellation with no reason. ENGINE SELF-CONTRADICTION, ORACLE GAP.

    node -e "const A=await import('/root/wt-as-compliance-nextgen/packages/engines/engines/assurance/auditManagement.js');
      const a=[{status:'Reported'},{status:'Cancelled'},{status:'Cancelled',cancellation_reason:'Plant shutdown'},{status:'Planned',planned_end:'2026-09-01'}];
      const t=new Date(2026,9,15); console.log(A.programmeProgress(a,t).outstanding, A.summarise({audits:a},t).auditsOutstanding)"
    # 2 1   (run as an ES module: node --input-type=module -e ...)

AS15 Q11 made a cancellation without a reason count as outstanding in
`programmeProgress` and `canCompleteProgramme`. `summarise().auditsOutstanding`
still counts it done. The Programmes page and the dashboard can therefore print
different outstanding counts for the same audits. The oracle's
`programme_progress` does not model the AS15 rule either (engine 2, oracle 1 on
the same input), and no golden case has a reasonless cancellation inside
`programmeProgress`, so the oracle has never checked `outstanding` there.
**Held: neither count is graded or taught as a figure.** The graded
`programmeProgress.percent` does not read the reason and the oracle agrees on it.
The digest prints R1 in SECTION 23. Latent in production today: the database
constraint `audit_records_cancel_needs_reason` refuses the row on the write path.

### 3c. R2: percent rounding at an exact half. KNOWN, UNPINNED.

`checklistProgress` on 57 answered of 200: engine 28, the audit oracle's exact
half-up 29. FINDINGS-audit ambiguity 2 calls it cosmetic and no golden pins it.
The quality oracle rounds the same way as the engine (float then half up), so
`planProgress` agrees with its oracle there. **Handled by construction:**
`oracle_check.py` refuses any graded checklist or programme percent that sits on
an exact half, and none does.

### 3d. R3: certificateExpiring is true for a lapsed certificate. LABEL AGAINST ITS OWN NUMBERS, LATENT.

    certificationReadiness({id:'s',certificate_expires:'2026-09-30'}, {clauses:[...]}, 2026-10-15)
    -> counts.certificateDays -15, certificateExpiring true, certificateExpired true

The readiness list names a lapsed certificate once, as `serious`; the counts
flag it as expiring as well as expired, because the flag is `certDays <= 90`
with no lower bound. The oracle mirrors the flag, so it is oracle-consistent and
still wrong as a label. The ISO app reads `certificateExpired` first
(`certificateState` in `isoPayload.js`), so nothing on screen is wrong today.
**Held: the flag is not taught as "inside the lead window" and is not graded;
`certificateDays` is graded and the oracle checks it.**

### 3e. R4: explainStatus prints "next due in -62 days" for a filed One-off. ENGINE PROSE DEFECT, LIVE.

    explainStatus({frequency:'One-off', due_date:'2026-08-14', last_submitted_date:'2026-08-10'}, 2026-10-15)
    -> { status: 'Compliant', reason: 'Last filed 2026-08-10, next due in -62 days.', daysUntil: -62 }

AS13-0 made a filed One-off Compliant after its due date; the Compliant reason
was written for a recurring obligation with a next due date ahead and was not
updated. Regulatory Compliance prints this reason on the obligation detail page
(`ComplianceDetail.jsx`, `explainStatus(obligation, new Date())`). **Held: the
status is taught, the sentence is printed once in the digest with a frame and
never taught as a reading; no reason text is graded, and no capstone obligation
is a filed One-off.** A one-line engine repair (a One-off branch in
`explainStatus`) would clear it; that is the lead's call.

### 3f. R5: ISO 9001 cited by name for any standard. PROSE, NOT GRADED.

`certificationReadiness` cites "ISO 9001 section 9.2" in the never-audited
blocker and `canSetClauseStatus` cites "ISO 9001:2015 section 4.3", whatever
standard the register holds (ORASHI is ISO 14001). Taught as the engine's own
wording.

### 3g. Two contracts that are not defects, stated so nobody grades against them

- **An unreadable today** is refused only by `deriveStatus` (AS15 Q1). Every
  other module answers as though nothing were due (`reviewState` -> "Review
  scheduled" on a 2020 review date; `isNcrOverdue` -> false). This is the
  FINDINGS-calendar ambiguity, decided for one module only. Taught as a limit.
- **A readable date STRING as today** throws a TypeError in every module
  (`today.getFullYear` / `d.getFullYear is not a function`). FINDINGS-compliance
  says so for `deriveStatus`; it holds for all six. The course always passes a
  Date built at local midnight.

## 4. FINDINGS held items and ambiguities in scope

From FINDINGS-compliance, -iso, -audit, -quality, -documents and -calendar at
6b00f43 (every knownDefect in them is now `repaired` and gated; the items below
are the ones still open):

- documentControl: `nextReviewDate` with no period returns null, and the
  24-month default is the caller's to apply; a fractional period truncates.
- auditManagement: percent rounding at an exact half (R2 above); a Complete
  programme with cancelled audits reads below 100 percent, by design; a
  templated audit passed with no items passes the unanswered rule vacuously.
- isoCompliance: two examinations of one clause on the same day keep the first
  row met; coverage falls back to `actual_end` when `examined_on` is missing
  (the schema makes `examined_on` mandatory).
- qualityAssurance: a closed NCR with no `closed_date` keeps ageing to today; an
  NCR raised in the future has a negative age; a CAPA verified true with no
  checker falls in no effectiveness bucket.
- calendar: an Invalid Date today returns NaN from `daysUntil` (3g).

None of these is on a graded path: no graded record lacks a closed date, a
period, an examination date or a checker, and no graded day count is negative
because of a future raise.

## 5. STATUS section 3n owner decisions that touch this scope

Q1 (unreadable today throws in deriveStatus), Q2 (evidence counts only for the
current period, `periodStart`), Q4 (coverage from Reported/Closed audits only),
Q5 (every examiner independent, `canExamineClause`), Q6 (an expired
certificate is serious, inside 90 days is watch), Q11 (N/A needs a reason; a
cancellation needs a reason), D1 (a document review task is decided only by its
assignee and never by the author). Q3 (fractional risk levels), Q9 (emergency
MOC) and Q10 (lesson validation) belong to `riskchange`. Every one in scope is
taught as a stated policy in digest SECTION 23 and the module that owns it.

## 6. The gradeable set, and why every graded field is an integer

**The academy grader is numeric only.** `public.academy_submit_capstone`
(migrations/20260822_dc1_deep_course_chassis.sql) reads each field's
`expected` and `tol` as `numeric` and the answer as `numeric`. A status word, a
date string or a boolean cannot be graded in this programme, whatever the brief
allows. So:

- **a date the engine returns is graded as the whole number of days
  `daysUntil` puts between it and the as-of date**, which is itself an engine
  return and oracle-checked (the oracle's `days_until` / date arithmetic);
- **enums and verdicts are taught and never graded**;
- **every graded value must also clear the go-live collision rule**: no graded
  value may equal the absolute value of any number token the digest prints,
  dates included (`2026-11-30` prints 2026, 11 and 30). That rules out every
  small count, so the graded counts are the ones a forty-clause register makes
  large (34, 35) and everything else is a day count or a percent.

Oracle coverage of every graded output, confirmed by calling the oracle, not
by reading goldens (`oracle_check.py`, 18 of 18):

| graded output | oracle function |
|---|---|
| explainStatus.daysUntil | oracle_compliance.explain |
| rollForward, periodStart (as days) | oracle_compliance.roll, period_start |
| nextReviewDate (as days) | oracle_documents.next_review |
| planProgress.percent (and the request gates) | oracle_quality.o_plan_progress, o_can_remove_checkpoint, o_can_decide |
| summarise.oldestOpenNcrDays, meanOpenNcrAgeDays | oracle_quality.o_summarise |
| checklistProgress.percent | oracle_audit.checklist_progress |
| programmeProgress.percent | oracle_audit.programme_progress |
| clauseCoverage lastExaminedOn (as days) | oracle_iso.certification_readiness -> coverage |
| findingAgeDays | oracle_iso.finding_age |
| certificationReadiness.counts.evidenced, covered, certificateDays | oracle_iso.certification_readiness |

Outputs deliberately NOT graded because the oracle does not check them or
disagrees: `programmeProgress.outstanding` and `summarise.auditsOutstanding`
(R1), every `reason` and blocker `text` (oracles strip prose), `certificateExpiring`
(R3), every sort order (checked by the goldens as orders, not a number).

## 7. The split with `riskchange`

This course owns audit independence, the audit and finding lifecycles and the
root-cause categories. It teaches Document Control's own reviewer rule because
it is documentControl code (AS15 D1); it does not teach the MOC or peer-review
approval rules, risk scoring, bands or appetite, and it grades nothing from
riskScoring, managementOfChange, peerReview or lessonsLearned. No NPV, Monte
Carlo or decision tree is anywhere in it.

## 8. Scope against the live catalogue

Swept on the worktree's `src/content/courses` with word boundaries: hold point,
witness point, ISO 19011, ISO 14001, ISO 45001, ISO 9001, non-conformance,
document control and regulatory obligation appear in ZERO live lessons. The
only hits for "root cause", "nonconformity" or "corrective action" are two
unrelated sentences (a pore-pressure blowout's root cause, a flow-assurance
refusal class). Free ground.

## 9. Vendoring

51 paths (50 discovered seeds plus the goldens runner the gate imports),
walked by `vendor/closure.py`, sha-identical with engines 6b00f43 and with the
Suite's vendoring, ledgered as `extra` in group `9-assurance-ahead-of-pin`
because the canonical pin 709172f predates the domain. Assurance suites 10 of
10 files, 2,391 of 2,391 tests green; the whole ledgered runner 125 suites,
6,344 tests, 24 failing, all 24 allow-listed from before this wave.
