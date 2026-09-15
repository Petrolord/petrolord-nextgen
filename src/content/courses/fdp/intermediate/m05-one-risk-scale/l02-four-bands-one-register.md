# Four bands, one register

There are four bands and they are the only ones in the studio: 20 and above is Critical, 12 and above is High, 6 and above is Medium, and below that is Low. The register, the HSE tab, the matrix and the response plan all read those same three thresholds.

{{panel:ec-schedule-explorer}}

## One register, banded

| risk | source | probability | impact | score | band |
| --- | --- | --- | --- | --- | --- |
| Subsea tie-in slips | Schedule | 4 | 5 | 20 | Critical |
| Hull yard delay | Fabrication | 3 | 4 | 12 | High |
| Reservoir underperformance | Subsurface | 2 | 4 | 8 | Medium |
| Logistics congestion | Operations | 2 | 2 | 4 | Low |
| Host government approval | Regulatory | none | 5 | none | Unscored |

By band the register reads Critical 1, High 1, Medium 1, Low 1, Unscored 1. The HSE matrix run over the same rows reads critical 1, high 1, medium 1, low 1, unscored 1, total 5. The two agree, and they agree for a reason that is worth stating plainly: there is one scale and both surfaces use it.

Unscored is the fifth label in that count and it is not a fifth band. It is what the register reports for a row that carries no probability, so no score could be formed and no threshold could be applied to it.

## Why agreement is the headline

Before the repairs made ahead of this course, several surfaces each carried their own thresholds. One score could read in one band on the register and a different band on the HSE tab, and a reader had no way to tell which surface was right because each was internally consistent. Treat that as history. What matters now is that a disagreement between two surfaces is a bug rather than a matter of interpretation.

## The boundary belongs to the higher band

A published case pins the thresholds exactly at 20, 12 and 6. It returns a consolidated score of 68 with Critical 2, High 1, Medium 1 and Low 1, and a portfolio health of 46. A score that lands exactly on a threshold goes up, not down. Subsea tie-in slips at 20 is Critical rather than High, and Hull yard delay at 12 is High rather than Medium, and both of those sit on the boundary by construction.

## Bands are not the only cut

The same register counted by source reads Schedule 1, Fabrication 1, Subsurface 1, Operations 1, Regulatory 1. Five rows, five sources, one each. That cut and the band cut both total 5 and answer different questions: which risks are severe, and where in the organisation they come from. A register with four Highs all from one source is a different problem from four Highs from four sources, and the band count alone cannot show it.

## The mistake

The mistake is letting the band count stand in for the register. One Critical sounds like one problem, and the Critical row here carries a cost impact of 180.0000 million USD while the Medium row carries 300.0000 million USD. Severity and money are different columns, and reading either one alone gets a register wrong.

## Exercise

State the four bands with their thresholds, then give the register's count by band and the HSE matrix's count over the same rows. Say why those two agree. Then give the count by source and name the two register rows whose scores sit exactly on a threshold.
