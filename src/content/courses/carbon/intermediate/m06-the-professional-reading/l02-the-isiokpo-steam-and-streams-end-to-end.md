# The Isiokpo steam and streams end to end

This lesson reads the rest of the Isiokpo plant as a chain: one failed trap, one condensate system and four process streams, each a separate call with its own refusals. Every figure is invented for this course, and the fuel emission factor is SYNTHETIC.

{{panel:carbon-efficiency-explorer}}

## The trap

The lab prints the trap failed open: a 4 mm orifice, 9 bar a upstream, a discharge coefficient of 0.72, a steam density of 4.65 kg/m3 and 8400 hours a year.

| isentropic exponent | kg an hour | tonnes a year | annual cost USD | annual fuel GJ | annual tCO2e |
| --- | --- | --- | --- | --- | --- |
| 1.135 | 42.3520 | 355.757 | 7826.65 | 1135.851 | 63.721 |
| 1.3 | 44.4620 | 373.481 | 8216.58 | 1192.439 | 66.896 |

The stated exponent is 1.135, for dry saturated steam. At the superheated exponent the lab computes 17.724 tonnes a year more. The flow is choked. The engine's note, verbatim: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5774, so the loss depends on the upstream pressure alone."

The trap refuses a blank exponent, discharge coefficient or hours. It reports the steam without a boiler efficiency and leaves the fuel and carbon absent, with the fuel note that a boiler efficiency is "not assumed to be 1". Hours left out of the call take the stated default of 8760, 371.004 tonnes a year.

## The condensate

The record raises the return from 0.35 to 0.65 on 16 t of steam an hour, with condensate at 92 C and makeup at 27 C.

| output | with treatment priced | with treatment left blank |
| --- | --- | --- |
| extraCondensateTonnesPerYear | 40320.000 | 40320.000 |
| energySavedGJPerYear | 13230.304 | 13230.304 |
| annualValue | 175835.28 | 121403.28 |
| complete | true | false |
| annualTonnesCo2e | 742.220 | 742.220 |

With the treatment cost blank the value is a floor, and the engine says so in its note: "A floor on the value: Treatment not repeated not priced. The treatment cost is the one usually left out." A blank boiler efficiency here is refused outright, and so is a target return of 0.25 below the current 0.35.

## The streams

The engine targets the four streams:

| minimum approach C | hot utility kW | cold utility kW | pinch hot C | pinch cold C | heat recovered kW |
| --- | --- | --- | --- | --- | --- |
| 10 | 1.800 | 216.000 | 118.000 | 108.000 | 585.150 |
| 15 | 25.950 | 240.150 | 118.000 | 103.000 | 561.000 |
| 20 | 59.700 | 273.900 | 118.000 | 98.000 | 527.250 |

At 15 C the heat flow is zero at shifted 110.500 C, inside the range, which makes it a pinch. The threshold case beside it has its only zero at the top of the cascade and is reported with no pinch. The minimum approach is required, and a negative heat capacity flowrate is refused.

## Three kinds of answer

The three calls show three ways the engine handles what it was not given.

It refuses. A trap with no exponent, a condensate system with no boiler efficiency, a problem table with no minimum approach: no answer prints.

It answers in part and names the gap. A trap with no boiler efficiency reports its steam and leaves fuel and carbon absent. A condensate system with no treatment cost reports a total, marks it complete false and calls it a floor.

It applies a stated default only where one is stated. Hours left out of the trap's call take 8760. Hours left blank are refused.

The course lists the trap's rule and the two pinch rules among those in force: a trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year; only an interior zero of the cascade is a pinch; a negative heat capacity flowrate is refused. Its MD45-1 table adds that a trap is choked only at or below the critical pressure ratio.

## Exercise

Read the three calls of this lesson. For each, name one box the engine refuses when blank. For the trap and the condensate system, name one figure the engine still reports when a different box is blank. Then say what the engine attaches to the condensate total of 121403.28 USD, and what the cascade's zero at shifted 110.500 C lets the engine name.
