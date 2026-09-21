# Reproducing a printed table

{{panel:lp-sif-builder}}

A worked example in a published paper is the strongest evidence available that an implementation of a standard's equations is the implementation the standard's community recognises. The golden behind this engine carries one: the 61508 Association paper by Dolan, dated 2024, titled SIL Calculations: Practical Guidance in the use of IEC 61508-6:2010, and its results table. Five subsystems, a proof test interval of one year throughout, and a printed total. The failure rates are the paper's own, cited there to SINTEF PDS and to vendor certificates, and this course offers them as the paper's example values and nothing more.

## The five subsystems and the total

| golden case | architecture | engine PFDavg | engine at three significant figures | printed |
| --- | --- | --- | --- | --- |
| dolan-pt-2oo3 | 2oo3 | 0.000235764375 | 2.36E-04 | 2.36E-04 |
| dolan-ai-2oo3 | 2oo3 | 0.000000696679 | 6.97E-07 | 6.97E-07 |
| dolan-cpu-1oo2 | 1oo2 | 0.000000533954 | 5.34E-07 | 5.34E-07 |
| dolan-do-1oo2 | 1oo2 | 0.000000668459 | 6.68E-07 | 6.68E-07 |
| dolan-valve-1oo2 | 1oo2 | 0.001048767640 | 1.05E-03 | 1.05E-03 |

| SIF | engine | printed |
| --- | --- | --- |
| PFDavg | 0.001286431107 | 1.29E-03 |
| RRF | 777.344387 | 777 |
| SIL | 2 |  |

Every subsystem rounds to the printed three significant figures, and the total rounds to the printed 1.29E-03 with an achieved risk reduction factor of 777.344387 against the printed 777.

## What a reproduction is evidence for

It is evidence about the equations, and only for the rows it reproduces. It says that the engine's Annex B implementation, its equivalent down times, its common cause terms and its series sum agree with what a recognised practitioner community publishes. It says nothing about whether the failure rates are right for any other plant, and nothing about the architectural constraint, which this engine does not check.

A reproduction is also a check on the series sum. The five subsystem figures added together give 0.001286431107, and the paper prints 1.29E-03 for the total, so the sum convention the engine uses is the sum convention the paper used. That is worth as much as any single row, because the sum is where an implementation can quietly go wrong without any one part looking odd.

## The table did not print everything it used

Three inputs had to be INFERRED before the printed figures came back. One is the restoration time after a proof test, taken equal to the restoration time of a detected failure. One is the lifetime in the coverage table, which the paper does not print. One is a common cause figure where the printed value and the reproducing value disagree. Each of the three is a fact about the published SOURCE, and the next three lessons take them one at a time. The golden's source lines record two of them, the lifetime as INFERRED and the beta factor as a slip, so a reader of the evidence can see the judgement and weigh it.

## What was not reproduced

The continuing example in the CCPS layer of protection analysis book is NOT reproduced here. No copy of the book was available to check its worksheet figures against, so no golden claims to be that example and no lesson presents it as verified. A reproduction that could not be attempted is reported as one that was not attempted.

## Exercise

Take the five subsystem figures and add them. Compare your sum with the printed total of 1.29E-03 and with the engine's 0.001286431107. Then work out what share of the total the valve subsystem carries, and write one sentence saying which subsystem a site should look at first if this safety instrumented function had to reach a tighter required PFDavg.
