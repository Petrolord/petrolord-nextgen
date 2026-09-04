# Failed

Not doing its job at all, and the consequence arrives immediately.

{{panel:wi-envelope-explorer}}

## What failed asserts

The element is not a barrier. Not a weak one, not a monitored one. It is not holding.

A packer that will not hold a differential. A tubing string with a confirmed hole. A tree valve that will not close. The test did not come back marginal. It came back saying the element does not do its job.

## How the engine handles it

The rollup walks the elements in an envelope and, the moment it meets a failed one, it returns `failed` and stops. It does not finish the list. There is nothing left on the list that could change the answer.

That short circuit is the rule in code form. **A failed element fails its envelope outright**, regardless of how many verified elements surround it.

| One element set to | Envelope verdict |
| --- | --- |
| verified | intact |
| degraded | degraded |
| not-verified | degraded |
| failed | failed |

## What follows immediately

Take the published roster and re-rate the DHSV to failed. The primary envelope goes to failed, the secondary stays intact, and the category is **orange**, with the reason `One barrier envelope failed; the other is intact.` The `no-failed-elements` check fails and names the element.

Orange means the well has one envelope where the standard requires two, and the one it has left has no backup. Every subsequent event is now a single failure away from an uncontrolled release.

Nor does the well have to get much worse to go red. If the surviving envelope is degraded, or holds an unverified element, the category is red on the spot.

## Failed is a decision, not a reading

The engine takes the status you give it. Deciding that a test result means failed rather than degraded is engineering judgement, and it is the judgement with the sharpest consequence in this course, because it is the one status that ends an envelope's contribution instantly.

If a result is genuinely ambiguous, degraded and not-verified both give a degraded envelope. Neither is a way of avoiding the call.

## Exercise

1. Fail one element in the primary envelope and read the category. Then fail one in the secondary too and read it again.
2. Starting from a failed primary and an intact secondary, make one secondary element not-verified. Note the category change and say why.
3. Write the criteria you would use to call a leaking valve failed rather than degraded.
