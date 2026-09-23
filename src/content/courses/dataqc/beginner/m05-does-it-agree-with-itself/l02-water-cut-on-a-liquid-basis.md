# Water cut on a liquid basis

{{panel:dq-checks-explorer}}

A production sheet often reports a water cut beside the oil and water rates it was calculated from. That gives a check for free: compute the cut again from the rates and see whether the sheet agrees with itself. `waterCutCheck` does that. The engine's water cut is water / (oil + water), a liquid basis. A reported cut outside [0, 1] is flagged as out of range, and one that differs from the computed value by more than the tolerance is a mismatch.

| tolerance | failed | out of range | mismatch |
| --- | --- | --- | --- |
| 1e-6, the default | 83 | 5 | 78 |
| 1e-4, one unit in the fourth decimal | 6 | 5 | 1 |

## Why 83 becomes 6

EKENE-3's sheet reports water cut to four decimals, a stated fact about the file. A correct value rounded to four decimals can differ from water / (oil + water) by up to half a unit in the fourth decimal. The engine's default tolerance, 1e-6, is tighter than that, so at the default the rounding itself is flagged, 78 times, as a mismatch. Set the tolerance to one unit in the fourth decimal, 1e-4, and the rounding passes. What remains is the planted defects.

| day | reported | computed, water / (oil + water) | rule |
| --- | --- | --- | --- |
| 20 | 20.430000 | 0.204348 | water-cut-out-of-range |
| 21 | 21.000000 | 0.209967 | water-cut-out-of-range |
| 22 | 20.630000 | 0.206271 | water-cut-out-of-range |
| 23 | 20.650000 | 0.206484 | water-cut-out-of-range |
| 24 | 21.340000 | 0.213353 | water-cut-out-of-range |
| 55 | 0.248100 | 0.248871 | water-cut-mismatch |

Days 20 to 24 are written in percent, the same slip module three found in the neutron log. Day 55 was typed from day 54. Its reason sentence prints the reported value and then the computed value with every digit the arithmetic produced; when you reason with the computed cut, quote the field at six decimals, 0.248871.

## The tolerance is a statement about the file

The default is a choice: 1e-6 treats the reported cut as if it carried full precision. The engine cannot know how your file was written; you can, and the tolerance you pass should match it. A tolerance tighter than the reporting precision flags the rounding; a tolerance matched to it leaves only the disagreements that are real.

## The basis matters

A water cut can be defined more than one way, and they are not interchangeable. On day 10 the computed liquid-basis cut is 0.183105. Derived on the same day, water over oil, the water-oil ratio, is 0.224147, and oil over liquid, the oil cut, is 0.816895. Only the first is what the engine checks. On EKENE-3, where water is below oil on every day the course prints, a water-oil ratio in the water cut column would mismatch day after day; where water exceeds oil it rises above 1 and the out-of-range rule fires instead.

## Days it cannot compute

Where the engine cannot compute a liquid-basis cut, because a rate is missing or negative or there is no liquid, the computed entry is null. On EKENE-3 that is days 31, 32, 33, 47 and 60: the meter outage, the negative allocation entry and a shut-in day. The check does not judge those days; each is also a gap in the reported water cut column. Day 60 is a correct shut-in day that rateCheck does not flag.

## Exercise

Open the checks explorer on the consistency view. The oil and water boxes hold a stretch of EKENE-3's rates, and the table beneath them lists water / (oil + water) for each entry. Read the computed cuts. Now swap the oil and water boxes and read the table again. Explain which quantity the swapped table now shows, and why a reported cut on the wrong basis would mismatch day after day.
