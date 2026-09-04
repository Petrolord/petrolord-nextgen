# Above the source

The plug has to reach past the thing it is isolating, and 50 m is how far past.

{{panel:wi-pa-explorer}}

## The check

`plugRuleCheck` computes `aboveM = sourceTopMdM - plug.topMdM` and requires it to be at least **50 m MD**. In words, the top of the plug must sit at least 50 m shallower than the top of the source of inflow.

This check only runs for a plug that is not a surface plug and only when a source top is supplied. Ask the engine about a plug without naming a source and you get the length check alone.

## What the margin is for

Everything you do not know about where the plug top actually is.

The as pumped top and the settled top are different depths. The top of a cement column is where contamination lives, so the shallowest few metres of any plug are the least trustworthy part of it. Depth control on the string, on the source pick and on the eventual tag all carry error. And the source itself may be thicker or shallower than the log says.

The 50 m is a buffer against all of that at once. It is not a seal length. The seal is the body of the plug. The 50 m is the distance you are willing to lose and still have a plug.

## The sweep

A source with its top at 2500 m MD, and a plug of the same length slid up the hole:

| Plug top, m MD | Above the source, m | Verdict |
| --- | --- | --- |
| 2600 | -100 | fail |
| 2560 | -60 | fail |
| 2520 | -20 | fail |
| 2500 | 0 | fail |
| 2470 | 30 | fail |
| 2440 | 60 | pass |
| 2400 | 100 | pass |

Read the negative rows carefully. A negative "above" means the plug top is deeper than the source top, so the plug is sitting inside the source with reservoir above it. The row at 0 is the plug top exactly on the source top, which is a plug with no margin at all, and it fails.

## In the published case

P1 reservoir primary tops out at 2380 m MD against a source top of 2500 m MD, giving 120 m above the source. P2 reservoir secondary tops out at 2350 m MD and gives 150 m. Both clear 50 m comfortably, which is what a designed plug should look like.

## Exercise

1. Move a plug up the hole in small steps and find the deepest top that still passes.
2. Set the plug top exactly on the source top and confirm the verdict.
3. State, for your own well, the largest depth error you could plausibly have on a plug top.
