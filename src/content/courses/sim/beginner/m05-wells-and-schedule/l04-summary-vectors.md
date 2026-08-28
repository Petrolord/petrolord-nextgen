# SUMMARY vectors

The SUMMARY section is a shopping list. It changes nothing about the physics and it decides everything about what you can see afterwards.

## The naming scheme

Vector names are systematic once you see the pattern. The first letter is the scope, the rest is the quantity:

| prefix | scope |
|---|---|
| F | field |
| W | well |
| R | region |
| B | block, a single cell |

Then the quantity: OPR is oil production rate, OPT is oil production total, WCT is water cut, GOR is gas-oil ratio, BHP is bottom-hole pressure, PR is pressure. A trailing H means the HISTORY value, the observed number rather than the simulated one.

So FOPR is field oil production rate, WBHP is well bottom-hole pressure, and WOPRH is the observed oil rate for a well.

## What this deck asks for

At field level: FOPR, FOPT, FWPR, FWCT, FGPR, FGOR, FPR, FWIR, FGIR, FWIT, FGIT. Rates and totals for oil, water and gas, produced and injected, plus the average field pressure.

Per well: WOPR, WWPR, WGPR, WBHP, WWCT, WWIR, WGIR. The three production rates, the water cut, the bottom-hole pressure, and the two injection rates.

Because this deck has a history, it also asks for the observed counterparts: FOPRH, FWPRH, FGPRH, FWCTH, FGORH at field level and WOPRH, WWPRH, WGPRH per well.

{{panel:sim-deck-explorer}}

Open SUMMARY. It is 49 lines, and it is the shortest section that does real work.

## Why the H vectors matter

Because a history match is a comparison, and a comparison needs both series in the same file.

FOPR is what the model produced. FOPRH is what the field produced. Plotting them together is the history match, and without the H vectors you would have to carry the observed data separately and align it by hand, which is where alignment errors come from.

Requesting both is free and it is the difference between a results file you can audit and one you have to reassemble.

## The vector you forgot

The practical problem with SUMMARY is that you find out what you needed after the run.

A run that took four hours and did not request WBHP cannot tell you whether a well was on pressure control, and the only fix is to edit the deck and run it again. That is why decks tend to accumulate generous SUMMARY sections: the marginal cost of one more vector is a few bytes and the marginal cost of a missing one is a re-run.

The counterweight is that per-cell vectors on a large model produce enormous files, and a request for a block vector on every cell of a million-cell model will fill a disk.

## What SUMMARY cannot give you

Anything the model does not compute. There is no vector for sweep efficiency, none for the swept volume, none for how much of the injected water went out of zone. Those are quantities YOU derive from the vectors, which is what the waterflood course spent three tiers doing.

## The misconception to avoid

"Adding SUMMARY vectors changes the run." It changes the output file and nothing else. Two runs of the same deck differing only in SUMMARY produce identical reservoir behaviour. This is worth being certain about, because it means you can add vectors freely when re-running without worrying that you have perturbed the comparison.

## Exercise

First, decode these four vector names without looking at the table: FWCT, WOPRH, FGIT, WBHP.

Second, a colleague's run reports that a producer fell short of its target and asks why. Name the two SUMMARY vectors you would need and say what pattern in them would confirm pressure limitation.
