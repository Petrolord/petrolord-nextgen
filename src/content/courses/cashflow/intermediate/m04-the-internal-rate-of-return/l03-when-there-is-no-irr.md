# When there is no IRR

The engine returns null for IRR on four published vector shapes and on three AKATA neighbours. Null is not zero and it is not a warning. It is the statement that no rate was found to zero the NPV.

{{panel:ec-time-explorer}}

## The four shapes

| case | flows | NPV at 0 percent | at 10 | at 20 | IRR |
| --- | --- | --- | --- | --- | --- |
| all_positive | [5, 5, 5] | 15.00 | 13.68 | 12.64 | null |
| all_negative | [-5, -5] | -10.00 | -9.55 | -9.17 | null |
| sign_change_late | [100, -300, 250] | 50.00 | 33.88 | 23.61 | null |
| no_real_root | [-1, 3, -3] | -1.00 | -0.75 | -0.58 | null |

all_positive has no outlay to recover, so its NPV is positive at every rate and never crosses. all_negative is the mirror. sign_change_late has an inflow first, and its NPV stays positive at 0, 10 and 20 percent: the outflow of 300 is discounted along with the 250 that follows it, and no rate in the search makes the middle term outweigh the ends. no_real_root, [-1, 3, -3], changes sign twice and still has no root: its sampled curve reads -271.000000 at -90 percent, -1.000000 at 0, -0.250000 at 100 and -0.333333 at 200. It rises toward zero, touches nothing, and falls back. A curve that never crosses gives bisection no bracket, and the finder returns null rather than a guess.

## AKATA's three nulls

AKATA at an oil price of 30 USD/bbl reports IRR null, NPV -169873348.04, payback Beyond project life and a tax column of 6354880.00, 801844.80 and then zeros. No sampled rate produced a positive NPV to bracket; the NPV beside the null says the field is deeply uneconomic.

AKATA with an abandonment of 200000000 in 2035 has flows [-121123680.00, 31746007.20, 64468245.07, 53959532.44, 44874457.77, 37311468.65, -169598201.95]. Their NPV is -58362170.82 at 0 percent, -81068008.48 at 100 percent and -108144473.17 at 300 percent, negative everywhere sampled, and the IRR is null. The headline NPV is -40359955.35. With an abandonment of 60000000 the last flow is -29598201.95, the NPV at 0 percent is 81637829.18, and a root exists at 23.2570 percent.

AKATA valued from 2030 with prior years sunk reports NPV 206819768.67, sunk_net_cash_flow -121123680.00 and IRR null. The only negative row was removed from the value metrics, so what remains is all positive, like [5, 5, 5], and there is nothing to bracket.

## The mistake

The careful mistake is to read null as bad news. One of AKATA's three nulls is the opposite: 206819768.67 of NPV with no IRR, because treating 2029 as sunk left no outlay for a return to be a return on. Null means the question has no answer for this vector; it never says whether the vector is good.

## What it refuses

It refuses to invent a rate when there is no sign change, and it refuses to clamp to a large number and call it converged. It refuses to distinguish the reasons in the field it returns: all positive, all negative and never crossing all read null, and only the NPV beside the null tells which you have.

## Exercise

Write the sign pattern of AKATA's flows with the 200000000 abandonment and with 2029 sunk, one line each. Then say which of the four published shapes each resembles, and what the NPV beside the null tells you that the null cannot.
