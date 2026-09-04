# The field day

`buildFieldSeries` has no idea what a well is. It keys on the date, adds every row carrying that date, and returns one point per field day.

{{panel:pd-ledger-explorer}}

## The sums come first and the ratios come off the sums

Four columns accumulate: oil, water and water injection in stb, gas in Mscf. Liquid is the oil sum plus the water sum. The watercut is the water sum over the liquid sum, a fraction. The gas-oil ratio is the gas sum times 1000 over the oil sum, in scf/stb. Both ratios are formed volumetrically, off the sums, and neither is an average of anything the wells reported.

Three consecutive days as committed in `surveillance_cases.json`, each column a volume over one field day and not a rate:

| Date | Oil, stb | Water, stb | Gas, Mscf | Watercut | GOR, scf/stb |
| --- | --- | --- | --- | --- | --- |
| 2025-06-28 | 740.000000 | 660.000000 | 767.000000 | 0.471428571429 | 1036.486486486 |
| 2025-06-29 | 740.000000 | 660.000000 | 767.000000 | 0.471428571429 | 1036.486486486 |
| 2025-06-30 | 9740.000000 | 2910.000000 | 6167.000000 | 0.230039525692 | 633.162217659 |

Water injection is 1900.000000 stb on all three. The shipped engine reproduces all 51 published days.

## The accumulator decides the answer

`d.oil += r.oil_stb || 0` starts at a numeric zero. `row.oil_stb || 0` hands back the string when the column arrived as text, and the first such row turns the accumulator itself into a string, so every later row is concatenated onto it rather than added.

Four identical rows of 800 stb of oil, all on one date, run through the shipped function:

| Rows on the date | As numbers, stb | As strings, stb | Overstatement factor |
| --- | --- | --- | --- |
| 1 | 800.000000000 | 800.000000000 | 1.000000000000 |
| 2 | 1600.000000000 | 800800.000000000 | 500.500000000000 |
| 3 | 2400.000000000 | 800800800.000000000 | 333667.000000000000 |
| 4 | 3200.000000000 | 800800800800.000000000 | 250250250.250000000000 |

Those are derived rows on constructed inputs, not a published case.

One text row is wrong before any accumulation. Through `buildFieldSeries` alone it returns oil 800.000000000 stb, water 200.000000000 stb, a liquid of 8000200.000000000 stb and a watercut of 0.000024999375. Nothing in the return says a column arrived as text.

## What it declines to filter

`buildFieldSeries` filters on nothing and never asks what type a well is, so an injector row and an observation row land in the field totals. They add nothing to oil, water or gas, and they do add to the injection total and the on-count.

## The mistake

Averaging the wells' own watercuts and expecting the field watercut. The field figure is one division on two sums, so a large well moves it and a small one barely does.

## Exercise

Read the published field series in the panel and write down the oil, water and watercut on 2025-06-28 and on 2025-06-30.

Then say why one row typed as text moves a field oil total by a factor of 500.500000000000.
