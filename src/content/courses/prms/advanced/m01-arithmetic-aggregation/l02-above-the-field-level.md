# Above the field level

{{panel:prms-aggregation-calculator}}

A total can be built at the field, property or project level, or above it, where fields are added into a company, a country or a portfolio. The engine takes the level as a stated input with no default, and the level changes one thing only: what may be reported.

## The level is stated

The aggregation calculator carries a Level (stated) control with two values, "field" and "above-field". Anything else is refused, verbatim:

> level must be one of "field", "above-field"; got "company"

Left unstated, the level is refused too, verbatim:

> level must be one of "field", "above-field"; got nothing

## The same figures, a different report

The Ekene Reserves were aggregated twice, once at each level, with the same three projects, the same correlation, the same seed and the same draws. The figures do not move:

| level | arithmetic 1P | statistical P90 (seed 20271112, 20000 draws) | what may be reported |
| --- | --- | --- | --- |
| field | 15.809794 | 17.300834 | arithmetic-or-statistical |
| above-field | 15.809794 | 17.300834 | arithmetic |

At the field level the engine reports "arithmetic-or-statistical": a sampled total may be reported beside the sums. Above the field level it reports "arithmetic" alone. The reasons print the rule each time. At the field level, verbatim:

> at the field, property or project level statistical aggregation may be reported (PRMS 4.2.5.4)

Above it, verbatim:

> above the field level report the arithmetic sums, with the caution that the aggregate 1P may be very conservative and the aggregate 3P very optimistic (PRMS 4.2.5.4; 17 CFR 229.1202(a)(3) (Regulation S-K Item 1202)); the statistical figures serve portfolio analysis (PRMS 4.2.5.5)

## Why the caution

In SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0), section 4.2.5.4 lets statistical totals stand at the field level and asks for arithmetic sums above it, and section 4.2.5.5 keeps the statistical figures for portfolio work. In the course's words: fields far apart share little, so a sum of their low estimates stacks up many unlikely shortfalls at once. The arithmetic 1P of a company's many fields is therefore very conservative, and its arithmetic 3P, a sum of many unlikely successes, very optimistic. The engine still prints the sampled figures above the field level, marked as estimates on the stated seed and draws, because a portfolio analyst may use them.

## What the engine does not choose

The engine does not decide where a field ends: whether three projects form one field or three is the caller's statement, and the level control records it. A report that quotes a total names its level for that reason.

The next lesson reads the United States rule that the engine cites beside PRMS 4.2.5.4, and the last lesson of this module shows how far apart the arithmetic 1P and the sampled P90 sit on the Ekene projects.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the "What may be reported" and "Level" tiles and the last reason. Switch the start to "Ekene Reserves above the field level" and compare every figure in the three tables: list what changed and what did not. Then set the Level (stated) control to "not stated" and read the refusal. Restore it to "above-field", and write one sentence saying which figures a company report may quote at this level.
