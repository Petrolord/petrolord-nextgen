# IRR by bisection

A root finder has no formula to fail and no derivative to diverge. What it still has to settle is where it will look, and since the 2026-09-15 repair the answer is one fixed band and a status word for everything outside it.

{{panel:ec-instrument-explorer}}

## The contract

`calculateIRR` follows the shared contract in `irrContract.js`, the same one the screening engine next door uses. It searches rates from negative 99 to 1000 percent and returns a number only when exactly one rate in that band brings the net present value to zero. A negative root inside the band is reported as the negative rate it is.

Everything else comes back null, and `calculateIRRResult` says why in one word. `no-sign-change` when the flows never change sign. `no-root` when nothing in the band zeroes the present value. `above-clamp` when the only root sits above the band. `multiple-roots` when several are in reach, with `irrRoots` listing the ones inside the band and `irrRootAboveBand` flagging one beyond it.

| case | flows | what the engine returns |
| --- | --- | --- |
| irr_known_21pct_year_end | -100 then 121 | 21.0000 percent |
| irr_three_period | -1000, 600, 600 | 13.0662 percent |
| irr_negative_root_reported | -100 then 90 | -10.0000 percent |
| irr_above_clamp_past_old_bracket | -1 then 2000 | null, above-clamp |
| irr_no_root_below_band | -100 then 0.5 | null, no-root |
| irr_multiple_roots_listed | -100, 230, -132 | null, multiple-roots |

The first checks the convention: with year-end discounting one plus the rate is 1.21, so the rate is 21 percent. The fourth has a true root of 199900.0000 percent, far above the band. The last has roots at 10 and 20 percent and both are listed.

## On real ledgers

Over the Designer's default project the six templates return 44.6574 percent for "Generic Royalty/Tax", 44.0823 for "Brazil - Concession", 40.2125 for "USA - Gulf of Mexico", 33.2329 for "Ghana - Deepwater", 32.3741 for "Angola - Deepwater PSC" and 28.2129 for "Nigeria - PIA (2021)". On the teaching field, whose prices start at 45 USD per bbl, all six come back null. "Brazil - Concession" is the one the verdict explains: its present value is zero at two rates, one negative and one below the 12 percent the field is discounted at, so no single rate can be named.

## The mistake

The mistake to retire with the old solver is reading a very large rate as a very good project. Until the repair this function bracketed by doubling from 100 percent, ten times over, and printed the top of its own search as a rate whenever the present value was still positive there, so a suspiciously round number stood where a rate should be.

The capex multiplier of 0.7 on the flat regime is the case to keep. Its present value is zero at 1095.4783 percent, which is above the band, and again at negative 20.4852 percent, which is inside it, so the engine returns null with the status multiple-roots and `irrRoots` carrying the negative root alone. A reader who took the large number for a return was ranking the payout of a reduced outlay against real rates.

## What it refuses

It will not name a rate it cannot make unique inside the band, so a column of nulls is the ordinary look of a comparison on a field whose cash flow changes sign twice. It reports nothing above 1000 percent and nothing below negative 99, and the year-end convention is baked in.

## Exercise

Write the four statuses with one published case for each. Then give the six default project rates, say what the same six templates return on the teaching field, and name the reading habit that the band and the status words were written to stop.
