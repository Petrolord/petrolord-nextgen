# Stop work records its correction

An auditor who sees imminent danger on site stops the work. The finding raised from that moment is a different kind of record from an ordinary one, and canRaiseFinding treats it differently in two ways: it must be a nonconformity, and it must record what was done at the time.

{{panel:compliance-plan-explorer}}

## Two refusals for a stop-work finding

Asked to raise a stop-work finding typed as an observation, the engine refuses with its own sentence:

"A finding that stopped work is a nonconformity, not an observation."

An observation records something worth watching. Stopping work says the auditor judged the site unsafe to continue. The two cannot describe the same event, so the engine refuses the observation type for a finding that stopped work.

Asked to raise a stop-work nonconformity with no correction recorded, the engine refuses again:

"A finding that stopped work records what was done about it at the time. Imminent danger does not wait for the corrective action cycle."

With its correction recorded, a stop-work nonconformity is ALLOWED.

| request | canRaiseFinding |
| --- | --- |
| a stop-work observation | REFUSED |
| a stop-work nonconformity, no correction | REFUSED |
| a stop-work nonconformity with its correction | ALLOWED |

## The correction is immediate

The second refusal separates two timescales. A corrective action runs on a cycle: a cause is found, an action is raised, it is completed and later checked. A stop-work situation cannot wait for that. The correction is what was done on the spot to make the site safe, such as work halted, the area made safe, or the permit withdrawn. The engine asks for it on the finding itself, at the moment of raising, so the record shows the danger was dealt with while the longer work on the cause goes on.

The Expert tier reads the correction and the corrective action as two parts of every finding. This lesson needs only the stop-work rule: the correction comes first and it is recorded at once.

## A stop-work finding holds the audit open

The audit's own closure gate reads stop-work findings too. Asked to close a reported audit with a stop-work minor finding still open, canCloseAudit refuses:

"1 finding that stopped work is still open."

The finding in that row is a minor one, and it still holds the audit open. Having stopped work is enough for the gate, whatever the finding's grade. Module five reads the closure gate in full.

The programme summarise in SECTION 17 carries the count as well: open findings 1, open major 1 and stop-work open 1. One finding is behind all three: AF-2026-018, a Major nonconformity, Open, stop-work true. A stop-work finding still open appears on the programme's own dashboard, beside the audits outstanding.

## Why the type rule matters

The type decides which rules a finding meets from then on. The engine's refusal keeps a stop-work event typed as a nonconformity, with its correction on the record from the moment it is raised and its closure read by the audit gate. The auditee cannot later argue that the event was only something to watch, because the record the engine allowed says otherwise.

## Exercise

Read the three canRaiseFinding rows for a stop-work finding, and the canCloseAudit row for a reported audit with a stop-work minor finding still open. Say what the readings show together: which finding type a stop-work event must carry, what it must record at the moment it is raised, and whether a stop-work finding's grade decides whether it holds the audit open.
