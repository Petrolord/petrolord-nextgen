# Two dimensions is a fiction

A real fracture has three dimensions. Both of the models in this tier survive by refusing to solve one of them.

## What the rock actually does

Pump fluid into a plane of weakness and the opening spreads in every direction the stress field allows. It runs outward, it climbs and it drops, and the width at any point depends on how far that point sits from every edge. The pressure inside is not uniform either, because fluid has to flow from the wellbore to the tip and viscous flow costs pressure.

Solving that properly means coupling an elastic surface of unknown shape to a fluid flow problem on the same surface, each depending on the other. There is no closed form for it. There is a mesh, a solver and a run time.

A two dimensional model buys the closed form by declaring one of the three dimensions known in advance. Height is the dimension both of them declare.

## The two different fictions

PKN and KGD do not make the same simplification. They make opposite ones, and both are called two dimensional.

PKN assumes the fracture is long and contained, so each vertical cross section behaves as an isolated slice of rock in plane strain. Width at a station along the length depends on the local fluid pressure and on the height. The length scale that sets the compliance is the height.

KGD assumes the fracture is short, so every horizontal plane through it behaves as an isolated Griffith crack in plane strain. Width now depends on the length, and the height is only a place to put the fluid. The compliance length scale is the half-length.

Neither assumption is the truth. Each one is a bet about which dimension is small enough to be treated as uniform.

## The evidence is in the disagreement

Give both models the same rock, fluid, rate and height and they still disagree, because the geometry they assume is different. In the digest sweep the KGD average width is 1.8723566993895047 times the PKN average width at a half-length of 40 m, and 3.0985171538556986 times it at 300 m.

That growing gap is the missing third dimension making itself felt. As the fracture lengthens relative to its height, one fiction gets more defensible and the other gets less, and the answers pull apart.

The shape factors are the last visible trace of the geometry that was assumed away. PKN averages the width with pi over five, KGD with pi over four, and each is the integral of a profile the model never computes.

## Exercise

Write down, in one sentence each, which dimension PKN treats as uniform and which one KGD treats as uniform.

Then say, for a fracture whose height and half-length are similar, why neither assumption is safe.
