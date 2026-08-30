# What agreement proves

The claim that can be made, precisely.

{{panel:hy-cleaning-explorer}}

## The claim

Two independent implementations of a stated method specification, written in different languages by different authors, produce the same numbers to better than one part in a million across every output of four cases.

That is a strong claim about the CODE.

## What it eliminates

**Transcription errors.** A digit typed wrongly in a correlation coefficient.

**Sign errors.** A term added where it should be subtracted.

**Unit errors.** A conversion applied once too many times, or not at all.

**Misread formulae.** An exponent on the wrong term, a bracket in the wrong place.

Between them those four are the great majority of the defects that actually occur in engineering software, and a comparison at 1e-6 catches all of them.

## What it does not eliminate

**A shared misreading of the specification.** If both authors read the same ambiguous sentence the same wrong way, they agree and they are both wrong.

That is a real risk and it is reduced by the specification being published and widely implemented, so a third implementation would disagree.

**Anything about the specification itself.** The four conventions in it are shared by both implementations by construction.

## The comparison with the torque and drag course

That course had a real disagreement to explain: worst relative 6.7e-2 on two cases in compression, resolved into discretisation and a residual model difference, with a closed-form case to say which implementation was closer.

This course has none. Everything agrees to better than the tolerance asked for.

## Which situation is more informative

The disagreement, by a long way.

A disagreement forces the question of which is right and produces a real result: in that course, that the engine reproduced the one closed-form case to nanonewtons while the oracle was tens of newtons away.

Agreement produces no such result. It says the code is right and leaves the model entirely unexamined.

## The honest summary

This engine implements the stated method specification correctly, verified against an independent implementation to better than 1e-6.

Whether the specification describes a real well is a different question, and the next lesson is about it.

## Exercise

Write the two-sentence claim you would put in a report about this comparison.

Then write the one-sentence overstatement somebody might make from the same result, and say what word in it does the damage.
