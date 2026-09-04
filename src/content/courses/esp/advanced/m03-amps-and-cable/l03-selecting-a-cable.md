# Selecting a cable

Selection is a sorted scan with an early exit. Smallest conductor first, and the first candidate that passes is the answer, which makes the order of the table part of the method.

{{panel:pd-power-explorer}}

## Cheapest first, stop at the first pass

`selectCable` walks the five shipped conductor sizes from the smallest and takes the first that clears the voltage drop limit, 5 percent by default. Golden electrical case 1 runs 33.500000 A down 7200 ft at 180 degF.

| Candidate | Ohms per 1000 ft at 77 degF | Drop, percent | Passes |
| --- | --- | --- | --- |
| 6 AWG | 0.4028 | 8.588373 | false |
| 4 AWG | 0.2533 | 5.400781 | false |
| 2 AWG | 0.1593 | 3.396544 | true |
| 1 AWG | 0.1264 | 2.695060 | true |
| 1/0 AWG | 0.1002 | 2.136432 | true |

Three candidates pass and 2 AWG is chosen, at 3.396544 percent, 2481.517046 V at the surface and 4.729921 kW lost in the cable. The two larger conductors both drop less and neither is selected: the routine buys the smallest acceptable conductor, not the best one.

Golden electrical case 2 puts 38.220000 A down 6000 ft at 210 degF on a 1300 V plate: 6 AWG reads 15.880619 percent, 4 AWG 9.986496, 2 AWG 6.280493, and 1 AWG passes at 4.983392. The pick lands one size up from the first case, and 2 AWG at 6.280493 against a 5.0 percent limit shows how coarse the steps are.

## When nothing qualifies, nothing comes back

The published gate fixture for that case runs 53.600000 A against a 1.0 percent limit. Every candidate fails: 58.884593 percent on 6 AWG down to 14.648054 percent on 1/0 AWG, and the routine returns no cable at all rather than the least bad one dressed up as an answer.

The teaching well QUA-IBOE-4 does the same on the default limit. Its 46.753944 A leaves even 1/0 AWG at 6.017615 percent, and the selection comes back as none.

## What it refuses

It refuses to return a failing candidate. No cable is the honest output when no cable passes, and the caller must widen the limit, shorten the string or change the motor voltage.

It refuses to rank on anything but conductor order. Cost, armour, outside diameter, insulation temperature rating and weight are absent from the table and from the decision.

## The mistake

Reading a returned cable as a recommendation. It is the smallest conductor whose resistive drop passed: on the teaching well IBENO-2 that is 6 AWG at 3.142777 percent, with 1/0 AWG available at 0.781793 percent. Reading "none" as a crash is the same mistake inverted. It is a verdict.

## Exercise

Run golden electrical case 2 in the panel and list all five drop percentages, then name the chosen cable and the one that missed.

Then run the teaching well QUA-IBOE-4, record what comes back, and state the smallest change that would give it a cable.
