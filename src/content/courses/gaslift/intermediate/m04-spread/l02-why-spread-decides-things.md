# Why spread decides things

A valve stays open until the pressure acting on it has fallen, at its own depth, by its own spread. That one comparison decides whether a string injects at one depth or at two.

{{panel:pd-valve-explorer}}

## A budget and a drawdown

Each unloading stage drops the surface injection pressure by the decrement, and that loss reaches every valve depth. A valve shuts when the drop accumulated since its own opening stage passes its spread, and the margin on a stage row is the spread less that drop.

| westTexasOil valve 1 | Casing dropped at depth, psi | Margin, psi | Open |
| --- | --- | --- | --- |
| stage 2 | 26.481994875 | 20.803660052 | true |
| stage 3 | 52.956885249 | -5.671230322 | false |

The spread is 47.285654927 psi. One stage of drop does not spend it and two stages overspend it, so valve 1 is still open when valve 2 takes over, and that design carries a multipointing warning at stage 2.

## The same test, the other verdict

deepHighPressure valve 1 has a spread of 39.204722432 psi and its first stage of drop at depth is 43.324677700 psi. The margin is -4.119955268 psi, the valve is shut by the time the next one takes over, and that design raises no multipointing warning at any stage. Nothing separates the two cases but which of the two numbers was larger.

## The drop at depth is not the decrement

westTexasOil is spaced on 25.00 psi per valve at surface, and the drop its valve 1 sees is 26.481994875 psi. A lower stage pressure makes a lighter gas column, so the column adds less weight over those 2119.249994721 ft and the loss at depth exceeds the loss at surface. Comparing a spread with the decrement treats the budget as larger than it is.

On midDecrementKnifeEdge that difference is the whole verdict: valve 4 has a spread of 32.272254090 psi against 32.122462454 psi of drop at stage 5, a margin of 0.149791635 psi on a string running at 1164.7 psia at surface and 1279.335785 psia at valve 4.

## The mistake

Looking for a threshold in the spread column. There is none. A spread of 39.204722432 psi shuts on time and a spread of 32.272254090 psi does not, because the drops they face differ. A spread is large or small only with respect to one other number, and that number lives in the stage table.

## What it refuses

Both sides of the comparison are shut in gas column pressures, with no friction, no velocity and no injection rate in the annulus, so neither is the casing a gauge reads while gas is moving. The comparison also says nothing about the overlap it detects: it flags that two valves are open, not how the gas divides between them.

## Exercise

Record the spread of westTexasOil valve 1 and its drop at depth at stages 2 and 3, and reproduce both margins by subtraction.

Then do the same for deepHighPressure valve 1 at stage 2, and name the input you would move to make that valve behave like the first one.
