# What a row holds

`derivePoint` sees one ledger row and nothing else. It returns fourteen keys, of which nine are copied through unchanged and five are computed, and every one of the five can come back null.

{{panel:pd-ledger-explorer}}

## The five computed members

`liquid` is oil plus water, in stb over the row, and it is a volume. `watercut` is water divided by liquid, a fraction, null when the row made no liquid. `gor` is gas times 1000 divided by oil in scf/stb, null when the row made no oil, and that 1000 is scf per Mscf and the only unit conversion in the file. `oilPd`, `waterPd`, `gasPd` and `liquidPd` are the volumes scaled to twenty-four hours, and they are null when `hours_on` is zero.

## The five published rows

The surveillance golden commits five rows and the five points they must produce, and the shipped engine reproduces all five.

| Row date | oil, stb | water, stb | gas, Mscf | hours_on, h | watercut | gor, scf/stb | oilPd, stb/d |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-01-01 | 800.000000 | 200.000000 | 400.000000 | 24.000000 | 0.200000000000 | 500.000000000 | 800.000000000 |
| 2025-01-02 | 500.000000 | 100.000000 | 250.000000 | 12.000000 | 0.166666666667 | 500.000000000 | 1000.000000000 |
| 2025-01-03 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | null | null | null |
| 2025-01-04 | 450.000000 | 90.000000 | 225.000000 | null | 0.166666666667 | 500.000000000 | 450.000000000 |
| 2025-01-05 | 0.000000 | 0.000000 | 120.000000 | 24.000000 | null | null | 0.000000000 |

Three of the five rows carry a `gor` of 500.000000000 scf/stb at three different oil volumes, which is what a ratio is for.

## Where the copied nine matter

`hours_on` is copied through as `hoursOn` and it is the only input to the four producing-day rates. The row of 2025-01-02 books 600.000000000 stb of liquid over twelve hours and returns a `liquidPd` of 1200.000000000 stb/d. Both numbers describe that row. One is the volume it made, the other is the rate it was making it at.

## What the function never does

It never says how long the row actually covers. Every row is read as one calendar day whatever period it was booked over, and there is no field in the input that could tell it otherwise.

## The mistake

Reading `liquid` and `liquidPd` as the same quantity with a scale factor between them. On the row of 2025-01-04 they are 540.000000000 stb and 540.000000000 stb/d, identical numbers, because `hours_on` arrived null and the rate fell back to the volume. On the row of 2025-01-02 they are 600.000000000 stb and 1200.000000000 stb/d. The relation between the two is not fixed and it is not visible in the pair.

## Exercise

Load the five published rows in the panel and write down which of them return a null `watercut` and which return a null `oilPd`.

Then say why the row of 2025-01-05 has an `oilPd` of 0.000000000 stb/d rather than null.
