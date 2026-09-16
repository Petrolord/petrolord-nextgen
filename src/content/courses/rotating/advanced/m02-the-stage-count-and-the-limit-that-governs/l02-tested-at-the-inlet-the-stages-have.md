# The temperature limit, tested at the inlet the stages have

The second rule that sets a stage count is a temperature, and the only hard part of it is deciding what temperature each trial stage starts from.

{{panel:fc-compressor-explorer}}

## One stage and more than one stage start from different places

A single stage starts from the suction and is never cooled, because there is nothing after it to cool for. Every stage after the first starts from the interstage cooler, so its inlet is the approach the cooler reaches.

The engine encodes exactly that. The inlet a trial count is tested at is the suction for one stage, and for more than one stage it is the hotter of the suction and the cooled temperature.

## On SOKU that rule bites

The SOKU duty cools back to 110.0000 degF against a suction of 104.0000 degF. Any trial of two or more stages is therefore tested from 110.0000 degF and not from 104.0000 degF, because 110.0000 degF is the hotter of the two and it is what the second and third stages actually see.

Against a stated discharge limit of 300.0000 degF, the stages the temperature limit demands is 3 while the ratio rule demands 2. The count the engine returns is 3, and the return says it was governed by discharge temperature.

## Why testing at the suction would be wrong

Test a three-stage trial from 104.0000 degF when the stages will run from 110.0000 degF and you have evaluated a machine that is not the one being built. The trial would be cooler than the real train at every stage after the first.

This is the whole reason the engine reports the inlet it tested at. A stage count is an answer about a specific set of inlets, and the count and the train have to be asked about the same set. When the approach sits at or below the suction the distinction costs nothing. When it sits above, it is the difference between a staging that agrees with its own train and one that does not.

## The limit is a stated input as well

The 300.0000 degF on this duty was typed. The engine applies a default when no limit is given, and that default is customary, unsourced in this repository and held for literature. Nothing in this course is graded on it.

## The mistake

The mistake is reading a stage count as a property of the pressure ratio. It is a property of the pressure ratio, the gas, the efficiency, the ratio limit, the temperature limit and the intercooler approach together. Change the approach and the count can change without a single pressure moving.

## Exercise

State the inlet rule the engine uses for one stage and for more than one stage, and give the suction, the approach and the inlet the SOKU count was tested at. Then say what the two rules each demanded on SOKU, which governed, and what would go wrong if a multi-stage trial were tested from the suction instead.
