# Working the capstone

The assessment gives one export line and asks for the figures a designer would hand over. Every one of them comes from running the chain in order and reading what the engine returns, with nothing carried across from a worked example.

{{panel:fc-wall-pig-explorer}}

## The wall comes before the rating

A wall is sized from a design pressure, an outside diameter and a specified minimum yield, under a code and a location class that together give the design factor. The joint factor and the temperature derate divide beside it. The corrosion allowance adds on top.

Two numbers come out and they are not interchangeable. The pressure wall is the steel holding the design pressure. The required wall is what gets ordered.

The rating is the same relation read backwards, and it is asked of the wall the mill actually rolled rather than the wall the design asked for. Decide whether the allowance is respected before reading the answer, because both calls are legal, both are correct for what they were asked, and neither warns.

## The volume chain runs in one direction

Bore and length give the line volume. The line volume times a holdup gives the swept volume. Length over pig speed gives the run time. The swept volume against the catcher's limit and the dropout rate gives the interval.

Each step needs only the step before it, so an error early travels the whole way down without being contradicted. Check the bore and the length before anything else, because both the volume and the run depend on them.

## State the conditions with the answers

Four inputs in this tier are stated conditions rather than results, and each one has to travel beside the figure it produced.

The location class and the code, because the wall is meaningless without them. Whether the corrosion allowance was respected in the rating. The holdup, because the swept volume is a straight multiplication by it. The pig speed, because the run time is a length divided by it.

## Precision and refusals

Liquid work prints to six decimals, and the run time is liquid work: the OGBIA duty reports 2.444444 hours. Barrels and days print to four, 1633.5349 bbl and 3.7997 days on that same line. Counts are whole numbers. Quote what the engine returned rather than a rounding of it.

If any step returns an object carrying an error, that error is the answer to give. A refusal is a result, and writing a number where the engine declined to produce one is the worst available answer.

## What cannot be reached from here

No graded figure in this course rests on a held item. The c factor, the efficiency, the roughness, the resistance sum, the location class and the holdup are stated conditions wherever they appear, so a reader who wants to check an answer can check it against the condition rather than against an unsourced table.

## Exercise

Write the order of the wall chain from design pressure to a rating on the wall as built, naming what each step needs. Then write the volume chain from bore and length through to an interval, list the four conditions that must be stated alongside the answers, and say what to report when a step returns an error.
