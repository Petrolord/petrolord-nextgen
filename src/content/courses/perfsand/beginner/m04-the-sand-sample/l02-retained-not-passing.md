# Retained, not passing

The convention that reverses the curve, and the confusion it causes.

{{panel:ps-shot-explorer}}

## The two conventions

A grain size curve can be plotted as cumulative percent PASSING a sieve, which rises as the size rises, or as cumulative percent RETAINED, which falls as the size rises.

They are the same data. One is a hundred minus the other.

## Which one this course uses

Retained. The sand control literature uses retained, the sieve tables in this engine are retained, and every D-value here is defined on the retained curve.

Soil mechanics uses passing. So does most of civil engineering. A reader arriving from either of those will read every number in this course backwards unless they notice.

## What it does to a D-value

D50 is the same in both conventions, because fifty is its own complement.

Everything else flips. On the retained convention, D10 is the size at which ten percent has been retained: only a tenth of the sample is COARSER. D10 is therefore the coarse decile, and it is the LARGEST of the D-values, not the smallest.

On the passing convention, D10 is the fine decile and the smallest. The same symbol means opposite ends of the distribution in the two fields.

## The check that catches it

D10 must be greater than D50, which must be greater than D90. If your D10 is the smallest number in the table, you have read a passing curve as a retained one, or the other way round.

That check costs nothing and it is worth running on any sieve table that arrives from outside.

## Why sand control picked this way round

Because the design questions are about the coarse end. A gravel is sized on the median. A standalone slot is sized on the coarse decile, because the coarse grains are the ones that must bridge across the slot and hold the rest back.

Having the coarse decile be D10 rather than D90 puts the number the designer wants at the near end of the alphabet.

## Exercise

State both conventions and say which one this course uses.

Explain why D50 is the same in both and why D10 is not.

Then write down the inequality check on a retained curve, and say what you would conclude if a table failed it.
