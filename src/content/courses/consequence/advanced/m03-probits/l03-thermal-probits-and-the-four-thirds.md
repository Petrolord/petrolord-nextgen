# Thermal probits and the four thirds

{{panel:cq-harm}}

A person caught near a fire is harmed by two things together: how intense the heat flux is and how long they stay in it. A thermal probit folds both into one measure, the thermal dose, and then applies the probit line. This lesson reads that measure, its unusual exponent and the unit trap it carries.

## The thermal dose

The engine exports its thermal presets as `THERMAL_PROBITS`, each of the form Y = a + b ln(t I^(4/3)), with t the exposure in seconds and I the intensity in the unit each source prints. The thermal dose is t I^(4/3). Time enters to the first power and intensity to the four thirds, so the heat flux counts for more than the time.

The table shows it. Two exposures from the engine's sweep have the same product of heat flux and time, and the one at the higher heat flux is worse:

| exposure, stated | eisenberg probability |
| --- | --- |
| 10000 W/m2 for 40 s | 0.004702 |
| 20000 W/m2 for 20 s | 0.022455 |

Half the time at twice the heat flux gives the larger probability, because doubling the heat flux multiplies the thermal dose by more than doubling the time does. A fire study that shortens an escape time cannot buy back an equal rise in heat flux.

## The unit each preset expects

Three of the four presets print their coefficients for I in kW/m2. The engine is always FED the heat flux in W/m2, and each preset converts to its own unit before it applies the power. That keeps the heat flux you type in one unit whatever preset you choose, and it hides a trap you meet when you copy a coefficient pair from a paper: the unit of I in that paper decides the value of a.

The engine's worked figure for Eisenberg: at 20000 W/m2 for 20 s the probit is 2.994507, with a thermal dose of 1085.767047 in s (kW/m2)^(4/3).

## The W/m2 form of Eisenberg

The Eisenberg preset, a = -14.9 and b = 2.56 in kW/m2, can be written for q in W/m2 as -14.9 + 2.56 ln(t q^(4/3) / 1e4). The engine's source string gives that form beside the kW/m2 one. It is the same probit, because (1000 I)^(4/3) is 1e4 I^(4/3): converting the unit inside the thermal dose multiplies it by a fixed factor, which the division by 1e4 removes.

The golden checks it at 10000 W/m2 for 30 s: the engine gives 1.666556, the golden 1.666556.

## Why Eisenberg is graded

The Eisenberg preset is one of the graded quantities in this course. What stands behind it is the lethal doses that UK HSE OSD/30 prints in its Table 17, against which the engine's own lethal doses are checked. The next lesson reads those lethal doses beside the other presets, two of which read far higher than Eisenberg at the same exposure.

## Exercise

On the harm panel's probit view, choose the Eisenberg preset and enter 20000 W/m2 for 20 s. Confirm the probit of 2.994507 and read the thermal dose the panel prints with it. Then enter 10000 W/m2 for 40 s and 20000 W/m2 for 20 s and confirm both probabilities in the table above. Write one sentence for a consequence note explaining to a reader who knows no probits why the second exposure is worse than the first.
