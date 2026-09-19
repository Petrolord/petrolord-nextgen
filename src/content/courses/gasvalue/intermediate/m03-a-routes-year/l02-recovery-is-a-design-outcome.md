# Recovery is a design outcome

The yield says what one Mscf makes. The recovery says what share of the parcel the route recovers. Recovery is a design outcome typed per route, and the engine ships no figure for it.

{{panel:gasvalue-route-explorer}}

## Four recoveries

EGBEMA's study typed a recovery on each route:

| route | yield per Mscf | recovery | productPerYear |
| --- | --- | --- | --- |
| Compressed natural gas | 18.5 kg CNG | 0.88 | 43345500.0000 kg CNG |
| Mini LNG | 0.0175 t LNG | 0.86 | 40070.6250 t LNG |
| LPG and condensate extraction | 0.0052 t LPG | 0.82 | 11352.9000 t LPG |
| Gas to power or gas to wire | 0.085 MWh | 0.94 | 212733.7500 MWh |

productPerYear is mscfPerYear times the yield times the recovery. On EGBEMA mscfPerYear is 2662500.0000 on every route, so each row's product rests on its own yield and its own recovery. The product prints in the route's unit: kilograms of CNG, tonnes of LNG and of LPG, megawatt hours.

Read the CNG row through the rule. The parcel is 2662500.0000 Mscf, the yield is 18.5 kg of CNG per Mscf and the recovery is 0.88, and productPerYear prints 43345500.0000 kg of CNG. The gas to power row reads the same way: a yield of 0.085 MWh and a recovery of 0.94 on the same parcel give 212733.7500 MWh.

## Two figures with two bounds

The yield and the recovery are separate inputs, and each has its own bound. The yield is bounded by the gas: module 2 showed a yield above what the gas holds refused on the route's basis. The recovery is bounded by the interval (0, 1], which the next section reads.

The four recoveries differ: 0.88, 0.86, 0.82 and 0.94. They are the EGBEMA study's own figures, invented and illustrative like every figure in this course.

## Refused outside (0, 1]

The engine refuses a recovery outside (0, 1]. Three CNG probes draw the same answer:

| probe | engine |
| --- | --- |
| CNG recovery 0 | REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. |
| CNG recovery 1.2 | REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. |
| CNG recovery left blank ('') | REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. |

Read the interval as the engine writes it. The round bracket at 0 leaves zero out. The square bracket at 1 lets one in. A recovery of 0 is refused, a recovery of 1.2 is refused, and a recovery left blank is refused. The blank is not taken as zero and not taken as one. It is missing, and the route gets no year. A cost box behaves another way: the next lesson but one shows a blank cost taken as zero and named in assumedZero. A blank recovery is refused.

The refusal carries a second sentence: "A recovery assumed at 100 percent is the quiet optimism that sinks these cases." The interval admits 1 when a study types it. The blank probe shows the engine supplies no recovery of its own when the box is empty.

## The same recovery in the abatement

The recovery a route types is read again in module 4, where abatement counts the flare the route avoids. The CNG route recovers 0.88 of EGBEMA's flare. The gas it does not recover is still flared, so the avoided flare CO2e is the flare's CO2e times the recovery. The abatement names a missing recovery in its own words when it blocks the net:

| probe | blockedBy |
| --- | --- |
| no recovery fraction | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |
| recovery 1.5 | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |

One typed figure feeds two answers: the product a route sells and the share of the flare it avoids.

In the panel, lower the CNG recovery and read productPerYear fall with it. Then type 1.2, then clear the box, and read the refusal.

## Exercise

Read the four recoveries and the productPerYear each gives. State the rule productPerYear follows. Then read the three CNG refusal probes, say what the interval (0, 1] admits and what it leaves out, and quote the second sentence of the refusal.
