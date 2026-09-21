# The beta factor on undetected and detected failures

{{panel:lp-sif-builder}}

Common cause enters the Annex B equations twice, once for each failure population. The two entries look similar and behave very differently, because the two populations wait for different things. The undetected common cause term waits for a proof test. The detected common cause term waits only for a repair crew. On most subsystems one of the two is thousands of times larger than the other.

## The two terms

The undetected term is the beta factor multiplied by the undetected rate, multiplied by half the proof test interval plus the repair time after a test. The detected term is betaD multiplied by the detected rate, multiplied by the MTTR. Neither term carries an equivalent down time and neither is squared, because a common cause failure is a single event that takes the whole group at once, so it behaves exactly like a failure of one channel.

## The two terms, measured

The EKULAMA channel with diagnostics as a one out of two, at a beta factor of 0.05 and a betaD of 0.02, with a proof test interval of 8760 hours, an MTTR of 8 hours and a repair time after a test of 8 hours, all stated.

| term | value |
| --- | --- |
| independent | 0.000035259176 |
| common cause, undetected | 0.000263280000 |
| common cause, detected | 0.000000448000 |
| PFDavg | 0.000298987176 |
| dominant | common cause |

The undetected common cause term is the largest single piece of this answer by a wide margin, and the detected one is almost invisible beside it. The reason is entirely in the down times that multiply the two rates. The undetected term is multiplied by 4380.000000 hours plus 8, and the detected term by 8 hours alone, a ratio of more than five hundred before the two fractions are applied.

## Why diagnostics help twice

A failure rate moved from the undetected population to the detected one is helped in two ways at once. Its independent contribution shrinks because its down time falls from half an interval to a restoration time. Its common cause contribution shrinks by the same ratio, and it is weighted by betaD in place of the beta factor. Good diagnostics are therefore one of the few design changes that attack the common cause term, which adding another identical channel does not.

## betaD is its own input

The engine asks for betaD separately and refuses a redundant call that has detected failures and no betaD. It is a separate input because it is a separate claim. The physical cause that plugs all three impulse lines is not the same population as the cause that a diagnostic routine catches on all three cards at once, and a plant may have good reason to rate them differently. In this teaching channel the stated betaD of 0.02 sits below the stated beta factor of 0.05, which is a common pattern, and it is a choice the analyst has to defend.

## Exercise

Compute the undetected common cause term for this subsystem yourself: multiply the beta factor of 0.05 by the undetected rate of 1.2e-6 per hour and by 4380.000000 hours plus the 8 hour repair time after a test. Compare your answer with the 0.000263280000 in the table, then work out what share of the total 0.000298987176 it is.
