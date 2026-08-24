# Never report an aggregate alone

Everything in this module reduces to one habit, and the habit is small enough to describe in a sentence. An aggregate travels with its composition, or it misleads. This lesson states the rule properly, shows the form a defensible total takes, and applies it to numbers that have nothing to do with nulls.

## Why 272 alone fails

A reader who receives the number 272 and nothing else needs two things they have not been given.

They need to know what kind of missing this is. One absent curve and a scatter of gaps are different findings with different owners and different remedies, and the total is the same integer either way.

They need to know how concentrated it is. 201 of the 272 sit in a single column, so this is not a file with a general problem. It is a file with one specific hole in it and a smaller quality note beside it.

Neither of those is a refinement. They are the two questions any reader will act on, and the aggregate answers neither. That is what misleading means here. Nothing in the number is false, and everything a reader will do with it is based on a picture the number invited them to form and never corrected.

## What an aggregate is, and what it destroys

Every total in this campaign is a sum over a population. 272 sums 4 curves. 24 sums 6 files. 5 sums 6 verdicts.

Addition is not reversible. The moment the parts become one number, the distribution of the parts is gone, and no care taken with the total recovers it. That is what aggregation is for: a table nobody can read becomes a column somebody can scan. The mistake is not producing the total. The mistake is letting the total travel by itself, because the person who reads it three weeks later has no way of knowing what it was a sum of.

So the rule is not that aggregates are bad. It is that an aggregate is half a finding, and the other half has to be attached to it before it leaves your desk.

## The form of a defensible total

Four elements, and a total with all four cannot be badly misread.

The number, with its unit stated as what it counts: 272 flagged samples.

The population it was summed over: the 4 value curves of nullheavy_20.las.

The denominator, so the reader can size it: 201 samples per curve.

The largest single contributor, or the full breakdown if it is short: 201 of the 272 are NPHI in V/V, a curve with no finite samples.

Put together, that is one sentence and it is the sentence from the previous lesson. The fourth element is the one people leave out, and it is the one that carries the meaning. When a breakdown has four rows, give all four. When it has sixty, give the largest contributor and the shape of the rest.

If you genuinely do not have the composition, say that instead of implying it does not exist. A total reported as a total, with a note that the breakdown has not been examined, is honest. The same total presented as a finished finding is not.

## The same rule on totals that are not nulls

Take the campaign's other numbers and apply it.

24 curves imported. Population, 6 files. Composition, 4 curves each, with no file departing from that. Here the composition is uniform, and reporting it is still worth the clause, because 24 is also consistent with five files of 4 and one file of 4 that happened to lose two curves and gain two others. Saying 4 per file across 6 files rules that out. A composition that turns out to be boring is a result, and it is the result that lets a reader stop worrying.

5 files with a uniform depth step. Denominator, 6. Composition, the one file that fails is irregular_20.las. Without the denominator, 5 is unreadable. Without the name, it is unactionable.

1 dead curve. Population, the 24 imported curves. Composition, all of it in nullheavy_20.las, and it is the same absence that supplies 201 of that file's 272 nulls. That last clause is the one that stops a reader adding the two findings together.

161 depth samples in wrapped_12. This one looks like a plain count with nothing inside it, and it has more composition than any of the others. The file is LAS 1.2 with wrap set to YES. The parser flattens every numeric token after the data header and reshapes by the curve count: 805 tokens divided by 5 curves gives 161 samples, and the data block holds 483 lines, so 483 divided by 161 is 3 lines per depth step. The number 161 is correct and it conceals an entire mechanism, which is what the next module is about. A count that arrives with no visible structure is not necessarily a count with no structure.

## Worked example

Rewrite three findings in the composed form and notice how little length it costs.

Bare: 272 nulls. Composed: 272 flagged samples across the 4 value curves of nullheavy_20.las at 201 samples each, of which 201 are NPHI in V/V with no finite samples at all and 71 are gaps in GR in GAPI, while RHOB in G/C3 and DT in US/M have 0 nulls of 201.

Bare: 24 curves. Composed: 24 curves imported, 4 from each of the 6 files with the depth index excluded, and no file departing from that.

Bare: 5 uniform. Composed: 5 of the 6 files have a uniform depth step, and the exception is irregular_20.las.

Three sentences instead of three numbers. Each one answers the questions its bare version raises, and none of them can be sorted, copied or quoted into a shape that means something else.

## Exercise

Take a total from your own work that is not about nulls, such as a count of wells loaded, files rejected, or curves missing a unit, and write it in the four element form: the number with what it counts, the population, the denominator, and the largest contributor. Then answer in two sentences: what would a reader most likely assume about the distribution of your total if you gave them only the number, and what would that assumption cost them.

Self-check: your composed version should read as one sentence carrying all four elements, in the same shape as 272 flagged samples across the 4 value curves of nullheavy_20.las at 201 samples each, of which 201 are one absent curve. A reader given only a total will assume the parts are broadly similar in size, because an even spread is what a single summary number suggests when nothing contradicts it, and in this campaign that assumption is wrong by a wide margin since 201 of the 272 sit in one column. The cost is that they act on a picture of a generally gappy file rather than on the two specific findings inside it, which sends the wrong query to the wrong person and leaves the largest item in the file unaddressed.
