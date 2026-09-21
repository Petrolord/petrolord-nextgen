# Severity sets what closure needs

An NCR carries one of four severities: Critical, Major, Minor or Observation. The severity decides how much canCloseNcr asks for once the disposition is agreed. This lesson walks the same closure at all four severities, and the walks part company at the root cause.

{{panel:compliance-plan-explorer}}

## The Major walk

After the disposition and its date, a Major NCR meets these refusals in order:

| step | canCloseNcr |
| --- | --- |
| a root cause missing | REFUSED |
| a root cause, a preventive action in progress | REFUSED |
| the preventive action finished, no corrective action | REFUSED |
| one corrective action found not to work | REFUSED |
| one corrective action complete and not yet checked | REFUSED |
| a corrective action verified effective | ALLOWED |

The root cause refusal:

"A major non-conformance needs a root cause before it closes. Closing one without it is how the same non-conformance arrives again next quarter."

The open action refusal:

"1 corrective or preventive action still open."

The corrective action refusal:

"A major non-conformance needs at least one corrective action. A disposition deals with the item; a corrective action deals with the cause."

Lesson three reads the last two refusals, where a completed action meets the check that it worked.

## The Minor walk

The same last steps on a Minor NCR:

| step | canCloseNcr |
| --- | --- |
| no root cause, no actions | ALLOWED |
| one corrective action complete and never checked | ALLOWED |
| one corrective action still open | REFUSED |

A Minor NCR closes with no root cause and no action at all. It closes over a corrective action nobody has checked. For a Minor NCR the engine asks for no formal check, and the judgement that the completed work is enough rests with the people who close it. The one thing it may not close over is an open action, and the refusal is the same sentence the Major walk gives: "1 corrective or preventive action still open."

## Where the line falls

The module's list NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. Those are the severities for which a completed action is not enough and the check that it worked is required. The Critical walk, after a disposition and its date:

| step | canCloseNcr |
| --- | --- |
| no root cause | REFUSED |
| a root cause, no corrective action | REFUSED |
| a corrective action complete and not yet checked | REFUSED |
| a corrective action verified effective | ALLOWED |

The first two refusals are the Major sentences with the word critical in place of major, and the third is the Major sentence word for word. The root cause refusal: "A critical non-conformance needs a root cause before it closes. Closing one without it is how the same non-conformance arrives again next quarter." NCR-2026-019, the one Critical NCR on the ABAM register, reads ALLOWED at the as-of date with k4 verified effective.

Observation is the fourth severity, and its walk is the shortest. With nothing recorded it meets the disposition refusal every NCR meets first. With a disposition, Use as is, and its date, and nothing else, it is ALLOWED.

## An open action blocks closure

Across the Major and Minor walks one refusal is common: an open action blocks closure. That is also the refusal NCR-2026-031 meets at the as-of date 2026-10-15. It is Major, status Actions in progress, and its preventive action k2 reads In progress, open true, due 2026-10-05, overdue true. Asked to close it, the engine refuses: "1 corrective or preventive action still open."

A severity is therefore a rule about evidence. An NCR has to finish the actions it started. A Major or Critical NCR also has to show why it happened and that the fix worked. An Observation needs only its disposition and date.

## Exercise

Read the two walks side by side: the Major row "with one corrective action complete and not yet checked", REFUSED, and the Minor row "one corrective action complete and never checked", ALLOWED. Then read the one refusal the two walks share. Say what the pair of answers shows about where severity changes what closure needs, and what stays the same at both severities. Then read the Observation walk's allowed row and say what it asks of an Observation NCR.
