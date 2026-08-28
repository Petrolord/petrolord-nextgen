# Never assume a split

Ask the engine for injection advice on a pattern that has no allocation routed to it and it returns this:

> withheld: true, reason: "No allocation factors route injection to this pattern. Define the injector-producer split first; even splits are never assumed."

Not a number. Not a null that a spreadsheet will render as zero. A refusal with a reason. This lesson is about why that is the right design, because it is a design decision that costs something and it is worth knowing what it buys.

## The tempting alternative

The obvious thing to do when a pattern has no allocation is to assume an even split. If an injector could plausibly support four producers, give each one a quarter. It is neutral, it is symmetric, it requires no judgement, and it lets the analysis proceed.

It is also a claim. An even split asserts that the four producers are equally connected to that injector, which for Ekene would mean Ekene-5 at 1767 m receives exactly as much of Ekene-2's water as Ekene-6 at 716 m. Nobody believes that. But it will be in the numbers, and it will not be labelled.

That is the failure mode: the assumption becomes invisible the moment it produces a number. A report saying "the North element is at 1.02" carries no trace of whether that 1.02 came from a considered matrix or from a default. Six months later nobody can tell.

## What withholding costs

It is genuinely inconvenient. A dashboard that shows blanks looks broken. A report with gaps invites the question "why can't you just estimate it", and the answer, "because an estimate would be indistinguishable from a measurement in the output", is unsatisfying to hear in a meeting.

There is also a real risk of the wrong response: an engineer who needs a number in an hour will type an even split into the matrix by hand, and now the assumption is in the input where at least it is visible, which is better, but the withholding has not prevented anything.

## What withholding buys

**Provenance.** Every pattern number that exists came from a matrix somebody wrote. There is no path by which a number appears without an allocation behind it.

**A prompt at the right moment.** The refusal arrives when someone is actually looking at that pattern, which is the moment they are most able to supply the missing judgement.

**A clean audit.** A reviewer can ask "which patterns have allocations" and get a definite answer, rather than having to check whether each number was computed or defaulted.

## The general principle

The engines across this course apply the same rule in several places, and it is worth naming: **when the data cannot support a result, return the absence with a reason rather than a plausible substitute.**

You have already met three instances. Producers without enough water history get no Chan curve rather than a curve fitted to four points. Injectors without pressure data get no Hall plot rather than one built on an assumed pressure. Periods with no produced voidage get a null VRR flag rather than an "under" flag.

In every case the alternative would have produced something that renders, prints, and looks exactly like a result.

## The historical note

This design was not free. The Petrolord waterflood engine replaced an earlier server implementation that fabricated pattern lags and injector recommendations with a random number generator, and used a placeholder constant where the Hall plot needed a measured pressure. Those outputs rendered perfectly. They were on dashboards. They were, as far as anyone reading them could tell, analysis.

The current engine's header says so explicitly and says the non-physical outputs are intentionally not reproduced. That is the strongest possible argument for withholding: the alternative was tried, it shipped, and nobody caught it from the output because the output looked fine.

## How to respond to a withheld result

Three legitimate responses, in order of preference.

**Supply the missing input.** Build the allocation, write it down, note the method.

**Answer a different question.** The field-level ledger needs no allocation and is available always. If the decision can be made at field level, make it there.

**Record the gap.** "No allocation exists for this element, so no pattern-level conclusion is available" is a perfectly good line in a report, and it is far more useful than a number nobody can trace.

What is not legitimate is silently defaulting and moving on.

## The misconception to avoid

"Withholding is the tool being unhelpful." The tool is being precise about what it knows. Unhelpfulness would be returning nothing at all; the engine returns a specific reason naming what is missing and what to do about it. That reason IS the help. Read it and act on it rather than routing around it.

## Exercise

First, list the four withholding behaviours named in this lesson and, for each, write the number a naive implementation would have returned instead and why that number would be hard to detect as wrong.

Second, you are asked for a pattern VRR on an element with no allocation, in a meeting, now. Write the two sentences you would say, and name the field-level number you would offer instead.
