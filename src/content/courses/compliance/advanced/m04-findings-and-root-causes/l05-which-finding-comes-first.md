# Which finding comes first

A register of findings is read in an order. findingByUrgency sorts the ORASHI findings so the one that most needs attention is read first. This lesson reads the order the digest prints at the as-of date 2026-10-15, what it shows, and one thing it does not settle.

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

## What the order does not settle

Now read orders 2 and 3. ISF-2026-003, an Opportunity for improvement, comes before ISF-2026-005, a Minor nonconformity. Both are Open, both read overdue false, and both were raised 2026-06-12. ISF-2026-005 is due 2026-12-11. ISF-2026-003 has no due date.

The digest prints the order and does not state the rule that places these two. A reader could guess that a missing due date sorts first, or guess some other key. This course does not say which. Do not read orders 2 and 3 as a statement that an Opportunity for improvement outranks a Minor nonconformity in severity: nothing printed says so, and isoCompliance.FINDING_TYPES lists Minor nonconformity before Opportunity for improvement.

When you need to know which of two open findings matters more, for a report or a management review, read their types, due dates and overdue flags yourself, and treat the sort as a reading aid.

## Why a sort is a teaching point

The Associate tier read the obligation register sorted worst first, and the Professional tier read ncrByUrgency. Each sort is useful only when the reader knows what put each row in its place. A sort whose rule is stated can be trusted to the last row. A sort whose rule is not stated can be trusted only as far as the rows you can explain, and here that is the top row and the bottom two.

## The sort and the readiness list

The readiness list in module 5 does not reuse this order. It counts findings by what they block: an open Major nonconformity is a blocking item, an open Minor nonconformity a watch item, and a finding past its due date another watch item. The sort helps a person working down a queue. The list tells a certification body what stands in the way.

## Exercise

At 2026-10-15, read the five rows of findingByUrgency. Say what places order 1 first, and what places orders 4 and 5 last, using the status and overdue columns. Then read orders 2 and 3 beside their due dates in the findings table and say what the digest does and does not tell you about why they sit in that order.
