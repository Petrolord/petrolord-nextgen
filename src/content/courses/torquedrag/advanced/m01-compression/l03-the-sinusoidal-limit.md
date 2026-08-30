# The sinusoidal limit

The first threshold, its ingredients, and what each one does.

{{panel:td-buckling-explorer}}

## The expression

    F_sinusoidal = 2 sqrt( EI w sin(theta) / r )

with EI the bending stiffness, w the buoyed weight per unit length, theta the inclination and r the radial clearance between the pipe and the hole.

## The four ingredients

**EI, bending stiffness.** A stiffer pipe resists buckling. For the drill pipe in this course EI is 1228241.4795052463 N.m2; for the drill collars it is 8663140.522854859 N.m2, seven times more.

**w, the buoyed weight per metre.** A heavier pipe presses harder against the low side and is harder to lift into a wave. Drill pipe here is 265.26806749988424 N/m and drill collars are 1288.2065631957541 N/m.

**sin(theta), the inclination.** This is what makes the low side a low side. At zero it is zero and the limit vanishes.

**r, the radial clearance.** A tighter hole gives the pipe less room to deflect into, so the limit is HIGHER. It appears in the denominator, so halving the clearance raises the limit by root two.

## The values

Drill pipe in the 0.2159 m open hole, clearance 0.04445 m:

| inclination | sinusoidal limit |
|---|---|
| 0 degrees | 0 N |
| 5 degrees | 50550.61969889707 N |
| 15 degrees | 87111.721247849 N |
| 30 degrees | 121077.5102803284 N |
| 45 degrees | 143986.2366921816 N |
| 60 degrees | 159346.96483292847 N |
| 75 degrees | 168286.92265158307 N |

Read the shape. Most of the limit is present by 30 degrees, and the next 45 degrees adds under 40 percent more. That is the square root of the sine: it rises steeply from zero and flattens, and the value at 90 degrees is barely above the value at 75.

## The consequence

A near-vertical hole is where buckling is easiest, and a horizontal hole is where it is hardest.

That is the opposite of most people's intuition, which associates horizontal wells with buckling problems. Horizontal wells DO have buckling problems, and the reason is that they generate far more compression, not that their limits are lower.

## The clearance term in practice

Drill pipe in cased hole has a clearance of 0.0467487 m against 0.04445 m in open hole, so the cased limit is slightly LOWER: at 75 degrees it is 164097.31772963493 N against 168286.92265158307 N in open hole.

A larger hole is easier to buckle in. That is why washouts are a buckling concern and why running a small string in a big hole is worse than it looks.

## Exercise

Compute the sinusoidal limit for the drill collars at 90 degrees in the 0.2159 m hole, using their EI of 8663140.522854859 N.m2 and buoyed weight of 1288.2065631957541 N/m.

Compare against the drill pipe's value at the same inclination and say what that ratio means for where compression should be carried.
