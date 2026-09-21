# What closing an audit needs

Reporting says what the audit found. Closing says that everything it found has been dealt with. canCloseAudit is the gate between Reported and Closed, the last move in the audit workflow, and it reads the findings the audit raised.

{{panel:compliance-plan-explorer}}

## The rows

| request | canCloseAudit |
| --- | --- |
| before it is reported | REFUSED |
| reported, with both major findings open | REFUSED |
| reported, with both closed | ALLOWED |
| reported, with a stop-work minor finding still open | REFUSED |
| reported, with a minor nonconformity open and no stop-work | ALLOWED |
| reported, with an observation open and no stop-work | ALLOWED |

## Report first

Before the audit is reported, the engine refuses:

"Report the audit before closing it: the report is the deliverable, and closure is the statement that everything it raised has been dealt with."

The sentence defines both statuses. Reported means the deliverable exists. Closed means the follow-up is done. The workflow in lesson one allows Closed only from Reported, and this refusal gives the reason in the engine's words.

## Major findings hold the audit open

Reported, with both major findings still open, the engine refuses:

"2 major nonconformities raised by this audit are still open."

With both closed, the answer is ALLOWED. A major nonconformity is a significant failure against a requirement, and the audit that raised it is not finished while it is open. The count in the refusal is the engine's own, read from the findings on the record.

Closing a finding has its own gate, with its own requirements about the cause and the check that the action worked. That gate belongs to the Expert tier, which reads it on a management system audit. This lesson needs only what the audit gate reads: whether the major findings are open or closed.

## A stop-work finding holds it open too

Reported, with a stop-work minor finding still open, the engine refuses:

"1 finding that stopped work is still open."

The finding in this row is a minor one. On a major finding alone the gate would already refuse, and this row shows the stop-work rule reaching further: a finding that stopped work holds the audit open whatever its grade. Module four showed why. Stopping work is the auditor's judgement of imminent danger, and an audit is not closed over it while its finding is open.

## What the gate lets through

The last two rows answer the other cases. A reported audit with a minor nonconformity open and no stop-work is ALLOWED to close. A reported audit with an observation open and no stop-work is ALLOWED too. So two kinds of finding hold an audit open: major nonconformities and findings that stopped work. A lesser finding left open follows its own lifecycle after the audit closes.

## Reading the programme dashboard

The programme summarise from the engine carries these same kinds of finding: open findings 1, open major 1 and stop-work open 1. Those are the counts a programme manager reads to see which reported audits cannot yet close. A reported audit that cannot close is waiting on a finding, and the dashboard names which kind.

## Exercise

Read the two rows for a reported audit with its major findings: "reported, with both major findings open", REFUSED with the count 2, and "reported, with both closed", ALLOWED. Then read the stop-work row, "reported, with a stop-work minor finding still open", REFUSED. Then read the two ALLOWED rows with a minor nonconformity or an observation open. Say what the readings show about which findings the closure gate reads, and whether a finding's grade alone decides whether it holds the audit open.
