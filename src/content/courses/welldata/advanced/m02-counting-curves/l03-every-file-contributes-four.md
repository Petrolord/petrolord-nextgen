# Every file contributes four

The campaign table has one column in which every entry is identical. All six files contribute exactly 4 curves once the depth index is excluded, which is why the total can be written as 6 x 4 = 24 rather than as a sum of six different numbers.

That is a property of this fixture. It is not a law of LAS files, it is not a rule of the format, and it is not what a delivery normally looks like. Say that plainly to yourself now, because the tidiness is convenient for learning and misleading if you carry it out of the classroom.

## Why the teaching set is uniform

The six files were built to teach one failure mode each. basic_20 is the control, feet_20 carries the unit trap, irregular_20 the sampling trap, nullheavy_20 the completeness trap, quirks_20 the header trap and wrapped_12 the layout trap.

For that design to work, everything except the mode under test has to be held still. If the files also differed in curve suite, a learner reading the null count could not tell whether nullheavy_20 looks different because of its nulls or because it carries a different set of curves. So all six carry the same four value curves against the same index: GR in GAPI, RHOB in G/C3, NPHI in V/V and DT in US/M.

Holding a variable constant to isolate another one is good experiment design. It also means the constant column is an artefact of the experiment, and reading it as a fact about LAS files is reading the apparatus as the result.

## What a real delivery looks like

Deliveries vary in curve count for reasons that have nothing to do with anything being wrong.

**The tools that were in the string differ.** One well was logged with a full triple-combo and the well next to it took a gamma ray and a resistivity because the rig was on a tight programme. Two files, two very different curve counts, both correct.

**Processed products are included for some wells.** A file may carry the raw measurements plus environmental corrections, a computed porosity or a synthetic curve, and the vendor may have generated those for the wells that needed them.

**The files cover different intervals of the same well.** An open-hole run and a cased-hole run have different suites by nature.

**Composites carry the union of everything spliced.** A composite built from several runs often holds every mnemonic any run contained, which inflates the curve count and, as the Associate tier showed, is one of the ways dead curves are born.

**Somebody exported a subset.** A curve list can be trimmed on export, on request or by accident.

In a delivery of six real files, curve counts of 4, 4, 9, 6, 12 and 5 would be entirely ordinary, and none of those numbers is a problem on its own.

## The campaign is more useful when the column is not constant

Here is the part worth carrying. A constant column tells you very little. A varying one tells you where to look.

If the six files had contributed 4, 4, 9, 6, 12 and 5 curves, the campaign total of 40 would matter less than the shape of the column. The file with 12 asks whether it is a composite, and if it is, whether its extra columns are real or sentinel-filled. The file with 9 asks what the other files lack. The pair at 4 asks whether those wells really were logged with less, or whether somebody trimmed the export.

None of those questions has an answer in the column. Every one of them is a question you would not have thought to ask without it, and each points at one named file, which is precisely what a campaign is for.

So the honest reading of this delivery's uniform column is not that everything is fine. It is that this particular check found nothing, because there was nothing in it to find. A check that returns no exception has still been run, and recording that it returned nothing is part of the work.

## What uniformity does buy you

One real benefit, and it is a modest one. When every file contributes the same number of curves, the campaign total is exactly proportional to the file count, so a discrepancy in the total is easy to read.

Suppose you expected six files and the total came back as 20. In a uniform delivery, 20 is 5 x 4 and the immediate hypothesis is that a file failed to load. In a delivery with varying suites, a total of 20 against an expectation of 40 could be a missing file, a trimmed export, a parser that lost a column, or a wrong expectation, and you would have to go to the per-file rows to tell.

That is why the campaign panel shows the composition next to every aggregate. The total is a headline. The row-by-row breakdown is what lets you say which of several stories produced it, and in a delivery where files contribute unequally it is the only thing that can.

## Exercise

Take the counts 4, 4, 9, 6, 12 and 5 as a hypothetical delivery from the same sender, replacing this teaching set. Work out the campaign curve count with the index excluded and with it included. Then write down, for each of the three files that stand out, one question you would ask about it and one place in the campaign table you would look first for a hint at the answer. Finally, say in one sentence what the uniform column in the real teaching set does and does not tell you.

Self-check: the counts are already index-excluded values in this hypothetical, so the campaign total is 4 plus 4 plus 9 plus 6 plus 12 plus 5, which is 40, and counting the index in each of the six files gives 46. For the file with 12, ask whether it is a composite and look at its dead-curve and null entries, since sentinel-filled columns from spliced runs show up there. For the file with 9, ask which measurements the other files lack and look at the sample counts and depth frames to see whether it covers a different interval. For a file with 4, ask whether the well was logged with a shorter suite or the export was trimmed, and the campaign table cannot answer that one, which is a signal to go back to the sender rather than to the panel. The uniform column in the teaching set tells you the six files share a curve suite by construction, and it tells you nothing about what curve counts to expect from real data.
