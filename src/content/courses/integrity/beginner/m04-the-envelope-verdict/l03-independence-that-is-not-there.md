# Independence that is not there

A shared element can degrade both envelopes at once, which is the exact failure two barriers were supposed to prevent.

{{panel:wi-envelope-explorer}}

## The shared element, with the verdict in hand

An element declares which envelope it serves: primary, secondary, or **both**. An element marked both is placed into the primary list and into the secondary list. It is one piece of steel appearing in two chains.

Everything you learned about the rollup now applies twice to that one element. Its status is read once for the primary verdict and again for the secondary verdict, and both verdicts move together.

## What that does to the category

Suppose the shared element is degraded. The primary envelope is degraded because it contains a degraded element. The secondary envelope is degraded for the same reason, the same element. Two degraded envelopes give **yellow**.

Now suppose it fails. Both envelopes are failed, from one cause, at one instant. The engine returns **red**, with the reason `One barrier envelope failed and the other is degraded, failed or missing.`

That is a two barrier well going from fully compliant to red on a single event. The second barrier bought you nothing, because it was never a second thing.

## Why the engine warns rather than refuses

The common element check is present on every run:

`No element shared between envelopes (common WBE)`

It is set at warn level, not fail. A common element is not forbidden. It is sometimes unavoidable, and it is acceptable only by a deliberate, documented dispensation from somebody who has looked at the scenario above and accepted it.

The engine will not take that decision for you. It will stop you taking it by accident, which is the useful half.

## The published roster

The worked case has an empty shared list. No element serves both envelopes, the check passes, and the two envelopes are genuinely two. When the DHSV degrades, only the primary moves. The secondary stays intact, which is why the well is yellow and not worse.

## The question to ask a barrier table

For every element, ask what single event would remove it. Then ask whether that event also removes anything in the other envelope. A shared element is the obvious case. A shared cause, such as one cement job that both envelopes depend on at different depths, is the case that hides.

## Exercise

1. Mark one element as serving both envelopes and confirm it appears in both counts.
2. Degrade it and read both envelope verdicts and the category. Then fail it and read them again.
3. List every element in the published roster and name the event that would remove it.
