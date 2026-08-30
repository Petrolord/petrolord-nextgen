# The story so far

Five modules, three losses, and one exponent each.

## The claim

A pump pressure is three losses in series, each with its own dependence on flow rate, and only one of the three reaches the formation.

## What each module established

**Module 1.** Four jobs pull against each other, and the fourth, not breaking the formation, opposes the other three. Two wells crossed with two muds, one string and one bit. The flow path is elements in series with the same flow rate everywhere, and the narrowest element carries the highest velocity.

**Module 2.** A mud is four dial readings converted to four points on a stress-against-rate curve. The power law and the Bingham plastic each use two of them and reproduce those two exactly; the power law has no yield stress and understates the low-rate behaviour by a factor of five, and Bingham extrapolates a yield that is twice the measured one. Herschel-Bulkley uses three readings, misses all four by a little, and is what the engine uses. The three models agree to four figures where they were fitted and differ by a factor of ten in the annulus.

**Module 3.** Pressure loss per element is a friction factor form, with the friction factor from a generalised Reynolds number built on a LOCAL power law. 16 over Re in a pipe and 24 over Re in an annulus for laminar flow, a Bourgoyne correlation for turbulent, and a linear blend over 800 Reynolds numbers between them because a discontinuity would be unphysical and would break every solver in the course. Two thirds of this system's pump pressure is spent inside the string, mostly in a 0.05715 m collar bore.

**Module 4.** The bit is the only inertial loss and the only exact square law. Its share rises with flow rate while everything else's falls, and the nozzle area is the one lever that changes the split without changing the rate. On this string the bit takes about a fifth of the pump pressure and reaching a classical optimum would need a pump nobody has.

**Module 5.** Three losses add. The three exponents against flow rate are 0.7464092669494129 for the annulus, 1.7229931970141557 for the pipe and 2.0000000000000004 for the bit, and those three numbers explain every share in the course. The hydrostatic columns cancel, which is why a pump pressure is small compared with a hydrostatic head.

## The numbers to carry

- The dial-to-stress conversion: 0.51040356094 Pa per degree. The rpm-to-rate conversion: 1.70233 per second per rpm.
- The bit discharge coefficient: 0.95.
- The three exponents: annulus 0.746, pipe 1.723, bit exactly 2.
- Herschel-Bulkley for kcl_polymer: yield 2.5520178046999997 Pa against a Bingham yield point of 6.124842731279998 Pa.

## The one sentence

Pump pressure is a system property and the equivalent circulating density is a formation property, and the next tier is about the second one.
