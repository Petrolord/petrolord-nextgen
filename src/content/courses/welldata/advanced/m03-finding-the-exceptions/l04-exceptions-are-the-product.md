# Exceptions are the product

This is the lesson the module exists for. Three of the campaign's graded numbers ask, in different words, how many files differ from the rest. In every case the answer is one. That is not a coincidence about this teaching set. It is what a campaign is for.

## Three findings, each of size one

Put the three side by side and read what each of them located.

Files needing depth unit conversion is 1, and the file is feet_20.las. Files with a uniform depth step is 5, which is a pass count, and the file it locates by subtraction is irregular_20.las. Dead curves detected is 1, and the curve is in nullheavy_20.las.

Three fields, three different tests, three different files. The reported values look unrelated, one of them is even phrased in the opposite direction from the other two, and underneath they are the same kind of finding: this delivery contains one file that is not like its neighbours, and here is its name.

A fourth graded number behaves differently and is worth putting next to them. Curves imported across the campaign is 24, because every one of the six files contributes exactly 4 curves once the depth index is excluded. There is no exception in that field. Six times four is 24 and nothing stands out. That is the useful contrast: a campaign field either isolates an odd file or it confirms that no file is odd, and both outcomes are results.

## The totals are the least interesting part

24 is the number a report is most likely to lead with, and it is the number that changes the least about what you do next.

Knowing the campaign imported 24 curves tells you the delivery is the size you expected. It does not tell you to open anything, write to anyone, or hold anything back. It is a receipt. Receipts matter, and you should check them, and checking that six files each delivered 4 curves is exactly the kind of arithmetic that catches a truncated download. But once it agrees with expectation, the total has done its work and it has nothing further to say.

The exceptions are the opposite. Each of the three is short, specific, and immediately actionable. feet_20 needs its conversion recorded and its converted depths sanity checked. irregular_20 needs a note attached so that no downstream step assumes a spacing it does not have. The dead curve in nullheavy_20 needs a decision about whether it was ever delivered and a message to whoever sent it. None of that follows from a total, and all of it follows from a list of three names.

## What a campaign is actually for

You could open six files and read each one. For six files that is an afternoon and it works. For sixty it is a week, and by the fortieth file your attention is not the instrument it was at the fifth, which is when a foreign depth unit gets waved through.

So a campaign is not a faster way of reading every file. It is a device for finding the files that differ without reading any of them. You define a small number of tests that every file must answer identically, you run them across the batch, and you then read one column at a time rather than one file at a time. Uniformity across a column is the background. Anything that breaks it is the signal.

That reframing changes what you should design into a campaign. A test earns its place if a file could plausibly fail it in a way that hurts you. A test that every file will always pass is a receipt at best. And a test whose result you would not act on has no business being in the report at all, because it makes the report longer without making it more useful, and a long report gets skimmed.

## The campaign only finds what it asks about

The three exceptions above are the ones the graded fields can locate. They are not everything that makes a file unusual.

wrapped_12.las is LAS version 1.2 with wrap set to YES, and every depth step in it spans several data lines. No graded field in this campaign reports that. The file passes the uniformity test, contributes its 4 curves like everyone else, needs no conversion, and holds no dead curve, so on all three exception fields it is entirely ordinary. It is also the only file in the set built on a different format convention, and module 5 is devoted to it.

That is worth holding on to. A campaign's field list defines the exceptions it can see, and a file can be the odd one out along an axis nobody thought to measure. The right response is not to add every test you can think of, which produces a report nobody reads. It is to know what your campaign does not cover, and to say so when you hand the results over.

## Worked example

Turn the six graded numbers into the thing you would actually send.

Start with the total: 24 curves imported across six files, 4 per file, which matches expectation, so no action. Then the three exceptions, each as one line with a file name and a consequence. feet_20.las converted from a foreign depth unit, conversion recorded. irregular_20.las has no uniform depth step, so no spacing may be assumed downstream. One dead curve in nullheavy_20.las, which needs a decision and a query to the supplier.

Four lines. One says the delivery is the right size and three say what to do. Now count what you left out: nothing that would change a decision. That is the test of a campaign report, and it is the reason the exception list rather than the totals is the product of the work.

## Exercise

Write the four line summary described above from the graded numbers, in your own words. Then answer in two sentences: which of the six graded fields would still be worth computing if you already knew the delivery was clean, and why does the field that returns 24 not name a file the way the other three do.

Self-check: your summary should carry the total of 24 curves from six files at 4 each as a check that matched, then feet_20.las as the one file needing a depth unit conversion, irregular_20.las as the one file without a uniform depth step against 5 that have one, and one dead curve in nullheavy_20.las out of the 24 imported. Every field is still worth computing on a delivery you believe is clean, because a campaign that only runs when you suspect trouble cannot tell you that a batch is sound, and a clean result is itself the finding. The field that returns 24 names no file because no file departs from the pattern, since 6 files times 4 curves is 24 exactly, and a field with no exception in it is confirming the shape of the delivery rather than locating anything inside it.
