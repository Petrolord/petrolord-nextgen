# A test that decides nothing

The hydraulic fracture verdict is a ternary with the same string on both arms. The skin test it performs decides nothing, and never has.

{{panel:pd-candidate-explorer}}

## One word wide

The line is `push("hydraulicFracture", Number.isFinite(skin) && skin > 0 ? "consider" : "consider", fracReasons)`. Both arms return consider. The test evaluates, the result is discarded, and the verdict is fixed before the skin is read. It looks as though somebody meant "candidate" on the true arm.

## The sweep that shows it

A derived sweep holds the well row fixed and moves the skin. The fracture verdict never moves, and neither does its reason count.

| Skin | Hydraulic fracture | Reasons | Matrix acid |
| --- | --- | --- | --- |
| -4.000 | consider | 3 | no |
| -1.000 | consider | 3 | no |
| 0.000 | consider | 3 | no |
| 0.500 | consider | 3 | marginal |
| 3.000 | consider | 3 | candidate |
| 9.000 | consider | 3 | candidate |
| 20.000 | consider | 3 | candidate |
| not entered | consider | 3 | unknown |

The last row is the ugly one and it is the one that proves the point. With no skin entered at all, `Number.isFinite(skin)` is false, the ternary takes its other arm, and the answer is the same word. Matrix acid, gated on the same field, returns unknown.

## The module knows how to write this branch

It wrote it correctly three times. Matrix acid is candidate above a skin of 2, marginal above 0, no at or below 0, and unknown when no skin was entered. Recompletion is candidate when the mechanism is channelling or the skin is above 8, and consider otherwise. Artificial lift is candidate when flowing is false, consider above 70 percent water, and no otherwise; the teaching well ELELENWO-4 sits at 74.5 percent and returns consider.

Three working gates in one function is why this defect survives review. The fracture branch has the same shape and the same call signature as its neighbours, and only two string literals separate it from a branch that works.

## What it refuses

It refuses nothing and it flags nothing. There is no warning and no ok flag on a verdict, so a caller that sees consider cannot tell a considered consider from a constant. The reason count does not move either: three at every skin in the sweep, and three again when no skin was entered at all.

The mistake is reading the fracture verdict as evidence about the well. It is evidence about the code. Anything that moves a fracture recommendation has to come from the reasons, from the water cut, or from a person.

## Exercise

Move the skin across the sweep in the panel and record the fracture verdict and its reason count at each value, keeping the row where no skin was entered.

Then write the one-word change that would make the true arm mean something, and name the verdict order position it would move to.
