# What this engine models

The scope, stated at the start so that nothing later comes as a surprise.

## What it computes

A Karakas-Tariq perforation skin from four lengths, a phasing angle and two permeability ratios, returned as four components and their total.

A steady-state radial productivity ratio from that skin and a drainage radius.

A guideline underbalance band by permeability class, returned as a range with its provenance and never as a point value.

A sieve analysis: six D-values, a uniformity coefficient, a sorting coefficient and a fines percentage.

A Saucier gravel band, a gravel-pack screen gauge, a standalone slot window and an ordered completion-type indication.

A critical flowing pressure from a Kirsch hoop stress, swept along a perforated interval against a stress and strength profile.

## What it does not compute

It does not compute a rate. There is no reservoir model in it, no pressure transient and no time. The productivity ratio is a ratio against an ideal, not a flow.

It does not compute the charge. Penetration and entrance hole are catalog inputs, taken from published-typical data and flagged approximate. Nothing here predicts what a shaped charge will do.

It does not compute gun running, gun clearance, detonation, misfires or debris.

It does not compute how much sand a failing rock will produce, or over what period, or whether the well can live with it. The sanding output is an onset criterion.

It does not compute the pressure drop through a gravel pack, the retained permeability of a screen, or plugging.

## What it will refuse

A perforation length, radius, shot density or wellbore radius that is not positive. A permeability ratio that is not positive. A phasing angle that is not one of the six the published tables carry. A crushed zone smaller than the tunnel it surrounds. A damage ratio below one. A sieve with fewer than four points, a negative size, a percentage outside nought to a hundred, or a curve whose sizes do not fall as the retained fraction rises. A far-field stress pair the wrong way round. And an interval whose bottom is above its top.

## What it flags rather than refusing

Two dimensionless groups have a stated range over which the skin correlation was developed. Outside them the engine still returns the number, and attaches a warning naming the group and the value. The Professional tier spends a module on why that is the right behaviour and on which catalog gun triggers it.

## Exercise

List the six things the engine computes and the five families of thing it does not.

For each of the five, name the input that would have to arrive first.

Then explain the difference between an input the engine refuses and a result it flags, and say why the flag is not simply a softer refusal.
