# Injuries beside fatalities

{{panel:qr-alarp}}

A measure that prevents a fire or an explosion usually prevents injuries as well as deaths, and the benefit counts them. The engine takes each harm as a line of its own, with the expected cases a year and a value per case, and adds their product to the fatality benefit every year of the measure's life. This lesson reads the four lines of the published HSE CBA checklist example, one by one.

## The four lines

The checklist works one explosion measure over 25 years, undiscounted. Its inputs are golden, and the engine's benefit over the life sits beside each line:

| line | cases a year | value per case | benefit over the life, engine |
| --- | --- | --- | --- |
| fatalities | 0.0002 | 1336800 | 6684.00 |
| permanently incapacitating injury | 0.0004 | 207200 | 2072.00 |
| serious injury | 0.001 | 20500 | 512.50 |
| slight injury | 0.002 | 300 | 15.00 |

The fatality line is the checklist's deltaPLL of 2e-4 times the 2003 VPF of 1336800, over the life. The other three lines have exactly the same shape: expected cases a year times a value per case, over the life. The engine treats them identically; only the value per case differs.

## How much the injuries add

Read the last column down. The fatality line is 6684.00 of the benefit. The permanently incapacitating injuries add 2072.00, the serious injuries 512.50 and the slight injuries 15.00. In this example the injuries are a real share of the benefit, and a note that left them out would understate what the measure buys. The heavy line is the permanent incapacity: a small number of cases a year at a high value per case.

The values per case are the checklist's 2003 figures, and like the VPF they are illustrative, with no default in the engine. An analyst who uses them states them, with their year, on every line.

## Injuries count in the ratio, and the ICAF leaves them out

Two figures later in this tier treat injuries differently. The cost to benefit ratio uses the whole benefit, fatalities and injuries together, so the injuries make a measure look better value. The ICAF, the implied cost of averting a fatality, divides the cost by the fatalities prevented only, so it leaves the injuries out. That is why, when injuries are in the benefit, the verdict is read from the cost to benefit ratio against the DF, and the ICAF is reported beside the VPF for comparison only.

## A measure that prevents nothing

A benefit needs something prevented. A measure with no PLL reduction and no other harm prevented is refused:

> deltaPllPerYr: the measure prevents nothing (no PLL reduction and no other harm): there is no benefit to weigh the cost against

The message names both halves. A measure is refused only when it has neither a PLL reduction nor another harm to its credit, so the injury lines are part of what the engine checks before it will weigh a cost.

## Exercise

Take the serious injury line: 0.001 cases a year at 20500 a case over 25 years, which the engine gives as 512.50. Multiply the three inputs and check the engine value. Then add the four engine lines, write the total benefit over the life to two decimals, and say which of the four lines the ICAF would use and why.
