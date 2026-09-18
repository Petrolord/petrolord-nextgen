# A factor computed rather than typed

The correction factor on this engine is an equation. It is evaluated from a closed form in P, R and the shell pass count, and it comes back on the same answer as the groups that produced it. Nothing here asks a user to read a value off a chart and type it into a box.

## What the answer carries

The return has four keys. The factor itself, the shell pass count it was evaluated for, the equivalent single-shell P that the closed form was actually read at, and a warning slot that holds nothing when the curve is well behaved. A factor without its shell count is not identifiable, because the same P and R give a different factor at every count.

| case | P | R | F at one shell pass |
| --- | --- | --- | --- |
| the studio case | 0.171875 | 2.909091 | 0.964693 |
| ORON | 0.204107 | 2.416739 | 0.957197 |

Both of those sit close to one, which is what a low P buys. Whatever the factor turns out to be, it lands in the surface without anything standing between the two: the area on this engine is the duty divided by the coefficient, the factor and the log mean, so an error of one percent in the factor is an error of one percent in the steel. That is the reason the factor is worth a module of its own at this tier.

{{panel:fc-coefficient-explorer}}

## The published cases, and what the golden column is

| P | R | F | golden F |
| --- | --- | --- | --- |
| 0.400000 | 0.800000 | 0.945353 | 0.945353 |
| 0.300000 | 1.500000 | 0.938660 | 0.938660 |
| 0.500000 | 1.000000 | 0.802278 | 0.802278 |
| 0.250000 | 2.500000 | 0.900870 | 0.900870 |
| 0.600000 | 0.500000 | 0.882889 | 0.882889 |

Read those two columns as two methods meeting. A golden figure is not the engine answering a second time. The published case file is written by the oracle, which reaches each answer by a different route, so a golden column agreeing with an engine column is evidence about the method rather than a restatement of it. Where the two agree to every digit printed, two independent routes have landed on the same number.

## Why a computed factor changes the work

A typed factor is an input, and an input is only as good as the reader who found it. A computed factor is a function of four temperatures already on the screen, so it cannot disagree with them. That closes a class of error in which a chart is read at the wrong R, or for the wrong number of shell passes, or carried forward after the temperatures beside it have been edited.

It also moves the interesting question. With the factor computed, the thing worth asking is no longer what value to use. It is whether this configuration can reach the duty at all, which is the subject of the next three lessons.

The shell pass count returned beside the factor is part of the same discipline. One shell pass is the default, and the equivalent single-shell P reported on the answer is equal to P itself at that default. At any higher count the two separate, and the fourth key is the only place a reader can see which value the closed form was really read at. A factor quoted without that count is a number nobody can check, including the person who produced it.

## Exercise

Record F at one shell pass for the studio case and for ORON, with the P and R each one was computed from. Then take any two rows of the published table, write down the engine figure and the golden figure, and say in one sentence what it means that the two agree.
