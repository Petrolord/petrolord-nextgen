# The plan's own P50

The plan's reserves figure comes from the reserves table, read through the same accessor the completeness check uses. On EGINA that is oil 130.0000 MMbbl and gas 70.0000 Bcf.

{{panel:ec-plan-explorer}}

## One reader for one number

The completeness check, the generated document and the economics all reach the reserves the same way, so the P50 on the cover is the P50 in the table. The document's headline carries P50 oil 130.0000 MMbbl and P50 gas 70.0000 Bcf, both of them per fluid sums of the three reservoir rows.

## A summary is not a table

Some plans arrive carrying a summary figure and no rows behind it. A plan whose reserves came from a loaded example is like that: it has a headline and an empty table, and its P50 reads 130.0000 with nothing underneath to check. A published case of exactly that shape, a plan carrying only the summary, scores 33 percent and isValid true, because a summary is something rather than nothing, and 33 percent is a loud enough number to send the reader looking for the rows.

The reverse case used to be the broken one. A plan with a full reserves table and an empty summary box now scores 100 percent and is valid. Before the repair that preceded this course it scored 78 and failed, because the check read only the summary field and a table nobody had summarised counted for nothing. The reserves were there the whole time.

## When the table cannot be read

A plan whose reserves table cannot be read reports P50 0.0000 and completeness 89 percent, and it invents no volume. A 0.0000 next to an 89 percent is the studio saying it found a reserves section it could not parse, and the fix is in the table.

## What the published cases score

The EGINA plan carries all nine sections and reads 100 percent with isValid true. The engine's published cases show the rest of the scale.

| published case | completeness | valid |
| --- | --- | --- |
| gas only plan | 33 percent | true |
| four of nine sections | 44 percent | false |
| five of nine sections | 56 percent | false |
| unreadable reserves table | 22 percent | false |
| empty state | 0 percent | false |

A gas only plan passes the reserves check at 33 percent and isValid true, which is worth knowing: the check asks whether reserves were estimated, not whether there is oil in them. Four of nine sections rounds 44.44 to 44 and five of nine rounds 55.56 to 56.

## The mistake

The mistake is to quote a plan's P50 from whichever box was nearest. A headline typed by hand, a summary carried in from an example and a table of reservoir rows can all sit in one plan and disagree. The number that belongs to the plan is the one the engine totals from the rows, one fluid at a time.

## Exercise

Give the plan's P50 for each fluid and name the part of the plan the figures were totalled from. Then say what completeness and P50 a plan reports when its reserves table cannot be read, and why the studio does not fall back to the summary figure in that case.
