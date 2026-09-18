# Severity sets what closure needs

An NCR carries one of four severities: Critical, Major, Minor or Observation. The severity decides how much canCloseNcr asks for once the disposition is agreed. The digest walks the same closure on a Major NCR and on a Minor one, and the two walks part company at the root cause.

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

The module's list NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. Those are the severities for which a completed action is not enough and the check that it worked is required. The digest walks the Major case step by step. It does not walk a Critical NCR one requirement at a time, so this lesson does not say which of the Major refusals a Critical NCR meets in which order. What the digest does show is NCR-2026-019, a Critical NCR, reading ALLOWED with one corrective action verified effective.

Observation is the fourth severity. NCR-2026-022, bolt torque record missing, is an Observation, Closed, with the disposition Use as is. The digest prints no closure walk for an Observation.

## The open action rule holds at every severity

Across both walks one refusal is common: an open action blocks closure. That is also the refusal NCR-2026-031 meets at the as-of date 2026-10-15. It is Major, status Actions in progress, and its preventive action k2 reads In progress, open true, due 2026-10-05, overdue true. Asked to close it, the engine refuses: "1 corrective or preventive action still open."

A severity is therefore a rule about evidence. Every NCR has to finish what it started. A Major or Critical NCR also has to show why it happened and that the fix worked. A dashboard that closes every severity on the same checklist has lost the difference the engine keeps.

## Exercise

Read the two walks side by side: the Major row "with one corrective action complete and not yet checked", REFUSED, and the Minor row "one corrective action complete and never checked", ALLOWED. Then read the one refusal the two walks share. Say what the pair of answers shows about where severity changes what closure needs, and what stays the same at both severities.
