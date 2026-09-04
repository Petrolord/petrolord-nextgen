# A drop and a stop

Three of the seven exception types read the same column: a mean volume over the recent window against a mean volume over the baseline. They differ in which column, and in what they do when the recent mean is zero.

{{panel:pd-exception-explorer}}

## One key, chosen by well type

`detectExceptions` sets `const rateKey = isInjector ? "winj" : "oil"`. Both are CALENDAR VOLUMES off the ledger row, stb over a row, and the producing-day rate the same file computes on every point is not consulted. A producer's fall is `rate_drop`, an injector's is `injection_drop`, and the two share one setting, `rateDropPct`, at a default of 20 per cent with the doubling to high at 40.

The published field gives all three verdicts on the same run.

| Well | Type | Value | Baseline | Severity |
| --- | --- | --- | --- | --- |
| P-5 | `rate_drop` | 100.000000000000 | 300.000000000000 | high |
| P-1 | `rate_drop` | 555.714285714286 | 900.000000000000 | medium |
| I-1 | `injection_drop` | 1900.000000000000 | 3000.000000000000 | medium |
| P-2 | `shut_in` | 0.000000000000 | 400.000000000000 | high |

The messages are "Oil down 67%: 100 vs 300 stb/d baseline.", "Oil down 38%: 556 vs 900 stb/d baseline.", "Water injection down 37%: 1,900 vs 3,000 stb/d baseline." and "Production stopped (baseline 400 stb/d oil)."

## A stop is not a large drop

`shut_in` is its own type and its severity is not earned. It is HIGH whatever the baseline was, so P-2, which stopped from a baseline of 400.000000000000 stb, ranks above P-1, which fell to 555.714285714286 stb from a baseline of 900.000000000000 stb and is printed at medium. No size of drop can produce a shut-in and no smallness of one can soften it. The teaching injector OGUTA-3W, invented for this course and neither published nor real, prices the shared setting the other way: its recent mean injection is 1994.285714285714 stb against a baseline of 2853.333333333333 stb, a change of -30.106809079 per cent, which is medium at a `rateDropPct` of 20 and high at 10.

## The mistake

Reading value and baseline as rates because the message says stb/d. Both are mean CALENDAR VOLUMES in stb over a ledger row, and the unit in the sentence is hard-coded. The teaching well OGUTA-6 makes the gap visible: its mean calendar oil falls 38.825312618416 per cent while its mean producing-day oil rate over the same rows changes by -1.856763925729 per cent.

## What it refuses

All three sit behind `minOilRate`, a default of 5, applied to the BASELINE mean. Below it no rate drop and no shut-in is reported at all. On the teaching field, setting `minOilRate` to 0 raises 9 exceptions including a high `rate_drop` on the small well OGUTA-5; at the default of 5 the same run raises 8 and that row is gone.

## Exercise

Compare the P-2 and P-1 rate rows in the panel and write down the value and baseline of each.

Then say why the row with the smaller baseline carries the higher severity.
