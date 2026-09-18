# What the dashboard counts

The NCR dashboard is a set of counts summarise derives from the NCRs and their actions at one as-of date. Each count has a rule about what it includes, and two of those rules shape the open and overdue counts: an NCR counts as open only while its status is an open one, and an action on a Voided NCR is left out of the action counts for open and overdue.

{{panel:compliance-plan-explorer}}

## The NCR counts at 2026-10-15

summarise prints: NCRs 6, open 3, overdue 2, serious and open 2, concessions 2, oldest open 117 days, mean open age 75 days.

| count | value | which NCRs |
| --- | --- | --- |
| open | 3 | NCR-2026-031, NCR-2026-027, NCR-2026-019 |
| overdue | 2 | NCR-2026-031, NCR-2026-019 |
| serious and open | 2 | NCR-2026-031 Major, NCR-2026-019 Critical |
| concessions | 2 | NCR-2026-022 Use as is, NCR-2026-006 Regrade |

The digest prints the ages the mean is taken over: 43, 64 and 117, their sum 224 over 3. The mean open age, 75 days, is a mean of open NCRs alone. The closed ages, 8, 2 and 48 days, are not in it. Oldest open, 117 days, is NCR-2026-019.

## The action counts

For the actions, summarise prints: 6 in total, open 2, overdue 1, awaiting an effectiveness check 1, verified effective 1, found ineffective 1. The open two are k2 and k6, and the overdue one is k2, the preventive action on NCR-2026-031, due 2026-10-05.

k5 is the case to read closely. It is a corrective action on NCR-2026-011, which is Voided. The digest prints: "isCapaOpen reads true and isCapaOverdue reads true, and summarise leaves it out of the open and overdue counts." Asked about k5 alone, the engine says the action is open and overdue. Asked for the dashboard, it leaves k5 out. The digest names the one fact that separates the two answers: the NCR k5 sits on is Voided.

The digest then runs the same actions through summarise with no NCRs supplied, and the counts read open 3, overdue 2. Its line on this: "A child whose parent is not supplied counts." Without the NCRs the engine has no way to know that k5's parent is Voided, so k5 is counted. A dashboard that summarises actions without their NCRs reports a figure the full register does not support.

## Sorted by urgency

ncrByUrgency lists the six NCRs in an order the engine derives:

| order | code | severity | status | overdue |
| --- | --- | --- | --- | --- |
| 1 | NCR-2026-019 | Critical | Disposition agreed | true |
| 2 | NCR-2026-031 | Major | Actions in progress | true |
| 3 | NCR-2026-027 | Minor | Open | false |
| 4 | NCR-2026-006 | Minor | Closed | false |
| 5 | NCR-2026-011 | Major | Voided | false |
| 6 | NCR-2026-022 | Observation | Closed | false |

The three open NCRs take orders 1 to 3, and among them the Critical comes first. The closed and voided NCRs follow at orders 4 to 6. A reader looking for the next thing to act on starts at the top and stops where the open rows end.

## One register, several readings

Each count answers a different question. Open 3 says how many NCRs are still being dealt with. Serious and open 2 picks out the Major and the Critical among them. Concessions 2 reaches back into closed NCRs to show where a departure was accepted. None of them is typed. The open, overdue and age figures are true at the as-of date 2026-10-15, and a dashboard read on another date, or after another action is recorded, prints its own.

## Exercise

Read the two action lines: summarise with the NCRs supplied, open 2 and overdue 1, and summarise with no NCRs supplied, open 3 and overdue 2. Name the action that accounts for the gap and its NCR's status. Say what the pair shows about why a dashboard needs the NCRs as well as the actions to count correctly.
