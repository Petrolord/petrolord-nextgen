# The decomposition

The property model is credited with 0.656868 MMstb. This lesson takes that number apart, and most of it turns out not to be a property model effect at all.

## Three bookings

Run the same chain three times, changing only the porosity.

| Porosity | STOIIP (MMstb) | Step |
| --- | --- | --- |
| Constant 0.20, as handed out | 12.139208 | |
| Constant 0.206667, the well average | 12.543848 | +0.404640 |
| The trend grid | 12.796077 | +0.252229 |

The two steps sum to 0.656869, which is the graded uplift to the precision of the rounding.

## What each step is

The first step required no spatial model. It is the difference between the porosity somebody handed out at the start of the course and the average of what the wells actually measured. A single constant, replaced by a better single constant.

The second step is the property model earning its keep: the difference between booking at the well average everywhere and letting the value vary from node to node.

## The proportions

The first step is 0.404640 MMstb, which is 61.6 percent of the total.

The second step is 0.252229 MMstb, which is 38.4 percent.

So nearly two thirds of what the property model appears to be worth is simply the correction of a constant that was too low. Only just over a third comes from the spatial modelling that the tier is named after.

## Why this matters more than the total

Because the two parts carry completely different amounts of confidence and demand completely different work.

The first part rests on six measurements and one division. It is about as solid as anything in the study. If you have six well porosities averaging 0.206667 and you are booking at 0.20, you are understating the volume, and the fix is arithmetic.

The second part rests on a plane fitted to six points, which misses four of them by more than 8 percent, and on the assumption that the trend continues across ground where nothing was measured. It is the least certain step in the chain, and it is worth 0.252229 MMstb.

A report that quotes 0.656868 MMstb for the property model is attributing the solid part to the shaky method. Split correctly, the message is: 0.40 MMstb of this is a correction you should make regardless, and 0.25 MMstb depends on whether you believe the trend.

## The same split in the three means

The decomposition is the three means of module three wearing different clothes, and it is worth connecting them.

The first step is the well mean against the handed out constant: 0.206667 against 0.20.

The second step splits further, into the selection effect and the weighting effect. Booking at the node mean over the oil gives 12.707784, so the selection effect is 0.163936 and the weighting effect is 0.088293.

Written out in full, the 0.656868 MMstb is 0.404640 from a better constant, 0.163936 from the oil sitting on better rock than the field average, and 0.088293 from the thicker cells carrying better rock. Only the last two are spatial, and the last one is the smallest of the three.

## Reading it off the panel

You can run the whole decomposition from the method control.

{{panel:rc-property-explorer}}

Set the method to constant and read the STOIIP tile: 12.5438. That is the first step, and the difference tile beside it reads plus 0.4046.

Set it to trend and the STOIIP reads 12.7961 with a difference of plus 0.6569. Subtract the previous reading to get the second step of 0.2523.

Two panel readings and one subtraction give the split, which is worth doing on any property model you build. The constant method is not there as a poor relation; it is the control case that makes the spatial model's contribution measurable.

## Worked example

Apply the decomposition to a decision.

Suppose the study has a week left and can either measure porosity in one more well or refine the property model with better software.

The decomposition says the spatial modelling is worth 0.252229 MMstb in total, and that is the whole effect, not the uncertainty on it. Refining the method might move some fraction of that.

The well average is worth 0.404640 MMstb and rests on six values with an uncertainty of one to two porosity units each. A seventh well would move the average by roughly its own deviation divided by seven, so a well half a porosity unit from the current average moves the booking by around 0.04 MMstb, and one that is genuinely different could move it by several times that.

More usefully, the seventh well also tests the trend, since the trend's largest residuals are around 0.019 and a new well would either support the plane or contradict it. That is the better use of the week, and the decomposition is what makes the comparison possible.

## Exercise

A field books 50 MMstb at a handed out porosity of 0.18. Its four wells average 0.175, and a trend model books 51.2 MMstb. Decompose the change and say which part you would report as robust.

Self check: booking at the well average gives $50 \times 0.175/0.18 = 48.61$ MMstb, a step of minus 1.39, and the trend then adds 2.59 to reach 51.2. The robust part is the minus 1.39, which follows from the measurements alone; the plus 2.59 depends entirely on the trend model and, being larger than the total change, should be reported with the method and its residuals attached.
