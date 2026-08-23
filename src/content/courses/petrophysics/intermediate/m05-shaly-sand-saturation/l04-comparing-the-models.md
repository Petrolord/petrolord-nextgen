# Comparing the models

You now hold three saturation models: Archie, Simandoux and Indonesia. This lesson lines them up on the same rock, sample by sample and zone by zone, so their behaviour becomes something you can predict rather than something you look up.

## The three-way comparison on the typewell

Start with the two anchor samples from earlier lessons, then widen to the zones. All runs use neutron-density porosity, linear $V_{sh}$, and the standard parameter set $R_w = 0.05$, $a = 1$, $m = 2$, $n = 2$, $R_{sh} = 2.0$.

| Location | Archie | Simandoux | Indonesia |
|---|---|---|---|
| Clean point, 2020 m | 0.4324 | 0.4324 | 0.4324 |
| Shale point, 2000 m | 0.8769 | 0.5730 | 0.4672 |
| SAND_A mean (2010-2030 m) | 0.4478 | 0.4335 | 0.4280 |
| SAND_B mean (2050-2080 m) | 0.7692 | 0.7504 | 0.7455 |

Two of these numbers are graded: the capstone expects the SAND_A Simandoux mean of 0.4335 and the SAND_A Indonesia mean of 0.4280, each within a tolerance of 0.01.

## Reading the table

The clean point repeats the collapse result: at $V_{sh} = 0$ both shaly-sand equations are Archie, to every decimal you care to print. Any spread between models in a genuinely clean sand means an input error, not geology.

The shale point shows the models at maximum disagreement, more than 40 saturation points between Archie and Indonesia. The ordering is systematic and worth memorising: shaly-sand models always read at or below Archie, because every siemens of conductivity they assign to clay is a siemens Archie was blaming on water. And at high $V_{sh}$, Indonesia usually sits lowest of the three, because its shale term, with the $V_{sh}^{\,1-V_{sh}/2}$ exponent, grows fastest as shaliness climbs.

The zone means are the numbers that matter commercially, and they tell a calmer story. SAND_A is a clean sand with thin shaly streaks, so the models sit close together: Archie 0.4478, Simandoux 0.4335, Indonesia 0.4280. The full spread is under 0.02 saturation units. The correction is real but modest, exactly what you expect when the average shale volume in the zone is a few percent. SAND_B, wetter and slightly shalier, shows the same ordering with a spread of about 0.024.

This is the professional's comfort: in the rock that pays, well-chosen models converge. Large disagreement between models is itself diagnostic, telling you the interval is shaly enough that the $V_{sh}$ and $R_{sh}$ inputs, not the choice of equation, dominate the answer.

## Which model when

The calibrations point the way. Simandoux came from dispersed clay in relatively saline waters, so it is the usual default where clay is smeared through the pore system and formation water is salty enough to keep $R_w$ low. Indonesia came from laminated shale sequences with fresh formation water, so it earns preference as laminations dominate or as $R_w$ climbs. In basins with core-calibrated saturation work, use whatever the calibration supports; provenance is a starting point, not a verdict.

Both models stand or fall on the same two inputs. $R_{sh}$ must come from a thick, representative shale (the typewell's flat 2 ohm.m reading). $V_{sh}$ must be conservative, which is why this tier uses the linear transform; feed either model a flattering Larionov $V_{sh}$ and the correction shrinks toward Archie, quietly giving back the accuracy you switched models to gain.

## Worked example

Quantify the correction in the zone that pays. For SAND_A:

1. Archie mean minus Simandoux mean: $0.4478 - 0.4335 = 0.0143$.
2. Archie mean minus Indonesia mean: $0.4478 - 0.4280 = 0.0198$.
3. Hydrocarbon saturation under each: $1 - 0.4478 = 0.5522$ (Archie), $1 - 0.4335 = 0.5665$ (Simandoux), $1 - 0.4280 = 0.5720$ (Indonesia).

The shaly-sand correction adds between 1.4 and 2.0 saturation points of hydrocarbon in SAND_A. On a large accumulation that is not a rounding error; scaled through a volumetric calculation it moves reserves by the same fraction. Yet it is small enough to confirm SAND_A is fundamentally a clean sand, which is precisely what the model spread is telling you.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-shaly-sw-lab}}

## Exercise

Repeat the three-step comparison for SAND_B using the table values. Self-check: the Archie-to-Simandoux gap is $0.7692 - 0.7504 = 0.0188$, the Archie-to-Indonesia gap is $0.7692 - 0.7455 = 0.0237$, and the hydrocarbon saturations are 0.2308, 0.2496 and 0.2545. Then answer in two sentences: why is the model spread larger in SAND_B than in SAND_A, and why does the spread matter less to booked volumes in SAND_B despite being larger?
