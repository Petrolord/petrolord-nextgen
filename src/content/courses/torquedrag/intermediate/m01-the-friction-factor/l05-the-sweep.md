# The sweep

What the response to friction actually looks like.

{{panel:td-friction-explorer}}

## The build-and-hold well

| open-hole factor | pick up | slack off | rotating torque |
|---|---|---|---|
| 0.15 | 906096.6898234246 N | 507028.11679142975 N | 16949.222705897006 N.m |
| 0.20 | 945350.7794480124 N | 484767.47835422773 N | 19445.46690855205 N.m |
| 0.25 | 984604.8690725992 N | 462506.8399170256 N | 21941.71111120706 N.m |
| 0.30 | 1023858.9586971867 N | 439630.5454844936 N | 24437.955313862116 N.m |
| 0.35 | 1063113.0483217717 N | 414628.1337779693 N | 26934.19951651723 N.m |
| 0.40 | 1102367.1379463573 N | 387607.1838578943 N | 29430.44371917226 N.m |
| 0.45 | 1141621.2275709433 N | 358620.4197281696 N | 31926.68792182742 N.m |
| 0.50 | 1180875.3171955291 N | 327663.69165975624 N | 34422.932124482206 N.m |

## The pick-up column is a straight line

Take the differences: 39254.089625 N for every one of the seven steps, to twelve significant figures.

The pick-up hookload on this well is EXACTLY linear in the open-hole friction factor.

## Why it is linear and why that is surprising

Because friction feeds back into tension, which feeds back into side force, which feeds back into friction. That feedback should make the response nonlinear.

It is linear here because the feedback is weak on this geometry: the extra tension a larger factor produces raises the side force by a small fraction of itself. On a longer, more deviated well the same table curves upward.

## The slack-off column is not linear

Its differences are -22260.638437, -22260.638437, -22876.294433, -25002.411707, -27020.949920, -28986.764130 and -30956.728068 N. They grow in magnitude.

Slack off puts the string into less tension, and eventually into compression. Once compression starts, the buckling state and the side-force distribution change, and the tidy linearity goes.

That asymmetry is worth carrying: the pick-up response is well behaved and the slack-off response is not, so a calibration done on pick up is more stable than one done on slack off.

## The torque column

Differences of 2496.244203 N.m throughout, constant to the same precision. Torque is linear in the factor on this well for the same reason pick up is.

## What the linearity buys

It means one calibration point determines the factor exactly, with no iteration needed in principle. The bisection in the next module is doing a search over a straight line.

It also means the SENSITIVITY is a single number you can quote: on this well, 39254.089625 N of pick-up hookload per 0.05 of friction factor, or 785.081792 N per 0.001.

## What it does not buy

Linearity is not accuracy. A perfectly linear response to a parameter that absorbs four different physical effects is still a fitted parameter absorbing four different physical effects.

## Exercise

Run the same sweep on the horizontal well and take the differences of the pick-up column.

They are not constant. Explain why, and identify at which factor the response starts to depart noticeably from a straight line.
