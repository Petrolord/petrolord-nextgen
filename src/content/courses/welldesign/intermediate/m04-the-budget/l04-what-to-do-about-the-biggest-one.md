# What to do about the biggest one

Four mitigations, and which of them addresses what.

## The situation

The budget says one source is more than half the total variance, and it is axial magnetic interference. What can actually be done?

## Non-magnetic spacing

The interference is the drill string's own magnetism reaching the magnetometers. Put more non-magnetic collar between the tool and the steel and it falls.

The required length is a design calculation, done for each hole section, depending on the expected inclination and azimuth relative to the field. It costs money in collars and it costs bottom hole assembly length.

This is the direct fix and it is a drilling engineering decision, not a survey one.

## Multi-station analysis

Instead of correcting each survey independently, take a whole run of surveys and solve for the interference terms that best explain them collectively.

It works because the interference has a specific signature: it varies with attitude in a known way, so a run that covers a range of attitudes contains enough information to separate the interference from the true azimuth.

The result is a corrected survey and a smaller parameter set. It costs nothing but the analysis, and it is now routine.

## In-field referencing

Put a magnetometer at surface near the rig and record the field continuously.

That removes two things: the error in the field model, and the daily variation the model cannot capture. It reduces the declination and field-strength sources, which on the validation well are the second and third largest.

It costs a piece of equipment and a survey to place it.

## Gyroscopic surveying

Change the measurement entirely. A gyro does not use the magnetic field, so every magnetic source disappears.

It costs a separate run, or a more expensive tool, and it brings its own error sources: drift, and a north-seeking accuracy that degrades at high latitude.

For a critical section, a gyro run is often the answer, and it is standard practice inside casing where magnetometers cannot work at all.

## Which to choose

Read the budget at the depth where the uncertainty matters.

If axial interference dominates: collars and multi-station analysis.

If declination and field reference dominate: in-field referencing.

If the well is vertical and shallow and the neighbours are close: none of the above, because the surface position uncertainty, which this model does not include, is the biggest term.

## What does not help

**A better MWD tool.** The sensor biases are not the dominant terms in this geometry.

**More survey stations.** The dominant terms are systematic and do not average down.

**A tighter confidence factor.** That changes the reported number, not the uncertainty.

Each of those is a real decision somebody has made in the belief it would help.

## The honest report

A mitigation recommendation should say: at this depth, this source is this share of the total; this mitigation reduces its magnitude by roughly this much; the resulting total would be that.

That is a two-run calculation with the panel: read the budget, change the parameter set, read it again. It is far more useful than a recommendation without a number.

## The misconception to avoid

"Position uncertainty is what it is." Most of it, in most wells, is a handful of sources with named mitigations and known costs. Treating the ellipse as a fixed property of the well rather than as an outcome of choices about collars, references and survey procedure is giving up a decision that is actually available.

## Exercise

You are planning a horizontal well whose anti-collision problem is at total depth, with a budget like the validation well's.

Rank the four mitigations above by expected benefit for that specific problem, and say for each one roughly what it costs and what it would not fix.
