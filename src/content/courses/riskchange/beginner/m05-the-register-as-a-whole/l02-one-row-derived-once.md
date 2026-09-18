# One row derived once

Everything this tier has taught so far comes together on a single row. The engine function deriveRiskFields takes one risk record and produces every derived value in one pass: the inherent score and band, the residual score and band, and the appetite answer. The OBODO register is shown here with every risk derived once through it.

{{panel:rc-risk-explorer}}

## The OBODO register

| risk | status | L | I | inherent | inherent band | residual L | residual I | residual | residual band | target | appetite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OB-01 | "Open" | 3 | 5 | 15 | "Critical" | 2 | 5 | 10 | "High" | 10 | "Within appetite" |
| OB-02 | "Open" | 4 | 4 | 16 | "Critical" | 2 | "" | 8 | "Medium" | 6 | "Above appetite" |
| OB-03 | "Under Review" | 5 | 4 | 20 | "Critical" | null | null | 20 | "Critical" | 12 | "Above appetite" |
| OB-04 | "Mitigated" | 4 | 3 | 12 | "High" | 3 | 3 | 9 | "Medium" | 9 | "Within appetite" |
| OB-05 | "Open" | 2 | 5 | 10 | "High" | 1 | 5 | 5 | "Medium" | 4 | "Above appetite" |
| OB-06 | "Open" | 3 | 3 | 9 | "Medium" | 2 | 2 | 4 | "Low" | null | "Not set" |
| OB-07 | "Realized" | 3 | 4 | 12 | "High" | 2 | 4 | 8 | "Medium" | 8 | "Within appetite" |
| OB-08 | "Open" | 3 | 5 | 15 | "Critical" | 2.5 | 5 | 0 | "None" | 5 | "Not set" |
| OB-09 | "Draft" | 2 | 2 | 4 | "Low" | null | null | 4 | "Low" | null | "Not set" |
| OB-10 | "Closed" | 4 | 5 | 20 | "Critical" | 1 | 5 | 5 | "Medium" | 5 | "Within appetite" |
| OB-11 | "Open" | 3 | 6 | 0 | "None" | null | null | 0 | "None" | 6 | "Not set" |
| OB-12 | "Open" | 1 | 5 | 5 | "Medium" | 1 | 3 | 3 | "Low" | 3 | "Within appetite" |

## Reading one row left to right

Take OB-05. Its status is "Open", so it is live. Its likelihood is 2 and its impact is 5, and 2 times 5 is 10, which reaches the lower edge of "High". Its residual likelihood is 1 and its residual impact is 5, both assessed, and 1 times 5 is 5, which reaches the lower edge of "Medium". Its target is 4. A residual of 5 is above a target of 4, so its appetite is "Above appetite".

Every row reads the same way, and every rule from the earlier modules appears somewhere in the table:

- OB-02 has a blank residual impact, which falls back to its inherent impact of 4, so its residual is 2 times 4, which is 8.
- OB-03 has neither residual axis assessed, so its residual is its inherent score, 20.
- OB-04 lands exactly on its target, 9 against 9, and reads "Within appetite".
- OB-08 has a residual likelihood of 2.5, off the scale, so its residual is 0, "None", and its appetite is "Not set".
- OB-11 has an impact of 6, off the scale, so its inherent score is 0, "None".
- OB-06 has no target, so its appetite is "Not set".

## Derived once, used everywhere

Deriving the whole row in one call means every column on that row comes from the same record at the same moment. The band cannot disagree with the score beside it, and the appetite cannot be computed from a residual that has since changed. Edit a level and derive the row again, and every column moves together.

`rating`, the column the register stores, is the INHERENT band, and it is written from the engine on every save. So the stored rating of OB-05 is "High", its inherent band, while its residual band is "Medium".

## The mistake

The mistake is to recompute one column by hand and mix it with the engine's others. A band worked out from a remembered score, placed next to an engine appetite answer, can describe two different versions of the record. Read every column of a row from one derivation, and quote them together.

## Exercise

For OB-05 and OB-12, record the inherent score and band, the residual score and band, the target and the appetite. For each value, state the rule from this tier that produced it, and record which band the register stores as `rating` for each.
