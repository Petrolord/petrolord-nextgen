# The flat branch

One branch of `chanDiagnosis` fires when every late derivative sits within 1e-12 of zero. It returns that there is nothing on the well for an intervention to fix.

{{panel:pd-candidate-explorer}}

## The history the module sends you to

Gas shutoff screening on teaching well ELELENWO-4 comes back consider, on a gas-oil ratio of 2152 scf/stb against an expected 950, and its second reason ends "Run the diagnostic on the gas-oil ratio before deciding."

The teaching gas history is that instruction carried out: 26 samples from t = 60.000000 to 3600.000000 days, exported with the Bourdet derivative column never computed. It is a teaching case, not a published one. Its ratio runs from 957.197245770 to 2151.864191995 scf/stb, a factor of 2.248088575 across the window.

## What comes back

`ok = true`, mechanism displacement, treatable false, confidence n/a, ambiguous n/a. `worSlope` 0.356090047 at `worR2` 0.949579198, fitted on the late samples in a window opening at t = 504.417216 days. `derivativeSlope`, `derivativeR2` and `spanDecades` all come back n/a.

The note reads "The ratio is sitting flat at 2151.86 and its derivative is zero throughout. Nothing is changing, so there is no mechanism to diagnose and nothing on this well for an intervention to fix. That is a finding, not a failure to reach one."

## Why it fires

Every derivative in the window coerces to 0.0 and satisfies `Math.abs(p.derivative) < 1e-12`, so the flat test passes on every late sample. It passes because the column is empty, and the branch has no way to tell an empty column from a genuinely flat one.

## The series where the branch is honest

Published history `flat` carries every ratio at 1.200000000 and every derivative at 0.000000000. Over the window opening at t = 186.345364 days its 20 late samples are all exactly zero, the derivative fit comes back `ok = false` with n = 0, and the diagnosis returns mechanism displacement with `worSlope` 0.000000000 at `worR2` 0.000000000.

| Series | worSlope | worR2 | Mechanism |
| --- | --- | --- | --- |
| published flat | 0.000000000 | 0.000000000 | displacement |
| teaching gas history | 0.356090047 | 0.949579198 | displacement |

Same branch, same verdict, same reassurance. One of those ratios is flat.

## The mistake

Accepting "nothing on this well for an intervention to fix" from a run whose `derivativeSlope`, `derivativeR2` and `spanDecades` are all n/a. Those absences say no derivative fit was attempted. On a genuinely flat well that is correct, and on an empty column it is the whole failure.

## What it refuses

Nothing. The flat branch is a success path: `ok` is true, a mechanism is named, and a screening handed that mechanism blocks the water shutoff squeeze on the grounds of ordinary displacement.

## Exercise

Run the teaching gas history and record `worSlope`, `worR2` and the three fields that come back n/a.

Then say what you would check before passing that mechanism into a screening run.
