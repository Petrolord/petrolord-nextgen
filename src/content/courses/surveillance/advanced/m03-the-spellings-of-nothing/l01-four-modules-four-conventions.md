# Four modules, four conventions

The same empty cell in the same ledger means four different things depending on which of the four modules reads it. None of them says which meaning it took.

{{panel:pd-reading-explorer}}

## The four lines

`surveillance.derivePoint` coerces a volume with `row.oil_stb || 0`, so an absent volume is zero, and so is a numeric string, which is neither a number nor zero. The same function reads the uptime with `Number.isFinite(row.hours_on) ? ... : null`, so an absent hours column is uptime unknown.

`allocation.computeAllocation` reads that identical column with `Number.isFinite(row.hours_on) ? ... : 24`, so an absent hours column is a full day on stream. `liftScreening.screenLift` coerces with `Number(x) || 0`, so an absent number is zero and an absent boolean is true. `liftAdvisor.num` takes a fallback per call site, 32 for an API.

## One column, two modules, side by side

A derived demonstration on one row of 800 stb of oil, moving nothing but the spelling of the hours.

| hours_on | surveillance oilPd, stb/d | allocation uptime | allocation theoretical oil, stb |
| --- | --- | --- | --- |
| 24 as a number | 800.000000000 | 1.000000000 | 1000.000000000 |
| 0 | null | 0.000000000 | 0.000000000 |
| null | 800.000000000 | 1.000000000 | 1000.000000000 |
| NaN | 800.000000000 | 1.000000000 | 1000.000000000 |
| the string "20" | 800.000000000 | 1.000000000 | 1000.000000000 |

`undefined` and the empty string behave exactly as `null` does on both sides.

## Where the two rows part

On the null row surveillance leaves the volume unscaled and reports 800.000000000 stb/d, and allocation credits a full day and a theoretical of 1000.000000000 stb. Those are consistent numbers and they are not the same claim. Surveillance says it does not know the uptime; allocation says the well was on all day. Only one is entitled to what it asserts, and both are called on the same ledger by the same studio.

A stated zero is the one spelling both agree on: surveillance returns null and allocation sets the uptime to 0.000000000 and the theoretical oil to 0.000000000 stb. Silence and a stated zero are the two ends of the allocation, one keystroke apart in a ledger.

The string "20" reaches neither reading. Both call `Number.isFinite`, so twenty hours written as text is not twenty hours in either module, and it is not a refusal in either module either.

## The mistake

Assuming a house convention. A reader who learns that surveillance treats a blank as unknown, and carries that across to the allocated volumes, will read a well credited with a full share as a well that reported one.

## What none of them refuses

No return in any of the four modules carries a flag saying a value was defaulted, a column was absent or a column arrived as text. The zero, the null, the twenty-four and the 32 all leave the function looking exactly like a measured input.

## Exercise

Take the hours row in the panel and set it in turn to a number, to zero, to null and to the text "20".

Then say for each spelling what surveillance concluded about the uptime and what allocation concluded, and which of the two you could defend to an auditor.
