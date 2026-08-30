# The differential, and its sign

One subtraction, two checks, and never both at the same depth.

{{panel:ct-loadcase-explorer}}

## The two

    burst differential   = inside minus outside
    collapse differential = outside minus inside

They are the same subtraction with opposite signs, so at any depth at most one of them is positive.

The engine tests each for positivity and skips the check when it is not. A depth where the inside pressure exceeds the outside contributes to the burst answer and contributes nothing at all to the collapse answer, and the reverse.

## What a null means

When no depth in a section has a positive burst differential, the section's burst safety factor comes back as infinity and its governing depth as null.

That is a real and useful answer: this load case does not load this section in burst. It is not a missing number.

Four of the seven published cases report a null burst on both sections, and two report a null collapse on both. Only the custom gradient case produces both on the same section, and even then at different depths.

## Why a case is named after one of them

A case called fullEvacuationCollapse is not forbidden from producing a burst differential. It is named after the check it exists to load. The engine computes all four checks on every case regardless, because the naming is a description of intent and not a filter.

That matters once, memorably, in module 5.

## Reading a case by its slope

The interesting thing about a differential is usually not its value at one depth but how it CHANGES with depth, and that is set by the difference of the two gradients.

    d(differential)/dz = (inside gradient) - (outside gradient)

If the inside column is denser than the outside one, the burst differential grows downward. If it is lighter, the burst differential shrinks downward and the worst point is at the top.

Every governing-depth result in the next module is that one line.

## The gradients in play

| column | gradient (Pa per metre) |
|---|---|
| gas at 2300 Pa/m | 2300 |
| seawater at 1030 kg/m3 | 10100.8495 |
| mud at 1440 kg/m3 | 14121.576 |
| cement at 1900 kg/m3 | 18632.635 |

A gas column is nearly flat. That single fact drives the whole of the next module.

## Exercise

Using the gradient table, predict the sign of the slope of the burst differential for a gas column inside against a seawater column outside.

Then predict it for a mud column inside against a seawater column outside. Check both in the panel.
