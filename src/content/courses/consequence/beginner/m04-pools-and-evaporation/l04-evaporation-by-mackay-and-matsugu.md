# Evaporation by Mackay and Matsugu

{{panel:cq-release}}

A pool of volatile liquid below its boiling point does not boil. It evaporates from its surface, driven by its vapour pressure and carried away by the wind. The rate at which vapour leaves the pool is the source term for any plume that follows. The engine computes it with the Mackay and Matsugu correlation, as the Yellow Book gives it, and this lesson reads that correlation and the edges the engine draws around it.

## The model, in the engine's words

The basis reads, verbatim: "Mackay and Matsugu: km = 0.004786 u10^0.78 (2r)^-0.11 Sc^-0.67; q = km Pv mu / (R T) x A".

km is the mass transfer coefficient in m/s. It grows with the wind at 10 m, u10, and falls slowly with the pool diameter 2r. Sc is the Schmidt number, which defaults to 0.8, the Yellow Book's value for gases and vapours in general. The evaporation flux per square metre is km times the vapour concentration at the surface, Pv mu over R T, where mu is the molar mass in kg/mol. The rate is that evaporation flux times the pool area A.

## A hexane-like pool

A stated teaching input: a pool of 10 m diameter, wind at 10 m of 3 m/s, vapour pressure 16000 Pa, molar mass 0.08618 kg/mol, liquid at 293.15 K:

| quantity | engine key | value |
| --- | --- | --- |
| mass transfer coefficient m/s | `massTransferCoefficientMS` | 0.010163820387 |
| evaporation flux kg/(m2 s) | `evaporationFluxKgM2S` | 0.005749887804 |
| pool area m2 | `poolAreaM2` | 78.539816 |
| evaporation rate kg/s | `evaporationRateKgS` | 0.451595 |

Sweeping the wind, and then the pool diameter, with everything else held:

| wind m/s, stated | evaporation rate kg/s |
| --- | --- |
| 1 | 0.191688 |
| 3 | 0.451595 |
| 8 | 0.970521 |

| pool diameter m, stated | evaporation flux kg/(m2 s) | evaporation rate kg/s |
| --- | --- | --- |
| 2 | 0.006863506842 | 0.021562 |
| 10 | 0.005749887804 | 0.451595 |
| 40 | 0.004936654932 | 6.203584 |

The rate grows with the wind to the power 0.78. The evaporation flux per square metre falls slowly as the pool grows, since the diameter enters to the power minus 0.11, while the rate still grows with the area.

## Two refusals draw the edge

> windSpeed10mMS: must be above 0 m/s: the correlation gives zero evaporation in calm air, which is its form and not physics

A real pool in still air still evaporates. The correlation cannot say how fast, so the engine refuses.

> vapourPressurePa: is at or above ambient: the pool is boiling, and this non-boiling evaporation model does not apply

A pool at or above its boiling point is driven by heat from the ground and the air, and this correlation does not describe it.

## A single route correlation

Mackay and Matsugu is a single route quantity in this course. It has no second derivation and no published worked number behind it in the engine's validation record: the only check is the transcription from the Yellow Book. A mistake copied faithfully into both the engine and its oracle would pass that check unseen. So the correlation is taught, and it is never graded. A capstone that needs a vapour source works from quantities that a second route or a published number stands behind.

## Exercise

The pool view feeds the evaporation from the pool it computes. Set the bund floor area to 78.539816 m2, the area of the 10 m pool, keep the other defaults, and confirm the evaporation rate against the first table. Raise the wind from 3 to 8 m/s and read the new rate against the table. Then set the vapour pressure to 101325 Pa and read the refusal. Write one sentence on why the engine refuses there, and one on why an evaporation rate from this correlation should be reported with its source named.
