# Annulus versus tubing

Two columns in one hole, solved by two different models, and only one is built into the engine.

{{panel:pd-vlp-explorer}}

## Two columns, two models

The annulus carries dry injection gas, single phase, and Cullender and Smith marches it down from the surface pressure. The engine owns that model.

The tubing carries a produced mixture whose phases travel at different speeds and whose flow changes character as it climbs. That arrives as an injected function, because choosing a multiphase correlation is a judgement the engine will not make for you.

BONNY-7's annulus runs 640 psia to 735.995592 psia over 6700 ft, average compressibility 0.93241456 against 0.91517071 at the wellhead. Its tubing takes a wellhead pressure of 420 psia, a gravity constant of 2150 psi, a lightening constant of 375 stb/d and a friction constant of 0.00064 psi per stb/d squared.

## The difference that matters

The tubing column changes shape with rate. The gas column does not.

BONNY-7's tubing requires 2545.501142 psia at 4.32 stb/d, 1617.153368 psia at 964.35 stb/d and 12560.087474 psia at 4324.44 stb/d. Across those three rates the gravity term goes 2125.489174, 601.970606, 171.562832 psi and friction goes 0.011969, 595.182762, 11968.524642 psi, so the gravity share falls from 0.99999437 to 0.50283499 to 0.01413193.

The column lightens as rate rises. Nothing in Cullender and Smith does that: the gas is already gas. The golden gas outflow curve is monotone from 952.986300 psia at 13.289296 Mscf/d to 1842.190804 psia at 13289.2963 Mscf/d.

FORCADOS-3 shows the other ordering: 4293.189726 psia at 4.14 stb/d against 3310.421637 psia at 4135.95 stb/d, its loaded end the higher. Which end stands higher depends on the well.

## The unit trap

**The marching column takes gas rate in MMscf/d. The closed form second opinion takes it in Mscf/d.** Same file, otherwise identical arguments, a thousandfold apart.

Get it wrong and the friction group is a million times off, and the column returns a converged, confident, wrong number in silence. FORCADOS-3's annulus carries 10.5 MMscf/d for a friction group of 0.02721909 and the golden vertical case 4 MMscf/d for 0.00182455. A friction group far from those magnitudes is a unit error, not a well.

The two columns in one well are also driven by two different rates: injection gas in MMscf/d, production in stb/d, both called the rate.

## The geometry split

Weight takes true vertical depth, friction takes measured depth. FORCADOS-3's annulus is 11200 ft measured against 9750 ft true vertical, and the golden flowingDeviated column 12000 ft against 10400 ft at a friction group of 0.00142657, reading 1399.082259 psia.

Swap them and the column comes back too heavy or the friction too small, silently. The defining integral check will not catch it: the target is built from measured depth and agrees with itself either way.

## What each refuses

The annulus column will not notice that the annulus is not dry. The tubing column cannot be audited at all: no defining integral, no published target, no convergence study.

## Exercise

Record BONNY-7's required bottomhole pressure at its lowest and highest sampled rates, then its annulus column bottomhole pressure. Say which of the three does not move with rate, in terms of what the column is made of.
