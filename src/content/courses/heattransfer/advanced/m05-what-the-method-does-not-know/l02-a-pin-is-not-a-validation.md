# A pin is not a validation

Five numbers in this module are fitted correlation coefficients. No oracle can validate a fit, because there is nothing to derive it from and no limit it has to satisfy. The engine's test suite pins each one by literal instead, so that changing it is a reviewed act rather than a silent one. That is worth having and it is not evidence.

{{panel:fc-coefficient-explorer}}

## The five, and where they act

| fitted constant | value |
| --- | --- |
| dittusBoelterA | 0.023000 |
| dittusBoelterReExp | 0.800000 |
| dittusBoelterPrExpHeating | 0.400000 |
| siederTateExp | 0.140000 |
| laminarNusselt | 3.660000 |

All five sit on the tube-side film. None is read by a rating, a hot-day answer, a bundle diameter or a fan power, and no graded field in this course reads any of them. That containment is deliberate: a number nothing can validate should decide as little as possible.

## Why pinning is the honest response

A pin makes a change visible. Move 0.023000 and a test fails by name, a reviewer sees which constant moved, and the movement is recorded. That is a control on process. It says nothing about whether the value is right, and no lesson here may present it as though it did.

The distinction is worth keeping sharp because the two look identical in a test report. A pinned constant and a validated one both appear as a green line, and a reader who has not looked at the file will assume the stronger of the two.

The alternative would be to publish the band each fit was taken over, and this module cannot. Both the validity band and the exponent for a cooled tube side are recorded as unsourced, so the engine returns the Reynolds and Prandtl numbers on every call for a caller to check, and refuses a cooled tube side outright.

## The register, and what it says about each

| held item | the shape of the caveat |
| --- | --- |
| bundleConstants | eight layout and pass pairs with no established source |
| dittusBoelterBand | validity band unestablished, Re and Pr returned for checking |
| dittusBoelterCoolingExponent | only the heating form carried, a cooled side refused |
| siederTateExponent | the exponent and its band unestablished |
| crossFlowF | no cross-flow correction, so a counter-current-basis area |
| defaultsProvenance | a wall conductivity naming no material, three fan defaults naming no machine |
| fanConstantWaterDensity | a customary constant written against an unstated water density |

That register carries 7 entries, counted by reading it. The module's own header sentence says six. The register is the authority, because it is what the returns point at, and the lesson is that a count is worth measuring rather than quoting, even from the module that owns it.

Every return that depends on one of the seven says so in a field of its own. The film carries its correlation block, the bundle its constants note, the bay its note about the missing correction. A caller never has to consult the register to learn that an answer rests on something unsourced.

## When agreement proves nothing

Move a shared constant in the engine and in the oracle together and every published case stays green. Every case green is then the finding rather than a reassurance, and that is how a wall factor of two survived in both files until an analytic limit was asked.

The fan constant is the counter-example. The oracle's fan route goes through pascals and carries no customary constant, so it measures the water density the engine's constant implies, at 62.303335 lb per ft3. Moving that constant in both files still fails, because one of them never read it.

## Exercise

Record the five fitted values and say which answer they all act on. List the seven register entries with the caveat each carries, and record the count the register holds against the count its header states. Then explain why moving a constant in two files can leave a suite green, and name the constant here where it cannot.
