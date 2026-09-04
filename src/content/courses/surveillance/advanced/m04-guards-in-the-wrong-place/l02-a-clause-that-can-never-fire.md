# A clause that can never fire

The gas-oil ratio gate in `detectExceptions` carries an escape hatch that no input can open, and the downtime branch two functions away carries a comparison that excludes the one uptime worth reporting. Both are single clauses.

{{panel:pd-reading-explorer}}

## The escape hatch

The gate reads `gorRecent.count && gorBase.count && gorBase.mean > 0 && (base.mean == null || base.mean >= s.minOilRate)`. The last clause is written to let a well through when its baseline oil is unknown.

`base` is the window mean of oil over that same window. `derivePoint` sets `oil` with `row.oil_stb || 0`, so oil is finite on every point that exists, and `base.mean` is null only when the window holds no points at all. In that case `gorBase.count` is zero and the gate shut two clauses earlier.

## Proved by construction rather than by argument

Five derived probes, each 40 days of identical rows. All five carry 40 points with a finite oil.

| Rows | Points with a finite gor | A window with a gor and no oil |
| --- | --- | --- |
| oil 0 stb, gas 0 Mscf | 0 | false |
| oil 0 stb, gas 100 Mscf | 0 | false |
| oil 3 stb, gas 0 Mscf | 40 | false |
| oil 3 stb, gas 100 Mscf | 40 | false |
| oil 900 stb, gas 500 Mscf | 40 | false |

Constructions in which the escape hatch could fire = 0 of 5. A row with no oil has no gas-oil ratio however much gas it made, so the two conditions the clause needs at once cannot both hold.

## The clause with the opposite defect

The downtime branch is `hrs.mean < s.downtimeHours && hrs.mean > 0`, against a `downtimeHours` default of 12. Every row of the hours sweep raises a high `rate_drop` and a high `watercut_rise` off the same constructed series, so the only column that moves is the third exception.

| Mean recent hours, h | downtime raised |
| --- | --- |
| 24.00 | none |
| 16.00 | none |
| 12.00 | none |
| 11.99 | medium |
| 6.00 | medium |
| 1.00 | medium |
| 0.10 | medium |
| 0.00 | none |

A well averaging 0.10 h raises a medium. A well averaging exactly 0.00 h, which is a well that recorded itself shut all window, raises nothing, and `shut_in` does not cover it wherever the baseline sits below `minOilRate`.

`downtime` is also always medium whatever the hours, so its severity carries no size.

## The mistake

Reading a surveillance run with an empty downtime column as a field that ran. The two lowest uptimes in that sweep are 0.10 h and 0.00 h, and only one of them is reportable.

## Exercise

Set the recent hours to 0.10 and then to 0.00 in the panel and record the exception count at each.

Then say which of the two clauses in that branch you would change, and what a well at exactly zero hours should report instead.
