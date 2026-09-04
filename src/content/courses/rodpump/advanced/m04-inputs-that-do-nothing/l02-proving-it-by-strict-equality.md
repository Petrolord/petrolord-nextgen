# Proving it by strict equality

An input that does nothing leaves no trace in the answer, so the test has to be built out of what the function does return.

{{panel:pd-balance-explorer}}

## Two runs, one difference

Run A on ODUMA-4 with a structural unbalance of 0 lb, a crank offset of 0 deg and no kinematics. Run B with 600 lb, 10 deg and a kinematics object passed. Nothing else moves. Then compare the returned numbers with `===`, not with a tolerance.

## Why equality rather than closeness

A tolerance test answers a different question. It asks whether the input mattered much, and two numbers can agree to six figures because it mattered a little. The claim under test is stronger: the input was never read at all, and that predicts agreement to the last bit. Floating point is unforgiving in exactly the way this needs, because a value that enters any expression on the way to an output almost always disturbs its final figure.

## Choose outputs that span the whole function

| Output | Returned by both runs |
| --- | --- |
| `fluidLoadLb` | 4690.299657039136 lb |
| `plungerStrokeIn` | 98.526653099789 in |
| `pprlLb` | 19545.877783338576 lb |
| `mprlLb` | 2625.472705679025 lb |
| `cardAreaInLb` | 750654.615621262812 in-lb |
| `prhp` | 18.955924636901 hp |
| `sweptBpd` | 351.739329046691 bbl/d |
| `ratedBpd` | 380.874258457575 bbl/d |
| `producedBpd` | 316.565396142022 bbl/d |
| `worstSection.loadingPct` | 82.873308395930 percent |

Those ten reach the pump, the march, the card, both load extremes, the power, the volumes and the stress check. If either number had entered any stage, one of these would have moved. The count of differences is 0.

## The second proof is different in kind

`kin` is not merely unread. It is unchecked against the input it duplicates. Hand the design the kinematics of a generic 144 in unit, whose stroke is 143.997728 in, alongside a surface motion whose stroke is 106.687717 in. The plunger stroke comes back 98.526653099789 in, identical to run A, and no warning is raised. A caller can describe one pumping unit in one argument and a different one in the next, and nothing has an opinion about it.

## What the test does not prove

It does not prove the answer is right. Both runs can be equally wrong, and equality says only that they agree. It proves nothing about any other input or any branch these two values did not reach, so choose values that would have to show: 600 lb and 10 deg move a balance by percent, not by rounding. And it cannot separate an input that is never read from one that is read and then multiplied by something that is zero on this case. Widening the values is the cheap way to tell those apart.

## Exercise

Run the design twice with the crank offset at two values far apart, compare four outputs with strict equality, and write the count of differences.

Then say why quoting the four values to three decimal places from a screen would not have settled the question.
