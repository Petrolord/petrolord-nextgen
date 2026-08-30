# Warnings, and what they mean

Three messages the engine emits, and what to do about each.

{{panel:td-string-explorer}}

## "Compression exceeds the sinusoidal buckling limit"

The message names the shallowest buckled depth, which is the TOP of the buckled interval.

It means the model computed a compression larger than the pipe can carry straight at that inclination and clearance. From that depth down, the pipe would be lying in a sine wave against the low side of the hole.

**What to do.** Check how far below the limit it is. A pipe just past the sinusoidal limit is still passing load along; a pipe past the helical limit is heading for lock-up and the model's friction is now an underestimate. The Expert tier's module 1 is where that distinction is made properly.

## "Tension or torsion utilization exceeds 80% of pipe capacity"

The pipe is within 20 percent of a rating somewhere along its length.

**What to do.** Find out WHICH one. Tension and torsion have different consequences and different remedies, and on a deviated well it is usually torsion, which is not what most people check first. The panel's utilization view separates them.

Eighty percent is a convention, not a physical threshold. It exists because the model does not do combined loading and because the real loads are dynamic and higher than the computed ones.

## "Hole geometry does not cover the full string"

The string extends into a depth range the geometry list does not describe, and the engine used a friction factor of zero there.

**What to do.** Fix the input. A zero friction factor is not conservative, it is silently optimistic, and the run is meaningless in that interval. This warning is a setup error rather than a result.

## The warning that is not a warning

The vertical well rotating on bottom reports buckling from 1940 m. That is technically correct, and it is describing drill collars doing exactly what drill collars are for.

The check is applied per component with that component's own stiffness and clearance, and a collar's sinusoidal limit in a vertical hole is zero, because the limit expression has sin(inclination) in it.

So in ANY vertical hole, any compression at all trips the buckling flag. That is a real property of the formula rather than a bug, and it is why the warning has to be read alongside the numbers rather than acted on by itself.

## The general rule

A warning is a pointer to a number. Read the number.

An engine that refuses to run when it sees compression would be useless; one that runs silently would be dangerous. Emitting a flag and the depth it applies to is the right behaviour, and it puts the interpretation where it belongs.

## Exercise

Run all five wells on all six operations in the panel and list every case that produces a warning.

Then classify each one as "the model has left its domain", "the pipe is genuinely near a limit", or "correct and not actionable", and be prepared to defend the third category.
