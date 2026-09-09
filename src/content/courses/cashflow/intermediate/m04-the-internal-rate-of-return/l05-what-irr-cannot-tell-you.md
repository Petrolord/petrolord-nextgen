# What IRR cannot tell you

IRR is a property of a curve. Everything the curve does not encode, the IRR cannot report, and most of what a decision needs is exactly that.

{{panel:ec-time-explorer}}

## Scale

AKATA at a working interest of 100 percent reports NPV 72534830.66 and IRR 29.2361 percent. At 75 percent, 54401123.00 and 29.2361. At 60, 43520898.40 and 29.2361. At 25, 18133707.67 and 29.2361. Scaling a vector scales its NPV at every rate and leaves the zero fixed, so IRR cannot tell you how much is at stake.

## Ranking

jv_analytic, [-12500000, 37500000], has an IRR of 200.0000 percent and an NPV of 21590909.09 at 10 percent. AKATA has 29.2361 percent and 72534830.66 at the same nominal 10 percent. IRR ranks the two-row vector far ahead; NPV ranks AKATA ahead. IRR measures how steeply the curve falls through zero; NPV measures how high it stands at the rate you chose.

## The rate you set

The discount rate never enters the IRR. On multiyear_jv_real the IRR is 47.9020 percent at a nominal discount rate of 0, of 10 and of 20 percent, while the NPV is 148905488.72, 88104639.00 and 50852201.45. On AKATA the IRR can be compared only with the nominal rate: at the breakeven price 64.916777 USD/bbl the IRR reads 10.0002 percent against a nominal 10, not against the applied real rate 6.796117.

## Which root

On a vector that ends negative the IRR is one of two roots and the return does not say which. two_roots_2_and_6, [-100, 208, -108.12], reports 6.0000 percent where the oracle reads 2.0000. AKATA with an abandonment of 60000000 reports 23.2570 percent. Neither number is wrong, and neither is complete.

## The mistake

The careful mistake is the ranking one. A reader with two candidate fields sorts by IRR, picks the steeper curve, and gives up the higher NPV. The number that measures value at the company's rate is NPV; IRR tells you the rate at which that value would vanish, which answers how wrong the rate can be before the answer changes, and no other question.

## What it refuses

It refuses to report scale, to rank, to use the discount rate, to count its roots, or to name the basis it should be compared on.

## Exercise

Write the IRR and the NPV of jv_analytic and of AKATA at 10 percent, and say which ranks first on each. Then say which single number you would put in front of a manager who asks whether AKATA survives a rate of 15 percent, and read it from the AKATA discount rate sweep.
