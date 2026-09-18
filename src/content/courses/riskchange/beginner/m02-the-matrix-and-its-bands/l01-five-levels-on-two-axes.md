# Five levels on two axes

A risk in this register is assessed on two axes. Likelihood asks how probable the event is. Impact asks how bad it would be if it happened. Each axis is given a level, and the risk's score comes from the pair.

{{panel:rc-risk-explorer}}

## The scale

The scale runs from 1 to 5 on each axis, likelihood and impact. There are five levels on each, and the levels are WHOLE numbers. A level of 1 is the lowest likelihood or the mildest impact the register recognises, and a level of 5 is the highest. The words a company attaches to each level, such as rare or catastrophic, belong to its own procedure. The engine works with the numbers.

A score is the product of the two levels. Likelihood 3 and impact 4 score 12. That single multiplication is the whole of the scoring rule, and the next lesson draws every cell it can produce.

## What the scale accepts as a level

A level can arrive from a form, from an import or from another system, so it does not always arrive as a plain number. These probes hand the engine the same level written several ways, each scored against an impact.

| the likelihood given | as | impact | score | band |
| --- | --- | --- | --- | --- |
| two whole levels | 3 | 4 | 12 | "High" |
| two whole levels written as text | "3" | "4" | 12 | "High" |
| a level with spaces around it | " 3 " | 4 | 12 | "High" |
| a whole level written as text with a decimal point | "3.0" | 4 | 12 | "High" |
| the value true | true | 5 | 5 | "Medium" |

A whole number written as text or with a decimal point is still that level. The text "3", the text " 3 " with spaces round it and the text "3.0" all score exactly as the number 3 does against an impact of 4: 12, "High". That is useful, because a spreadsheet import often delivers numbers as text, and the band does not change because of how a cell was formatted.

The value true, handed in as a likelihood against an impact of 5, scores 5 and bands "Medium". Asked directly, true against an impact of 1 scores 1, so the engine reads true as level 1; false against an impact of 1 scores 0, band "None". The register's own form stores whole numbers, so this is how the engine treats a value the form never writes. Treat it as a warning that a field of the wrong kind can still produce a band.

## Two axes, one product

Keep the two axes separate in your head even though the score joins them. A risk with likelihood 5 and impact 1 and a risk with likelihood 1 and impact 5 both score 5 and both band "Medium". The score alone cannot tell you which one you are looking at. The register keeps both levels on the record for exactly that reason, and a reviewer reading a band should always look back at the two levels behind it.

## The mistake

The mistake is to think the scale accepts anything that looks roughly like a number. It accepts five whole levels, written as a number or as text. The next lessons show what happens to a level that falls outside them, and the answer is never a guess.

## Exercise

Record the lowest and highest level on each axis and the rule that turns two levels into a score. Then record the score and band for likelihood 3 against impact 4 when the likelihood is given as 3, as "3" and as "3.0", and state why they agree.
