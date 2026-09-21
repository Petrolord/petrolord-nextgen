# The Dutch line and its points

{{panel:qr-societal}}

The engine carries one criterion line as a preset, and it comes from the Netherlands. It is the best known societal criterion in process safety, printed in the Purple Book and written into Dutch law for two decades. This lesson sets out its constants, the three points that anchor it, and the status it has today, which is part of what an analyst must say when using it.

## The preset

The preset is named vrom-establishments. Its constants are C = 1e-3 and alpha = 2, starting at N = 10 with no upper end. The engine names its source, verbatim:

> TNO Purple Book CPR 18E (1999) Figure 6.8; Besluit externe veiligheid inrichtingen (2004, repealed 1 January 2024) art. 13(1)(b)

With alpha of 2 the line is risk averse: every tenfold rise in N brings a hundredfold fall in the frequency allowed.

## The three Bevi points

| N | Bevi value, printed | the line C / N^alpha, engine constants |
| --- | --- | --- |
| 10 | 1e-5 | 1e-5 |
| 100 | 1e-7 | 1e-7 |
| 1000 | 1e-9 | 1e-9 |

Bevi article 13 prints three points, and each lies exactly on the Purple Book line built from the engine's constants. This is the published side of every F-N comparison in this course. The curve itself has no published worked example and is checked by self-consistency, but the line it is compared with is reproduced from print.

## Two sources, two words

The Purple Book Figure 6.8 caption prints the line as a recommended limit for establishments. Bevi article 13 asks for the group risk to be compared with the same three points and calls them an orientation value. The difference matters. A limit is something a plant must stay under; an orientation value is something an authority weighs. The engine takes neither side in words: it reports a state against the line, and the analyst says what the comparison is for.

## Repealed, and what follows

Bevi was repealed on 1 January 2024, and the engine did not read its successor. So the line is a published comparison the analyst chooses to make. It remains a clear, well documented benchmark, which is why it is still useful, and an honest report says in the same breath that the regulation it came from no longer stands. The engine has no successor preset, and it will not invent one.

## Where the line starts

The line applies from N = 10. A corner of an F-N curve below that N is outside the line's range and is not checked. On the JISIKE off-site curve, the corner at N = 3 carries 0.000049700000 per year, the highest frequency on the curve, and the Dutch line says nothing about it. An analyst who wants small events judged needs a different criterion, such as a line of their own that starts lower, which the next module shows. The engine never extends a preset below its stated range.

## Exercise

The JISIKE curve has F(12) of 0.000009700000 per year. Compute the Dutch line's value at N = 12 from C = 1e-3 and alpha = 2, then divide the curve's value by it and say whether the curve lies above or below the line at that corner. The next lesson prints both figures for you to check against.
