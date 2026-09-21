# Two measures on one source

Every AGBOR measure names the source it acts on. When two measures act on the same source, the tonnes they claim cannot simply be added, and `abatementCurve` says so in its result. This lesson reads SECTION 20's interaction output on the six invented measures, with money in US dollars.

{{panel:carbon-abatement-explorer}}

## What each measure acts on

SECTION 18 prints the source beside every measure:

| measure | tonnes abated a year | acts on |
| --- | --- | --- |
| Tune the fired heaters | 760 | heaters |
| Repair failed steam traps | 1150 | steam |
| Heat integration project | 3400 | heaters |
| Flare gas recovery | 6200 | flare |
| Solar for purchased power | 2100 | power |
| Vapour recovery on the storage tanks | 1850 | vents |

Two measures name heaters. Every other source is named by one measure.

## The engine's interaction output

SECTION 20 prints the curve's interaction table and one flag:

| source | measures |
| --- | --- |
| heaters | Tune the fired heaters; Heat integration project |

The flag is additive false. The engine's note, verbatim: "Measures listed here act on the same source, so their abatements overlap and the cumulative curve is an upper bound. Resolving the overlap needs an engineering judgement about sequencing, so the overlap is flagged here and the sequencing is left to that judgement."

## Reading the note

The note makes three statements. The two heater measures' abatements overlap. Because they are counted in full on the axis, the cumulative curve is an upper bound: the 15460.000 t the curve ends at is the most the six measures could give together, as costed. And the engine does not resolve the overlap: it names the source and the measures and leaves the sequencing to an engineering judgement.

The engine does not reduce either measure's tonnes. Tune the fired heaters still prints 760.000 t a year on the curve and the Heat integration project 3400.000 t a year. What changes is the label on the total. The step widths, the cumulative ends and totalAbatementTonnes carry both heater measures at their full tonnes, and the flag and the note tell a reader how to read them.

In practice, tuning a heater and then integrating its heat act on the same fuel, so the second measure works on what the first left behind; the engine leaves that judgement to the engineer.

## What the label carries into a target

When the curve is checked against a target, the label travels with the verdict. SECTION 21 states the rule: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound." A verdict read from an upper bound is a verdict on tonnes the measures could give at most. At the Agbor inputs no curve in SECTION 21 meets the condition: every row prints meetsTarget none. The next three lessons read why.

## Where the flag sits among the curve's outputs

SECTION 20 prints additive false in the same table as totalAbatementTonnes 15460.000, netAnnualCostOfAll 290443.84 USD and weightedAverageCostPerTonne 18.7868 USD. Every one of those figures is built on the full tonnes of both heater measures. The flag is the reader's warning that the sum beneath them is an upper bound.

## Exercise

Read the acts-on column for the six measures, the interaction table, the additive flag and the tonnes a year of the two heater measures on the curve. Say what the flag and the note, read with the two tonne figures, show about the curve's total of 15460.000 t.
