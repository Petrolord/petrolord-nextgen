# compliance REVISE: where each digest gap is now closed, and the lessons to revise

Digest: `/root/as-wip-compliance/digest.txt`, rebuilt at engines **ab3ce6a**
(ASC-1): 988 lines, 24 sections. Line numbers below are that digest's. The
section numbering is unchanged, so every section a lesson cites still exists.

Rules for revision writers: quote the digest line, never this file. Every line
cited here is printed by a live engine call at the as-of date 2026-10-15. Where
the engine has no rule for something a gap asked about, the digest now says so
in a sentence next to a probe. Build the lesson from that sentence. Do not
invent a rule.

## A. LINES THAT CHANGED UNDER A LESSON (fix these first: the lesson now quotes a line the digest no longer prints)

| what changed | old digest text | new digest line | lessons quoting the old text |
|---|---|---|---|
| ASC-1: the Due soon reason for REG-2026-012 names the DEFAULT lead time | "inside the 30 day lead time set for this obligation." | 120 | beginner/m03-lead-time-and-the-current-period/l01-the-lead-time-sets-the-warning.md, beginner/m03-lead-time-and-the-current-period/l02-a-missing-lead-time.md |
| ASC-1 (E8): the unevidenced-claim blocker names the missing part | "1 clause is marked conformant with no evidence, date or assessor recorded." | 883 | advanced/m05-certification-readiness/l01-a-list-of-blockers.md, advanced/m05-certification-readiness/l02-blocking-serious-and-watch.md |
| ASC-1 (E3): an ISO audit that is Reported is not overdue | "Reported: true" (ISO isAuditOverdue) | 868 | advanced/m04-findings-and-root-causes/l04-a-findings-age-stops-at-closure.md (line 55, "The two modules agree on every row except Reported", is now false: they agree on every row) |
| ASC-1 (E3): ISO summarise audits overdue | "audits overdue 2" | 936 (summarise line, now "audits overdue 1") and 926 to 934 (the audits with planned end, open and overdue: ISA-2026-001 Reported is open and not overdue; ISA-2026-002 In progress is open and overdue) | advanced/m05-certification-readiness/l04-the-counts-beside-the-list.md |
| ASC-1: isoCompliance exports one more function | "\| isoCompliance \| 33 \| 24 \| 10 \|" | 19 ("\| isoCompliance \| 34 \| 25 \| 10 \|") | beginner/m01-what-the-register-derives/l01-five-apps-and-one-date.md (line 25) |
| ASC-1: golden case counts | "complianceStatus 159", "isoCompliance 216 / 32" | 974 and 977 (171; 235 / 33) | advanced/m06-the-expert-reading/l03-what-the-oracles-check.md (lines 12, 15, and line 24's "exports 33 functions", now 34). **URGENT: line 15 prints 32, which is now a GRADED value (obeakpu_clauses_covered moved 34 to 32). Revising the row to the digest's 33 removes it; until then the lesson prints an Expert capstone answer.** |
| Lab gap: the unresolved points are computed, not typed | "and W-09, S-10 and R-12 are still open." | 424 ("and W-09, S-10, R-12 are still unresolved.") | intermediate/m01-the-inspection-and-test-plan/l01-five-point-types-and-one-that-stops-work.md, intermediate/m01-the-inspection-and-test-plan/l05-progress-counted-from-the-points.md, intermediate/m02-closing-a-plan/l02-hold-points-outstanding.md |
| B4: the segregation header names the document | "Segregation of duties on revision rev-0019-10, authored by u-adaeze:" | 345 | beginner/m05-controlled-documents/l04-the-author-does-not-review.md |
| B5: the byReviewUrgency header states its rule | "byReviewUrgency:" | 367 | beginner/m05-controlled-documents/l05-the-review-queue.md |
| SECTION 23 title and its ASC-0 line | "...AND FIVE RULES THIS COURSE TEACHES WITHOUT GRADING"; "Five rules the engine keeps at 9d5d3b4..." | 938 (title), 957 | advanced/m06-the-expert-reading/l02-what-is-held-and-what-is-decided.md |

## B. THE GAPS, ONE BY ONE

### Associate (writer commit abe953791)

| gap | closed by digest line(s) | what the digest now prints | lessons that taught around it |
|---|---|---|---|
| B1 lead time 15 on REG-003 | 148 | the sweep row `15 \| On track`, between 14 and 16 | beginner/m03-lead-time-and-the-current-period/l01-the-lead-time-sets-the-warning.md, l03-the-edge-of-the-window.md |
| B2 REG-002 after filing and roll | 211, 212 | the rolled row's periodStart (2026-10-10), the filing on or after it, and the precedence stated and PROVED by a probe: the same row with lead_time_days 0 reads Compliant | beginner/m04-rolling-the-schedule-forward/l01-from-the-date-that-was-due.md, beginner/m02-an-obligations-status/l05-on-track-and-compliant-are-two-words.md |
| B3 a second roll from a pulled-back month end | 214 to 220 | 2026-01-31 to 02-28 to 03-28; 2026-02-28 to 03-28 to 04-28; 2026-08-31 to 2027-02-28 to 2027-08-28, and the sentence: each roll starts from the date it is given | beginner/m04-rolling-the-schedule-forward/l02-month-ends-pulled-back.md |
| B4 library documents to nextReviewDate, revision to document | 298 to 304, 345 | each document with an issue date, its recomputed review date against the recorded one (all three agree), the four with no issue date named; rev-0019-10 is ENG-PRO-0019, Hydrotest procedure, In Review, revision '09', next '10' | beginner/m05-controlled-documents/l02-the-review-date-earned-at-issue.md, l04-the-author-does-not-review.md, beginner/m06-the-associate-reading/l02-the-ikoro-library-end-to-end.md |
| B5 byReviewUrgency sort rule | 367 | the five states in order, then nearest review date, undated last | beginner/m05-controlled-documents/l05-the-review-queue.md |
| B6 regime per obligation | 265 to 280 | a table of code, obligation, regime and obligation type | beginner/m06-the-associate-reading/l01-the-ikoro-register-end-to-end.md |
| ENGINE COPY, default lead time (ASC-1 item 3) | 120, 967 | "inside the default 30 day lead time (none is set for this obligation)" | beginner/m03 l01, l02 (see table A) |

### Professional (writer commit defdc07ce)

| gap | closed by digest line(s) | what the digest now prints | lessons that taught around it |
|---|---|---|---|
| Q1 a failed point of another type | 426 to 430 | W-09, R-04, M-07 and S-10 each Failed in turn on an otherwise closable plan: each REFUSED with the failed-point reason | intermediate/m02-closing-a-plan/l01-a-failed-point-blocks-whatever-its-type.md |
| Q2 waiver with a reason and no record; waiving a hold point | 408 to 412 | refused without a date and verifier; a hold point waived with its record and reason is ALLOWED; without the reason refused; and the sentence: the engine has no rule forbidding a waived hold point | intermediate/m01-the-inspection-and-test-plan/l03-a-waiver-carries-its-reason.md, l04-setting-a-hold-point-aside.md |
| Q3 the Critical NCR closure walk | 499 to 503 | four steps, the first three refused with the engine's words, the last allowed | intermediate/m03-the-nonconformance/l02-severity-sets-what-closure-needs.md, l03-a-completed-action-and-a-working-one.md |
| Q4 an Observation NCR closure walk | 505 to 507 | refused with no disposition; allowed with a disposition and its date and nothing else | intermediate/m03-the-nonconformance/l02-severity-sets-what-closure-needs.md (no lesson taught it; add it there) |
| Q5 NCR-2026-031's next refusal | 516 | once k2 is Complete: "No corrective action has been verified effective yet..." | intermediate/m03-the-nonconformance/l03-a-completed-action-and-a-working-one.md, intermediate/m06-the-professional-reading/l01-the-abam-plan-end-to-end.md |
| Q6 audit closure with a lesser finding open | 625, 626 | reported with an open minor nonconformity and no stop-work: ALLOWED; with an open observation: ALLOWED | intermediate/m05-the-audit-and-the-programme/l03-what-closing-an-audit-needs.md |
| Q7 Major and Minor items answered Nonconformant | 593 | a probe checklist: 0 items listed, canReportAudit ALLOWED, and the sentence: the finding rule applies to Critical items only; the engine has no such rule for Major or Minor | intermediate/m04-the-checklist/l03-a-failed-critical-item-needs-a-finding.md, intermediate/m05-the-audit-and-the-programme/l02-what-reporting-an-audit-needs.md |
| Q8 answers outstanding 2 itemised | 590 | items 10 (Not applicable, a blank note) and 11 (Not applicable, no note) have a row that is not an answer; 13 and 14 have no row at all | intermediate/m06-the-professional-reading/l02-the-abam-audit-and-programme-end-to-end.md |
| Q9 one finding behind three counts | 678 | AF-2026-018, Major, Open, stop-work true, is the one finding behind open findings 1, open major 1 and stop-work open 1 | intermediate/m04-the-checklist/l04-stop-work-records-its-correction.md, intermediate/m06 l02 |
| Q10 half-up rounding placed in the Professional tier | 432 | "How a percent rounds": 1 of 8 prints 13; 23 of 40 prints 58; 3 of 8 prints 38; 5 of 8 prints 63 | intermediate/m01-the-inspection-and-test-plan/l05-progress-counted-from-the-points.md, intermediate/m04-the-checklist/l02-no-checklist-is-no-percentage.md |
| Q11 the outstanding rule where S17 is read | 680 | four audits: programmeProgress 2, summarise 2, canCompleteProgramme refused naming the rule | intermediate/m05-the-audit-and-the-programme/l05-a-programme-is-delivered-by-its-reports.md |

### Expert (writer commit 5a6e0cd3e)

| gap | closed by digest line(s) | what the digest now prints | lessons that taught around it |
|---|---|---|---|
| E1 canSetClauseStatus for Partially conformant | 730, 731 | refused with nothing recorded; allowed with evidence, a date and an assessor | advanced/m01-a-claim-is-evidence/l02-evidence-a-date-and-a-name.md |
| E2 findingByUrgency rule and the ranks of 003 and 005 | 844 to 851 | the rule (0 open Major overdue, 1 open Major, 2 other open overdue, 3 other open, 4 closed; then due date, raised date standing in), and a rank table: ISF-2026-003 rank 3 sorting on its raised date 2026-06-12, ISF-2026-005 rank 3 sorting on its due date 2026-12-11 | advanced/m04-findings-and-root-causes/l05-which-finding-comes-first.md |
| E3 ISO audits overdue after ASC-1, with planned ends | 868, 926 to 936, 965 | Reported reads false; each ORASHI audit with its planned end, open and overdue: open are ISA-2026-001 (Reported, not overdue) and ISA-2026-002 (In progress, overdue); summarise audits overdue 1; both modules agree on every status | advanced/m04-findings-and-root-causes/l04-a-findings-age-stops-at-closure.md, advanced/m05-certification-readiness/l04-the-counts-beside-the-list.md, intermediate/m05-the-audit-and-the-programme/l01-six-statuses-and-the-moves-between-them.md |
| E4 the action awaiting an effectiveness check | 824 | ac4, Preventive, on ISF-2026-004 | advanced/m05-certification-readiness/l04-the-counts-beside-the-list.md |
| E5 which clauses ISA-2026-S01 examined | 768 to 774 | every ORASHI audit's examinations; ISA-2026-S01 examined 6.1.2 only, on 2026-07-22 | advanced/m03-coverage-over-the-cycle/l01-only-internal-audits-count.md, l05-the-latest-examination-that-counts.md, advanced/m02-independence/l04-the-external-auditor.md |
| E6 daysUntil for clause reviews | 702 to 716 | each clause's next review, days until it, and both flags (4.3 at -14 overdue; 6.1.2 at 18 due soon) | advanced/m01-a-claim-is-evidence/l04-reviewing-the-register.md |
| E7 which exports lack a golden case | 980 to 986 | per module: exported functions, how many lack a case (0 in all six, a sort case counting for its sort), and the lists and constants, which are data and carry no case | advanced/m06-the-expert-reading/l03-what-the-oracles-check.md |
| E8 the readiness sentence and what 5.2 lacks | 718, 719, 883, 966 | missingEvidenceParts for 5.2: "evidence reference"; the blocker now reads "...with no evidence reference recorded." | advanced/m05-certification-readiness/l01-a-list-of-blockers.md, l02-blocking-serious-and-watch.md |

### The lab agent's gaps

| gap | closed by digest line(s) |
|---|---|
| isoCompliance.AUDIT_TYPES in full | 43 (plus AUDIT_OPEN_STATUSES 44 and AUDIT_UNDELIVERED_STATUSES 45) |
| qualityAssurance.CHECKPOINT_STATUSES in full | 35 |
| the typed "W-09, S-10 and R-12 are still open" | 424, computed from the plan |

### GATE: the litsweep tokenizer

The tokenizer is in the SHARED kit, which is not vendored into this wave:
`/root/dc-wavekit/litsweep.py`, line 123,
`NUM = re.compile(r'\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?')`. It cuts
6.1.2 into 6.1 and 2, and 8.1.4.3 into 8.1, 4.3. The fix is for the kit owner:
put a dotted-clause alternative first, `\d+(?:\.\d+){2,}`, and treat that token
as one literal that must appear whole in the digest. Nothing in this wave was
changed to work around it. Until the kit is fixed, a lesson literal like 6.1.2
is checked as 6.1 and 2, both of which the digest prints, so the sweep passes
without having checked the clause number.
