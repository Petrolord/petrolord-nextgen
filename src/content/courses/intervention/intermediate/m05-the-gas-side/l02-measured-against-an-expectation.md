# Measured against an expectation

The gas gate tests a ratio of two typed numbers. Every other gate in the same function tests a number against a constant, and the difference decides who chose the threshold.

{{panel:pd-channel-explorer}}

## Two kinds of gate in one screening

| Gate | What it tests | Where the boundary sits |
| --- | --- | --- |
| Water shutoff | water cut against a constant | opens at 30.0 percent |
| Hydraulic fracture, out of zone reason | water cut against a constant | appears between 60.0 and 61.0 percent |
| Artificial lift | water cut against a constant | consider above 70 percent, and this well is at 74.5 percent |
| Matrix acid | skin against a constant | candidate above 2, marginal above 0, no at or below 0 |
| Recompletion | mechanism, or skin against a constant | candidate on channelling or above a skin of 8 |
| Gas shutoff | measured ratio against a typed ratio | a factor of two on whatever expectation was entered |

Five of those boundaries are written into the module and the sixth is written by the user.

## What the expectation does

Held at 950 scf/stb on teaching well ELELENWO-4, a case this course built rather than a published one, the boundary lands between 1899 scf/stb, which comes back no at a ratio to expected of 1.998947368, and 1900 scf/stb, which comes back consider at exactly 2.000000000. Change the number in the expectation field and that boundary moves with it, on the same measured gas. The screening records the pair only inside a reason string, "The gas-oil ratio is 2152 against an expected 950, so most of the gas is not coming out of the oil.", and nowhere in a field a reader can check.

## Nothing derives the expectation

No pressure is read anywhere in the screening. Nothing computes a solution gas-oil ratio, nothing looks at a bubble point, and nothing tests whether the expectation is plausible. It is a field on the well row, like the water cut and the skin, and the module treats it as given.

## The refusal bucket is very wide

At 900 scf/stb the ratio to expected is 0.947368421, below the expectation entirely. At 1899 scf/stb it is 1.998947368, all but double it. Both return no with 1 reason and the identical text.

## The mistake

Calling a gas-oil ratio high on its own. At 1500 scf/stb against an expected 950 the verdict is no, and the same measured ratio sits on either side of the gate depending on the expectation typed beside it. A recommendation quoting the measurement without the expectation has quoted half the test, and neither half is checked: `screenTreatments` is asserted against no golden.

## Exercise

Hold the measured gas-oil ratio fixed in the panel and move the expected ratio instead, and find where the verdict turns.

Then write the two numbers a gas shutoff recommendation must carry, and say which of them is a measurement.
