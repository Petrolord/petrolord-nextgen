# Porosity at depth

This lesson works one number all the way through, by hand, because it is one of the six the capstone grades and because the method is the same for every depth and every lithology you will ever put through this curve.

The question is: what is the porosity of the engine's shale at 2000 m.

## The three steps

Start from the curve and the two library parameters for shale, $\phi_0 = 0.63$ and $c = 0.00051$ per m.

$$\phi(z) = \phi_0 \, e^{-c z}$$

**Step one, form the exponent.** Multiply the compaction constant by the depth. The constant is per m and the depth is in m, so

$$c z = 0.00051 \times 2000 = 1.02$$

and the result is dimensionless, which is the check that you have used consistent units. If your exponent comes out carrying a unit, you have mixed metres with kilometres somewhere.

**Step two, take the exponential.** Compute $e^{-1.02}$. The minus sign is not optional and it is the most common slip in this calculation. A positive exponent gives a porosity larger than the surface value, which would be sediment that gains pore space as it is buried.

**Step three, scale by the surface porosity.** Multiply that factor by 0.63.

The engine returns

$$\phi(2000\ \text{m}) = 0.22717481230903933\ \text{v/v}$$

Do the three steps on a calculator and you should land on the same digits until your calculator runs out of them.

## Reading the answer

Say it as a sentence before you move on. At 2000 m, a little under a quarter of the bulk volume of this shale is still pore space. That is a real amount of space. A shale at 2000 m is not a solid object with a few sealed voids in it, it is a rock roughly three quarters grain and one quarter water by volume, and the water in it is one of the things a basin model later has to move.

Now compare the answer with where it started. Step two produced the factor $e^{-1.02}$, and that factor is the fraction of the original porosity that survives to 2000 m. It is about a third. Two kilometres of burial have taken away roughly two thirds of the pore space the mud had on the day it was deposited, and what remains is the third that is hardest to remove.

There is something worth noticing in that. The surviving fraction is $e^{-cz}$, and $\phi_0$ does not appear in it at all. Any sediment with a compaction constant of 0.00051 per m keeps the same fraction of its original porosity by 2000 m, whether it started at 0.63 or at half that. The surface porosity sets how much space there was to begin with, and the compaction constant alone sets what proportion of it is left.

## How many digits are meaningful

The graded value is 0.22717481230903933 v/v and the tolerance is 0.001. Those two facts together tell you how to handle the number.

An answer of 0.227 passes comfortably. So does 0.2272. The digits beyond the third or fourth decimal place carry no information about rock, because the parameters that produced them are fitted values with an uncertainty far larger than that. Reporting a porosity to seventeen digits in a document does not make it more accurate, it advertises a precision that the compaction law does not possess.

Two rules follow, and they pull in opposite directions on purpose.

When you report, round to the precision the input supports. Shale porosity at 2000 m is 0.227 v/v, or 22.7 percent if you say the word percent.

When you compare or compute, do not edit the stored value. Leave the full precision number where the engine put it, carry it into the next step, and let the comparison carry a tolerance. Rounding inside a workflow is how a small error is made permanent, and the trailing digits cost nothing to keep.

## Where this calculation goes wrong

Four failure modes account for nearly every wrong answer.

Mixing units in the exponent. The constant is per m. If you feed it a depth of 2 because you were thinking in kilometres, you get an exponent of 0.00102 and a porosity barely below the surface value.

Losing the minus sign, which turns compaction into expansion.

Quoting the answer without its depth. A porosity is only meaningful with a depth attached, and 0.227 v/v is a fact about shale at 2000 m and about nothing else.

Using percent and fraction interchangeably inside a calculation. This course works in v/v throughout. Convert only at the moment you write a sentence for a human.

The panel below runs the curve for you. Pick a depth and a lithology and it reads the compaction curve at that depth alongside the solid and restored thicknesses and the golden heat column.

{{panel:bs-burial-heat-explorer}}

## Exercise

Work shale porosity at 1000 m using the same three steps, writing the exponent down before you touch the exponential, and check your answer against the ladder in the previous lesson. Then answer this without computing anything: if a shale in some other basin were deposited at a surface porosity of 0.50 but had the same compaction constant of 0.00051 per m, would the fraction of its original pore space surviving to 2000 m be larger, smaller or the same as for the engine's shale.

Self check: the exponent is $0.00051 \times 1000 = 0.51$, so the porosity is $0.63 \, e^{-0.51}$, which the engine returns as 0.37831221465172754 v/v. The surviving fraction for the other shale is exactly the same, because the surviving fraction is $e^{-cz}$ and the surface porosity has cancelled out of it. That shale would hold less pore space at 2000 m in absolute terms, since it began with less, but it would have kept the same proportion of what it started with.
