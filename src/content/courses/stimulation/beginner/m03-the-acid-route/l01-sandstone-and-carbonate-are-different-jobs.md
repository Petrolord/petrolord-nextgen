# Sandstone and carbonate are different jobs

Same tanker, same pump truck, two entirely different pieces of engineering.

{{panel:st-acid-explorer}}

## What the acid is attacking

In a sandstone the rock framework is quartz. Hydrochloric acid does almost nothing to quartz, and the hydrofluoric blends that do attack it are not there to remove the reservoir. They are there to remove what is sitting in the pore throats: mud solids, migrated clay fines, scale. The acid dissolves the DAMAGE and leaves the rock behind.

In a carbonate the rock framework is the thing that dissolves. Hydrochloric acid on limestone attacks the matrix itself, fast and almost completely. There is no way to dissolve only the damage, because the damage and the rock are the same chemical target.

That one difference drives everything else in these two modules.

## Two different design questions

Because sandstone acid removes damage in place, the job succeeds when the acid front has swept past the outer edge of the damaged zone. The design question is a RADIUS, and what you deliver is the volume needed to reach it. The engine function `sandstoneAcid` takes a target front radius and returns a planning volume plus the skin still left behind.

Because carbonate acid dissolves rock, it does not advance as a tidy front. It opens a few dominant channels that run far ahead of anything uniform. The design question is a CHANNEL LENGTH, and the volume is what you spend to buy it. The engine function `carbonateAcid` takes the pumped volume and returns how far the channels effectively reached.

## The published pair

Both cases sit on the same well: 100 m of interval, porosity 0.18, wellbore radius 0.108 m.

| | Sandstone | Carbonate |
|---|---|---|
| You choose | front radius 0.6 m | pumped volume 8 m3 |
| Engine returns | volume 29.55 m3 | wormhole radius 0.39 m |
| Skin after | 1.62 | -1.29 |

Read the last row twice. The sandstone job is climbing back towards zero from a damage skin of 8.48. The carbonate job goes straight past zero into negative skin, because it has made the well effectively larger than it was drilled.

## The misconception to avoid

"Acidising is acidising, only the recipe changes." The two jobs have different objectives, different success criteria and different arithmetic. Treating a sandstone job as a small carbonate job is how people pump far too little acid and then report that stimulation does not work in their field.

## Exercise

First, write down in one sentence each what "success" means for the sandstone job and for the carbonate job above.

Second, in the panel, hold the sandstone target radius at 0.6 m and note the skin it leaves. Then say, without computing anything, whether pumping the same 8 m3 of carbonate acid into a sandstone would help.
