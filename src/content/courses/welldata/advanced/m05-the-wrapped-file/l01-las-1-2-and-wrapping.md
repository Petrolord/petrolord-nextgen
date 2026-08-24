# LAS 1.2 and wrapping

Five of the six teaching files put one depth step on one physical line. Read a line, get a depth and its readings, move on. The sixth file breaks that model legally. `wrapped_12.las` declares `WRAP. YES` in its version section, and from that point on a single depth step's readings continue across several physical lines.

This module is about that file and about how the engine handles it, which turns out to be more interesting than the format rule itself. Start with the rule.

## What wrapping is

In an unwrapped file the layout is one record per line. The depth value comes first, then the reading for each curve in the order the curve section declared them, then a line break, then the next depth.

In a wrapped file the record is the same and the line breaks are different. The depth value opens the record on a line of its own, the curve values continue on as many following lines as the writer needed, and the next depth starts a fresh line. Nothing about the record changed. The values are still in curve order, still complete, still one set per depth step. Only the position of the line breaks changed.

That distinction is worth holding onto, because it is the whole of the format rule. Wrapping is a statement about where the writer put line breaks. It is not a statement about the order of the values, the meaning of the columns, or what a null looks like. A null wraps like any other value, sitting in the same slot in the same curve order it would have occupied if the record had been written on one line.

## Why the format allowed it

LAS 1.2 was written when a text line was expected to stay inside 80 characters, which was the width of a terminal, a punched card and most printers of the period. A logging run with a dozen curves cannot fit a dozen formatted numbers into that width. Rather than let files exceed the line length that the tools of the day could handle, the standard offered a way out: keep writing the record on the next line.

The constraint that motivated it is long gone. LAS 2.0 made one line per depth step the normal layout and wrapping became a legacy feature. Wrapped files did not go away, though. They sit in archives, and archives are exactly what a data manager gets asked to load. A file written decades ago is still a file, and the well it describes is still in the field.

## What wrapped_12 declares

The file in this teaching set is LAS version 1.2, with wrap YES, and its curve section declares 5 curves including the depth index. Excluding the depth index, that is 4 curves, which is what the file contributes to the campaign total. It holds 161 depth samples.

That count of 161 samples is one of the six numbers the Expert capstone grades, and it carries a tolerance of zero. It is the reason this module exists rather than being a footnote in the previous one. Everything else in the campaign is a roll-up of a check you already know. This one number depends on how the parser reassembles a file whose line breaks do not line up with its records.

## Wrap is declared once and governs everything

Read the file top to bottom and there is exactly one place where wrapping is announced: the `WRAP` line in the version section, before any curve or any data appears.

There is no per-line marker. There is no continuation character at the end of a line that carries on. There is no indentation rule, no blank line between records, nothing in a data line that identifies it as the start of a record rather than the middle of one. Given a single data line pulled out of the file, you cannot tell which it is.

That is why the version section is read first, and it is why the other five teaching files declaring `WRAP. NO` is a fact worth checking rather than assuming. A reader that skips the version section and jumps to the data has thrown away the only evidence the file offers about its own layout.

## What a naive reader does with it

The failure mode is worth naming now, because the rest of the module is about a design that avoids it.

A reader built on the assumption that one line is one record counts physical lines and reports that count as the sample count. On a wrapped file that overcounts, and every value after the first record lands in the wrong place. Depths are read as curve values, curve values are read as depths, and whole curves shift into each other.

What makes this dangerous is that the results still look like log readings. A gamma ray value read as a depth is a number in the hundreds or the tens, which is not visibly absurd in a shallow well. Nothing in the values screams. The arithmetic screams, which is why the arithmetic is the check.

## Why this file matters to the campaign

Out of six files in this delivery, `wrapped_12.las` is the only one where the number of physical lines in the data block and the number of depth samples are different numbers. Every other file in the set has a data block where those two counts agree, so a reader could get the right answer there for the wrong reason and never find out.

The campaign grades the sample count of the one file where the wrong reason gives the wrong answer. That is deliberate. A count that can only be produced by the correct mechanism is a much better test than one that any mechanism happens to get right.

## Exercise

Write down, in your own words, what changes and what stays the same when a file is written in wrapped mode rather than one record per line. Then answer two questions. First, given a single line taken out of the middle of the data section of `wrapped_12.las`, what can you tell about whether it starts a record? Second, why does the count of 161 depth samples make a better graded field than the same count taken on `basic_20.las`?

As a self check: what changes is where the line breaks fall, and what stays the same is the order of the values, the curve contract they follow, the completeness of each record and the treatment of nulls. Given one line out of the middle of the data section you can tell nothing about whether it starts a record, because wrapping is declared once in the version section and no marker appears in the data lines themselves. And 161 is the better graded field because `wrapped_12.las` is the only file in the delivery where the physical line count and the depth sample count differ, so a reader that counts lines gets the wrong answer here and the right answer everywhere else.
