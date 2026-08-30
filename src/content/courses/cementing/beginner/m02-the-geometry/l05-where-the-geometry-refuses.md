# Where the geometry refuses

Five inputs the engine will not accept, and why each is a data error rather than a design choice.

{{panel:cm-volume-explorer}}

## A liner

    Liner jobs (hangerMd > 0) are a later phase; v1 cements a full string from surface.

A hanger depth above zero means the casing does not reach surface and is run on a work string, which changes the flow path, the displacement volume and the U-tube completely. The engine says which phase it belongs to rather than pretending.

## A float collar below the shoe

    Float collar must sit at or above the shoe.

A float collar deeper than the shoe is not a shoe track, it is a typo. The engine also accepts a float collar exactly AT the shoe, which is a job with no shoe track: unusual, and legitimate.

## A top of cement below the shoe

    TOC must be above the shoe.

Cement above the shoe is what a primary job places. A requested top below it is either a squeeze or a mistake, and this engine does neither.

## A hole description with a gap

    Hole geometry does not cover 500-1400 m.

Named with the interval, so the reader can go and find the missing section.

## A casing that does not fit

    Casing OD does not fit the hole at 1400-3000 m.

Also named, and also distinguishing whether the offending bore was casing or open hole, so the reader knows which number to check.

## A lead and tail split outside the cement

    Lead/tail split must sit between TOC and the shoe.

A split above the top of cement would put lead where there is no cement at all; a split below the shoe would put it below the job.

## Why refusing is the right behaviour

Every one of these could be given a plausible answer. A liner could be treated as a short full string. A gap could be filled with the section above it. A split outside the range could be clamped.

All six of those would return a number, and all six numbers would be wrong in a way no reader could detect. A named refusal costs a few minutes and a plausible wrong volume costs a cement job.

## Exercise

For each of the six refusals, say what a plausible wrong answer would have been if the engine had guessed instead.

Then say which of the six wrong answers would have been hardest to spot in a finished volume sheet.
