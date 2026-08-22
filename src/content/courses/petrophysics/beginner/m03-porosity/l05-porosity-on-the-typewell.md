# Porosity on the typewell

You now have the equation, the parameters and the failure modes. This lesson walks the density porosity curve across the whole typewell, from 2000 to 2100 m, and turns the profile into geological statements about the two sands you will eventually book pay in.

## Computing the curve

Open the Learning Mode app and run the workflow with the given parameters ($\rho_{ma} = 2.65$, $\rho_{fl} = 1.0$). The engine applies

$$\phi_D = \frac{2.65 - \rho_b}{1.65}$$

to every RHOB sample, 201 of them at 0.5 m spacing. What comes back is a porosity curve you should now read interval by interval.

## The shale background

Outside the sands, RHOB sits around 2.55 g/cc and the computed porosity hovers near 0.06. Recall from lesson two why this is an apparent value: sandstone parameters applied to clay-rich rock. The shale's small computed porosity is bound water and microporosity, storage in name only. It conveniently falls below the reservoir cutoff of $\phi \ge 0.08$ that module five introduces, so the workflow will discard it without any manual editing. Notice the teaching point hiding here: a cutoff is doing quietly what a more advanced shale correction would do explicitly.

## SAND_A: the good sand

Between 2010 and 2030 m the density curve drops to around 2.30 g/cc and porosity jumps to about 0.21. At the sample you worked by hand, 2020.0 m, RHOB = 2.3035 gives $\phi_D = 0.2100$ exactly. Across the interval the pay-quality rock averages $\phi = 0.208$, and 18.0 of the 20.5 gross metres will eventually qualify as net pay. That is a high net-to-gross, well-sorted, clean quartz sand, and its porosity profile is correspondingly flat and boring. Flat and boring is what good reservoir looks like on a porosity log.

Look closely and you will see a steady downward drift of porosity with depth within the sand. The dataset builds in a compaction gradient of 0.002 in porosity per metre, so across the 20 m of SAND_A the sand loses about 0.04, sliding from roughly 0.23 near the top to about 0.19 at the base. That is why the interval averages 0.208 rather than sitting at a single value. Recognising trends like this matters even more in thicker packages, where the top and base of a sand can differ meaningfully in quality.

## SAND_B: the marginal sand

Between 2050 and 2080 m sits a second, thicker gross interval of 30.5 m. Its density values are higher and its computed porosity averages only about 0.14 in the streaks that qualify as pay. The interval is heterogeneous: some beds clear the 0.08 porosity cutoff comfortably, others sit near or below it, and in the end only 5.5 m of the 30.5 survive the full set of pay tests, a net-to-gross of about 0.18.

SAND_B is the more instructive of the two sands. Porosity alone already tells you it is second-rate storage, and the water saturation work in module four will further penalise it (its pay averages $S_w$ of about 0.54, against 0.36 in SAND_A). When module five combines the tests, you will see thickness, porosity and saturation jointly demote a big gross interval to a small net one. Real fields are full of SAND_Bs, and telling them apart from SAND_As quickly is much of the job.

## The water leg

At the base of SAND_B, the interval from 2075 to 2078 m is fully water-bearing. Its porosity is unremarkable, but hold onto the location: the intermediate and advanced tiers use exactly this water leg to extract the formation water resistivity from the logs themselves. Porosity you can trust is a precondition for that trick working.

## From porosity to saturation

The porosity curve is now one of the two quantitative inputs the Archie equation needs. Module four brings in the second, true resistivity, and computes water saturation sample by sample. Before moving on, make sure the three anchor numbers of this module are second nature: 0.21 in clean SAND_A, about 0.14 in tighter SAND_B pay, 0.06 apparent in shale.

## Exercise

From the typewell profile:

1. RHOB reads 2.36 g/cc at one SAND_B sample. Compute $\phi_D$ and state whether it clears the 0.08 reservoir cutoff.
2. Using the compaction gradient of 0.002 in porosity per metre, estimate how much porosity a SAND_A quality sand loses across a 10 m bed, and from what value to what value if its top reads 0.22.
3. In one sentence each, explain why SAND_A's porosity profile is flat while SAND_B's is ragged, and what that means for their net-to-gross.

Self-check: $(2.65-2.36)/1.65 = 0.1758$, comfortably above the cutoff. Ten metres times 0.002 is 0.02, so a bed topping at 0.22 grades down to about 0.20 at its base. SAND_A is a clean well-sorted sand, so nearly all of it qualifies (net-to-gross 0.88); SAND_B alternates good and poor beds, so only scattered streaks qualify (net-to-gross 0.18).
