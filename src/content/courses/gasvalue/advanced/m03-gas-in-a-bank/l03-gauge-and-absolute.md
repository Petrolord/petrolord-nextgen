# Gauge and absolute

In practice, a pressure gauge on a bank reads the pressure above the atmosphere around it. `gasMassInVessel` takes absolute pressure: every pressure in lpgCng is absolute, and the engine prints pressureBasis "absolute (bar(a))" on every CNG result. This lesson reads what a gauge reading typed as absolute does to a bank's mass.

{{panel:gasvalue-rollout-explorer}}

## One bank, two pressures

A bank at IBAFO reads 249 bar on its gauge. The site's atmosphere is taken as 1.013 bar(a). Both figures are invented for the course. The bank is 2 m3 of gas 0.62 at 30 C, like IBAFO's other banks.

The engine was given the pressure two ways:

| pressure given to the engine | bar(a) | massKg |
| --- | --- | --- |
| the gauge reading typed as if absolute | 249 | 424.4393 |
| gauge plus atmosphere | 250.0130 | 425.6447 |
| absolute minus gauge-as-absolute | 1.0130 | 1.2054 |

## Reading the three rows

The first row is the shortcut the engine does not take: the gauge reading, 249, typed as if it were absolute. The engine reads whatever it is given as bar(a), and it returns 424.4393 kg.

The second row is the gauge reading plus the atmosphere: 250.0130 bar(a). On that pressure the engine returns 425.6447 kg.

The third row is the difference the table above prints: absolute minus gauge-as-absolute. It is 1.0130 bar in pressure and 1.2054 kg in mass.

The pressure difference in the third row, 1.0130, is the site atmosphere typed, 1.013. The mass difference in the same row is 1.2054 kg.

## The basis on the result

The engine takes the number it is typed and reads it as bar(a). The result prints pressureBasis absolute (bar(a)) beside the mass. The reader is the one who checks that the number typed was on that basis.

## The trap that looks finished

A gauge reading typed as absolute gives a figure that looks finished. 424.4393 kg prints to four decimals, like 425.6447 kg. The two rows differ in the basis of the pressure typed, and each is a mass the engine computed on a pressure it read as bar(a).

## The same atmosphere everywhere

The atmosphere in this lesson is the site's, taken as 1.013 bar(a). It is an invented, illustrative figure like every other figure at IBAFO.

## Where the basis follows

The cascade, the compressor and the forecourt all carry the same basis. The cascade prints pressureBasis absolute (bar(a)). The compressor bridge prints pressureBasis absolute (bar(a)) and converts its suction to psia. Every pressure in lpgCng is absolute, so each of them reads its pressures as bar(a).

In practice, a station's log records whether each pressure it lists was read as gauge or absolute, and which atmosphere the site takes.

## In the explorer

Open the bank in the panel. Type 249 as its pressure and read the mass. Turn on the gauge toggle, which adds the stated atmosphere, and read the mass again with the difference the panel shows beside it.

## Exercise

Read the gauge table: 249 typed as if absolute giving 424.4393 kg, 250.0130 bar(a) giving 425.6447 kg, and the row absolute minus gauge-as-absolute, 1.0130 bar and 1.2054 kg. Say which row the engine's basis calls for, what the third row prints, and what field the engine prints on every CNG result to state its basis. Then say what the second row's 250.0130 bar(a) is made of.
