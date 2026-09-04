# Sweeping the decrement

Walk the surface decrement across the published knife edge and the most consequential boolean in the output changes inside a tenth of a psi per valve.

{{panel:pd-unloading-explorer}}

## The sweep

Every input of the published `midDecrementKnifeEdge` case held fixed except `dpPerValvePsi`.

| psi per valve | Stage 5 surface margin on valve 4, psi | Stage 5 multipointing | Multipointing stages |
| --- | --- | --- | --- |
| 26.00 | 0.972936966 | true | 2, 3, 4, 5 |
| 26.50 | 0.407491645 | true | 2, 3, 4, 5 |
| 26.70 | 0.181314071 | true | 2, 3, 4, 5 |
| 26.75 | 0.124769727 | true | 2, 3, 4, 5 |
| 26.80 | 0.068225402 | true | 2, 3, 4, 5 |
| 26.85 | 0.011681097 | true | 2, 3, 4, 5 |
| 26.90 | -0.044863189 | false | 2, 3, 4 |
| 27.00 | -0.157951701 | false | 2, 3, 4 |
| 27.50 | -0.723393096 | false | 2, 3, 4 |

26.75 psi per valve is the published value. The flip sits between 26.80 and 26.90 psi per valve.

## The margin is smooth, the verdict is not

The margin walks down steadily across the whole sweep: 0.972936966, 0.690214057, 0.407491645, 0.294402819, 0.181314071 psi and on down through zero. There is no kink at the flip. The verdict is the sign of a well behaved quantity, and the only event is that the quantity passes zero inside the band anyone would call a normal decrement.

That is why the margin is worth reporting and the boolean is not. The margin tells you the design is 0.124769727 psi from a different string behaviour. The boolean tells you nothing about distance at all.

## Why a decrement moves the verdict at all

Spacing is a recursion on the decremented injection line, so a change in decrement moves every valve depth below it, which moves every valve temperature, every dome charge and every closing surface pressure. It also moves the casing pressure at each stage directly, since the stage casing is the kickoff less one decrement per stage. Both sides of the closing comparison move, and their difference is what the sweep walks.

## The mistake

Sweeping on whole psi steps. A sweep at 26.00, 27.00 and 27.50 psi per valve reads 0.972936966, -0.157951701 and -0.723393096 psi and reports a flip somewhere between the first two points. It never sees that the flip lives inside a tenth of a psi per valve, finer than anyone would quote a decrement to. Resolution chosen to make a plot look smooth is not resolution chosen to locate an event.

## What it refuses

The sweep says where the verdict changes on this design. It does not say which side of it is correct, and it does not say what the well does. The unloading and transfer lines behind every one of these rows are straight lines on constant gradients, which a real unloading column is not.

## Exercise

Read the stage 5 surface margin at 26.00, 26.85, 26.90 and 27.50 psi per valve and write the four values with their verdicts.

Then state the interval the flip lies in, and say how coarse a sweep would have to be to miss it.
