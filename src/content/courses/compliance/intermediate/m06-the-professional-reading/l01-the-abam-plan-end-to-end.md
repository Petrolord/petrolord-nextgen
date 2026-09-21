# The Abam plan end to end

This lesson reads QAP-2026-014 and its NCRs as one record at the as-of date 2026-10-15, the way a quality lead would read them before a progress meeting. Every figure below is the engine's, and every one is true at that date.

{{panel:compliance-plan-explorer}}

## The plan in one line

The engine prints the plan's reading: 6 of 12 points resolved, 50 percent. Hold points: H-01 Passed, H-03 Passed, H-05 Failed, H-08 Pending, H-11 Pending. Overdue points at the as-of date: H-05, S-10, R-12. summarise: checkpoints 12, outstanding 6, overdue 3, hold points outstanding 3, failed 1.

Read those counts against the types. The plan prints hold points 5 and hold points outstanding 3, and the outstanding three are H-05, H-08 and H-11. H-05 is failed and overdue. H-08 and H-11 are pending, overdue false, and they still hold the plan.

## What stands between the plan and closure

The closure walk is the plan's to-do list, in the engine's order:

| step | what the engine asks |
| --- | --- |
| 1 | resolve H-05, the failed radiography |
| 2 | resolve H-08 and H-11, the hold points outstanding |
| 3 | close or void the 3 open NCRs |
| 4 | ALLOWED |

Step 1 is "the most outstanding item on a plan", in the engine's words. Step 2 needs, for each hold point, a date and a verifier to pass it, or a date, a name and a reason to set it aside. Removing either is refused while the plan is Active. Step 3 reaches outside the plan into the NCR register.

W-09, S-10 and R-12 do not appear in the walk. At the allowed step planProgress reads resolved 9 of 12, percent 75, and W-09, S-10, R-12 are still unresolved. S-10 and R-12 are overdue at the as-of date, and the gate does not stop on either of them.

## The NCRs behind step 3

| code | severity | status | age in days | first closure answer |
| --- | --- | --- | --- | --- |
| NCR-2026-031 | Major | Actions in progress | 43 | refused on the open action k2 |
| NCR-2026-027 | Minor | Open | 64 | refused on the missing disposition |
| NCR-2026-019 | Critical | Disposition agreed | 117 | ALLOWED |

NCR-2026-019 is the oldest open NCR at 117 days and the first in ncrByUrgency, and it is also the one the engine will let close at the as-of date: k4, a corrective action, is verified effective. NCR-2026-031 waits on k2, its preventive action, which is In progress and overdue against 2026-10-05, while k1, its corrective action, is Complete and reads verified effective false. Finishing k2 is not the end: once k2 is Complete, the engine refuses NCR-2026-031 on "No corrective action has been verified effective yet." NCR-2026-027 has no disposition, so the gate reads nothing else about it until one is agreed and dated. Its age, 64 days, keeps growing while it waits.

The dashboard counts for the NCRs at the as-of date: NCRs 6, open 3, overdue 2, serious and open 2, concessions 2, oldest open 117 days, mean open age 75 days.

## What the meeting should hear

A quality lead reading this record reports three things. The plan is at 50 percent, with a failed hold point that the closure gate reads before anything else. H-08 and H-11 are pending and on schedule, and they still stop work. Of the three open NCRs, one may close at the as-of date by the engine's own answer, one waits on a late preventive action and then on the check that k1 worked, and one has not yet had its disposition agreed. None of that is typed. Each statement is an engine reading of a dated record at 2026-10-15.

## Exercise

Read two figures for NCR-2026-019: its age, 117 days, and its closure answer, ALLOWED. Then read NCR-2026-027's age, 64 days, and its first refusal, the disposition. Say what the pair shows about whether an NCR's age tells a reader how close it is to closure, and which records you read instead to know what each NCR still needs.
