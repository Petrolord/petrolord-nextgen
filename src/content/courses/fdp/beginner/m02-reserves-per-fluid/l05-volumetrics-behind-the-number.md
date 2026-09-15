# Volumetrics behind the number

A reserves row is a recoverable volume, and behind it sits an in place volume and a fraction somebody believes will come out. The studio will compute both from the rock properties if you give them to it.

{{panel:ec-plan-explorer}}

## The inputs and the answer

| property | value |
| --- | --- |
| area | 2400.0000 acres |
| net pay | 140.0000 ft |
| porosity | 0.260000 |
| water saturation | 0.220000 |
| formation volume factor | 1.310000 |

On an Egina Main zone with those properties the engine returns an OOIP of 403539180.4580 STB, which is 403.5392 MMstb. Area times net pay gives a rock volume, porosity takes the pore space out of it, one minus the water saturation of 0.220000 leaves the oil filled fraction, and the formation volume factor of 1.310000 shrinks reservoir barrels to stock tank barrels at surface.

## Every input is somebody's work

None of those five numbers is measured by the studio. The 2400.0000 acres came off a mapped closure, the 140.0000 ft of net pay off a log interpretation with a cutoff in it, the porosity of 0.260000 and the water saturation of 0.220000 out of petrophysics, and the 1.310000 out of a fluid study. Change the net pay by a tenth and the in place volume moves by a tenth. The four decimal places on 403539180.4580 STB describe the arithmetic and say nothing about the mapping.

## The recovery factor falls out

The plan's oil P50 is 130.0000 MMbbl. Set that against the 403.5392 MMstb in place and the implied recovery factor is 0.322150. The reserves table states its own recovery factors alongside the rows, 0.340000 for Egina Main and 0.280000 for Egina Deep, so 0.322150 sits between them.

Read what the 0.322150 is measured against before using it. The 130.0000 MMbbl is the oil total for two reservoirs, and the 403.5392 MMstb is the in place volume of one zone. A ratio built from two different footprints is a screening cross check and not a reservoir engineering result.

## How many wells that implies

At 12 MMbbl a well the engine returns 11 wells for the 130.0000 MMbbl. The EGINA plan carries 4 wells. Both figures are real answers to different questions: 11 is what the recoverable volume would need at an assumed drainage per well, and 4 is what the well list actually holds. A gap that size is either a drainage assumption that does not hold on this field or a well count that has not caught up with the reserves, and the studio will not resolve it for you.

## The mistake

The mistake is to run the volumetric calculation and then treat its output as a reserves estimate. An OOIP is oil in place. It becomes reserves only after a recovery factor, and the recovery factor carries the development concept, the drive mechanism, the well count and the years of production inside it. Quoting 403.5392 MMstb as a field size to somebody who hears reserves is the most expensive rounding error available in this studio, and no arithmetic in the plan will catch it.

## Exercise

List the five rock and fluid properties the volumetric calculation uses and give the OOIP in MMstb. Then compute what recovery factor the oil P50 of 130.0000 MMbbl implies against that OOIP, and say why that figure should be read beside the recovery factors in the reserves table rather than instead of them.
