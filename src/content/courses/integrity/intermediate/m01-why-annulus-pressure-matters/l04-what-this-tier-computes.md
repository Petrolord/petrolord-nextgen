# What this tier computes

A short list, and a shorter list of things people expect from it that are not there.

## The return

    { engine, rows, governing, maaspPa, negative }

One row per element you supplied. The name of the row that governs. A number, clamped at zero. A flag saying the clamp did something. The MAWOP path adds `mawopPa`, which is the same value under a second name.

That is the whole output. Everything else in this module is how to read those five fields honestly.

## The clamp and the flag

The reported limit is the greater of zero and the governing row's allowable, and `negative` is true when that allowable was below zero.

A zero with the flag raised is not a well at its limit. It is a well where the annulus fluid column alone already exceeds what the governing element can carry, before you add any pressure at surface. Raise the published annulus fluid to 2250 kg/m3 and the governing row allows minus 506009.3090692945 Pa, so the engine reports 0 and raises the flag.

Reporting the raw negative would invite someone to treat it as a pressure they could arrive at by bleeding down, and there is no such pressure. Reporting zero without the flag would hide a design problem behind a plausible looking number. The clamp and the flag only work as a pair, so read them as a pair.

## True vertical depth, not measured depth

Every element carries `tvdM`. A pressure head is a vertical quantity, so a measured depth handed in here would silently inflate every hydrostatic term on a deviated well.

The conversion belongs to the survey engine and this one does not attempt it. In the published case the limiting element sits at 2400 m measured and 2048.29303343 m vertical, and using the wrong one of those would be a large error in the same direction on every row.

## What it does not compute

No leak rate. No cause. No time to build, and no bleed-down and rebuild behaviour.

It will not tell you whether the pressure on your gauge is thermal or a communication path, whether it is growing, or what to do about it. It answers one question, which is how much surface pressure the bounding elements of this annulus will carry, and it answers that from the elements you chose to give it.

## Exercise

On paper, write the five fields above and next to each one write the decision it supports.

Then write the two fields you would need in addition before you could call an annulus pressure acceptable, and say which engine or which procedure supplies them.
