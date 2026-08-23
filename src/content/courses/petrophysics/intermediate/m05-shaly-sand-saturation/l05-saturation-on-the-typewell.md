# Saturation on the typewell

This lesson assembles the module into the run the app actually performs, from curves to the two graded zone means. Nothing new is introduced; the point is to see the full chain operate and to know every link in it.

## The inputs, assembled

The saturation stage consumes three curves and six parameters, all of them earned earlier in the course:

* $V_{sh}$: the linear transform of gamma ray, $(GR - 20)/(120 - 20)$, clamped to $[0, 1]$. Conservative by design.
* $\phi$: neutron-density porosity, the average of density porosity and the neutron reading, the porosity this tier books.
* $R_t$: the deep resistivity curve, as recorded.
* Parameters: $R_w = 0.05$ ohm.m validated by the Pickett fit in the water leg, $a = 1$, $m = 2$ also from the Pickett slope, $n = 2$ by regional default, and $R_{sh} = 2.0$ ohm.m read from the thick shale.

The app then evaluates Simandoux and Indonesia at every sample, alongside the Archie baseline. Three saturation curves, one pass, 0.5 m sampling.

## What the curves show

Track the three curves down the section and the behaviour from the previous lesson plays out depth by depth.

In the shales the curves separate widely: Archie saturates near its ceiling while the shaly-sand models fall away below it. None of this matters for booking, because the $V_{sh}$ cutoff will exclude these samples anyway, but the separation is a live QC display; if the curves fail to separate in a rock the gamma ray calls shale, your $V_{sh}$ or $R_{sh}$ input is broken.

In SAND_A the three curves run nearly together, split by only a couple of saturation points, and all well below the 0.6 cutoff. In SAND_B they run together again but higher, and toward the base of the zone they climb to 1.0.

In the water leg (2075 to 2078 m) all three models return exactly 1.0000. The reason is worth spelling out: the leg is clean, so $V_{sh} = 0$, both shaly-sand models collapse to Archie, and Archie in the interval that defined $a R_w$ reads fully wet by construction. The water leg is therefore a three-model QC point: any model that does not read 1.0 there has a broken input.

## The graded means

The capstone grades the SAND_A zone means over 2010 to 2030 m:

* Simandoux mean: $S_w = 0.4335$ (tolerance 0.01)
* Indonesia mean: $S_w = 0.4280$ (tolerance 0.01)

The zone mean is the plain average of the per-sample saturations across the zone, skipping any sample where the model returns no value (the same convention as the porosity means in module three). With 0.5 m sampling across a 20 m zone, roughly forty samples contribute, so no single streak dominates.

## Worked example

Place the SAND_A answer in reservoir terms, step by step:

1. Water saturation, Simandoux: 0.4335, so hydrocarbon saturation is $1 - 0.4335 = 0.5665$.
2. Water saturation, Indonesia: 0.4280, so hydrocarbon saturation is $0.5720$.
3. Booked porosity for the zone (module three): $\phi_{ND} = 0.1762$.
4. Hydrocarbon pore volume per metre of rock, Simandoux basis: $0.1762 \times 0.5665 = 0.0998$, call it 10 percent of bulk volume.

SAND_A is therefore a genuine pay sand: about 43 percent water in the pores, 57 percent hydrocarbon, in a rock carrying 17.6 percent porosity. SAND_B tells the opposite story: means near 75 percent water under both models, consistent with the zone shaling out and carrying the field's water leg at its base. High saturations there are not a model artefact; they are the free water surface announcing itself.

## The reporting discipline

Close the module with the habit that separates professional work from quicklook work. A saturation number reported alone is unreviewable. Report, side by side:

1. The model used, and its Archie baseline at the same samples.
2. The inputs: $V_{sh}$ transform, porosity source, $R_w$, $a$, $m$, $n$, $R_{sh}$ and where each came from.
3. The spread between models over the booked zone, as an uncertainty statement.

On the typewell that report reads: SAND_A mean $S_w$ 0.4335 (Simandoux) and 0.4280 (Indonesia) against an Archie baseline of 0.4478; all parameters as validated in the water leg; model spread under 0.02, consistent with a clean sand. Three lines, and a reviewer can reproduce every number in them.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-shaly-sw-lab}}

## Exercise

Write the equivalent three-line report for SAND_B using the module's zone means (Archie 0.7692, Simandoux 0.7504, Indonesia 0.7455) and the SAND_B neutron-density porosity mean of 0.1220 from module three. Self-check: the Simandoux hydrocarbon pore volume per metre is $0.1220 \times (1 - 0.7504) = 0.0305$, less than a third of SAND_A's. Finish with one sentence on whether the water leg supports treating SAND_B's high saturations as real rather than as a model failure.
