# A verdict that used to fail open

A check that cannot run should say so. Before FC1-0 two of these droplet checks returned false when they had nothing to work with, and false is the word this engine uses for a vessel that passed.

{{panel:fc-slug-explorer}}

## A missing gravity that produced a verdict

The oil gravity sets the oil density, which appears in the density difference that drives both droplet calculations. Before FC1-0 a missing oil gravity did not refuse. The two droplet checks read NaN, every comparison against NaN came back false, and `waterCarryover` false is the answer that means no carryover.

So a vessel that carried water into the oil outlet reported no carryover, on a run where the engine had never been told what the oil weighed. A verdict for an input it could not read is a verdict that says nothing, and it said nothing in the reassuring direction.

The repair is a refusal by name: SeparatorInputError on `sgOil`, "sgOil is required: the oil specific gravity (got undefined)". A second refusal catches the gravities the wrong way round, "sgWater (1) must exceed sgOil (1.1) for the water to settle".

## A layer that was not there

The other fail-open was geometric. The retired rule divided the water area by the gas-liquid chord to get a layer thickness, which on AGBAMI gave 2.026834 ft where the exact inversion gives 3.049149 ft. The carryunder check then asked a rising oil drop to cross a layer thinner than the one in the vessel, so every crossing it timed came back shorter than the drum makes it.

## Why all of them point the same way

| retired behaviour | what it produced | direction |
| --- | --- | --- |
| NaN gravity read as a passing comparison | both verdicts false | permissive |
| chord rule for the water layer | thin water layer, short crossing | permissive |
| single dropletMicron argument | one size covering two checks | permissive on the harder check |

None of the three ever produced a false alarm. That is the pattern to carry out of this lesson: a defect that fails open is quiet, and a defect that fails closed announces itself the first time somebody sizes a vessel.

## What a verdict is for

A verdict is a claim that a specific drop, at a specific size, crossed a specific layer in less time than a specific phase stayed. Strip any one of those four and there is no claim left. That is why the engine refuses a missing droplet size, a missing viscosity and a missing gravity by name rather than substituting something reasonable.

## The mistake

The mistake is trusting a green result more than a red one. A red verdict arrives with the arithmetic that produced it and invites a check. A green verdict invites nothing, so a green verdict from a version of the method that could fail open is the one to re-run.

The second mistake is assuming the repair touched only the failing cases. Every vessel whose carryunder was judged against the chord rule was judged against the wrong layer, and the ones that passed comfortably were judged just as wrongly as the ones that did not.

## Exercise

Describe what a missing oil gravity did to the two droplet verdicts before FC1-0 and give the refusal that replaced it. Then explain why the retired chord rule made the carryunder check permissive, and say why a defect that fails open is harder to find than one that fails closed.
