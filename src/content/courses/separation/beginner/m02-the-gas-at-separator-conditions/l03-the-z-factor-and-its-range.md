# The z factor, and its range

The Dranchuk and Abou-Kassem correlation returns z 0.908065 for the ABANA gas at 614.700000 psia and 95.000000 degF, and refuses outright at conditions where the fit it was built from has nothing to say.

{{panel:fc-separator-explorer}}

## What z does in the chain

z is the correction that turns the ideal gas law into a usable one. A z of 0.908065 says this gas occupies a little over nine tenths of the volume an ideal gas would at the same pressure and temperature, so it is that much denser. Density is proportional to one over z, so every part in a hundred of error in z is a part in a hundred of error in the gas density, in the settling velocity and in the area the gas needs. A z read at the wrong conditions is an error that survives every remaining step to the drum.

| stream | Ppr | Tpr | z |
| --- | --- | --- | --- |
| ABANA-1 | 0.922896 | 1.488478 | 0.908065 |
| ABANA-2 | 0.922896 | 1.488478 | 0.908065 |
| AGBAMI | 0.549797 | 1.508700 | 0.947166 |

AGBAMI sits closer to 1 because it sits at a lower reduced pressure. Take any gas toward zero pressure and z runs to 1, which is the ideal gas limit.

## The range it is honest in

The module enforces Tpr from 1.0 to 3.0 and Ppr up to 30. Outside that pair the correlation is being asked to extrapolate beyond the data it was fitted to, and the engine refuses rather than returning a number.

| case | the refusal |
| --- | --- |
| 1000.000000 psia at -150.000000 degF | "Tpr 0.848 is below the DAK validity range of 1.0 to 3.0: the z-factor would be an extrapolation below the critical temperature, so it is refused" |
| 500.000000 psia at 700.000000 degF | "Tpr 3.176 is above the DAK validity range of 1.0 to 3.0, so the z-factor is refused" |
| 25000.000000 psia at 150.000000 degF | "Ppr 37.306 is above the DAK validity limit of 30, so the z-factor is refused" |

The first message says more than the other two. Below Tpr 1.0 the gas is below its pseudo-critical temperature, where a single-phase gas correlation is describing a region that may not hold a single-phase gas at all.

## The end that is accepted with a note

Below Ppr 0.2 the fit data stop, and the engine takes a different line there. It returns the answer and attaches a note, because the surface runs to the ideal gas limit in that corner and an ordinary low-pressure separator sits in it. The published case at 100.000000 psia and 100.000000 degF has Ppr 0.149225 and returns z 0.986286 with the note "Ppr 0.149 is below the 0.2 where the DAK fit data start; the z-factor here runs toward the ideal-gas limit".

A refusal and a note are different instruments. A refusal says there is no answer. A note says here is the answer and here is the reason to read it carefully.

## The published cases, read together

| case | psia | degF | gravity | Ppr | Tpr | z |
| --- | --- | --- | --- | --- | --- | --- |
| sg065At1000psia100F | 1000.000000 | 100.000000 | 0.650000 | 1.492250 | 1.532881 | 0.871027 |
| sg065At100psia100FBelowFitPpr | 100.000000 | 100.000000 | 0.650000 | 0.149225 | 1.532881 | 0.986286 |
| sg070At2500psia150F | 2500.000000 | 150.000000 | 0.700000 | 3.768829 | 1.614635 | 0.828979 |
| sg080At500psia60F | 500.000000 | 60.000000 | 0.800000 | 0.769591 | 1.294515 | 0.873908 |

z is not monotonic in pressure in any simple way a reader can guess. It falls from 0.986286 to 0.871027 as Ppr climbs from 0.149225 to 1.492250, keeps falling to 0.828979 at Ppr 3.768829, and would turn and rise again further up. That shape is the reason a correlation exists at all.

## The mistake

Holding z at a constant. The retired app used 0.85 for every gas at every condition, and the four cases here return 0.871027, 0.986286, 0.828979 and 0.873908. The error runs from small to very large depending on where the stream sits, and it is largest exactly where a low-pressure stage sits.

## Exercise

State z for each of the three teaching streams and say why AGBAMI is the highest. Then give the three conditions the correlation refuses and the reason for each, and say how a refusal differs from the note returned at Ppr 0.149225.
