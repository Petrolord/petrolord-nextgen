# Distributions, not points

Every booking in this course so far has been a single number. Ekene-1 books 91666.6666666667 stb at a 10 stb/d limit. The four producers together book 461709.132532792 stb. Those are correct closed-form answers to precisely stated questions, and as reserves deliverables they are inadequate, for a reason module 3 has just made concrete: the interval machinery that was supposed to carry the uncertainty cannot see most of it.

This module replaces the point with a distribution. The distribution we will use is deliberately simple, because the honesty is in where the three numbers come from, not in the elegance of the density.

## What the point number is hiding

List the decisions that produced 461709.132532792 stb, and what each one could plausibly have been.

**The family and the exponent.** Hold $q_i = 120$ stb/d and $D_i = 0.0012$ per day, put the limit at 10 stb/d, and vary only $b$. EUR runs 91666.6666666667 stb at $b = 0$, 142264.973081037 stb at $b = 0.5$, 248490.664978800 stb at $b = 1$ and 321875.914758613 stb at $b = 1.2$. That last is 3.51137361554850 times the first, from identical early data. No parameter interval in module 3 spans anything like that range, because the $b$ half-width is a hard-coded ten percent placeholder.

**The economic limit.** Sum the four wells' closed-form EURs at three limits and you get 535469.764892198 stb at 5 stb/d, 461709.132532792 stb at 10 stb/d, and 372230.076701345 stb at 20 stb/d. Moving the limit from 10 to 5 adds 73760.6323594066 stb; moving it from 10 to 20 removes 89479.0558314471 stb. The limit is a price and cost assumption wearing a rate's clothing, and it changes annually.

**The arithmetic used to total it.** The engine's daily-sum roll-up of the four base scenarios reports 461475.535264973 stb against the closed-form 461709.132532792 stb, a difference of -233.597267818579 stb or -0.0505940323374476 percent. Small, and a reminder that even the deterministic total is a choice of method.

**The window and the model.** The type-curve booking of Ekene-6 reports $R^2 = 0.999047938405246$ and quality Good while under-booking EUR by 13.0548028121744 percent. Appearance and booking are separate quantities, which is the Professional tier's hardest lesson and the reason a single number cannot be defended by its fit statistic.

None of these appear in a confidence interval. All of them appear in a range.

## Probabilistic language, stated once

The petroleum convention is a source of persistent confusion because it runs backwards from statistical convention, so fix it now and do not drift.

- **P90** is the **low** case. There is a 90 percent chance the true volume is at least this much. Statistically it is the 10th percentile.
- **P50** is the median. Half the distribution lies above it.
- **P10** is the **high** case, the 90th percentile statistically.

P90, P50 and P10 attach to the probabilistic method. The deterministic labels 1P, 2P and 3P attach to proved, proved plus probable, and proved plus probable plus possible. They are often aligned in practice, and they are not defined as the same thing. When you write P90 in a memo, write which convention you mean at least once in the document.

## Why a field range is not four well ranges added up

The tempting construction is to build a distribution per well and add them. Two things break.

The first is arithmetic. Quantiles do not add. The sum of four P90s is not the P90 of the sum, except in the degenerate case where the wells are perfectly correlated. Add independent well-level P90s and you produce a field low case that is far too pessimistic, because you are asserting that all four wells simultaneously land near their individual downsides.

The second is worse, and it is the reason the naive fix of assuming independence is also wrong. These four wells are not independent. They share one window doctrine, one $b$ policy, one economic limit, one flood model, and one evaluator. If the flood response is optimistic, it is optimistic on all four. If the limit assumption is stale, it is stale on all four. The dominant uncertainties in a decline booking are **common mode**, which means the field distribution is much closer to a scaled single-well distribution than to a sum of four independent ones.

So we build the range where the common-mode drivers live: at field level, on the total.

## Worked example: bracketing the Ekene field

Start from the deterministic total, 461709.132532792 stb, and ask what would have to be true for the field to come in materially lower or higher.

For a low case, everything that could be optimistic in the base is walked back: the limit rises with costs, the post-flood tail is shorter than the response model suggests, and any $b$ above the primary-window value is disallowed. Note that the sum of the four EURs at a 20 stb/d limit is already 372230.076701345 stb, so a low case that keeps the 10 stb/d limit but trims the tails does not need to fall anywhere near that far. A field low of 380000 stb sits 17.6971012214034 percent below the deterministic total and is defensible on limit and tail grounds alone.

For a high case, the levers point the other way: a lower limit as prices firm, and a $b$ at the upper end of what SPEE governance permits. The sum at a 5 stb/d limit alone is 535469.764892198 stb, and the $b$ lever is worth far more than that. A field high of 580000 stb, 25.6202139252263 percent above the deterministic total, is a restrained choice rather than an aggressive one.

Those three numbers, 380000, 461709.132532792 and 580000 stb, are the Ekene field triangle. The next three lessons compute with it. Notice already that it is not symmetric: the upside is 25.62 percent and the downside is 17.70 percent, because the upside levers are open ended and the downside ones are bounded by production you have already seen.

## The misconception to retire: the range is the confidence interval

They are different objects with different inputs. The confidence interval propagates residual scatter under a fixed model. The reserves range propagates model, window, limit and governance choices, which are the things that actually move a booking. A distribution that was built by widening a confidence interval has inherited the confidence interval's blind spots and gained nothing.

## Exercise

Write the three bracket sentences a reserves committee would need to see for the Ekene triangle. One sentence for the low, naming exactly which assumptions are walked back and in which direction; one for the mode, naming the method that produced 461709.132532792 stb and the limit it assumes; one for the high, naming the two levers and the governance rule that stops the high from being higher.

Then, using the three closed-form field sums at limits of 5, 10 and 20 stb/d given above, state what percentage of the low-to-high spread is explained by the economic limit alone if $b$ is held fixed. That number is your answer to the first question any committee will ask, which is whether this range is a reservoir statement or a price statement.
