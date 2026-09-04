# A number that arrived as text

`row.oil_stb || 0` is meant to catch a missing volume. A non-empty string is not missing, so the string is what comes back, and four of the derived quantities on that row are then formed out of text.

{{panel:pd-reading-explorer}}

## The same row twice

A derived demonstration on one constructed row, first with the volumes as numbers and then with the identical volumes as strings.

| Quantity | Volumes as numbers | Volumes as strings |
| --- | --- | --- |
| liquid, stb | 1000.000000000 | 800200 |
| watercut, fraction | 0.200000000000 | 0.000249937516 |
| gor, scf/stb | 500.000000000 | 500.000000000 |
| oilPd, stb/d | 800.000000000 | 800.000000000 |
| liquidPd, stb/d | 1000.000000000 | 800200.000000000 |

## Why two of the five survive

Every derived quantity formed by multiplication or division coerces its operands back to numbers, so the gas-oil ratio and the oil producing-day rate come back exactly right. The one formed by addition is `liquid`, and `+` on two strings concatenates rather than adds.

Everything that passes through `liquid` inherits that. On this row the watercut is understated by a factor of 800.200000000 and the liquid producing-day rate is overstated by the same factor of 800.200000000, one in each direction, and that factor is the whole of the damage at the level of a single row.

## The accumulator is a different mechanism

`buildFieldSeries` runs `d.oil += r.oil_stb || 0`. The accumulator starts as a numeric zero, the first string turns the accumulator itself into a string, and every later row on that date is concatenated onto it.

Even one string row through that path reports a field oil of 800.000000000 stb and a field water of 200.000000000 stb with a field liquid of 8000200.000000000 stb and a field watercut of 0.000024999375, on a `wellsOn` of 1.

| Rows of 800 stb on one date | As numbers, field oil, stb | As strings, field oil, stb |
| --- | --- | --- |
| 1 | 800.000000000 | 800.000000000 |
| 2 | 1600.000000000 | 800800.000000000 |
| 3 | 2400.000000000 | 800800800.000000000 |
| 4 | 3200.000000000 | 800800800800.000000000 |

The overstatement factor on those rows runs 1.000000000000, then 500.500000000000, then 333667.000000000000, then 250250250.250000000000. It grows with the number of rows sharing a date, which is a property of an accumulator and not of any one row.

## The mistake

Sanity-checking the row by its ratios. A gas-oil ratio of 500.000000000 scf/stb and an oil producing-day rate of 800.000000000 stb/d are exactly what a clean row would give, and the liquid on the same row is 800200 stb. The two quantities that look right are the two that could not have been wrong.

## What nothing reports

No return in `surveillance.js` carries a note that a column arrived as text. A single text row is already wrong in the liquid and the watercut, and the producing-day oil rate beside it is still correct, so a reader has no inconsistent pair to notice.

## Exercise

Set the oil and water on one row in the panel as text and record the liquid, the watercut and the gas-oil ratio.

Then say which of those three you would have believed, and name the operator that decided it.
