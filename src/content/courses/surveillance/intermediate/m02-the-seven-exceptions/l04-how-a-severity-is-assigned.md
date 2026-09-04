# How a severity is assigned

A severity is not a measurement of anything. It is the name of a threshold crossing, and for four of the seven types it is the name of the SECOND crossing of the same threshold.

{{panel:pd-exception-explorer}}

## The doubling rule, and the three types that ignore it

`rate_drop` and `injection_drop` are medium past `rateDropPct`, a default of 20 per cent, and high past 40. `watercut_rise` is medium past `watercutRisePts`, a default of 10 points, and high past 20. `gor_rise` is medium past `gorRisePct`, a default of 30 per cent, and high past 60. Those four are the doubling family.

The other three do not work that way at all. `shut_in` is HIGH whatever the baseline was. `downtime` is MEDIUM whatever the hours were, so a well averaging 0.10 h on stream and a well averaging 11.99 h against a 12 h threshold rank identically. `stale_data` doubling takes it only from info to medium, so a gap of 400 days against a `staleDays` of 7 is medium, the same rank as a gap of 15 days.

A lesson that tells you every severity in this list was earned by a size is wrong on three of the seven types.

## The same rows, a different rank

Raising `rateDropPct` on the published field, one setting at a time:

| rateDropPct | Exceptions | High | Medium |
| --- | --- | --- | --- |
| 5 | 9 | 7 | 2 |
| 10 | 9 | 7 | 2 |
| 15 | 9 | 6 | 3 |
| 20 | 9 | 4 | 5 |
| 25 | 8 | 4 | 4 |
| 30 | 8 | 4 | 4 |

The published strict case makes the point on named wells: at a raised `rateDropPct` the field returns 6 exceptions against 9 at the defaults, P-5 keeps its `rate_drop` at value = 100.000000000000 against a baseline of 300.000000000000 but is printed at MEDIUM rather than high, and the P-1 rate drop is gone. Not one ledger row changed.

## The mistake

Comparing severities across types. The reading can move one too. On the teaching well OGUTA-2, invented for this course and neither published nor real, the gas-oil ratio rise is 83.907484614181 per cent taken as a mean of daily ratios and 11.250129499613 per cent taken volumetrically off the same seven recent rows: high against nothing at all. On the published well P-1 the same seam gives high against medium on both ratios.

## What it refuses

No exception carries its own threshold, its own setting, or the reading its ratio was formed under. The returned object has a type, a severity, a value, a baseline and a message, and the reader is expected to know the settings the run used.

## Exercise

Run the published field at `rateDropPct` of 20 and again at 30 and write down the severity of the P-5 rate drop at each.

Then say what changed about the well between the two runs.
