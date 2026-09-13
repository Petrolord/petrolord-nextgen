# IRR by bisection

A bisection has no formula to fail and no derivative to diverge, which is why the engine documents it as robust with no artificial cap. It still has to find a bracket first, and the bracket is where the trouble lives.

{{panel:ec-instrument-explorer}}

## The four steps

The function checks that the flows change sign, and returns 0 if they never do. It checks that the net present value at a rate of zero is above zero, and returns 0 if it is not. It then brackets by starting at 100 percent and doubling ten times, and if the value is still positive at the top of that range it reports the bound instead of a root. Finally it bisects 80 times inside the bracket it found.

Eighty halvings is a fine sieve, which is why the engine and the golden agree to four decimals wherever a root exists.

| case | flows | engine percent | golden expects percent |
| --- | --- | --- | --- |
| irr_known_21pct_year_end | -100 then 121 | 21.0000 | 21.0000 |
| irr_three_period | -1000, 600, 600 | 13.0662 | 13.0662 |
| irr_beyond_bracket | -1 then 2000 | 102400.0000 | 102400.0000 |

The first is the sanity check on the convention: with year-end discounting, one plus the rate is 1.21, so the rate is 21 percent. The third case is different in kind.

## On real ledgers

The bisection is well behaved on anything the sandbox actually produces. Over the Designer's default project the six templates return 44.6574 percent for "Generic Royalty/Tax", 43.0919 for "Brazil - Concession", 40.2125 for "USA - Gulf of Mexico", 33.2329 for "Ghana - Deepwater", 32.5073 for "Angola - Deepwater PSC" and 28.2129 for "Nigeria - PIA (2021)". On the teaching field, whose prices start at 45 USD per bbl, the same six return 11.4055, 10.6728, 8.7906, 8.4381, 7.4603 and 6.4905 percent. Same regimes, same code, and an ordering that survives the change of field.

## The mistake

The mistake is reading a very large internal rate of return as a very good project. Two published cases show why. The capex multiplier of 0.7 on the flat regime reports 1095.4783 percent, with a payout year of 1: the field returned its reduced outlay almost immediately, and the rate is real but tells a reader nothing they could act on. Worse, the case with flows of -1 then 2000 reports 102400.0000 percent, and 102400 is not a root at all. It is 100 doubled ten times, the top of the search, reported because the net present value was still positive when the doubling stopped. The true rate on those flows is 199900 percent. The golden pins the disagreement rather than hiding it, and the Expert tier takes the bracket apart.

The tell is a suspiciously round number where a rate should be. A rate that comes out of 80 bisections looks like 13.0662. A rate that is really a bound looks like 102400.

## What it refuses

It returns one number for a curve that may have more than one root, and says nothing about how many it found. It carries no status flag, so a bound, a guard and a genuine root all arrive as the same kind of value. And the year-end convention is baked in, so the rate it reports is a year-end rate and cannot be compared with a mid-year rate from another engine.

## Exercise

Write the four steps in order and say which step produces 102400.0000 percent. Then give the six default project rates and the six teaching field rates, and name what changed between them.
