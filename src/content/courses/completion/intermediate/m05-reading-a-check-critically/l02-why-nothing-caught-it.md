# Why nothing caught it

The tests passed, the oracle agreed, and the defect survived. Here is the gap.

## What was tested

The engine had a golden file with a full published completion in it and an independent oracle in another language that recomputed the results.

Every clearance row matched. Every status matched. Every governing drift and controlling label matched. The volumes matched, the through bore matched, the stack up matched.

## What was not

The oracle never computed a worst row.

So the golden file had no field for it, so the comparison had nothing to compare, so the engine's worst row was never checked against anything. It was an output of the engine that no test read.

## Why that is easy to do

Because the worst row is derived from the rows, and the rows were all verified. It feels covered. If every row is right, surely a selection among them is right.

That reasoning is wrong in a specific way: the rows are data and the selection is logic, and verifying the data does not verify the logic that reduces it. A reduction over correct inputs can still be the wrong reduction.

## The general shape

Any output that is a summary of other outputs is at risk of this. A worst case, a controlling item, a governing depth, a binding constraint, a recommended value.

The detailed outputs get compared because they are numerous and obviously the substance. The summary gets read by every user and tested by nobody.

## The rule that follows

An independent oracle has to compute every output the engine reports, including the ones that look like conveniences. If the oracle skips one, that output is unverified no matter how thorough the rest of the comparison is.

That is the version of the lesson worth carrying out of this course. It is not about clearance and it is not about completions.

## What was actually missing in the oracle

A function of a few lines that sorted the rows and returned the tightest, with a couple of assertions about ties and about rows with no clearance value. Writing it took less time than reading this lesson.

The cost of not having written it was a wrong headline on every passing string, for as long as the module had existed.

## Exercise

Explain why verifying every row did not verify the worst row.

Name three other kinds of output that have the same risk profile.

Then write, in words, the oracle function that would have caught this, including what it should assert about ties.
