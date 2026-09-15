# Density from the gas law

The ABANA gas weighs 2.239712 lb/ft3 at 614.700000 psia and 95.000000 degF, and the AGBAMI gas 1.276898 lb/ft3 at 364.700000 psia and 110.000000 degF. Both come from the gas law with z in the denominator.

{{panel:fc-separator-explorer}}

## The four inputs

Gas density needs the absolute pressure, the absolute temperature, the gas gravity and z. Gravity sets the molecular weight, pressure and temperature set the volume an amount of gas occupies, and z corrects that volume for the fact that a real gas is not ideal.

| stream | psia | degF | gravity | z | gas lb/ft3 |
| --- | --- | --- | --- | --- | --- |
| ABANA-1 | 614.700000 | 95.000000 | 0.680000 | 0.908065 | 2.239712 |
| ABANA-2 | 614.700000 | 95.000000 | 0.680000 | 0.908065 | 2.239712 |
| AGBAMI | 364.700000 | 110.000000 | 0.700000 | 0.947166 | 1.276898 |

AGBAMI carries the heavier gas and still comes out lighter, because it sits at a little over half the pressure. Pressure dominates, and a gravity difference of 0.020000 does not come close to overcoming it.

## Why this number is the one that matters

Gas density enters the settling velocity as the difference between the liquid density and the gas density, under a square root. It is the only place the gas properties reach the vessel dimensions. Get 2.239712 lb/ft3 wrong and the settling velocity is wrong, so the area is wrong, so the diameter is wrong.

It is also the number that makes high pressure hard. A denser gas is closer to the liquid it is carrying, the difference under the square root shrinks, drops fall more slowly, and the vessel has to be larger for the same duty.

## The published cases

| case | psia | degF | gravity | z | density lb/ft3 |
| --- | --- | --- | --- | --- | --- |
| sg065At1000psia100F | 1000.000000 | 100.000000 | 0.650000 | 0.871027 | 3.598498 |
| sg065At100psia100FBelowFitPpr | 100.000000 | 100.000000 | 0.650000 | 0.986286 | 0.317797 |
| sg070At2500psia150F | 2500.000000 | 150.000000 | 0.700000 | 0.828979 | 9.344827 |
| sg080At500psia60F | 500.000000 | 60.000000 | 0.800000 | 0.873908 | 2.377049 |

The first two share a gas and a temperature and differ only in pressure, ten times in pressure giving 3.598498 against 0.317797 lb/ft3. The ratio is a little over eleven rather than ten, and the extra comes from z: the dense case is corrected by 0.871027 and the light one by 0.986286, so the correction itself makes the high-pressure gas relatively denser still.

## What it refuses

Each input is guarded by name. A missing absolute pressure gives "pPsia must be a finite, positive absolute pressure (got undefined)". A temperature that is not a number gives "tF must be a finite temperature in degF (got warm)". A missing gravity gives "gasSg must be a finite, positive gas gravity with air = 1 (got undefined)", and that message carries its own definition, because a gravity is a ratio against air and only means something once the reference is stated.

## The mistake

Leaving z out, or holding it at 1. At the ABANA conditions that would report a gas about a tenth lighter than it is, which makes drops appear to fall faster than they do and sizes a vessel smaller than the duty needs. The direction is the unforgiving one: the error flatters the design.

## Exercise

Name the four inputs to gas density and say what each contributes. Then explain why AGBAMI is lighter than ABANA despite the heavier gas, and why a tenfold pressure difference between two published cases gives densities of 0.317797 and 3.598498 lb/ft3 rather than an exact factor of ten.
