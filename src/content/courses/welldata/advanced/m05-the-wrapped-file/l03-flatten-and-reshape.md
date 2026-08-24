# Flatten and reshape

The previous lesson described the mechanism. This one runs it on `wrapped_12.las` with real counts, because the mechanism is easier to trust once you have watched three numbers fit together.

There are exactly three numbers to work, and they are three different kinds of thing. One is a count of numeric tokens. One is a count of depth samples. One is a count of physical lines. Keeping those three straight is most of the lesson, and it is also the discipline that stops a reader reporting a line count as a sample count.

## The first number: 805 tokens

Strip the header sections away and walk the data section of `wrapped_12.las`, splitting every line on whitespace and counting the pieces. Blank lines and comment lines contribute nothing. Every remaining piece is a numeric token.

The count is 805 tokens.

That number belongs to the flat stream and to nothing else. It is not a sample count, it is not a line count, and it is not the size of any curve. It is how many numbers the data section contains, in file order, with the line breaks already thrown away.

## The second number: 161 samples

The curve section of this file declares 5 curves, and that count includes the depth index. The parser divides:

$$ \frac{805 \text{ tokens}}{5 \text{ curves}} = 161 \text{ samples per curve} $$

Two things are worth pausing on.

First, 805 divides by 5 exactly. There is no remainder. That is the arithmetic guard from the previous lesson passing, and it is the parser's evidence that the file is neither ragged nor truncated. A remainder here would have stopped the parse with an error rather than producing 161 point something samples.

Second, the divisor is 5 rather than 4. The campaign table credits `wrapped_12.las` with 4 curves, because the campaign excludes the depth index from a curve count that is about how much log data arrived. The reshape does not exclude it, because the depth index occupies a token slot in every record exactly like any other column. Use 4 here and you get 201.25 samples, which is visibly wrong, and that visible wrongness is a small mercy. The same confusion in a file with a curve count that happened to divide would give you a wrong answer that looked right.

So the file holds 161 depth samples. That is the value the Expert capstone grades, with a tolerance of zero.

## The third number: 483 lines, so 3 lines per step

Now count the physical lines in the data block rather than the tokens in it. There are 483 lines.

The parser never computes this number and never needs it. You compute it as a reader, and it answers a question the parser does not ask: how many lines did the writer use per record?

$$ \frac{483 \text{ lines}}{161 \text{ samples}} = 3 \text{ lines per depth step} $$

That is the wrap layout of this file, recovered by division. Each depth step occupies three physical lines, and the reason is straightforward once you have the token count. Five values per record across three lines means the writer put the depth on one line and split the remaining four curve values over two more.

You can run the same arithmetic in the other direction as a check. Three lines per step times 161 samples gives 483 lines. And 161 samples times 5 curves gives 805 tokens. All three numbers agree, and they agree because they are three views of the same data section.

## Why 483 is the number to be careful with

Of the three counts, 483 is the one that will hurt you if it escapes into the wrong field.

A reader built on one record per line reports 483 samples for this file. That is the naive failure from lesson 1, and now you can see its size: it is exactly three times the truth, because the wrap layout is three lines deep. On a file wrapped two lines deep the overcount would be double, and on a file wrapped six lines deep it would be sixfold. The size of the error is the wrap depth, which means it is invisible from the value alone unless you know what the depth frame should hold.

This is also where the words matter. The file has 483 lines and 161 samples, and a report that says 483 samples has not made a rounding error. It has confused two different quantities that happen to be counted with the same kind of number.

## The independent check

You do not have to take the reshape's word for any of this. The Associate tier taught a check that uses none of the arithmetic above: read the depth frame out of the header and compute how many samples it can hold. For this file the header declares a start of 1500 m, a stop of 1580 m and a step of 0.5 m, which gives

$$ \frac{1580 - 1500}{0.5} + 1 = 161 \text{ samples} $$

Two independent routes, one from the token count and the curve count, one from the depth frame, land on the same 161. That agreement is what lets you report the number rather than merely repeat it. When the two routes disagree, either the header is lying or the reader misread the data, and both are findings worth having before the curves reach an interpretation.

The panel below runs the real pipeline over all six files, so you can read the sample count for `wrapped_12.las` straight from the campaign table and check it against the arithmetic you just did.

{{panel:wd-campaign-explorer}}

## Exercise

Work all three counts for `wrapped_12.las` from scratch, writing each one with its unit, and then state the two divisions and the one multiplication that link them. Then answer this: if the same well had been exported with 10 curves including depth in wrapped mode, and the data section still held one full record per depth step, which of your three numbers would change and which would not?

As a self check: the data section holds 805 numeric tokens, the curve section declares 5 curves including the depth index, and 805 divided by 5 gives 161 samples per curve, which is the graded value. The data block holds 483 physical lines, and 483 divided by 161 gives 3 lines per depth step, which is the wrap layout recovered by division rather than an input to the parse. The multiplication back is 161 samples times 5 curves giving 805 tokens. With 10 curves including depth the token count and the line count would both change, since a record would carry ten values and would need more lines to hold them, while the sample count of 161 would not change, because the number of depth steps is a property of the depth frame rather than of the number of curves logged.
