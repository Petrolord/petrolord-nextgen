# What ignoring the history costs

Forty percent on the permeability, from a shortcut that looks reasonable.

{{panel:wt-regression-explorer}}

## The shortcut

You have a well that has been producing at varying rates. The last rate change was 36 hours ago and the rate has been steady since.

The tempting analysis: treat the last period as a fresh drawdown. Reset the clock to the moment of the last rate change, use the current rate of 700 stb/d, and run an ordinary MDH semilog analysis on it.

It looks defensible. The rate is constant over the period, the pressure is falling smoothly, and the earlier history was at lower rates and further away in time.

## The result

The permeability comes back at 119.41136566441537 mD against a planted 85. That is 40.483959605194556 percent high.

The skin comes back at 12.457536423503514, against a planted 6.5. Nearly double.

The r squared is 0.9998446105602713.

## Why it goes wrong

The pressure at any moment during the third period is the sum of three responses: the original 450 stb/d step still developing since hour zero, the drop to 250 still developing since hour 24, and the rise to 700 developing since hour 60.

The first two are still changing. The 450 step's response is 80 hours old and a logarithm is still climbing at 80 hours. Treating the observed pressure as the response to the 700 step alone attributes all three to one.

The two earlier steps together are a NET production of 250 stb/d that has been going on for a long time, and their combined response is flattening out because a logarithm flattens. So the total pressure change over the third period is less steep than the 700 step alone would give.

A flatter line means a higher permeability. Hence 119 against 85.

And a higher permeability, through the skin formula, means a larger skin. Both errors point the same way and both make the well look different from what it is: better rock, worse damage.

## Why the direction is worth remembering

This is the third time in the course that a mis-specified analysis has moved the permeability and the skin together in a coordinated, plausible direction.

In the Associate tier, including wellbore storage gave low permeability and a skin whose sign inverted to stimulated.

In the Professional tier, fitting past a sealing fault gave about half the permeability and a negative skin.

Here, ignoring the rate history gives high permeability and a high skin.

None of the three produces an obviously wrong number. All three produce an internally consistent reservoir description that somebody would act on.

## The correct analysis, for comparison

The multi-rate semilog on the same data returns a permeability about two percent low and a skin close to the planted value. Same data, same software, one more piece of information: the rate history.

The rate history is not an input to the physics. It is an input to the ANALYSIS, and this is the clearest demonstration in the course of how much an analysis depends on information that is not in the pressure record.

## When the shortcut is safe

When the last rate period is much longer than everything before it, so the earlier steps' responses have genuinely flattened.

The test is quantitative: compare the equivalent producing time against the duration of the last period. If they are close, the earlier history contributed little and the shortcut is defensible. If the equivalent producing time is much longer, as it is here, it is not.

That is a one-line check and it uses a function you already have.

## The misconception to avoid

"The most recent data are the most relevant, so the recent rate is the one that matters." Every past rate change is still contributing, because the logarithmic response never stops growing. There is no time after which a rate change can be ignored; there is only a time after which its CONTRIBUTION IS SLOWLY VARYING, and that is a different and weaker statement.

## Exercise

Compare 119.41136566441537 mD against the planted 85 and against the multi-rate answer.

Then compute the ratio of the equivalent producing time to the duration of the last period, and state the rule you would use in future to decide whether the single-period shortcut is safe.
