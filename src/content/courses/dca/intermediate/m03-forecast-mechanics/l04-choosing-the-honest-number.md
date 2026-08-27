# Choosing the honest number

One well, one fit, one economic limit, and three defensible arithmetics. Ekene-1 at a 10 stb/d limit books 91666.6666666667 stb by the closed form, 91604.1233600709 stb by the engine's daily sum, and 93011.6570105305 stb if the history comes from a monthly snapshot and only the forecast leg is exact. Nobody made a mistake in any of them. This lesson is about which one goes in the memo and what has to go beside it.

## Rule 1: if a closed form exists, publish it

An Arps fit always has one. The closed form carries no discretization convention inside it, so two readers with two different tools reproduce it to the last digit from the parameters alone. Reproducibility is the property that turns a number into an auditable booking, and it is the only one of the three candidates that has it.

## Rule 2: publish the convention with the number

A booking line for Ekene-1 that a reviewer can check without asking you anything:

> EUR 91666.6666666667 stb at a 10 stb/d economic limit. Exponential fit, $q_i$ 120 stb/d, $D_i$ 0.0012 per day, window 2020-01-01 to 2022-12-01 (primary, pre-flood), closed-form integral. Time to limit 2070.75554149000 days from 2020-01-01.

Six facts: model, parameters, window, limit, integration method, clock origin. Remove any one and the reader has to guess, and the guess they make will not be yours. Notice that the integration method is on the list. Most memos omit it, which is exactly why the three numbers at the top of this lesson circulate as though they were the same number.

## Rule 3: size a difference before arguing about it

The daily-sum gap is 62.5433065957332 stb on a 91666.6666666667 stb booking, 0.0682290617407998 percent. Against a 500 stb grading tolerance it uses 12.5086613191466 percent of the allowance. It is real, it is predictable from last lesson's half-drop rule, and it does not deserve a meeting.

Now the arguments that do. Fitting Ekene-1 over its full history instead of its primary window changes the selected model and drops the fit to R2 0.818388421218434. Booking Ekene-6 from a borrowed exponent instead of its own fit costs 13742.3505116328 stb, as the next module shows in detail. Those are three orders of magnitude above the discretization argument. Review time is finite, so spend it where the barrels are: on the window, the model and the limit, not on the rectangles.

## Rule 4: one convention across a portfolio

The four Ekene producers' engine daily sums total 461475.535264973 stb. Their four closed forms total 461709.132532792 stb. The difference is 233.597267818986 stb, 0.0505940323375365 percent, and it is only interpretable because every well was treated the same way. A table that uses the closed form for two wells and the engine sum for the other two cannot be reconciled at field level at all, because the field difference no longer decomposes into anything meaningful.

Pick a method, apply it to every well, and state it once at the top of the table rather than five times in five footnotes.

## Rule 5: when no closed form exists, declare the step

Real bookings carry plateaus, facility constraints, downtime, terminal declines and profiles that are not Arps at all. Then a numerical sum is the only option, and the honest move is to name the rule and the step. You already know what each choice costs on Ekene-1: a right-endpoint daily sum runs 0.0599879999991226 percent low, a left-endpoint monthly snapshot runs 1.87153173403483 percent high on a 31-day month, and a monthly trapezoid over the primary window runs 0.0111376698848531 percent high. A named method with a known bias is auditable. An unnamed method with a smaller bias is not.

## The correction-factor trap

Once you know the no-limit daily sum sits at exactly 0.999400120000009 of the truth, it is tempting to keep the engine's number and divide by that ratio. Resist it. The ratio is exact only for an exponential run with no limit. Switch stop-at-limit on and a truncation term appears that the factor does not model at all, 7.55884099300602 stb of Ekene-1's gap. Move to a hyperbolic well and the ratio depends on $b$ as well. A factor that is exact in one configuration and approximate everywhere else is worse than either honest option, because the output no longer tells anyone which method produced it.

## Two named misconceptions

**"It came out of the software, so it is the answer."** The software answered the question its loop asks. You saw the loop two lessons ago. Software is a fast, faithful implementation of a convention that somebody chose, and if you do not know which convention, you do not know what you are publishing.

**"Booking the lower number is conservative, so it is safe."** Conservatism is not a convention. If your process is to publish whichever number is smaller, your bookings stop being comparable between wells and between years, and the direction of the bias flips the moment a monthly snapshot enters the workflow, because that one runs high. Honest practice is one stated method plus explicit sensitivities, not a thumb on the scale.

## Worked example: the reconciliation table

Every booking that has more than one candidate number deserves this table once, at the bottom of the page.

| Method | EUR at 10 stb/d (stb) | Difference from closed form (stb) | Percent |
|---|---|---|---|
| Closed-form integral | 91666.6666666667 | 0 | 0 |
| Engine daily sum, stop at limit | 91604.1233600709 | -62.5433065957332 | -0.0682290617407998 |
| Snapshot history plus exact forward | 93011.6570105305 | +1344.99034386381 | +1.46726219330597 |

Publish the first row. Footnote the second so that anyone re-running the engine sees why their number differs. Investigate the third, because a 1.5 percent discrepancy on a noise-free well with no downtime and no allocation is a process defect, not a rounding argument.

Stop and build the same table for Ekene-3 from the numbers in the last two lessons. Its closed form is 111270.166537926 stb and its engine sum is 111190.357687804 stb. Then say in one sentence why you cannot fill in the third row for that well without going back to the fixture.

## Exercise

Audit this line from a reserves table: "Ekene-1 EUR 91,604 stb. Field total 461,476 stb."

List every convention the line fails to state. Name the integration method those two figures imply. Say by how many barrels each figure would move if the team switched to closed forms, using 62.5433065957332 stb and 233.597267818986 stb as your evidence. Then write the corrected entry in two lines, one for the well and one for the field, so that a reviewer who has never seen the fixture could reproduce both numbers.
