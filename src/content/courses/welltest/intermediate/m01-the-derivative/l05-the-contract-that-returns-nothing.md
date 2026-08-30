# The contract that returns nothing

A function that silently gives you an empty answer, and how to notice.

## The trap

`bourdetDerivative` has this signature:

    bourdetDerivative(series, { L = 0.1, xKey = 'x', yKey = 'y' })

The two key names default to `x` and `y`. Internally it maps each row to `{ x: row[xKey], y: row[yKey] }`, drops any row whose x is not a finite positive number, and returns an empty array if fewer than three rows survive.

So if you pass rows shaped `{ t, dp }`, which is the natural shape for a drawdown, every row has an undefined x, every row is dropped, and the function returns an empty array.

Not an error. Not a warning. An empty array, which is exactly what a derivative that could not be computed would also look like.

## Why this matters more than it sounds

The consequences are all silent.

A plot of an empty series is a blank plot, which reads as "no data" rather than "wrong keys".

A regime detection on an empty series returns an empty list of regimes, which reads as "no regime held for a quarter of a decade", which is a legitimate result on a short test.

A plateau averaged over an empty selection is not a number, which propagates as a blank in a report.

At no point does anything say that the caller made a mistake.

## The general shape of this bug

This is worth generalising, because it recurs across every engine in this suite.

A function that FILTERS its input rather than validating it will treat a wrongly named field as an absent value, and absent values are usually a legitimate condition. The filter is there for good reasons: real gauge data have gaps, nulls and non-positive times, and dropping them silently is the right behaviour for data.

The failure is that the same mechanism swallows a programming error. There is no way for the function to tell "this row has no pressure because the gauge missed it" from "this row has no pressure because you spelled the field wrong."

## How to defend against it

Three habits, in increasing order of reliability.

**Pass the keys explicitly.** `{ xKey: 't', yKey: 'dp' }` is one extra argument and it removes the whole class of problem.

**Check the count.** A derivative should return exactly as many points as it was given, once the invalid rows are removed. Comparing the input length against the output length catches an empty return immediately, and it catches a partially filtered input too, which is the subtler version of the same problem.

**Assert on a known case.** A test that runs the derivative on a fixture with a known plateau and checks the height is the strongest defence, because it fails when the wiring breaks rather than when someone looks at a plot.

The teaching lab this course uses does all three, and the count check is the one that has caught the most.

## The related trap in the sweeps

The same shape appears in the tooling around this course. Two of the verification scripts take a `--banks <directory>` argument and read the next word from the command line. Passing a bare `--banks` with no directory yields undefined, the script falls back to its default input, and it prints a perfectly green result for a sweep that never examined the thing you asked it to.

The tell is the count: the number of files examined is the wrong number. A silently-skipped check reads exactly like a passing one, and the only general defence is to confirm that a check counted what you expected it to count.

## The misconception to avoid

"If it returned without an error, it did what I asked." Filtering functions return successfully on inputs they understood as empty. Any function whose contract is "clean the input and process what survives" can return a valid empty answer to an invalid question, and the calling code has to check the arithmetic of the count.

## Exercise

Look at the engine's `logDecimate` and `trimSpikes`. Both take a key name with a default and both filter.

For each of them, describe the silent failure a wrong key name would produce, and say what the caller would see. Then write down the single check that would catch both.
