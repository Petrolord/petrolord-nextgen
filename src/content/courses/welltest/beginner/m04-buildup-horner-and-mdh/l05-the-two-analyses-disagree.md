# The two analyses disagree

The same well, two tests, two answers, and neither of them is wrong.

## The result

Analyse the drawdown fixture with MDH over its late data, and the buildup fixture with Horner over its late data, using the same reservoir parameters and the same care in both.

The drawdown's permeability comes out 1.2163532852823662 percent above the buildup's. The skins differ too, by a bit under two tenths.

The rock is identical. The fluid is identical. The rate is identical. The analyses are both correct.

## Why they differ

Three reasons, and they are all physical rather than numerical.

**The two tests are affected by wellbore storage differently.** The drawdown's storage transient decays from the initial pressure; the buildup's decays from the flowing pressure at shut-in, with the superposed producer still contributing. The transition out of storage has a slightly different shape, so a window chosen at the same nominal cut-off contains different amounts of residual transition.

**The buildup's time axis is compressed at late time.** Agarwal equivalent time saturates at tp, and the Horner ratio approaches 1. The last third of the buildup record is squeezed into a small stretch of the axis, so the late points carry less leverage in the least-squares fit than the same number of drawdown points would.

**They interrogate different amounts of rock.** The drawdown ran for 100 hours from a static reservoir. The buildup followed 36 hours of production. The volumes averaged are not the same.

## What to do about it

Nothing, other than report it.

A disagreement of a percent or two between a drawdown and a buildup on the same well is a normal, healthy result and it is a useful estimate of the analysis uncertainty. Reporting a single permeability to four significant figures when two valid analyses of the same well differ in the second is false precision.

The useful practice: when both are available, quote both, and quote the range rather than an average.

## When the disagreement is large

A gap of one or two percent is analysis. A gap of tens of percent is a signal.

Large disagreements usually mean one of three things: the producing time used for the Horner analysis was wrong, in which case the buildup is the suspect one; the rate during the drawdown was not constant, in which case the drawdown is; or the reservoir is not behaving like the model, in which case both are.

A useful diagnostic is that a wrong tp moves p* a lot and the permeability a little. So a buildup whose permeability agrees with the drawdown but whose extrapolated pressure looks wrong points at the producing time.

## The digits to quote

This is worth being blunt about. The permeability from a well test on a good dataset is a number known to two significant figures, maybe three. The skin is known to about one decimal place at best.

Software reports fifteen digits because floating point has fifteen digits. Copying them into a report implies a precision that the disagreement between two valid analyses of the same well shows does not exist.

The capstone in this tier asks for full precision, deliberately, because it is checking that you ran the analysis rather than estimated it. That is a different purpose from a report to a colleague, where the honest form is two or three figures and a stated range.

## The misconception to avoid

"One of the two must be right." Both are estimates of a quantity that is itself an average over a volume, taken by two experiments that averaged slightly different volumes under slightly different conditions. The disagreement is a property of the measurement, not a mistake in one of them.

## Exercise

You have a drawdown analysis giving 61.2 mD and a buildup analysis giving 60.4 mD on a different well.

Write the one line you would put in the report to state the permeability. Then write what you would write instead if the two numbers had been 61.2 and 30.

State what you would investigate first in the second case.
