# Wrapped mode

One depth step, one line. That is the model the previous lesson built, and for five of the six teaching files it is right. The sixth breaks it legally: `wrapped_12.las` declares `WRAP. YES`, which means a single depth step spans several physical lines.

## Why the format allows it

LAS 1.2 was written when a text line was expected to stay within 80 characters, the width of a terminal, a punched card and most printers of the era. A logging run with a dozen curves cannot fit a dozen formatted numbers in 80 columns, so the standard offered wrapped mode: write the depth value on its own line, then continue the curve values on as many following lines as needed, then start the next depth on a fresh line.

The constraint that motivated it is long gone, which is why LAS 2.0 made one line per depth step the normal layout. Wrapped files have not gone away, though. They sit in archives, and archives are precisely what a data manager is asked to load.

## A real record

Here is the top of the data section in `wrapped_12.las`, the first two depth steps:

```
 1500.0000
   43.1351     2.1893
    0.2338   399.7369
 1500.5000
   42.4200     2.1920
    0.2284   399.5260
```

Read it against the curve contract, which for this file is the same five curves as everywhere else in the teaching set: DEPT, GR, RHOB, NPHI, DT. The depth `1500.0000` sits alone on its own line. The next line carries gamma ray 43.1351 and bulk density 2.1893. The line after that carries neutron porosity 0.2338 and sonic transit time 399.7369. Those five numbers are one sample, at 1500.0 m, written across three physical lines. Then `1500.5000` starts the next record.

Nulls wrap like anything else. A little further down, the gamma ray value for 1502.5 m is written `-999.2500`, in the same slot on the same continuation line as every other gamma ray value. Wrapping changes the line breaks, never the order or the meaning of the columns.

## How the parser handles it

Here is the satisfying part: the engine has no wrap branch at all. It records `WRAP` from the version section and reports it, but the data reader never consults it.

The reason is the design described in the previous lesson. The data reader walks the lines after `~A`, skips blanks and `#` comments, splits each remaining line on whitespace, converts every token to a number, substitutes the declared NULL with NaN, and pushes the result onto one flat array. Line boundaries are discarded in that step. What comes out is a single stream of 805 numbers in file order, identical to the stream a one-line-per-sample version of the same file would produce.

Reshaping happens afterwards, by arithmetic. The curve section declares 5 curves, and 805 divides by 5 exactly, giving 161 samples. Tokens 1 to 5 are the first sample, tokens 6 to 10 the second, and so on. Wrapped and unwrapped files travel the same code path because the format's own rule, values in curve order without gaps, is a statement about the token sequence rather than the lines.

## The proof that unwrapping worked

You do not have to trust any of this. The header states the answer. `wrapped_12.las` declares `STRT 1500.0000`, `STOP 1580.0000` and `STEP 0.5000`, all in metres, so the file must contain

(1580 - 1500) / 0.5 + 1 = 161

depth samples. If the parser reports 161, the reassembly is correct. That 161 is one of the six numbers the Associate capstone grades, and it is the most useful check you can run on any LAS file: compute the expected sample count from the header, then compare it with what the reader produced. A mismatch means either the header lies or the reader misread the data, and both are worth knowing before the curves reach an interpretation.

## The failure mode

Now the naive reader. Point a line-per-sample parser at this file and it counts physical lines: 483 of them, because each of the 161 records occupies three. It reports 483 samples for an interval that can hold only 161, and every sample after the first is wrong. Depth 1500.5 becomes 43.1351, a gamma ray value read as a depth. Whole curves shift into each other.

The overcount is not subtle at three times the true count, but the values themselves all look like plausible log readings, which is what makes this class of bug dangerous. Nothing in the numbers screams. Only the arithmetic does.

The warning was there the whole time, in the very first section of the file. `WRAP` is declared once, in `~V`, and it governs the entire data block. There is no per-line marker, no continuation character, no way to tell from a data line alone whether it is a new record or a continuation. That is why the version section is read first, and why the other five teaching files declaring `WRAP. NO` is a fact worth checking rather than assuming.

Try it yourself: the panel below runs the real parser over the teaching files.

{{panel:wd-las-inspector}}

## Exercise

Count the physical lines each depth step of `wrapped_12.las` occupies, then predict the total number of lines in its data section. Self-check: three lines per step, so 3 x 161 = 483 data lines. Next, work out how many numeric tokens the data section holds and show that the file is not ragged. Self-check: 161 samples x 5 curves = 805 tokens, and 805 is an exact multiple of 5. Finally, suppose the same well had been exported with twelve curves in wrapped mode instead of five. State what would have to change in the parser. Self-check: nothing, because the reshape uses the declared curve count and the token stream is indifferent to where the lines break.
