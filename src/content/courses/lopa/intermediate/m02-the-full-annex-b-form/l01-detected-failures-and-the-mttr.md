# Detected failures and the MTTR

{{panel:lp-sif-builder}}

Diagnostics change the shape of a PFDavg calculation. A dangerous failure that diagnostics reveal is not hidden until the next proof test: it is announced, and the clock that matters for it is the time taken to restore the channel. The engine calls that time the MTTR, the mean time to restoration of a detected failure, and it asks for the MTTR whenever the dangerous detected rate is above zero.

## The EKULAMA channel with diagnostics

The channel from the first module of this tier is now given a dangerous detected rate as well. The full set of stated inputs is a dangerous undetected rate of 1.2e-6 per hour, a dangerous detected rate of 2.8e-6 per hour, a proof test interval of 8760 hours, an MTTR of 8 hours, a mean repair time after a test of 8 hours, a beta factor of 0.05 and a betaD of 0.02.

| quantity | value |
| --- | --- |
| lambdaDU, per hour | 1.2e-6 |
| lambdaDD, per hour | 2.8e-6 |
| lambdaD, the sum, per hour | 4e-6 |
| T1 divided by two, hours | 4380.000000 |
| MTTR, hours | 8 |
| channel equivalent down time, hours | 1322.000000 |

## Two effects that pull opposite ways

Adding diagnostics does two things at once. It moves failures out of the undetected population, where they wait for an average of half the proof test interval, into the detected population, where they wait only for the MTTR. That pulls the equivalent down time of the channel far below the 4380.000000 hours that half the interval would give: on these inputs it lands at 1322.000000 hours. At the same time it raises the total dangerous rate, because lambdaD is the sum of both rates and now reads 4e-6 per hour against the 1.2e-6 of the undetected rate alone.

## What the two effects give together

The one out of one PFDavg is the product of those two quantities, so the answer depends on which effect wins.

| channel | PFDavg, one out of one |
| --- | --- |
| EKULAMA with detected failures | 0.005288000000 |
| EKULAMA, undetected failures only | 0.005256000000 |

The two are close, and the channel with diagnostics reads slightly higher. That happens because this channel was given additional dangerous failures when the detected rate was added, so the comparison is between two different channels. Diagnostics that reclassify an existing failure rate from undetected to detected are a large gain. Diagnostics that simply reveal dangerous failures nobody had counted are not.

## The MTTR must be typed

If the dangerous detected rate is above zero and no MTTR is given, the engine refuses the call and names the field, because a detected failure is down for the restoration time and without that time there is no answer to give. The engine invents no default, and the analyst who knows the maintenance contract types the number.

## Detected failures in a redundant subsystem

In a redundant architecture the detected population needs a second input as well. The fraction of detected failures that strike every channel at once is betaD, and the engine requires it whenever the dangerous detected rate is above zero in a redundant subsystem. On this channel a beta factor of 0.05 and a betaD of 0.02 are the stated values, and the common cause module takes up what they do to the total.

## Exercise

Multiply lambdaD of 4e-6 per hour by the channel equivalent down time of 1322.000000 hours. Compare your product with the engine's 0.005288000000 and state how many decimals agree, then say in one sentence what would happen to that product if the MTTR were raised from 8 hours to 24.
