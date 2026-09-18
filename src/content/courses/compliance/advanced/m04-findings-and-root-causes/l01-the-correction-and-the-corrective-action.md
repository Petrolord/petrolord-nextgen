# The correction and the corrective action

An audit that finds something raises a finding. isoCompliance.FINDING_TYPES holds four: Major nonconformity, Minor nonconformity, Observation and Opportunity for improvement. This module reads how a finding closes, and it starts with the two halves of an answer to a nonconformity: the correction and the corrective action. The ORASHI findings are read at the as-of date 2026-10-15.

{{panel:compliance-readiness-explorer}}

## Two halves, two jobs

The engine states the difference in its own words, in the refusal it gives a Major nonconformity that has only a preventive action:

REFUSED: A major nonconformity needs at least one corrective action. A correction deals with the instance; a corrective action deals with the cause.

A correction is what was done about the thing that was found: the missing record written up, the wrong label replaced. A corrective action is what was done so that it does not happen again. The first ends the instance. The second removes its cause. A finding answered with a correction alone is dealt with for now and may be raised again at the next audit. A finding answered with a corrective action alone leaves the instance itself standing while the cause is worked on. The engine asks for the halves that each finding type needs, and names the missing one when it refuses.

## The correction comes first

canCloseFinding refuses any nonconformity with no correction recorded. On ISF-2026-005, a Minor nonconformity with status Open, it answers:

REFUSED: Record the correction: what was done about the thing that was found. A corrective action deals with the cause, and this is the other half.

The same sentence opens the Major nonconformity walk in lesson 2. Whatever else a finding needs, the instance has to be dealt with, and the correction is the record that it was.

## What each type asks for

The digest prints canCloseFinding for the four types:

| finding | recorded | verdict |
| --- | --- | --- |
| a Minor nonconformity | its correction and no actions | ALLOWED |
| an Observation | nothing | ALLOWED |
| ISF-2026-003, Opportunity for improvement, Open | its own actions | ALLOWED |
| a Major nonconformity | a corrective action verified effective, after the full walk | ALLOWED |

A Minor nonconformity closes on its correction alone. It needs no corrective action to close. An Observation and an Opportunity for improvement are not nonconformities. The Observation closes with nothing recorded, and ISF-2026-003 closes with no action against it anywhere in the actions table. A Major nonconformity asks for everything: a correction, a root cause, a corrective action and a check that the action worked. isoCompliance.EFFECTIVENESS_REQUIRED_TYPES holds one word, Major nonconformity, and lesson 2 reads what that means.

## The ORASHI actions

The actions table carries the two action types this module uses:

| action | finding | type | status | verified effective |
| --- | --- | --- | --- | --- |
| ac1 | ISF-2026-004 | Corrective | In progress | false |
| ac2 | ISF-2026-001 | Corrective | Complete | true |
| ac3 | ISF-2026-005 | Corrective | Open | false |
| ac4 | ISF-2026-004 | Preventive | Complete | false |

A preventive action deals with a cause that has not yet produced a nonconformity. It is welcome on a Major finding, and it does not satisfy the rule. The refusal names what the rule asks for: "A correction deals with the instance; a corrective action deals with the cause."

## The Professional parallel

The Professional tier read the same halves on an NCR, in the quality module's words: "A disposition deals with the item; a corrective action deals with the cause." A disposition is to a nonconforming item what a correction is to a finding. The two modules name the first half for what each one deals with, and both keep the corrective action for the cause.

## Exercise

At 2026-10-15, read the canCloseFinding verdicts for the five ORASHI findings and for the three one-line cases in the table above. Say, for each type of finding, what has to be on the record before it closes. Then read ac4's type and say why, on its own, it cannot satisfy the rule for ISF-2026-004.
