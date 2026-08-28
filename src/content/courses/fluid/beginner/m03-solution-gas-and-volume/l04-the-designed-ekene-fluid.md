# The designed Ekene fluid

Four properties, chosen rather than measured, carried unchanged through five courses. This lesson is why that was done and what it costs.

## The designed set

| property | designed value |
|---|---|
| bubble point | 2000 psia |
| solution gas at bubble point | 400 scf/stb |
| formation volume factor | 1.2 rb/stb |
| oil viscosity | 1.8 cp |

Nobody measured any of it. The material balance course needed a fluid to build a tank model on, chose a self-consistent and unremarkable set, and every course since has used it.

## What the correlations say

| property | designed | Standing at the designed Rs |
|---|---|---|
| bubble point | 2000 psia | 1912.1923059028293 psia |
| formation volume factor | 1.2 rb/stb | 1.2407824121407645 rb/stb |

And running the correlation the other way, at the designed bubble point of 2000 psia it gives 421.94 scf/stb rather than 400.

Three comparisons, three disagreements, all in the range of a few percent. That is what it looks like when a designed fluid is close to but not on a correlation's surface.

## Why consistency was chosen over agreement

Because the alternative is worse.

The tank model's pressure history was computed with these values. The waterflood ledger's frozen factor set uses them. The fractional flow curves in the displacement course were built with the 1.8 cp viscosity in the mobility ratio. The simulation deck's PVTO tables carry them.

Replace the fluid with a correlated one and every one of those becomes internally inconsistent, and the inconsistency is invisible: nothing errors, the numbers just quietly stop meaning what the documents say they mean.

The simulation course stated this as a rule and it is worth repeating from the fluid side. **The fluid a model carries must be the fluid the model was matched against.** Not the most recently published one, not the one a correlation prefers, the one the rest of the work used.

## What it costs

Two things, and both should be in the report.

**The fluid is not a measurement.** Ekene has no laboratory PVT. Every number in that table is a decision, and a decision is a weaker thing than a measurement even when it is a sensible one.

**It does not sit exactly on any published correlation.** So a reader who checks it against Standing will find a few percent of disagreement and needs to be told in advance that this is expected rather than an error.

Both fit in one sentence: "PVT is a designed self-consistent set carried from the material balance study, not a laboratory measurement; it differs from Standing by a few percent, which is expected."

## What it buys

Traceability. Because the fluid never changed, a formation volume factor quoted in the waterflood course is the same number as the one in the simulation deck, and a discrepancy between two courses means a real error rather than a fluid update nobody logged.

On a real field that property is worth a great deal and it is usually absent. Fluid descriptions get revised, and the revisions rarely propagate to every calculation that used the old one.

## The misconception to avoid

"A designed fluid means the exercises are not real." The correlations being run on it are the real ones, the arithmetic is the real arithmetic, and the disagreements are the size of real disagreements. What a designed fluid removes is the measurement uncertainty, which lets the correlation uncertainty be seen on its own. That is a teaching advantage rather than a compromise.

## Exercise

First, write the four designed Ekene properties and, beside each, what a correlation says, where the course has given you one.

Second, suppose a new laboratory report arrives with a bubble point of 2150 psia. List the calculations across the previous four courses that would have to be revisited, and say what would happen if only the simulation deck were updated.
