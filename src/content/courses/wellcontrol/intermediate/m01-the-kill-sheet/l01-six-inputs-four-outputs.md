# Six inputs, four outputs

The whole sheet, in one page.

{{panel:wc-killsheet-explorer}}

## The six inputs

**Known before the kick:** the true vertical depth at the bit, the true vertical depth at the shoe, the mud density, the slow circulating rate pressure, the pump output, and the string and annulus volumes.

**Measured during it:** the shut-in drill pipe pressure, the shut-in casing pressure, and the pit gain.

That is nine items, of which the first six are the standing part and the last three are the event.

## The four outputs

**Formation pressure.** The mud head at the bit plus the SIDPP.

**Kill mud density.** The same statement expressed as a density.

**Initial circulating pressure.** The slow circulating rate pressure plus the SIDPP.

**Final circulating pressure.** The slow circulating rate pressure scaled by the kill mud over the original mud.

Plus the schedule between the last two, and the stroke counts that set its length.

## The horizontal well, moderate scenario

| output | value |
|---|---|
| formation pressure | 19155726.143274635 Pa |
| kill mud density | 1607.873978399 kg/m3 |
| initial circulating pressure | 6500000 Pa |
| final circulating pressure | 5024606.182497741 Pa |
| strokes to the bit | 2019.221492463 |
| bottoms up | 5613.784216004 |
| total strokes | 7633.005708467 |

## What is NOT an output

**The casing pressure history.** The engine produces the drill pipe schedule and nothing about what the choke will read.

**Whether the shoe will hold.** That is the kick tolerance calculation and it is a separate call.

**Which method to use.** A procedure decision.

## Why the drill pipe side and not the annulus

Because the drill pipe side is calculable and the annulus side is not.

The string contains one fluid at a time with a known density and a known displacement rate. The annulus contains mud, influx and expanding gas at unknown positions.

So the schedule is written on the side that can be computed, and the choke is used to make the other side follow.

## The single most important consequence

The choke operator does not watch the casing pressure. They watch the DRILL PIPE pressure and move the choke to keep it on the schedule.

The casing pressure is an outcome. Trying to control it directly is how a kill goes wrong.

## Exercise

For the slant well's small scenario, work all four outputs from the six inputs.

Then check them against the panel, and identify which of the four would change if the slow circulating rate pressure had been recorded wrongly.
