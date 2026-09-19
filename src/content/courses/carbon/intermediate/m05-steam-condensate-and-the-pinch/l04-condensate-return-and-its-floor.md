# Condensate return and its floor

A failed trap loses steam. In practice, a condensate system that returns too little of its condensate loses hot, treated water that is replaced with colder makeup. This lesson reads condensateReturnValue, one of the energyEfficiency functions SECTION 1 lists, on the Isiokpo condensate system.

{{panel:carbon-efficiency-explorer}}

## The Isiokpo case

SECTION 16 prints Isiokpo raising its condensate return. Every figure is invented for this course and the emission factor is SYNTHETIC: 16 t of steam an hour, return raised from 0.35 to 0.65, condensate at 92 C against makeup at 27 C, a boiler efficiency of 0.83, fuel at 7.5 USD a GJ, raw water at 0.55 and treatment at 1.35 USD a tonne, 8400 hours, and a factor of 56.1 kg CO2e per GJ.

The engine prints the result twice, once with the treatment cost priced and once with it left blank:

| output | with treatment priced | with treatment left blank |
| --- | --- | --- |
| extraCondensateTonnesPerYear | 40320.000 | 40320.000 |
| energySavedGJPerYear | 13230.304 | 13230.304 |
| Fuel not burned reheating makeup | 99227.28 | 99227.28 |
| Raw water not bought | 22176.00 | 22176.00 |
| Treatment not repeated | 54432.00 | none |
| annualValue | 175835.28 | 121403.28 |
| complete | true | false |
| annualTonnesCo2e | 742.220 | 742.220 |

## What moves and what does not

Read the two columns row by row. The extra condensate, 40320.000 tonnes a year, is the same in both. So is the energy saved, 13230.304 GJ a year, and so are the carbon, 742.220 tCO2e a year, and two of the three money lines: 99227.28 USD of fuel not burned reheating makeup and 22176.00 USD of raw water not bought.

One money line differs. With the treatment cost priced, treatment not repeated is worth 54432.00 USD a year. With it blank, the line is none. And the total follows: an annualValue of 175835.28 USD against 121403.28 USD, with complete true against complete false.

The money in this section is US dollars, and every figure behind it is invented.

## The floor note

With the treatment cost blank, the engine returns a valueNote. It is quoted here as the engine's words, verbatim: "A floor, not the value: Treatment not repeated not priced. The treatment cost is the one usually left out."

The note does three things. It says the annualValue of 121403.28 USD is a floor. It names the line that was not priced. And it says which cost is the one usually left out. The engine still prints the total, and it prints complete false beside it and the floor note with it, so the total cannot be read as the whole value.

The same rule runs through this tier: a box nobody filled is named. Here the box is a price, and the engine names it in the note, where the trap of lesson three named a missing boiler efficiency in its fuel and carbon notes.

## What the engine refuses

SECTION 16 prints three refusals:

| the call | the engine says |
| --- | --- |
| boiler efficiency blank | REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed. |
| hours a year blank | REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year. |
| target return 1.2 | REFUSED: Return fractions must lie between 0 and 1. |

The boiler efficiency here is refused outright, where the trap of lesson three answered its steam and left the fuel absent. The refusal gives its own reason: the fuel saved depends on it and it is not assumed. A return fraction of 1.2 is refused because return fractions must lie between 0 and 1.

## Exercise

Read the two columns of the SECTION 16 table and the floor note. Say which lines are the same in both columns, which one money line separates them, what complete false beside 121403.28 USD tells a reader, and why the engine calls that figure a floor.
