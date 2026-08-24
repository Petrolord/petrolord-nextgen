# The parser has no wrap branch

Here is the fact that earns this module its place at the Expert tier. The engine that reads these files does not implement wrapping. There is no code in it that unwraps a wrapped file, no branch that behaves one way when `WRAP` is YES and another way when it is NO, and no function that decides which physical lines belong to the same depth step.

The file that declares wrap YES and the five files that declare wrap NO travel the same code path, and they produce correct results for the same reason.

## What the parser does with the WRAP line

It reads it and it reports it. The version section is parsed first, `WRAP` is recorded, and the value comes back in the parse result alongside the version number and the null value, so that a QC panel can display it and a reader can see what the file claims about itself.

Then the data reader runs and never consults it. The wrap flag is metadata that gets surfaced to you. It is not an input to the reassembly.

Separating those two things is the design. The file's claim about its own layout is worth showing to a person, because a person wants to know what kind of file this is. The claim is not worth trusting as an instruction, because the parser can get the right answer without it.

## How the data section is actually read

The data reader walks the lines after the `~A` marker and does four things to each one.

It skips the line entirely if it is blank or if it starts with a comment character. It splits what is left on whitespace, without caring how many pieces come back. It converts each piece to a number, and if a piece is not a number it stops with a plain error naming the line. It substitutes the file's declared null value with a not-a-number marker, and it does that substitution on the full-precision value before the value is cast down to the 32-bit float that gets stored, so a null written as `-999.2500` matches a declaration of `-999.25`.

Then it pushes the result onto one flat array and moves to the next line.

Read that list again and notice what is missing. Nothing in it records where a line ended. Line boundaries are consumed and discarded in the split, and what comes out is a single stream of numeric tokens in file order. That stream is byte-for-byte the same stream that a one-record-per-line version of the same file would produce, because the two files contain the same numbers in the same order and differ only in where the writer pressed return.

## How the tokens become curves

Reshaping happens afterwards, by arithmetic on counts.

The curve section has already told the parser how many curves the file declares. The parser divides the number of tokens in the flat stream by that curve count to get the number of samples, and then fills each curve by striding through the stream: the first curve takes tokens 1, then 1 plus the curve count, then 1 plus twice the curve count, and so on. The second curve takes the same walk starting one token later.

That is the whole mechanism. A count, a division, and a stride.

## Why this is a design rather than an oversight

It would be easy to read this as a corner the engine cut, and it is worth being clear that it is the opposite.

Start with what the format actually guarantees. The LAS rule for the data section is that the values appear in curve order, one full set per depth step, with no gaps. That is a statement about the sequence of values. It says nothing about lines. Wrapping is a statement about lines, and the values-in-order rule holds whether the writer used one line per record or five.

A parser that reassembles from the sequence is therefore reading the guarantee the format gives it. A parser that reassembles from line boundaries is reading a convention the format does not require, and then needs a special branch to handle the case where the convention does not hold.

Then look at what the single code path buys. There is one reader to test, one reader to fix, and one reader that the goldens exercise. A wrapped file is not a rarely exercised special case that quietly rots while the common path gets all the attention, which is the usual fate of a legacy branch. The 161 samples out of `wrapped_12.las` come from the same code that produced 301 out of `basic_20.las`.

And there is a third benefit that only shows up when files are strange. A parser that decides which lines belong together has to be right about that decision. A parser that flattens has nothing to be right about. It never needs to know which lines belong to one depth step, because grouping is not a question it asks.

## What the parser does check

Flattening does not mean trusting. The parser applies one arithmetic guard before it reshapes: the number of tokens in the flat stream has to be an exact multiple of the declared curve count. If it is not, the parse stops with an error that names both counts and says the file is ragged or truncated, rather than reshaping into something plausible and wrong.

That guard is where the next two lessons live. Lesson 3 works the arithmetic on `wrapped_12.las` and shows the three counts fitting together. Lesson 4 asks what the guard does and does not catch, because a design this clean is worth understanding at its edges before you rely on it in a delivery.

## Exercise

Describe the parser's data path in five steps, from the `~A` marker to a filled curve, without using the words line or wrap after the first step. Then answer two questions in one sentence each. What does the parser do with the `WRAP` value it read from the version section? And why can a parser that flattens the data section be indifferent to which physical lines belong to the same depth step?

As a self check: the five steps are walking the lines after `~A` while dropping blanks and comments, splitting each one on whitespace, converting every piece to a number with the declared null becoming a not-a-number marker at full precision before the cast to 32-bit float, pushing everything onto one flat token stream, and then dividing that stream's length by the declared curve count and striding through it to fill each curve. The parser reports the `WRAP` value so a reader can see what the file claims, and the data reader never consults it. And flattening can be indifferent to grouping because the format's guarantee is about the order of the values rather than about the placement of line breaks, so the token sequence carries everything the reshape needs.
