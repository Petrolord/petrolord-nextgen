# `compliance` RECON: Compliance, Audit & Quality

Academy module `assurance`, path_order 60, slug `compliance`. Subject: five of
the ten `engines/assurance` modules plus the calendar they share, as vendored
sha-identical from petrolord-engines **9d5d3b4** (ASC-0, PR #212, which
repaired the five findings below; the foundation was first cut at 6b00f43): `complianceStatus.js`, `documentControl.js`,
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

### 3b to 3f. R1 to R5: REPAIRED UPSTREAM IN ASC-0 (engines PR #212, main 9d5d3b4)

This recon found five defects and reported them under rule 5. The lead ruled
on all five and the engine was repaired before a lesson was written. The
course now teaches the repaired behaviour as current behaviour (digest SECTION
23, "Five rules the engine keeps"), and none of the five is a held item any
longer. Each ruling, with the reproduction that now gives the repaired answer:

- **R1, one rule for "outstanding".** `programmeProgress`, `canCompleteProgramme`
  and `summarise` ask one predicate (`isOutstandingAudit`): an audit is
  outstanding until it is reported, closed, or cancelled WITH a written reason.
  The oracle models Q11. On four audits with one reasonless cancellation both
  counts now read 2 (they read 2 and 1 at 6b00f43). Not graded: see section 6.
- **R2, percents round half up on the exact rational.**
  `floor((200n + d) / 2d)` in checklistProgress, programmeProgress and
  planProgress, the only three exports that print a percent. 57 of 200 now
  prints 29 (it printed 28). The exact-half guard in `oracle_check.py` is
  RETIRED: engine and oracle round the same way by construction, and the
  per-field comparison would catch any divergence.
- **R3, `certificateExpiring` is `0 <= days <= 90`.** A lapsed certificate
  reads expiring false, expired true. Day 0 reads "The certificate expires
  today. Book the recertification audit now."
- **R4, a filed One-off is discharged in words too.** The reason reads
  "Filed <date>. A one-off obligation, nothing further is due." (was "next due
  in -62 days"). The dump now THROWS if any explainStatus reason prints a
  negative day count, so R4 cannot regress unseen.
- **R5, sentences name the register's standard.** `canSetClauseStatus` takes
  the standard record as a 4th argument; §9.2 is cited for ISO 9001, 14001 and
  45001, §4.3 for ISO 9001 only, and a call with no standard is neutral. The
  digest prints the Not applicable refusal for ISO 14001, ISO 9001, ISO 45001
  and no standard.

Also in ASC-0 and in scope: `calendar.localDateOf`, which reads a created_at
INSTANT as its local calendar date; `ncrAgeDays` now uses it for the
created_at fallback. No teaching or capstone NCR lacks a raised_date, so no
digest or graded value moved. The digest does not print a localDateOf example
on purpose: its answer depends on the time zone by design, and the digest must
be identical in every zone. Article agreement ("An archived", "An emergency")
and plural agreement in two readiness sentences are also repaired; none of
those sentences was quoted in a way a lesson depends on.

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
9d5d3b4 (every knownDefect in them is now `repaired` and gated; the items below
are the ones still open):

- documentControl: `nextReviewDate` with no period returns null, and the
  24-month default is the caller's to apply; a fractional period truncates.
- auditManagement: a Complete
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
  large (32, 35) and everything else is a day count or a percent.

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

Outputs deliberately NOT graded: `programmeProgress.outstanding` and
`summarise().auditsOutstanding`, which agree and are oracle-checked after ASC-0
but are 3 on the UTAPATE programme, a number the digest prints, so they cannot
clear the collision rule; every `reason` and blocker `text` (oracles strip
prose); `certificateExpiring`; every sort order.

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

At 9d5d3b4 (ASC-0): 53 paths (52 discovered seeds, now including the new
assurance.copy and assurance.instants suites, plus the goldens runner),
walked by `vendor/closure.py` and sha-identical with engines 9d5d3b4. The
vendor commit is the sibling's `chore(engines): vendor the assurance family
(engines 9d5d3b4)` (e2211cc0), cherry-picked, so `packages/engines` is the same
git tree on both branches (f37e30d0). Ledgered as `extra` in group
`9-assurance-ahead-of-pin` (53 entries) because the canonical pin 709172f
predates the domain. The Suite still vendors 6b00f43, so it matches 6 of the 53
paths until it re-vendors. Assurance suites 12 of 12 files, 2,569 of 2,569
tests green; the whole ledgered runner 127 suites, 6,522 tests, 24 failing,
all 24 allow-listed from before this wave.
