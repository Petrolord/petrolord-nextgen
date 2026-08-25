# A pick is a measured depth

The tie machinery consumes picks, and it is easy to forget what a pick actually is. This lesson pins that down, because the residual's meaning depends on it.

## Where a pick comes from

A formation top pick is an interpretation event: somewhere in a well's logs, a geologist decided that the character changed from one formation to the next, and recorded the depth of that change. The depth recorded is measured depth, because that is the axis the logs live on. Nothing about the pick knows the model, the frame, or even the trajectory; a pick is a statement of the form "along this hole, at 1580 m of cable, the formation changed".

That has two consequences the tie table inherits. First, a pick can be wrong on its own terms: the geologist may have placed the boundary at the wrong log break. The tie residual cannot distinguish a wrong pick from a wrong surface; it only measures their disagreement. Second, a pick's location in space is DERIVED, not observed. Move the trajectory and every pick in the well moves with it, even though nothing about the well's logs changed. Module five leans on this hard.

## The fixture's picks

The golden wells carry three picks each, TopA, TopB and BaseB, and each pick name is bound to a framework surface by an explicit index: TopA to surface 0, TopB to surface 1, BaseB to surface 2. The binding is by NAME, and the engine skips a pick whose name has no surface, rather than guessing. In a real registry this is where naming discipline pays: a pick called Top_A or TOPA would silently produce no tie row, and the QC that notices a well with fewer rows than picks is the defence.

The MD values were listed in module one; what matters here is their ORDER. In every well, TopA's MD is less than TopB's, which is less than BaseB's: the hole meets the formations in stratigraphic order. Nothing in the engine enforces that; it is a property of the geology being layered and the holes being one-way. A pick list that violated it, TopB above TopA in a hole, would be a red flag about the picks, and the tie table would faithfully tie each pick anyway, which is the correct division of labour: the tie machinery checks surfaces against picks, not picks against stratigraphy.

## What zone intervals add

Each well also carries zone intervals, zone A from the TopA pick's MD to the TopB pick's MD, zone B onward to BaseB. The intervals exist because the Expert tier needs a WEIGHT for each well's property value, and the natural weight is how much of the zone the well sampled. The interval is stored in MD, and the weight used downstream is the MD length, base minus top: 35, 120, 45 and 46 m for zone A in W1 through W4. Whether MD length is the RIGHT weight for a deviated well is a real question, and it is deliberately deferred to module five rather than smuggled past you here.

## Worked example

Read W2's zone A interval from its picks. TopA at 1580 m MD, TopB at 1700, so the zone A interval is [1580, 1700] and its MD length is 120 m. Now state what is and is not claimed by that 120. Claimed: the hole spent 120 m of its length inside zone A. Not claimed: that zone A is 120 m thick. The thickness of rock crossed is a trajectory question, answered in module two as 84.8528137423857 m of TVD, and the gap between 120 and 84.85 is entirely the 45 degree angle.

## Exercise

W4's picks are TopA 1584, TopB 1630, BaseB 1660, and its KB is 28 m. Write down the two zone intervals, their MD lengths, and, using the vertical shortcut valid for W4, their thicknesses in vertical rock. State in one sentence when the MD length and the rock thickness of a zone can legitimately differ.
