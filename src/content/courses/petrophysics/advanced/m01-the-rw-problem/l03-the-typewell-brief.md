# The typewell brief

Every Expert study starts with a case file. This lesson is the typewell's: the new evidence this tier introduces, and the booking machinery you inherit from the tiers below. Everything in the rest of the course works from exactly these givens, so read them the way you would read a client's data package, noting not just the values but what each one is and is not.

## The new evidence

**The lab sample.** A formation water sample from the typewell was measured in the laboratory at

$$R_w = 0.114 \text{ ohm.m at } 75\ \text{degF}$$

Formation temperature at the reservoir is 180 degF. The sample value therefore cannot be used as it stands: brine resistivity falls steeply with temperature, and 75 degF is bench temperature, not reservoir temperature. The first route of the triangulation (module 2) corrects this value to formation conditions with the Arps equation.

**The SP quicklook.** In the clean sand the SP log reads a static deflection of

$$SSP = -93\ \text{mV}, \qquad R_{mfe} = 0.62 \text{ ohm.m at formation temperature}$$

$R_{mfe}$ is the equivalent mud filtrate resistivity, supplied here as a given the way a log analyst would pull it from the log header after correcting it to formation temperature. The second route (module 3) converts this pair into an equivalent water resistivity.

**The Pickett fit.** From the Professional tier you already hold the third route: the least-squares water line through the six valid water-leg samples between 2075 and 2078 m gave

$$a R_w = 0.0500 \text{ ohm.m}, \qquad m = 2.000$$

Nothing about that fit changes at this tier; it simply takes its place as one voice among three.

## The inherited booking machinery

The capstone books SAND_A exactly the way the Associate tier did, so the Expert tier isolates one variable: $R_w$. The recipe, unchanged:

* Density porosity: $\phi_D = (\rho_{ma} - \rho_b)/(\rho_{ma} - \rho_{fl})$ with $\rho_{ma} = 2.65$ and $\rho_{fl} = 1.0$ g/cc.
* Shale volume: Larionov tertiary from the gamma ray with $GR_{clean} = 20$ and $GR_{clay} = 120$ API.
* Saturation: Archie with $a = 1$, $m = 2$, $n = 2$, and whichever $R_w$ is under test.
* Cutoffs: $\phi \ge 0.08$, $V_{sh} \le 0.5$, $S_w \le 0.6$.

Note what this recipe is not: it is not the Professional tier's neutron-density porosity or shaly-sand saturation. The Expert capstone deliberately returns to the simple Associate booking so that when the answer moves, only one cause is possible. The single exception is the water-leg validation check (module 4), which uses neutron-density porosity, matching how the Professional tier characterised the leg.

## The zones

* SAND_A: 2010 to 2030 m. The booking target.
* SAND_B: 2050 to 2080 m. Booked once in module 5 for the field view.
* Water leg: 2075 to 2078 m, at the base of SAND_B. The validation ground.

## What the brief does not contain

Practise noticing absences. There is no salinity report for the sample, so the Arps correction's NaCl assumption (module 2) goes unverified. There is no bed-thickness correction chart for the SP, so the SSP reading is taken as delivered. There is no independent measurement of $a$ or $n$. A real study would list each absence in the report as an assumption carried; the capstone carries them silently, and part of the Expert standard (module 6) is learning to write them down anyway.

## Worked example

Confirm one inherited number before trusting the machinery. At 2020 m the bulk density is 2.3035 g/cc:

1. Numerator: $2.65 - 2.3035 = 0.3465$.
2. Denominator: $2.65 - 1.0 = 1.65$.
3. $\phi_D = 0.3465 / 1.65 = 0.2100$.

The same sample carries $R_t = 9.2554$ ohm.m and $GR = 20$ API, so $IGR = 0$ and $V_{sh} = 0$: a clean sample whose booking depends only on porosity, resistivity and the contested $R_w$.

## Exercise

From the brief alone, before any computation: which of the three routes already agrees with the given parameter block ($r_w = 0.05$, $a = 1$), and which two still need their conversions run? Self-check: the Pickett product $a R_w = 0.0500$ with $a = 1$ implies $R_w = 0.0500$, matching the given; the lab sample (0.114 at 75 degF) and the SP pair (-93 mV, 0.62 ohm.m) are still raw inputs awaiting modules 2 and 3. Then compute $\phi_D$ for a bulk density of 2.4685 g/cc as a machinery check: $(2.65 - 2.4685)/1.65 = 0.1815/1.65 = 0.1100$.
