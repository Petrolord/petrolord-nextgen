# Twenty four curves

The first graded reading of the tier is the number of curves the campaign imported across the six files, with the depth index excluded. The answer is 24, the tolerance is zero, and the arithmetic is 6 x 4.

That is the whole calculation. This module exists because the calculation is not the difficult part.

## Where the 24 comes from

Run the pipeline on each file and count the curves it produced, leaving out the depth column. Every file gives 4.

| file | curves (depth excluded) | running total |
| --- | --- | --- |
| basic_20.las | 4 | 4 |
| feet_20.las | 4 | 8 |
| irregular_20.las | 4 | 12 |
| nullheavy_20.las | 4 | 16 |
| quirks_20.las | 4 | 20 |
| wrapped_12.las | 4 | 24 |

Six files, four curves each, 24 curves in the campaign. Because every row is the same, the sum can be written as a product, and 6 x 4 = 24.

The four curves in each file are the same four throughout the teaching set: GR in GAPI, RHOB in G/C3, NPHI in V/V and DT in US/M. The depth column sits ahead of them in every file and is not in the count. Add it back and each file declares five curves, which is the number you would get by counting lines in the curve section of the header.

## Two numbers live here, and they differ by six

Say both out loud once, because a reader who has not separated them will eventually quote the wrong one.

Curves declared across the campaign, index included, is 30. Curves imported across the campaign, index excluded, is 24. The difference is 6, one index per file, and it is a constant rather than a finding.

The graded reading is 24. The next lesson gives the reason at length, and the short version is that the index is the axis the other curves are sampled against rather than a measurement in its own right. For now, take it as the platform's convention, and notice that the convention was already in force at the tier below. The Professional tier graded feet_20 at 4 recognised curve kinds out of 5 declared curves, for the same reason and with the same exclusion.

## Why the tolerance is zero

There is nothing here to be approximately right about. You cannot import 23.7 curves.

More usefully, consider what the reachable wrong answers are, because each of them is a definition rather than a slip.

**30.** You counted the index in every file. This is the most common wrong answer and it is produced by careful work, since 30 really is the number of lines in the six curve sections added up. It answers a different question.

**Some number between 20 and 24.** You dropped the dead curve, or curves you judged unusable, from the count. The count is of curves imported, and a dead curve is imported. It arrives, it occupies a column, it appears in the registry, and it is counted. Whether it should have been delivered is a separate question that module 3 and module 4 take seriously.

**4.** You read the reading as a per-file number. Each file does contribute 4, and the graded value is the campaign total.

**A number that is not a multiple of 4.** You counted from memory of one file's curve section rather than from the campaign, or you assumed the files differ in curve count. In this delivery they do not, which lesson 3 examines rather than celebrates.

## Reading the column, not the row

The useful habit from this reading has nothing to do with the number 24. It is that the curves column in the campaign table is constant, and a constant column is a specific kind of information.

A column where every entry agrees tells you about the delivery's format. Whoever exported these six files ran the same curve suite in each, or built them from one template, and that consistency is a fact about the sender rather than about the wells. A column where entries differ tells you about individual files, and those are the columns you read for exceptions.

So the curves column is the one column in this campaign with no exception in it. That is worth knowing early, because the rest of the tier is largely about exceptions, and this reading is the control against which an exception looks like one.

The panel below runs all six teaching files as one campaign and shows the table with each aggregate and its composition.

{{panel:wd-campaign-explorer}}

## Exercise

Open the panel and confirm the curve count file by file, then check the campaign total. Now answer three questions without the panel. First, what would the campaign total be if the index were counted, and by how much would it differ from the graded reading. Second, if a seventh file arrived from the same sender with the same curve suite, what would the graded reading become, and would the tolerance change. Third, if one of the six files had shipped without its NPHI curve, what would the graded reading be and would the count still be expressible as a product.

Self-check: counting the index gives 30, which is 6 more than the graded 24, since the difference is one index per file. A seventh file with the same suite would take the reading to 28, and the tolerance stays at zero, because the reading remains a count and adding members to a set does not make a count approximate. Losing NPHI from one file would give 23, which is 5 files at 4 curves plus 1 file at 3, and that cannot be written as a product because the files no longer contribute equally. Note that the product form is a convenience of this particular delivery rather than a property of curve counting.
