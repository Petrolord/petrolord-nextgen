# The development range

The two dimensionless groups that have a stated range, and what happens outside it.

{{panel:ps-skin-explorer}}

## The two groups

The dimensionless perforation radius, which the paper developed over a range from about a hundredth to about eighteen hundredths.

The dimensionless spacing, which was developed up to about ten.

Both appear in the converging-flow term, and both were varied over those ranges when the finite element results were fitted.

## What "developed over" means

That the fitted expression reproduces the numerical solution well INSIDE those ranges, because that is where the data it was fitted to lie.

Outside them, the expression still evaluates. It is a power law with fitted exponents and it will happily return a number for any positive input. Whether that number resembles the finite element solution is unknown, because nobody solved the finite element problem there.

## Why an extrapolated fit is worse than an extrapolated physical law

Because a fitted correlation has no mechanism in it. The exponents were chosen to make a curve pass through some points; they are not derived from anything that continues to hold outside the points.

A physical law extrapolates because its derivation extrapolates. A fit extrapolates because nobody stopped it.

## What the engine does

Returns the number, and attaches a warning naming the group and the value.

Not a refusal, because the input is a legitimate description of a real gun in a real well, and the reader may have no alternative. And not silence, because a reader who does not know the number is extrapolated will treat it like every other number on the sheet.

## How to read a flagged result

As an indication of direction rather than a magnitude. A big-hole gun with a flagged dimensionless radius is still better than a small in-line gun; the ranking is safe. What is not safe is the specific value, and anything downstream that depends on it.

## Exercise

Name the two dimensionless groups with stated ranges and give the ranges.

Explain why extrapolating a fitted correlation is more dangerous than extrapolating a derived law.

Then say what the engine does outside the range and defend the choice against both alternatives.
