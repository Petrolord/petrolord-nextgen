# Fracture is a tension failure

The other end of the window, and a narrower question than it looks.

{{panel:gm-stability-explorer}}

## The picture

Too much mud in the hole. The radial stress is large, and because the differential pressure enters the hoop stress with a minus sign, the hoop stress at its DIP has been pushed all the way down through zero.

Rock in tension fails at a very small stress. The wall splits along the direction where the hoop stress is least.

## The criterion

    least wall stress >= -T0

with T0 the tensile strength, 1000000 Pa in the published runs.

The engine finds the LARGEST well pressure at which that still holds, by bisection on a function that IS monotone, so this half needs no scan.

## Which stress is watched

The smallest of the hoop and axial pair, after the shear term has been folded in. Not the radial stress.

That is a deliberate choice and the engine's comment says why: the radial effective stress going negative below balance is the well being underbalanced, which is a well control condition rather than hydraulic fracturing of the wall.

## What this is not

**It is not a leak-off test prediction.** A leak-off test measures the pressure at which the formation starts to take fluid, which involves an existing flaw and the far-field minimum stress, not the intact hoop stress at the wall.

**It is not a fracture propagation pressure.** Once a fracture has initiated, extending it into the far field is governed by the minimum horizontal stress, and that is the stimulation course. Initiation pressure is generally HIGHER than propagation pressure.

**It is not a lost circulation prediction.** Losses usually happen into natural fractures at pressures well below the intact rock's initiation pressure.

## What it is

The upper bound on mud weight from the point of view of the intact wall of the hole. It is the right number for the question "will the wall split", and it is an over-estimate for the question "will I lose returns".

## Why that matters practically

Because a mud window whose upper bound is fracture initiation is optimistic wherever natural fractures exist, which is most places.

A conservative upper bound in practice is the minimum horizontal stress rather than the initiation pressure, and it is usually a good deal lower.

## The tensile strength

A small number and often taken as zero. Rock is weak in tension: a few megapascals at most, and a rock with any pre-existing microcracks is effectively zero.

Setting it to zero is the conservative choice, and it lowers the fracture initiation pressure by exactly T0.

## Exercise

For a vertical hole at 2500 m, write the least hoop stress as a function of differential pressure and solve for the pressure at which it reaches minus the tensile strength.

Then compare it against the minimum horizontal stress at that depth, and say which of the two you would put in a drilling programme as the upper bound.
