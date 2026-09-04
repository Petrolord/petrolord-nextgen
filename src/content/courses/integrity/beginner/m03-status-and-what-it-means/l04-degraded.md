# Degraded

Impaired, and still doing part of its job. That is a different claim from failed, and the engine treats it differently.

{{panel:wi-envelope-explorer}}

## What degraded asserts

Two things at once. The element is not performing to its specification, and it is still performing.

A downhole safety valve that closes but leaks past the seat at a rate above the acceptance criterion. A cement column that holds but shows communication on a bond log. A wellhead seal weeping at a rate somebody is monitoring. In each case there is evidence, the evidence is bad, and the element has not stopped working.

That last part is what separates degraded from failed. Degraded is a measured shortfall. Failed is an absence.

## The published case

The worked roster is exactly this situation. Ten elements, five in the primary envelope and five in the secondary. Nine are verified. The DHSV is degraded.

The result:

| | Status | Elements |
| --- | --- | --- |
| Primary | degraded | 5 |
| Secondary | intact | 5 |

Category **yellow**, with the reason `Barrier degradation (or unverified elements); no failure.`

Now notice something about the checks on that roster. All four of them pass. No element is failed, no element is unverified, there is no shared element, and both envelopes exist. The well is still yellow.

That is worth sitting with. The checks are a list of specific defects, and this roster has none of them. The category comes from the rollup, not from the checklist, and the rollup sees a degraded element that the checklist has no line for.

## What degraded does to the verdict

One degraded element degrades its whole envelope. It never fails one. That holds however many other elements are verified and however severe the degradation is judged to be.

What varies is what happens next, and that depends on the other envelope. Against an intact secondary, a degraded primary is yellow. Against a degraded secondary, still yellow. Against a **failed** secondary it is red, with the reason `One barrier envelope failed and the other is degraded, failed or missing.`

So a degraded element is not urgent on its own and becomes urgent the moment anything else goes wrong. It is your margin, spent.

## Exercise

1. Reproduce the published roster in the panel and confirm the primary reads degraded with 5 elements and the secondary intact with 5.
2. Degrade a second element in the same envelope and check whether the verdict changes. Explain why.
3. Now degrade one element in each envelope and read the category. Then fail one of them and read it again.
