# Why averaging them is wrong

The two predictions are 1671 m and 1682 m. Almost everybody, on first meeting them, wants to add them and divide by two.

$$\frac{1671 + 1682}{2} = 1676.5$$

That is the wrong move, and this lesson is about why. The arithmetic is correct and the result is useless, which is a combination worth learning to recognise, because it will come at you in other forms for the rest of your career.

## Name the temptation first

The pull towards 1676.5 m is not laziness. It comes from four reasonable places.

A single number is what was asked for. Reports have a field for a depth and a reviewer asked what TOP_B does under Ekene-4, and a range can feel like a failure to answer.

A single number is what tools accept. A mapping package wants one value per control point. A spreadsheet column wants a scalar. The software is not built to receive a range and the path of least resistance is to give it what it wants.

Averaging feels even handed. Two methods, with no clear winner between them, so splitting the difference looks like the neutral choice rather than a choice at all.

And a middle value feels more likely to be close. If the true depth is somewhere between the two, then the midpoint is never far off, which is the only one of the four arguments with anything in it.

Refuse all four. Here is what each of them costs.

## It destroys the only honest thing you produced

The previous lesson made the case that the 11 m spread is the result. It is a measured uncertainty, derived from the data, on a pick nobody logged. Almost nothing else you do in a correlation gives you an error estimate that the section itself produced.

Report 1676.5 m and that quantity is gone. Not reduced, not approximated, gone. A reader receives a depth and has no way to recover the range from it, no way to tell whether the two methods agreed to within a metre or differed by fifty, and no way to know that a methodological choice was made at all. You did the work that measured the uncertainty and then deleted the measurement.

## It claims a precision the data cannot support

Look at the number itself. 1676.5 m carries a decimal, in a well that stopped above the surface, for a prediction built from three wells whose picks are recorded to the metre.

Nothing in this section justifies half a metre of anything. The decimal is an artefact of dividing an odd difference by two, and it will be read by somebody as evidence of care. That is exactly backwards. Rounding it to 1676 m or 1677 m does not fix the problem either, because the problem is not the decimal, it is the implied claim that the depth is known to a metre when the honest statement is that it is known to about eleven.

## It implies the truth is in the middle, and nothing says so

The midpoint would be the best single estimate if the two predictions were independent samples from a distribution centred on the true depth. They are not, on two counts.

They are not independent. Both are built from the same three wells and the same tops table. The SAND-to-B interval is a subset of the A-to-B interval in every one of those wells, so the two methods share most of their evidence. Averaging correlated estimates does not cancel their errors the way averaging independent measurements does.

And they are not centred on anything. The previous lesson showed the gap is a systematic term, Ekene-4's upper interval of 60 m minus the contributing mean of 49 m, not a random scatter. A systematic difference has a direction, and the midpoint of a systematic difference is not a better estimate. It is a point that neither method endorses.

## It hides that a choice was made

This is the cost that lasts longest. A range with a method attached tells a reader that the interpreter faced a decision about which marker to project from and declined to pretend the data settled it. The average tells them nothing at all.

Six months later, the average is a number in a table. Nobody remembers that two methods were run, that they disagreed, or which direction the disagreement pointed. If a later well or a seismic tie suggests TOP_B is deeper than expected, the range would have flagged that the deeper end of it was always available and better supported. The average would just look wrong.

## What to do instead

Report the range with the method, as the previous lesson set out. That is the default and it should survive most requests for a single figure, because most of those requests are habit rather than necessity.

If a single number is genuinely required, choose one of the two on stated grounds and carry the range with it. Choosing 1682 m because the projection is shorter and the anchor nearer is a defensible position that a reader can inspect and disagree with. Choosing 1676.5 m because it is halfway is a position with no argument behind it, and it is not available for inspection because there is nothing to inspect.

That is the real difference. One of those numbers came from a reason. The other came from a division.

The next lesson makes the choice properly, including what it costs to make it.

## Exercise

A colleague sends you a tops summary listing Ekene-4 TOP_B at 1676.5 m with no other comment. Write down the three separate things that number has concealed, and the two questions you would ask to recover them. Then say what you would put in the table instead if the format allows only one depth field.

Self-check: it conceals the range, since the reader cannot tell that two estimates 11 m apart lie behind it; it conceals the method, since nothing says which markers were projected from or which wells contributed; and it conceals the status of the entry, since a depth in a tops column reads as a pick and this one was never drilled. The two questions are which constructions produced it and what the individual results were, and whether the value is an estimate rather than a pick, which also determines whether Ekene-4 should be counted among the wells carrying all four tops. If only one depth field is available, put a value that came from a stated method rather than from the midpoint, flag the row as estimated in whatever way the format allows, and put the range and the method in the accompanying text so that the single field is never the only record of the work.
