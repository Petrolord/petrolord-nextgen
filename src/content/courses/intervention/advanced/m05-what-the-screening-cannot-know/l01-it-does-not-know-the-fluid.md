# It does not know the fluid

`screenTreatments` reads `diagnosis.mechanism.id`. Nothing in what `chanDiagnosis` returns says whether it read a water-oil ratio or a gas-oil ratio, and the module's own text sends the user to run it on the gas.

{{panel:pd-candidate-explorer}}

## The instruction the module gives

The gas shutoff gate is a factor of two on the expected gas-oil ratio and nothing else. A derived sweep pins it: at 1899 scf/stb against an expected 950 scf/stb the verdict is no, at a ratio to expected of 1.998947368, and at 1900 scf/stb it is consider, at 2.000000000. On the teaching well ELELENWO-4, at 2152 scf/stb against the same expected 950 scf/stb, a ratio of 2.265263158, the verdict is consider with two reasons.

The second reason ends: "only the channelling case is worth squeezing. Run the diagnostic on the gas-oil ratio before deciding."

That is good advice. Following it is where the trouble starts.

## What comes back off the gas

The teaching gas history is 26 samples from t = 60 to 3600 days, first gas-oil ratio 957.197245770 scf/stb and last 2151.864191995 scf/stb, a factor of 2.248088575 across the window. It is a teaching case, not a published one, exported the way a production database exports one, with the Bourdet derivative column never computed and spelled `null`.

`chanDiagnosis` returns ok = true, mechanism displacement, confidence n/a, ambiguous n/a. The ratio fit over the late window opening at t = 504.417216 days gives worSlope 0.356090047 at a fit quality of 0.949579198 as a fraction, while derivativeSlope and spanDecades are unavailable. The note reads "The ratio is sitting flat at 2151.86 and its derivative is zero throughout. Nothing is changing, so there is no mechanism to diagnose and nothing on this well for an intervention to fix."

## Handing that to the screening

The well row handed in is identical in both rows. Only the diagnosis changes.

| Diagnosis handed to the screening | Water shutoff | Reasons |
| --- | --- | --- |
| The water reading at lateFraction 0.5 | candidate | 3 |
| The gas reading, derivative column null | blocked | 1 |

On the gas diagnosis the water shutoff returns blocked = true, with reason 1 "Water cut is 75 percent and the derivative is flat." and the block reason "The diagnostic says ordinary displacement. The water is arriving because the reservoir is swept, which is not a well problem and no treatment on this well will change it."

Not one word of that block was read off water.

## What it refuses

Nothing. There is no fluid field on the diagnosis and no flag, so the screening cannot refuse what it cannot see. The one honest refusal nearby is taken with no diagnosis at all, where the water shutoff blocks with "The mechanism has not been established."

The mistake is running the gas diagnosis the module asked for and passing the whole result object onward. The gas verdict is right about the gas. It is the water shutoff that quietly consumes it.

## Exercise

Record the water shutoff verdict, the blocked flag and the reason count on the water diagnosis at lateFraction 0.5 and on the gas diagnosis, then name the field the screening would need in order to tell them apart.
