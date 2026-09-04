# The design factor is an input

The module never defaults the design factor, because burying one in a shared engine would be pretending a jurisdiction. Leave it out and what comes back is not a rating.

{{panel:pd-trunk-explorer}}

## What the number does to the answer

Hold the pipe and the steel completely fixed. An NPS 8 schedule 80 line, 8.625 in outside on a 0.5 in wall with a 7.625 in bore, in x65 at 65000 psi, moves like this and only because of this one input.

| Design factor | Rating, psi |
| --- | --- |
| 0.4 | 3014.492754 |
| 0.5 | 3768.115942 |
| 0.72 | 5426.086957 |
| 0.8 | 6028.985507 |
| 1 | 7536.231884 |

Nothing physical changed down that column. Same steel, same wall, same outside diameter, same table row. The rating went from 3014.492754 psi to 7536.231884 psi because somebody typed a different number for a rule.

## A design factor of 1 is the bare hoop stress

The last row is the same calculation with the factor doing nothing, which is the hoop stress at yield: 7536.231884 psi on that line. On the gate pipe, 6.625 in outside with a 0.28 in wall in x52 at 52000 psi, the bare hoop is 4395.471698 psi against a rating of 3164.739623 psi at a design factor of 0.72, and the bare number is 1.388889 times the rated one. A wall at yield is a wall about to fail, so a bare hoop stress is a description of a limit rather than a pressure to work to.

## The factor moves the answer further than the steel does

On one 6.625 in pipe with a 0.28 in wall at a fixed design factor of 0.72, the entire grade range the module ships runs from 2130.113208 psi at gradeB to 3955.924528 psi at x65. On the NPS 8 line at a fixed grade, the design factor alone runs the answer from 3014.492754 psi to 7536.231884 psi. The regulatory input has a longer reach than the metallurgy, and it is the one most often inherited from a spreadsheet whose author is no longer around.

## The mistake

Comparing two ratings computed at different design factors and reading the difference as steel or as wall. The design factor is not a property of the pipe, it is not in the table, and the module will not supply it. Two ratings are only comparable when the factor behind them is the same number, and the rating alone does not carry it.

## What it refuses

There is no default and no fallback. An unknown grade gives `gradeYield('x55') = NaN`, a missing yield gives NaN, and a zero wall gives NaN. A rating computed with a factor the module invented would be a jurisdiction the module does not have, so the omission is deliberate and the caller carries it.

## Exercise

In the panel, rate the NPS 8 schedule 80 line in x65 at design factors of 0.4 and of 0.8 and write both, then say how much of the difference is steel.

Then say why a rating of 7536.231884 psi is a worse thing to write on a drawing than no rating at all.
