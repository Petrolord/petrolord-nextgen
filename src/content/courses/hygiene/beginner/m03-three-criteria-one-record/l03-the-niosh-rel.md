# The NIOSH REL

{{panel:hy-noise-dosimeter}}

On the NIOSH noise REL the OBEN day is a noise dose of 265.610944 percent and a TWA of 89.242460 dBA, and the engine reports `exceedsLimit` true. That is more than two and a half days' allowance in one shift, from the same record that gave 27.748183 percent on the OSHA PEL.

The criterion comes from NIOSH 98-126, Criteria for a Recommended Standard: Occupational Noise Exposure (1998), section 1.1 and its Appendix. It is a recommendation rather than a regulation, and this course always calls it the NIOSH noise REL. The Expert tier meets a NIOSH heat REL, a different limit with the same acronym, so the qualifier matters.

## The four numbers of the criterion

| part of the criterion | OSHA PEL | NIOSH noise REL |
| --- | --- | --- |
| criterion level, dBA | 90.000000000000 | 85.000000000000 |
| decibel exchange rate, dB | 5.000000000000 | 3.000000000000 |
| threshold, dBA | 90.000000000000 | 80.000000000000 |
| limit noise dose, percent | 100.000000000000 | 100.000000000001 |

The measured limit noise dose prints as 100.000000000001 because the engine finds it by bisection; the literal it is pinned against is 100.000000000000. Everything else differs from the PEL. The criterion level is five decibels lower, the decibel exchange rate is 3 dB and the threshold is 80.000000000000 dBA.

## Every period costs more

Each change makes the allowance smaller, so every integrated period carries a larger share. The reference durations show it.

| sound level, dBA | OSHA, hours | NIOSH, hours | NIOSH contribution, percent |
| --- | --- | --- | --- |
| 84.300000 | 17.630482 | 9.404383 | 27.646683 |
| 89.800000 | 8.224911 | 2.639016 | 71.996537 |
| 94.600000 | 4.228072 | 0.870551 | 91.895868 |
| 81.200000 | 27.095850 | 19.248401 | 9.091664 |
| 99.100000 | 2.265768 | 0.307786 | 64.980192 |

The third period, 0.800000 h at 94.600000 dBA, carries 91.895868 percent on its own, close to a full day's allowance. The fifth, just 0.200000 h at 99.100000 dBA, carries 64.980192 percent. Those two short loud periods feel the 3 dB rate most, because each three decibels halves the time.

## The TWA on this criterion

The TWA uses the coefficient NIOSH prints, 10.0, around the criterion level of 85: TWA = 10.0 log10(D/100) + 85. A noise dose of 265.610944 percent gives 89.242460 dBA. The NIOSH criterion also carries a ceiling of 115 dBA, which a later lesson in this module reads.

## Where the NIOSH figure comes from

It helps to see which periods drive the total. On the PEL the fourth period, 1.750000 h at 81.200000 dBA, counts for nothing. On the NIOSH noise REL it is still small, 9.091664 percent, because its reference duration is long at 19.248401 h. The first period, 2.600000 h at 84.300000 dBA, carries 27.646683 percent. The big terms are the three loudest periods, which between them carry most of the day. A control aimed at the fourth period would barely move the NIOSH figure. A control aimed at the third would move it most.

The sixth period, at 76.500000 dBA, is below the NIOSH threshold of 80 and counts nowhere, as it does on both OSHA setups.

## Exercise

Take the second OBEN period, 1.900000 h at 89.800000 dBA. Divide the hours by the NIOSH reference duration of 2.639016 h and check your answer against the 71.996537 percent in the table. Then divide the same hours by the OSHA reference duration of 8.224911 h and say why the PEL still gives that period nothing, although your division returns a number.
