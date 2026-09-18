# Which finding comes first

A register of findings is read in an order. findingByUrgency sorts the ORASHI findings so the one that most needs attention is read first. This lesson reads the order the digest prints at the as-of date 2026-10-15, what it shows, and the rule that places each row.

{{panel:compliance-readiness-explorer}}

## The order

| order | code | type | status | overdue |
| --- | --- | --- | --- | --- |
| 1 | ISF-2026-004 | Major nonconformity | Action in progress | true |
| 2 | ISF-2026-003 | Opportunity for improvement | Open | false |
| 3 | ISF-2026-005 | Minor nonconformity | Open | false |
| 4 | ISF-2026-001 | Major nonconformity | Closed | false |
| 5 | ISF-2026-002 | Observation | Voided | false |

## What the order shows

Read the top and the bottom. ISF-2026-004 is first: it is open, it is a Major nonconformity, and it is the only finding that reads overdue true. The two findings that are closed or voided sit at the bottom, ISF-2026-001, Closed, then ISF-2026-002, Voided. The three open findings come before the two that are finished.

Read the two Major nonconformities. ISF-2026-004 is first. ISF-2026-001 is fourth. The type is the same, and the status decides the place: a closed finding needs nothing more, however serious it was.

## The rule

findingByUrgency gives each finding a rank. An open Major nonconformity that is overdue ranks 0, and one that is not overdue 1. Any other open finding that is overdue ranks 2, and any other open finding 3. A closed or voided finding ranks 4. Within a rank the earlier due date comes first, and the raised date stands in for a missing due date.

| code | open | overdue | rank | date it sorts by |
| --- | --- | --- | --- | --- |
| ISF-2026-004 | true | true | 0 | 2026-09-30 |
| ISF-2026-005 | true | false | 3 | 2026-12-11 |
| ISF-2026-001 | false | false | 4 | 2026-04-30 |
| ISF-2026-002 | false | false | 4 | 2026-06-10 (raised) |
| ISF-2026-003 | true | false | 3 | 2026-06-12 (raised) |

## Orders 2 and 3

ISF-2026-003, an Opportunity for improvement, comes before ISF-2026-005, a Minor nonconformity. Both are open and not overdue, and neither is a Major nonconformity, so both rank 3. ISF-2026-003 has no due date, so it sorts by its raised date, 2026-06-12. ISF-2026-005 sorts by its due date, 2026-12-11. The earlier date comes first.

The rule does not rank an Opportunity for improvement above a Minor nonconformity. Only a Major nonconformity has ranks of its own. The two types share rank 3, and a date decides between them.

The same date rule orders the bottom two. ISF-2026-001, Closed, and ISF-2026-002, Voided, both rank 4. ISF-2026-001 sorts by its due date, 2026-04-30, and ISF-2026-002 by its raised date, 2026-06-10, so ISF-2026-001 is fourth and ISF-2026-002 fifth.

## Why a sort is a teaching point

The Associate tier read the obligation register sorted worst first, and the Professional tier read ncrByUrgency. Each sort is useful only when the reader knows what put each row in its place. A sort whose rule is stated can be trusted to the last row. findingByUrgency's rule is stated, so every row here can be explained.

## The sort and the readiness list

The readiness list in module 5 does not reuse this order. It counts findings by what they block: an open Major nonconformity is a blocking item, an open Minor nonconformity a watch item, and a finding past its due date another watch item. The sort helps a person working down a queue. The list tells a certification body what stands in the way.

## Exercise

At 2026-10-15, read the five rows of findingByUrgency. Say what places order 1 first, and what places orders 4 and 5 last, using the status and overdue columns. Then read orders 2 and 3 beside their ranks and the dates they sort by, and say what places ISF-2026-003 before ISF-2026-005.
