# Cullender and Smith

A marching solution of the defining pressure integral down the column, with the compressibility factor and the temperature updated as it goes.

{{panel:pd-vlp-explorer}}

## What it is

The defining relation for a gas column: the integral of a function of pressure, from the wellhead pressure down to the bottomhole pressure, equals 18.75 times the gas gravity times the measured depth.

The unknown is a limit of that integral, so there is no rearranging it. Cullender and Smith marches instead, solving each sub-interval for the pressure at its far end and carrying that pressure into the next.

The integrand is a ratio. Its numerator is the density group, pressure over absolute temperature times the compressibility factor. Its denominator sums that group squared and scaled by the elevation ratio, true vertical over measured depth, and the friction group, proportional to the friction factor times rate squared over the fifth power of the diameter.

| Case | Rate, MMscf/d | Tubing ID, in | Friction group |
| --- | --- | --- | --- |
| golden flowingDeviated | 6 | 2.992 | 0.00142657 |
| golden flowingVertical | 4 | 2.441 | 0.00182455 |
| golden prescribedFriction | 5 | 2.441 | 0.00288615 |
| golden flowingHighRate | 9 | 2.441 | 0.00907182 |
| FORCADOS-3 lift gas | 10.5 | 2.125 | 0.02721909 |

## Why it marches

The integrand depends on the compressibility factor, which depends on the pressure you are solving for, so the function is not known until the answer is.

Every station therefore carries its own temperature, from a straight line in measured depth between the stated wellhead and bottomhole values, and evaluates the compressibility factor at its own pressure. Nothing is averaged. Each interval closes by fixed point iteration to a thousandth of a psi, and each pair gets a Simpson refinement.

## The audit it comes with

A converged march reproduces its own defining relation, and the engine reports both:


| Case | Achieved integral | Target |
| --- | --- | --- |
| golden staticVertical | 97501.5914 | 97500.0000 |
| golden flowingVertical | 97499.0893 | 97500.0000 |
| golden flowingHighRate | 97507.9296 | 97500.0000 |
| golden prescribedFriction | 127498.3856 | 127500.0000 |
| golden flowingDeviated | 157499.8411 | 157500.0000 |
| BONNY-7 | 76633.1434 | 76631.2500 |
| FORCADOS-3 | 138618.9944 | 138600.0000 |

Targets scale by depth and gravity alone: three cases on 8000 ft at 0.65 gravity all target 97500.0000. The largest miss belongs to the largest friction group.

## What it refuses

It is a dry gas method with no way to detect condensate or standing liquid, it will not take a temperature profile that is not linear in measured depth, and it marches downward only.

## The mistake

Evaluating the density group once at an average condition and pulling it outside the integral. That is a different published method, not a cheap Cullender and Smith, and it lands close enough to survive review: 735.658610 psia against a marched 735.995592 on BONNY-7, 2626.370567 against 2608.360298 psia on FORCADOS-3.

## Exercise

Record the achieved defining integral and its target for the FORCADOS-3 and BONNY-7 columns.

State which misses by more, and name the input that explains it.
