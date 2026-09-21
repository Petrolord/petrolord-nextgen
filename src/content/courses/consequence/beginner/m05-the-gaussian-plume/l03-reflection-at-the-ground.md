# Reflection at the ground

{{panel:cq-release}}

A plume spreading downward eventually meets the ground. Gas does not pass into the soil, so whatever reaches the ground is turned back up into the air. The engine models this with total ground reflection, and it is the sixth declared choice: the ground reflects the plume.

## The image source

The expression carries two vertical terms in its bracket:

exp(-(z - h)^2 / 2 sz^2) + exp(-(z + h)^2 / 2 sz^2)

The first is the plume from the real release at height h. The second is the IMAGE SOURCE at minus h: a mirror copy of the release, as far below the ground as the real one is above it. The basis names it in its own words: "total ground reflection (image source at -h)". Every bit of gas the real plume would carry below the ground, the image returns above it.

## Doubling at the ground

Put the release and the receptor both at ground level and the receptor on the centreline. Then y, z and h are all zero, both exponentials are one, and the bracket is two. The expression becomes Q / (pi sy sz u). The reflection DOUBLES what an unbounded plume would give there.

So every ground level concentration in the UBIT table, 239.712839 mg/m3 at 500 m in class D among them, is twice what a plume in open air with no ground would give at that point. A plume model that left out the reflection would understate every ground level result by half.

## A check on the whole plume

The independent oracle integrates u times the concentration over every crosswind distance and every height above the ground, for eight plume cases, and recovers the release rate. The golden records that ratio, and it is one to within one part in a billion in every case. That is conservation of mass: everything released per second passes each downwind plane per second. A plume that dropped the reflection would return a half. This mass flux integral is a second route. It checks the reflected plume without ever writing the plume formula the same way twice.

## A published plume

The Purple Book works a plume: a release of 100 kg/s in a 5 m/s wind, with the release and the receptor both at 1 m, sigma_y of 28.8 m and sigma_z of 10.3 m, as printed. It prints 21.3 g/m3. The engine gives 21.260627 g/m3. The worked case gives its sigmas explicitly, which the engine accepts in place of a class. When neither a class nor the sigmas are given, it refuses:

> sigmaYM: a stability class or a sigma_y above 0 m is required

## Exercise

On the plume view, run UBIT at 500 m in class D with the release and the receptor both at 0 m, and read the concentration. Then write the expression for an unbounded plume by keeping only the first exponential, and say what concentration it would give at the same point, using the reading and the doubling above. Write one sentence on why a model without the reflection understates a ground level result.
