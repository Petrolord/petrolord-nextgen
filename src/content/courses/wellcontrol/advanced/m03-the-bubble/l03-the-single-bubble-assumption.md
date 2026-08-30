# The single-bubble assumption

One column, and what a real influx does instead.

## The assumption

The influx is a single continuous column occupying the full annulus cross section, with mud above it and mud below it.

Every expression in this module rests on it.

## What a real influx is

**Dispersed.** Gas enters through a permeable interval that may be metres thick, and it enters as bubbles that rise at different rates.

**Mixed with mud.** The leading edge is a gas-cut mud rather than a clean interface, and the transition can be tens of metres.

**Not axisymmetric.** In an inclined hole the gas rises along the high side, because it is buoyant, and the mud on the low side is barely disturbed.

**Partly dissolved,** in an oil-based mud. Gas dissolves in the base oil at depth and comes out of solution as the pressure falls on the way up, which can happen suddenly and high in the hole.

## Which of the four matters most

The last one, on any well drilled with oil-based mud.

A dissolved gas influx gives almost no pit gain at shut-in and almost no casing pressure, so it looks like a small kick. Then, at some depth on the way up, the gas breaks out of solution and the influx appears all at once, high in the annulus, where the mud above it is short.

That is a specific and well documented hazard and there is nothing about it in this model.

## Which way the single-bubble assumption errs

**Conservative** for a dispersed influx, because a dispersed influx has a smaller density contrast over a longer interval and produces less pressure change at the shoe than a clean column of the same volume.

**Not conservative** for an inclined hole, where the gas concentrates on the high side and the effective column is denser and taller than the axisymmetric assumption gives.

**Badly wrong** for dissolved gas in oil-based mud, in a direction that depends entirely on where the breakout happens.

## What the model gains from it

Tractability. A single column with two densities and a height is four numbers, and the whole calculation is algebra.

The alternative is a transient multiphase flow model, which exists, is expensive, and is used on wells where the margin justifies it.

## The honest statement

The kick tolerance in this course is a single-bubble estimate on a well with a clean water-based mud in an annulus treated as axisymmetric.

That is the industry-standard calculation, it is what a well design uses, and its limitations are known and named rather than hidden.

## Exercise

For each of the four departures from the assumption, say whether it makes the real kick tolerance larger or smaller than the computed one.

Then say which of the four you would want a specialist model for, and on what kind of well.
