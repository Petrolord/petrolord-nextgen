# The Expert workflow map

You have the brief; this lesson lays out the route through it. The Expert workflow is five steps, each owned by one of the modules ahead. Learn the shape now and every later lesson will slot into place.

## Step 1: correct the lab sample (module 2)

The bottle says 0.114 ohm.m at 75 degF; the reservoir sits at 180 degF. The Arps equation converts brine resistivity between temperatures, and running it gives

$$R_w(180) = 0.114 \times \frac{75 + 6.77}{180 + 6.77} = 0.114 \times \frac{81.77}{186.77} = 0.0499 \text{ ohm.m}$$

This is the first capstone number, `rw_arps`, graded to a tolerance of 0.0005 ohm.m. The factor 0.437811 is worth pausing on: temperature alone cut the sample's resistivity by more than half. Skipping this step is the single most damaging quicklook error in saturation work.

## Step 2: convert the SP reading (module 3)

The SP quicklook chain turns the static deflection and the filtrate resistivity into an equivalent water resistivity:

$$R_{we} = R_{mfe} \times 10^{SSP/K}$$

With $SSP = -93$ mV, $R_{mfe} = 0.62$ ohm.m and the temperature coefficient $K$ evaluated at 180 degF, the chain lands at 0.0498 ohm.m. That is the second capstone number, `rwe_ssp`, same tolerance. It comes from a completely different physical measurement than the bottle: an electrochemical potential logged in the borehole.

## Step 3: compare with the Pickett fit (module 4)

The third voice costs nothing new: the Professional-tier fit said $a R_w = 0.0500$ ohm.m with $a = 1$. Set the three side by side:

| Route | Rw estimate (ohm.m) |
|---|---|
| Lab sample, Arps-corrected | 0.0499 |
| SP quicklook | 0.0498 |
| Pickett water-line fit | 0.0500 |

Three independent routes inside half a percent of each other. Module 4 turns that comparison into a discipline: what counts as agreement, and what to do when you do not get it.

## Step 4: validate in the water leg (module 4)

Agreement among estimates is necessary but not sufficient; the adopted value must also reproduce known physics. The known physics here is the water leg, where saturation is 1 by definition. Compute Archie $S_w$ on neutron-density porosity across 2075 to 2078 m with the corrected $R_w$ and average the six samples:

$$\bar{S}_w^{leg} = 0.9991$$

Effectively unity, sample after sample. This is the third capstone number, `sw_waterleg_mean` (tolerance 0.005). If your adopted $R_w$ cannot make the water leg read water, it is wrong no matter how it was derived.

## Step 5: book, then book again (module 5)

Finally the payoff. Book SAND_A with the Associate recipe and the corrected $R_w$:

* Net pay 18.0 m, NTG 0.878, pay-average $S_w$ 0.3609.

These are capstone numbers four and five (`sand_a_net_arps`, tolerance 0.01 m, and `sand_a_sw_avg_arps`, tolerance 0.005). Reassuringly, booking with the parameter-block 0.05 gives the same 18.0 m net with $S_w$ 0.3613: the corrected sample lands on the Associate booking, closing the loop across all three tiers.

Then book once more with the raw, uncorrected 0.114:

* Net pay 16.5 m, pay-average $S_w$ 0.5303.

The 16.5 m is the sixth capstone number, `sand_a_net_uncorrected`. The pair of bookings is the course's closing argument: 1.5 m of net pay hangs on one temperature correction.

## The map in one sentence

Correct the sample, convert the SP, confirm against Pickett, prove the water leg reads unity, and only then book pay, twice, so the report shows what the right number is worth.

## Module ownership

* Module 2: Arps and temperature (step 1).
* Module 3: the SP quicklook chain (step 2).
* Module 4: triangulation and the water-leg check (steps 3 and 4).
* Module 5: the two bookings and the sensitivity story (step 5).
* Module 6: the reporting standard and the capstone walkthrough.

## Exercise

Without looking back: list the six graded quantities and match each to its workflow step. Self-check: `rw_arps` 0.0499 (step 1), `rwe_ssp` 0.0498 (step 2), `sw_waterleg_mean` 0.9991 (step 4), `sand_a_net_arps` 18.0 m and `sand_a_sw_avg_arps` 0.3609 (step 5, corrected booking), `sand_a_net_uncorrected` 16.5 m (step 5, raw booking). The Pickett value is graded nowhere at this tier; it was graded at the Professional tier and serves here as the third voice in step 3. As a final arithmetic check, the pay lost to the uncorrected sample is $18.0 - 16.5 = 1.5$ m and the pay-average saturation shift is $0.5303 - 0.3609 = 0.1694$.
