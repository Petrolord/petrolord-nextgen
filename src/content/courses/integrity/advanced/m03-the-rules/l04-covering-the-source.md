# Covering the source

The base of the plug must be at or below the top of the source, and this is a different question from the one the last lesson asked.

{{panel:wi-pa-explorer}}

## The check

`plugRuleCheck` compares `plug.bottomMdM` against `sourceTopMdM` and requires the base to be at or below the source top. There is no margin on it. Equality passes.

The reasoning is geometric. If the plug base is shallower than the source top, there is open wellbore between the source and the cement. That gap is a place for reservoir fluid to sit, to build pressure, and to reach whatever else the open hole touches. The plug is above the problem instead of on top of it.

## Two checks, not one

`above-source` looks at the plug **top**. `covers-source` looks at the plug **base**. They ask different questions and a plug can pass either one while failing the other.

| The failure | What it looks like |
| --- | --- |
| Passes covers, fails above | The plug sits down in the source with too little cement above the source top |
| Passes above, fails covers | The plug is well up the hole with open wellbore between it and the source |

The coverage sweep shows the first case five times. Every plug in it has its base at or below the source top at 2500 m MD, so `covers-source` passes on all seven rows, while the five deepest tops fail `above-source`. The overall verdict follows the failure, because `plugRuleCheck` passes only when every check passes.

## The second case in the published programme

P3 intermediate runs 1700 to 1810 m MD. Judged against the reservoir sand, whose top is at 2500 m MD, it clears the above the source check by a wide margin and fails covers the source outright. Its base is nowhere near the reservoir.

That is not a defect in P3. It is a correct reading of what P3 is. Against the reservoir sand the programme lists it as a **secondary qualifying** plug, backing up a barrier from above, and against the intermediate gas stringer at 1800 m MD it is a primary, with a base at 1810 m MD that covers that source properly.

So the same plug is a pass and a fail at the same time, depending on which source you asked about. Always ask the engine about a named source.

## Exercise

1. Take a plug that passes both checks and raise the base above the source top without moving the top. Read which check flips.
2. Reproduce the P3 result against both sources and confirm the two verdicts.
3. For each barrier plug in a programme you know, name the source it covers.
