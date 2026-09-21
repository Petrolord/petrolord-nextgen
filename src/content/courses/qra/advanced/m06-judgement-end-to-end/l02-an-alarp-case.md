# An ALARP case

{{panel:qr-alarp}}

An ALARP case starts from a person. The individual risk of the most exposed person is banded, and the band decides whether a demonstration is required at all. This lesson builds the individual risk half of a case from the EREMOR figures of the Associate tier, bands it with this tier's presets, and then says where a measure should aim and how it is weighed.

## The individual risk, rebuilt

| place | LSIR per year | operator hours a year, stated | contribution per year |
| --- | --- | --- | --- |
| process deck | 0.000148150000 | 1000 | 0.000016912100 |
| control room | 0.000006545000 | 800 | 0.000000597717 |
| accommodation | 0.000000108000 | 2560 | 0.000000031562 |

The EREMOR operator's IRPA is 0.000017541379 per year. The supervisor, whose time is given as fractions of the year (process deck 0.05, control room 0.2, accommodation 0.25), carries an IRPA of 0.000008743500 per year.

## Banding the people

The supervisor's IRPA of 0.000008743500 per year is TOLERABLE against the worker preset, 8.743500 times the lower limit, so an ALARP demonstration is required. The operator's IRPA is higher, so the operator is the more exposed of the two, and the case is written for the operator. The supervisor's band shows that even the less exposed role sits in the TOLERABLE region, so a demonstration cannot be avoided by choosing a different person to report.

Both are workers, so the worker preset applies. If the same installation put members of the public within reach of its scenarios, their individual risk would be banded against the public preset in a section of its own.

## Where a measure should aim

The process deck carries most of the operator's IRPA: 0.000016912100 of 0.000017541379 per year. On the deck, the flash fire carries 0.546743 of the LSIR. A measure that acts on the flash fire at the process deck therefore acts on the largest share of the most exposed person's individual risk. That points the search for measures before any cost is weighed, and the note records why the search started there.

## How the measure is weighed

A measure is weighed by its reduction in the PLL across everyone it protects, which is the societal side of the same scenarios. The analyst reruns the tree, the LSIR and the PLL with the measure in place, and the difference is the deltaPLL stated to `costBenefit`, with the VPF, the costs, the life, the rates and the DF. The weighing then runs exactly as it did for the EDIKAN firewall in the earlier modules, and the note reports the ratio, the verdict, the largest reasonably practicable cost and the ICAF, each with the choices behind it.

## Exercise

Take the supervisor's IRPA of 0.000008743500 per year. Divide it by the lower limit of 1e-6 and check the engine's 8.743500. Then take the operator's IRPA of 0.000017541379 per year, band it against the worker preset, and write the first two sentences of an ALARP note: the most exposed person's individual risk and its region, and whether a demonstration is required.
