# The material-balance bridge

Decline curve analysis answers two questions: how fast is this well falling, and how much will it make before it stops. Both answers are extrapolations of a rate. Neither of them contains any information about how much oil is in the reservoir, and neither of them can tell you why the rate is falling.

The analysis that answers those questions is material balance, and it is the subject of the next course in this series. This lesson is the join between them. It is deliberately short on material balance and long on the thing you hand over, because the quality of the hand-off is a decline-analysis responsibility and nobody downstream can repair it.

## What crosses the bridge

Material balance needs three histories: pressure at a set of survey dates, fluid properties at those pressures, and cumulative production to each date. Pressure comes from gauges and surveys. Fluid properties come from a PVT lab report. Cumulative production is yours.

Not rate. Cumulative. Every fitted decline in this course has been a statement about $q(t)$, and material balance never uses $q(t)$ directly. It uses $N_p(t)$, the integral, evaluated at a handful of dates that have nothing to do with your fit window.

That is a sharper handover than it sounds, because a cumulative can be produced from the same rate history in several defensible ways, and they do not agree. The Professional tier compared three of them for you: the exact integral of a fitted decline, the engine's daily forecast sum, and a monthly snapshot that holds the rate on the first of the month for the whole month. Its module 3 is entirely about which of those you should report and why the snapshot route runs high on a declining well. Whatever you concluded there arrives here as a number that propagates into an estimate of how much oil the field contains.

## The Ekene hand-off, exactly

The fixture's material-balance history uses the exact closed-form cumulatives of the four planted declines. No snapshots, no daily sums, no rounding.

| Survey | Np (stb) | Pressure (psia) | Bo (rb/stb) |
|---|---|---|---|
| 2020-07-01 | 38864.2338744572 | 3037.73875987746 | 1.20233656185776 |
| 2021-01-01 | 99594.7403971816 | 2782.91506179661 | 1.20600602311013 |
| 2021-07-01 | 151911.968683336 | 2562.14286113606 | 1.20918514279964 |
| 2022-01-01 | 195407.593210859 | 2377.70868780590 | 1.21184099489560 |
| 2022-07-01 | 230985.237096421 | 2226.24560801141 | 1.21402206324464 |
| 2023-01-01 | 261475.039999678 | 2096.00826266700 | 1.21589748101760 |

The last row is the one you can check against your own work without opening a material-balance tool at all. Add the four producers' closed-form cumulatives at the flood start:

$$73157.9366256283 + 76326.1296660118 + 58807.5520048379 + 53183.4217032003 = 261475.03999967827$$

which is the survey's `cum_oil_stb`. Four Arps integrals, one addition, and you have reproduced the input that the next course's capstone runs on. Stop and do that sum now. It is the only place in this course where a number you computed becomes an input to a different discipline, and it is worth having done it with your own hands.

## What material balance does with it, in one paragraph

The Havlena-Odeh formulation rearranges the material-balance equation into a straight line. Each survey contributes an underground withdrawal $F$, in reservoir barrels, computed from the cumulative production and the fluid properties, and a total expansion $E_t$, in reservoir barrels per stock-tank barrel, computed from the pressure drop and the compressibilities. The equation says $F = N E_t$, so the slope of $F$ against $E_t$ is $N$, the oil originally in place. RC2 derives every term of that and explains when the line bends. Here, only the shape matters: your cumulative enters through $F$, linearly.

You can see the arithmetic on the fixture without any of the derivation. At the 2023-01-01 survey the goldens carry $F$ = 317926.8424845837 rb and $E_t$ = 0.026190080907192072 rb/stb, so

$$N = \frac{317926.8424845837}{0.026190080907192072} = 12139208.107496822 \text{ stb}$$

Do it at an earlier survey instead, say 2021-07-01, where $F$ = 183689.69554533364 rb and $E_t$ = 0.015131933971203063 rb/stb, and you get 12139208.107496746 stb. Every survey returns the same number, which is why the regression through all six points reports a slope of 12139208.107496837 stb at R2 1 with an intercept of -6.111804395914078e-10 rb.

## The reconciliation that closes the loop

The geoscience courses computed the Ekene STOIIP volumetrically, from a mapped structure, a net-to-gross of 0.8, a porosity of 0.2, a connate water saturation of 0.35 and an oil formation volume factor of 1.2, and locked the answer at 12139208.107496763 stb.

The dynamic answer, from six pressure surveys and a cumulative that came out of decline analysis, is 12139208.107496837 stb. The two differ by 7.450580596923828e-8 stb, a relative difference of 6.137616664074325e-15, which is floating-point noise and nothing else.

That agreement is manufactured. The fixture was built so that the dynamic history is the exact consequence of the volumetric answer, precisely so that you can see what a closed loop looks like before meeting an open one. On a real field the two numbers disagree, often by tens of percent, and the disagreement is the most useful signal in the study: it means the mapped volume is wrong, or a drive mechanism is missing from the model, or the cumulative is wrong. Decline analysis owns exactly one of those three, and it is the one nobody checks.

## Why the flood happened, in the same numbers

The table also explains the event that has driven the last three lessons. By 2023-01-01 the field had produced 261475.039999678 stb from 12139208.107496763 stb in place, a recovery factor of 2.153971146093131 percent, and had spent 1103.9917373330045 psi of the 3200 psia it started with to do it. That is 422.2168729123678 psi per hundred thousand barrels.

Pressure at the flood start is 2096.00826266700 psia. The bubble point is 2000 psia. The tank was 96.0082626669955 psi above the point at which gas comes out of solution, which is 4.8004131333497755 percent of the bubble-point pressure, and at the observed rate of depletion that margin is worth roughly twenty-three thousand barrels of further production.

So the waterflood was not a discretionary uplift project. It was pressure maintenance started with a very small margin left, which is why the response lags in the last three lessons are as short as they are and why the lift factors are as large as they are. The response model you learned to read in lesson 1 is the shape of that decision.

## The misconception to retire: decline analysis estimates reserves independently

It estimates a recoverable volume conditional on the drive mechanism continuing to behave as it has. It contains no independent information about how much oil is in the ground, which is why a decline-based EUR can be perfectly fitted, perfectly documented, and larger than the oil in place. The check against that is not a better fit. It is a second, volume-based method, and providing the cumulative that lets somebody run it is part of finishing the job.

## Exercise

Verify the bridge at a survey you have not used. Take 2022-01-01, where the goldens give $F$ = 236802.93216680066 rb and $E_t$ = 0.019507280052358564 rb/stb, and divide. Confirm you land within floating-point noise of the STOIIP.

Then do the part that matters. Take the fixture's 2023-01-01 cumulative of 261475.039999678 stb, imagine it had been produced by the monthly-snapshot route the Professional tier warned about rather than by the exact integral, and answer in one sentence, without computing anything: in which direction would the estimate of oil in place move, and why. If you can state the sign and the mechanism, you understand what you are handing over.
