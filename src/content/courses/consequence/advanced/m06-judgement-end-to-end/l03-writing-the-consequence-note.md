# Writing the consequence note

{{panel:cq-harm}}

Everything this course teaches ends in a document. The consequence note is what a reviewer reads when a layout is challenged, or what an inspector reads when a scenario is reopened years later. A note that carries only a final probability cannot be audited. A note that carries every input, every model, every warning and every limit can be recomputed by someone who disagrees, which is the point of writing it.

## What the note states

| part of the note | what goes in it |
| --- | --- |
| the release case | the hole, the pressure and the temperature, and the regime the engine reported |
| the weather | the wind and the stability class, and why that class |
| the receptor | its height, and whether it is on the centreline |
| the models | every model named by the method the engine reports |
| the stated inputs | every input that is not the engine's own: a pool thickness, a transmissivity, a TNT yield, a radiative fraction and a soot fraction |
| the warnings | every warning the engine returned |
| the harm | the probit preset and its source |
| the limits | what the engine did not model |

Each row answers a question a reviewer will ask. The stated inputs row matters most, because it carries the analyst's judgement. The engine's arithmetic is reproducible by anyone with the same inputs; the inputs themselves are where two competent analysts differ.

## When two methods disagree

This course has shown three places where methods disagree on the same case: the surface emissive power, where one heptane fire carries 30886.154395, 180128.456236 or 52025.691247 W/m2 by method; the thermal presets, where 20000 W/m2 for 20 s reads 0.022455 under Eisenberg and 0.537647 under Tsao and Perry; and the two toxic sources, where chlorine at 400 ppm for 10 minutes reads 0.441437 under Lees and 0.309443 under the Purple Book.

In each case the note says which one it used and why, and shows the other beside it. The disagreement is information. It tells the reader how far the answer depends on a choice the analyst made rather than on physics the engine computed.

## Naming what belongs elsewhere

The limits section names the seams as well as the engine's absences. A note from this course states that it gives effects and no frequency, so individual risk, the potential loss of life and the F-N curve remain for the quantitative risk course, and a risk matrix ranking remains for the risk and change course. It states that its heat fluxes are solid flame figures, so a point source estimate or a setback is a matter for the Facilities courses. Writing those sentences costs little and stops a reader from taking a consequence result for a risk result.

## Writing it as you work

The easiest note to write is the one kept alongside the calculation. Each engine call returns its basis, the model and its source, so copy the basis into the note as you go, together with any warning and every stated input. A note assembled afterwards from memory loses exactly the details a reviewer asks about first. Keep the refusals too. A refusal you met and worked around is a decision, so the note records the field the engine named and what you changed in response.

## Exercise

On the harm panel's probit view, run 20000 W/m2 for 20 s under each of the four thermal presets and record the probabilities. Write the harm and limits sections of a consequence note for that exposure: name the preset you would use and its source, show the other three beside it, state what kind of harm the probit covers, and add the sentences that name what belongs to other courses.
