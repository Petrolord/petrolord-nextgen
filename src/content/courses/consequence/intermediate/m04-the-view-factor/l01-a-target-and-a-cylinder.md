# A target and a cylinder

{{panel:cq-fire}}

The view factor is the second of the three factors in the heat flux. It is a pure number between zero and one: the fraction of a small target's field of view that the flame fills, weighted by the angle at which the heat radiation arrives. This lesson sets up the geometry the engine uses.

## The flame as a cylinder

The solid flame model draws the flame as a cylinder. Its base is the pool, a circle of radius R = D/2, and its axis runs up from the centre of the pool for the flame length L. In wind it tilts downwind by the angle from module three. The engine does not stretch the base in the wind; the base stays a circle of radius D/2, as the Yellow Book's own worked step draws it.

## The target

The target is small and sits at ground level. Its distance X is measured from the axis of the flame base, that is from the centre of the pool, along the ground. A person standing at the edge of a bund is therefore at X equal to R, and a person some way beyond the edge is at R plus that further distance. Mixing up the distance from the centre with the distance from the flame edge is an easy error in a pool fire note, and it moves every number downstream.

## Two ratios carry the geometry

The engine reduces the geometry to two dimensionless ratios: a = L / R, the flame length over the flame radius, and b = X / R, the distance from the axis over the flame radius. With the tilt, those two ratios fix every view factor in this module. Two fires of different sizes with the same a, b and tilt give the same view factor.

## The two model strings

At zero tilt the engine names its model as "vertical cylinder view factor (Raj), target at ground level, vertical and horizontal planes; Fmax their vector sum". With a tilt it names "tilted cylinder view factor (Mudan), target at ground level; Fmax the vector sum of Fv and Fh".

## A target inside the flame base

A target at or inside the base circle would be standing in the fire. The engine refuses it, naming `distanceFromAxisM`:

> distanceFromAxisM: the target is at or inside the flame base: a view factor model needs the target outside the flame

## Exercise

In the fire panel's view factor view, enter the stated flame of radius 10 m and length 30 m at zero tilt. Place the target at 15 m from the axis and read the view factors. Then move the target to 10 m and to 5 m and copy what the panel returns for each, with the field it names. Finally, write down a and b for the 15 m target as ratios of the stated inputs.
