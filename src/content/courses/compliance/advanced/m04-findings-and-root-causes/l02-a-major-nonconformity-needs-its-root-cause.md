# A major nonconformity needs its root cause

Lesson 1 read the two halves of an answer. A Major nonconformity asks for both, and for two things more: the cause written down, and proof that the corrective action worked. The digest prints canCloseFinding on a Major nonconformity one requirement at a time. This lesson walks it, and then reads the two ORASHI Major findings at the as-of date 2026-10-15.

{{panel:compliance-readiness-explorer}}

## The walk

| step | verdict |
| --- | --- |
| no correction recorded | REFUSED |
| a correction, and an action still open | REFUSED |
| the action complete, no root cause | REFUSED |
| a root cause, only a preventive action | REFUSED |
| a corrective action found not to work | REFUSED |
| a corrective action complete and unchecked | REFUSED |
| a corrective action verified effective | ALLOWED |

Each step adds one thing to the record, and the refusal moves to the next thing missing. The root cause step reads:

REFUSED: A major nonconformity needs its root cause recorded before it closes. Closing one without it is how the same finding is raised again at the next surveillance audit.

## The root cause

A corrective action is aimed at a cause. Without the cause on the record, nobody reading the finding can tell whether the action was aimed at the right thing. The refusal names the consequence in the register's own terms: the same finding, raised again at the next surveillance audit. Lesson 3 reads the list of categories the root cause is recorded against.

## The effectiveness check

The last three steps are about whether the action worked.

A corrective action checked and found not to work is refused:

REFUSED: A corrective action here was checked and found not to have worked. Raise another one rather than closing over it.

A corrective action complete and never checked is refused:

REFUSED: No corrective action has been verified effective yet. For a major nonconformity the effectiveness check is the point: a completed action is not a working one.

That second sentence is the engine's own, quoted as it prints. The rule it states is that Complete is a status of the action, while verified effective is a finding about the action. Only the second closes a Major nonconformity.

## The two ORASHI Major findings

ISF-2026-001 is Closed. Its action ac2 is Corrective, Complete, and verified effective reads true. That is the record the walk ends on.

ISF-2026-004 is Action in progress. Its actions are ac1, Corrective, In progress, and ac4, Preventive, Complete, verified effective false. canCloseFinding refuses it:

REFUSED: 1 action still open against this finding.

The refusal names the first thing missing: ac1 is still open. Complete it, and the record would still hold no corrective action verified effective. The summary in module 5 prints awaiting an effectiveness check 1 across the register. The digest does not say which action that count reads, so this lesson does not name it.

## The Professional parallel

The quality module asks the same of a Major NCR, and qualityAssurance.NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. On a Minor NCR, a corrective action complete and never checked is allowed. On a Minor nonconformity here, the correction alone closes it. Both modules keep the effectiveness check for the serious end of the scale.

## Exercise

Read the seven steps of the walk. For each refused step, name the one thing the record gains in the next step. Then read ISF-2026-004's two actions at 2026-10-15 and say which refusal it meets now, and which of the walk's later refusals it would still meet if ac1 were completed and never checked.
