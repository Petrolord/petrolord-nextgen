# Health, and what it counts

Portfolio health is a number from 0 to 100 built from the bands of the risks that carry a score. EGINA's register returns 58, with a consolidated score of 44 and one unscored risk that health does not see at all.

{{panel:ec-schedule-explorer}}

## The ladder, from published registers

| register | bands | consolidated | health |
| --- | --- | --- | --- |
| empty | nothing | 0 | 100 |
| every risk Low | Low 4 | 8 | 100 |
| one Medium | Medium 1 | 6 | 80 |
| one Medium with a fractional probability | Medium 1 | 10 | 80 |
| one Medium and one unscored risk | Medium 1, Unscored 1 | 9 | 80 |
| one High | High 1 | 12 | 50 |
| one Critical and one Low | Critical 1, Low 1 | 24 | 50 |
| one of each band | Critical 1, High 1, Medium 1, Low 1 | 44 | 58 |
| two Critical and three below | Critical 2, High 1, Medium 1, Low 1 | 68 | 46 |
| every risk Critical | Critical 3 | 75 | 0 |

## Health does not read the consolidated score

Three registers in that ladder carry a consolidated score of 6, of 9 and of 10, and all three return a health of 80. Two more carry 12 and 24 and both return 50. The consolidated score adds the scores up and health does not use it. Health reads the band of each scored risk and averages, so a single Medium is 80 whether its score is 6, 9 or 10.

## It is an average, so the count matters

Every risk Critical returns 0 and it floors there. One Critical with one Low returns 50, because the average is taken over both. Nothing was mitigated between those two registers: a row was added. Health rises when a register grows in its lower bands, which means comparing the health of two registers is only meaningful when they hold a comparable number of rows. A published register of five rows, Critical 1, High 2, Medium 1 and Low 1, returns a consolidated 56 and a health of 56, and it is a worse register than EGINA's four rows at 58 by a margin that a single averaged number carries badly.

## Unscored rows are not counted

A register of one Medium risk returns 80. Add a risk with no probability and it returns 80 still, with a consolidated 9 and the bands reading Medium 1, Unscored 1. EGINA's health of 58 is the average across its four scored rows, and its fifth row is reported and excluded. That is the point of the Unscored label: the row is visible, and it moves nothing.

## The mistake

The mistake is reading 100 as safe. An empty register returns 100, and so does a register of four Low risks, and the two are not the same situation. Health has no view on how many risks are missing from a register, how much money they carry or whether anybody has looked. A health of 58 beside an exposure of 269.0000 million USD and one unscored row is three separate readings, and the register is the only place all three can be reconciled.

## Exercise

Give the health of an empty register, of one made only of Low risks, and of one made only of Critical risks. Name the three consolidated scores in the ladder that all return a health of 80 and say what that tells you about how health is computed. Then give EGINA's health, its consolidated score and its count of unscored risks.
