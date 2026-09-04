# The Nolte exponent

One number sets both how long the pad runs and how fast the concentration climbs, and it is the same number.

{{panel:st-pack-explorer}}

## The exponent

Nolte's schedule is written around a single exponent, which the engine calls eps:

    eps = (1 - eta) / (1 + eta)

with eta the fluid efficiency from the material balance. On this case eta is 0.1728566723633056 and eps is 0.7052381992848291.

That same eps is the pad fraction, and it is also the power to which dimensionless time is raised in the concentration ramp. Two different jobs, one number.

## Why one number does both

Think about where a given parcel of slurry ends up. Slurry pumped early travels furthest and spends the longest in the fracture, so it loses the most fluid to leakoff and its concentration rises the most on the way. Slurry pumped late travels a short distance and loses little.

If you pumped a constant concentration, the parcels that left early would arrive at the tip far richer than the parcels that arrived late, and the pack would be graded from thick at the tip to thin at the well.

Nolte's condition is that every parcel should reach the same concentration at the end of the job. Working that condition through the same leakoff behaviour that produced the efficiency gives a power law in dimensionless time, and the power is eps. The pad fraction falls out of the same algebra, because the pad is the volume that must be gone by the time the first slurry parcel needs its width.

## Not the same as the Nolte factor

The tier below used a different Nolte quantity, the leakoff factor that corrects the leakoff area for the fact that the fracture was not there for the whole pump time. That factor runs from 1.5589231771218184 at an efficiency of 0.05 to 1.3333333333333333 at an efficiency of 1.

The exponent here runs the other way and over a much wider span. It is 0 at perfect efficiency and it climbs towards 1 as efficiency falls.

| efficiency | exponent eps |
|---|---|
| 1 | 0 |
| 0.6326359683290029 | 0.22501282514741658 |
| 0.39582605426929196 | 0.4328432929610202 |
| 0.1728566723633056 | 0.7052381992848291 |
| 0.01460645625334061 | 0.9712076418135991 |

Two Nolte results, two roles. Keep the names apart.

## Exercise

Read eps off the panel at the published conditions and confirm it equals the pad fraction to every digit shown.

Then say what a job with an efficiency of 1 would look like: what is the pad, what is the shape of the ramp, and why does that answer make physical sense.
