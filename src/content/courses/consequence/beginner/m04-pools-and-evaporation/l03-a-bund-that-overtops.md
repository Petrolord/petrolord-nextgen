# A bund that overtops

{{panel:cq-release}}

A bund confines a spill only while the liquid stays below the top of its wall. When the spilled volume would stand deeper than the wall, liquid spills over and runs out across the ground beyond. The bund model then fails to describe the pool, and the engine has no spreading model to take over. It refuses the case and says why.

## The same spill in a smaller bund

Take the 30 m3 spill from the first lesson of this module and put it in a bund of 50 m2, with the same 0.5 m wall. The liquid would stand, derived, 0.600000 m deep behind that wall. That is higher than the wall, and the engine refuses:

> spillVolumeM3: the spill overtops the bund (depth above the wall height), so the pool is not confined by it

The field named is `spillVolumeM3`. The message states the test the engine applied, depth above wall height, and the consequence: the pool is not confined by the bund.

## Why a refusal instead of a pool

The engine could have returned the bund pool anyway, at 50 m2, or clipped the depth at the wall height. Either would produce a number, and both would be wrong. Liquid that overtops a bund leaves it, so the real pool is larger than the floor and has a shape the bund model cannot describe. Anything built on the floor area would understate the consequence.

The engine takes the other path. It stops, names the input, and hands the decision back to the analyst.

## What the analyst does next

An overtopping bund is itself a finding worth recording, because a bund exists to hold the spill. Once it is recorded, the study still needs a pool. Two routes remain.

- **Treat the release as unconfined.** Clear the bund and state a pool thickness for the ground outside it. The engine then returns a pool marked UNCONFINED_STATED_THICKNESS, and the note records the thickness as the analyst's judgement.
- **Revisit the spill volume.** If the volume came from a release duration or an inventory, check that it is the right one. A shorter release, or an isolation that stops the flow sooner, may keep the pool inside the bund.

## The check is simple

The depth test is one division: the spill volume over the bund floor area, against the wall height. The engine performs it on every confined call. A bund result always means the liquid stayed below the wall.

## Exercise

On the pool view, set the bund floor area to 50 m2 with the default 30 m3 spill and the 0.5 m wall, and read the refusal. Then find, by trying values on the panel, a bund floor area that just confines the spill, and read the containment flag and depth it returns. Write one sentence on what the refusal would have hidden if the engine had returned a pool.
