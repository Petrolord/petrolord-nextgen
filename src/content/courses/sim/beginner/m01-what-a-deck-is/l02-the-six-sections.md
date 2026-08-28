# The six sections

A deck is read from the top down, and it is divided into sections that must appear in a fixed order. A keyword in the wrong section is not a warning; it is a different deck, or no deck at all.

## The order

| section | starts at line | what it settles |
|---|---|---|
| RUNSPEC | 3 | the size and shape of the problem |
| GRID | 32 | where the rock is and what it is made of |
| PROPS | 169 | how the fluids behave |
| SOLUTION | 253 | where the fluids were before anyone produced |
| SUMMARY | 262 | what to write out |
| SCHEDULE | 311 | what the wells do, and when |

Those line numbers are the Ekene deck's own. They are worth quoting because they tell you something about proportion: the GRID section runs from line 32 to line 168, which is 137 lines of a 940 line deck, and the SCHEDULE runs from 311 to the end, which is 630 lines. Two thirds of this deck is the well history.

## Why the order is fixed

Because each section depends on the ones before it.

RUNSPEC declares the dimensions, so the GRID section can be checked against them. GRID establishes which cells exist and how big they are, so PROPS tables have something to apply to. PROPS defines the fluids, so SOLUTION can equilibrate them under gravity. SOLUTION sets the initial state, so SCHEDULE has somewhere to start. SUMMARY sits between them because it names outputs, and it needs to know the wells exist by the time the run begins.

A simulator reading a deck is doing a single pass. It is not going back to reinterpret an earlier section in the light of a later one, which is why the order is a rule rather than a convention.

{{panel:sim-deck-explorer}}

Step through the sections. Watch how much of the deck each one takes, and notice that the section headers are bare keywords on their own lines, with nothing after them.

## What each section is for

**RUNSPEC** is the declaration. Grid dimensions, which phases are present, which unit system, the start date. Everything downstream is sized by it.

**GRID** is the rock. Cell sizes, the depth of the top of each column, porosity and permeability. This is geometry and static properties, nothing dynamic.

**PROPS** is the fluids and how they share the rock. PVT tables, relative permeability tables, capillary pressure, densities, rock compressibility.

**SOLUTION** is the initial condition. Where the contacts are, what the pressure is at a reference depth, how much gas is dissolved at each depth. The simulator puts the fluids where gravity would have put them.

**SUMMARY** is a list of things to record. It changes nothing about the physics. Leave a vector out and the run is identical, you simply cannot see that quantity afterwards.

**SCHEDULE** is time. Well definitions, completions, controls, and the sequence of dates and timesteps the simulator marches through.

## A useful reading habit

When you open an unfamiliar deck, find the six section headers first and note the line numbers. That gives you the shape of the thing before you read a single number. A deck that is nearly all SCHEDULE is a history-matched study; a deck that is nearly all GRID is a big static model with a short run; a deck with a tiny PROPS section is probably using defaults you should go and check.

## The misconception to avoid

"SUMMARY affects the run." It does not. It is a request for output and nothing else. This matters practically: if a colleague says a vector is missing from the results, that is a deck edit and a re-run, not a physics problem, and it is the cheapest kind of mistake to fix.

## Exercise

First, from the table above, compute how many lines each of the six sections occupies in the Ekene deck, and say which two dominate it.

Second, explain in one sentence why SOLUTION cannot be placed before PROPS.
