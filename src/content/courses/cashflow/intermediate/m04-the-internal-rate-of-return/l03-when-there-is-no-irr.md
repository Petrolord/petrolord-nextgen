# When there is no IRR

The engine returns null whenever it cannot name exactly one rate in the band from -99 to 1000 percent that zeroes the NPV. Null is not zero and it is not a warning. It arrives with a status that says which way the search failed.

{{panel:ec-time-explorer}}

## The four shapes

| case | flows | NPV at 0 percent | at 10 | at 20 | irrStatus |
| --- | --- | --- | --- | --- | --- |
| all_positive | [5, 5, 5] | 15.00 | 13.68 | 12.64 | no-sign-change |
| all_negative | [-5, -5] | -10.00 | -9.55 | -9.17 | no-sign-change |
| sign_change_late | [100, -300, 250] | 50.00 | 33.88 | 23.61 | no-root |
| no_real_root | [-1, 3, -3] | -1.00 | -0.75 | -0.58 | no-root |

all_positive has no outlay to recover, so its NPV is positive at every rate and never crosses; the vector never changes sign, and the status says so. all_negative is the mirror. sign_change_late has an inflow first, and its NPV stays positive at 0, 10 and 20 percent: no rate in the band makes the outflow of 300 outweigh the ends. no_real_root changes sign twice and still has no root: its curve reads -271.000000 at -90 percent, -1.000000 at 0, -0.250000 at 100 and -0.333333 at 200. It rises toward zero, touches nothing, and falls back. The signs do change, so the status is no-root rather than no-sign-change.

Two further statuses complete the set. above_band_only, [-1, 1000], has its only crossing beyond the top of the band and reports above-clamp. A vector with several crossings inside the band reports multiple-roots.

## AKATA's nulls

AKATA at an oil price of 30 USD/bbl reports IRR null, NPV -169873348.04 and payback Beyond project life. No sampled rate produced a positive NPV to bracket, and the NPV beside the null says the field is deeply uneconomic.

AKATA with an abandonment of 200000000 in 2035 has a last flow of -169598201.95. Its NPV is -58362170.82 at 0 percent, -81068008.48 at 100 percent and -108144473.17 at 300, negative everywhere sampled, so the IRR is null and the headline NPV is -40359955.35. With an abandonment of 60000000 the last flow is -29598201.95 and the NPV at 0 percent is 81637829.18, so that curve does cross, and it crosses twice; the null there has the opposite cause, too many rates rather than none. The status multiple-roots is what separates it from the 200000000 run.

AKATA valued from 2030 with prior years sunk reports NPV 206819768.67 and IRR null. The only negative row was removed from the value metrics, so what remains is all positive, like [5, 5, 5], and there is nothing to bracket.

## The mistake

The careful mistake is to read null as bad news. One of AKATA's nulls is the opposite: 206819768.67 of NPV with no IRR, because treating 2029 as sunk left no outlay for a return to be a return on. Null means the question has no single answer for this vector; it never says whether the vector is good. The status beside each null is what tells the shapes apart.

## What it refuses

It refuses to invent a rate when no rate in the band zeroes the NPV, and it refuses to clamp to a large number and call it converged. It refuses to pick one crossing from several. And the status names the branch, not the verdict: no-root and no-sign-change are both null, and only the NPV beside the null says whether the field is worth anything.

## Exercise

Write the sign pattern of AKATA's flows with the 200000000 abandonment and with 2029 sunk, one line each. Then say which status each earns, and what the NPV beside the null tells you that the status cannot.
