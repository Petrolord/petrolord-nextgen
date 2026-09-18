# The inside terms and the diameter ratio

Two of the five resistances live on the inside surface of the tube, and the coefficient is referred to the outside one. Something has to happen to those two terms on the way into the stack, and what happens is a multiplication by the ratio of the two diameters. That is visible in the numbers rather than asserted in a comment.

## The inside film, term by term

The studio case has an inside film coefficient of 547.762384. One over that is 0.001825609, which is the resistance of that film on its own surface. The resistance the engine puts into the stack is 0.002208398.

The second figure is the first multiplied by the diameter ratio, which is 1.209677 on this tube, being the outside diameter over the inside one. So the inside film term in the stack is larger than the film alone implies, by exactly the factor that converts one surface into the other.

{{panel:fc-coefficient-explorer}}

## The fouling terms, same rule

| term | as typed | in the stack |
| --- | --- | --- |
| inside fouling | 0.002000000 | 0.002419355 |
| outside fouling | 0.001000000 | 0.001000000 |

The inside fouling allowance moves by the same ratio as the inside film. The outside allowance does not move at all, because it is already on the reference surface and there is nothing to convert.

That asymmetry is the single most useful thing in this lesson. Two fouling allowances typed as the same number would not carry the same weight in the stack, and the one on the inside would carry more. An engineer who types an inside allowance and an outside allowance as equals has quietly made the inside one the larger of the two.

The wall term is a third case and it is worth separating from both. It is not converted by a ratio at all. The cylindrical wall expression carries the outside diameter and the logarithm of the diameter ratio inside itself, over twice the conductivity, so the geometry is already in the term and there is nothing to refer afterwards. Three terms, three treatments, one reference surface.

## Worth checking rather than trusting

The conversion is one multiplication and it is easy to write correctly. It is also easy to write once too often or once too few, and either way the answer is of the right order of magnitude. Nothing about a wrong diameter ratio looks wrong.

What makes it checkable here is that the engine prints both ends. The film coefficient is on the answer and so is the resistance that film became, so a reader can take one over the film, divide the printed resistance by it, and see the ratio. The two fouling allowances can be checked the same way, and on the outside one the check is that nothing happened.

That is a small habit with a large return. A conversion nobody checks has been right for years or wrong for years, and the two look identical from a distance. Printing both ends of it turns a piece of trust into a piece of arithmetic a reader can do on the screen in front of them.

## Exercise

Record the inside film coefficient on the studio case, one over it, and the resistance the engine places in the stack. Then record the diameter ratio and confirm which of the two fouling allowances moves by it. Say in one sentence why the outside allowance does not move.
